import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { priceForOutcome } from '../markets/amm';

@Injectable()
export class PositionsService {
  constructor(private prisma: PrismaService) {}

  async findForUser(userId: string) {
    const positions = await this.prisma.position.findMany({
      where: { userId, quantity: { gt: 0 } },
      include: { market: true },
      orderBy: { id: 'desc' },
    });

    return positions.map((p) => {
      const currentPrice =
        p.market.status === 'RESOLVED'
          ? p.market.resolvedOutcome === p.outcome
            ? 1
            : 0
          : priceForOutcome(
              p.market.qYes,
              p.market.qNo,
              p.market.liquidityB,
              p.outcome,
            );

      const currentValue = p.quantity * currentPrice;
      const costBasis = p.quantity * p.avgEntryPrice;

      return {
        id: p.id,
        market: {
          id: p.market.id,
          slug: p.market.slug,
          question: p.market.question,
          status: p.market.status,
        },
        outcome: p.outcome,
        quantity: p.quantity,
        avgEntryPrice: p.avgEntryPrice,
        currentPrice,
        currentValue,
        unrealizedPnl: currentValue - costBasis,
      };
    });
  }
}
