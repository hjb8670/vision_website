import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMarketDto } from './dto/create-market.dto';
import { UpdateMarketDto } from './dto/update-market.dto';
import { yesPrice } from './amm';

export type SortFilter = 'newest' | 'trending' | 'volume' | 'ending';
export type HistoryRange = '1D' | '1W' | '1M' | 'ALL';

function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 60) +
    '-' +
    Math.random().toString(36).slice(2, 7)
  );
}

@Injectable()
export class MarketsService {
  constructor(private prisma: PrismaService) {}

  private async toSummary(market: {
    id: string;
    slug: string;
    question: string;
    imageUrl: string | null;
    closeDate: Date;
    status: string;
    qYes: number;
    qNo: number;
    liquidityB: number;
    category: { id: string; name: string; slug: string };
    createdAt: Date;
  }) {
    const yesProb = yesPrice(market.qYes, market.qNo, market.liquidityB);
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const recentPoints = await this.prisma.pricePoint.findMany({
      where: { marketId: market.id, timestamp: { gte: since } },
      orderBy: { timestamp: 'asc' },
    });
    const volume24h = recentPoints.reduce((sum, p) => sum + p.volume, 0);

    const sparkline = await this.prisma.pricePoint.findMany({
      where: { marketId: market.id },
      orderBy: { timestamp: 'desc' },
      take: 7,
    });

    return {
      id: market.id,
      slug: market.slug,
      question: market.question,
      imageUrl: market.imageUrl,
      closeDate: market.closeDate,
      status: market.status,
      category: market.category,
      yesProbability: yesProb,
      volume24h,
      recentActivity: recentPoints.length,
      sparkline: sparkline.map((p) => p.yesProbability).reverse(),
      createdAt: market.createdAt,
    };
  }

  async findAll(sf: SortFilter = 'newest', categorySlug?: string) {
    const markets = await this.prisma.market.findMany({
      where: categorySlug ? { category: { slug: categorySlug } } : undefined,
      include: { category: true },
    });

    const summaries = await Promise.all(markets.map((m) => this.toSummary(m)));

    switch (sf) {
      case 'trending':
        summaries.sort((a, b) => b.recentActivity - a.recentActivity);
        break;
      case 'volume':
        summaries.sort((a, b) => b.volume24h - a.volume24h);
        break;
      case 'ending':
        summaries.sort(
          (a, b) =>
            new Date(a.closeDate).getTime() - new Date(b.closeDate).getTime(),
        );
        break;
      case 'newest':
      default:
        summaries.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
    }

    return summaries;
  }

  async findBySlug(slug: string) {
    const market = await this.prisma.market.findUnique({
      where: { slug },
      include: { category: true },
    });
    if (!market) throw new NotFoundException('Market not found');

    const yesProb = yesPrice(market.qYes, market.qNo, market.liquidityB);
    return { ...market, yesProbability: yesProb };
  }

  async findByIdOrThrow(id: string) {
    const market = await this.prisma.market.findUnique({ where: { id } });
    if (!market) throw new NotFoundException('Market not found');
    return market;
  }

  async history(idOrSlug: string, range: HistoryRange = 'ALL') {
    const market = await this.prisma.market.findFirst({
      where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
    });
    if (!market) throw new NotFoundException('Market not found');

    const now = Date.now();
    const rangeMs: Record<string, number> = {
      '1D': 24 * 60 * 60 * 1000,
      '1W': 7 * 24 * 60 * 60 * 1000,
      '1M': 30 * 24 * 60 * 60 * 1000,
      ALL: Infinity,
    };
    const since =
      rangeMs[range] === Infinity ? undefined : new Date(now - rangeMs[range]);

    return this.prisma.pricePoint.findMany({
      where: {
        marketId: market.id,
        ...(since ? { timestamp: { gte: since } } : {}),
      },
      orderBy: { timestamp: 'asc' },
    });
  }

  async create(dto: CreateMarketDto) {
    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });
    if (!category) throw new BadRequestException('Unknown category');

    const market = await this.prisma.market.create({
      data: {
        slug: slugify(dto.question),
        question: dto.question,
        description: dto.description,
        resolutionSource: dto.resolutionSource,
        categoryId: dto.categoryId,
        imageUrl: dto.imageUrl,
        closeDate: new Date(dto.closeDate),
        liquidityB: dto.liquidityB ?? 75,
      },
    });

    await this.prisma.pricePoint.create({
      data: {
        marketId: market.id,
        timestamp: new Date(),
        yesProbability: 0.5,
        volume: 0,
      },
    });

    return market;
  }

  async update(id: string, dto: UpdateMarketDto) {
    await this.findByIdOrThrow(id);
    return this.prisma.market.update({
      where: { id },
      data: {
        ...(dto.question ? { question: dto.question } : {}),
        ...(dto.description ? { description: dto.description } : {}),
        ...(dto.resolutionSource
          ? { resolutionSource: dto.resolutionSource }
          : {}),
        ...(dto.categoryId ? { categoryId: dto.categoryId } : {}),
        ...(dto.imageUrl !== undefined ? { imageUrl: dto.imageUrl } : {}),
        ...(dto.closeDate ? { closeDate: new Date(dto.closeDate) } : {}),
        ...(dto.liquidityB !== undefined ? { liquidityB: dto.liquidityB } : {}),
      },
    });
  }

  async resolve(id: string, outcome: 'YES' | 'NO') {
    const market = await this.findByIdOrThrow(id);
    if (market.status === 'RESOLVED') {
      throw new BadRequestException('Market already resolved');
    }

    return this.prisma.$transaction(async (tx) => {
      const resolved = await tx.market.update({
        where: { id },
        data: { status: 'RESOLVED', resolvedOutcome: outcome },
      });

      const winningPositions = await tx.position.findMany({
        where: { marketId: id, outcome, quantity: { gt: 0 } },
      });

      for (const position of winningPositions) {
        const payout = position.quantity * 1;
        const wallet = await tx.wallet.findUnique({
          where: { userId: position.userId },
        });
        if (!wallet) continue;

        await tx.wallet.update({
          where: { id: wallet.id },
          data: { balance: { increment: payout } },
        });
        await tx.walletLedger.create({
          data: {
            walletId: wallet.id,
            amount: payout,
            type: 'PAYOUT',
            note: `Payout for resolved market: ${resolved.question}`,
          },
        });
      }

      return resolved;
    });
  }
}
