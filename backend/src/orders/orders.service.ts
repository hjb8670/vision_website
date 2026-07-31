import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { tradeCost, yesPrice } from '../markets/amm';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateOrderDto) {
    const market = await this.prisma.market.findUnique({
      where: { id: dto.marketId },
    });
    if (!market) throw new NotFoundException('Market not found');
    if (market.status !== 'OPEN')
      throw new BadRequestException('Market is not open for trading');

    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new NotFoundException('Wallet not found');

    const existingPosition = await this.prisma.position.findUnique({
      where: {
        userId_marketId_outcome: {
          userId,
          marketId: dto.marketId,
          outcome: dto.outcome,
        },
      },
    });

    if (dto.side === 'SELL') {
      const held = existingPosition?.quantity ?? 0;
      if (held < dto.quantity) {
        throw new BadRequestException('Insufficient position quantity to sell');
      }
    }

    const { cost, newQYes, newQNo, avgPrice } = tradeCost(
      market.qYes,
      market.qNo,
      market.liquidityB,
      dto.outcome,
      dto.side,
      dto.quantity,
    );

    if (dto.side === 'BUY' && cost > wallet.balance) {
      throw new BadRequestException('Insufficient balance');
    }

    return this.prisma.$transaction(async (tx) => {
      const updatedMarket = await tx.market.update({
        where: { id: market.id },
        data: { qYes: newQYes, qNo: newQNo },
      });

      const balanceDelta = dto.side === 'BUY' ? -cost : Math.abs(cost);
      const updatedWallet = await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: { increment: balanceDelta } },
      });

      await tx.walletLedger.create({
        data: {
          walletId: wallet.id,
          amount: balanceDelta,
          type: 'TRADE',
          note: `${dto.side} ${dto.quantity} ${dto.outcome} @ ${market.question}`,
        },
      });

      const quantityDelta = dto.side === 'BUY' ? dto.quantity : -dto.quantity;
      const prevQty = existingPosition?.quantity ?? 0;
      const prevAvg = existingPosition?.avgEntryPrice ?? 0;
      const newQty = prevQty + quantityDelta;
      const newAvg =
        dto.side === 'BUY' && newQty > 0
          ? (prevQty * prevAvg + dto.quantity * avgPrice) / newQty
          : prevAvg;

      const position = await tx.position.upsert({
        where: {
          userId_marketId_outcome: {
            userId,
            marketId: dto.marketId,
            outcome: dto.outcome,
          },
        },
        create: {
          userId,
          marketId: dto.marketId,
          outcome: dto.outcome,
          quantity: Math.max(newQty, 0),
          avgEntryPrice: newAvg,
        },
        update: {
          quantity: Math.max(newQty, 0),
          avgEntryPrice: newAvg,
        },
      });

      const order = await tx.order.create({
        data: {
          userId,
          marketId: dto.marketId,
          outcome: dto.outcome,
          side: dto.side,
          quantity: dto.quantity,
          cost,
          price: avgPrice,
        },
      });

      await tx.pricePoint.create({
        data: {
          marketId: market.id,
          timestamp: new Date(),
          yesProbability: yesPrice(newQYes, newQNo, market.liquidityB),
          volume: Math.abs(cost),
        },
      });

      return {
        order,
        position,
        balance: updatedWallet.balance,
        yesProbability: yesPrice(
          updatedMarket.qYes,
          updatedMarket.qNo,
          updatedMarket.liquidityB,
        ),
      };
    });
  }
}
