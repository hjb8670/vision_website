import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { priceForOutcome } from '../markets/amm';

const STARTING_BALANCE = 1000;

@Injectable()
export class LeaderboardService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.user.findMany({
      include: {
        wallet: true,
        positions: { include: { market: true } },
      },
    });

    const rows = users
      .filter((u) => u.wallet)
      .map((u) => {
        let openValue = 0;
        let resolvedCount = 0;
        let winCount = 0;

        for (const p of u.positions) {
          if (p.quantity <= 0) continue;
          if (p.market.status === 'RESOLVED') {
            resolvedCount += 1;
            if (p.market.resolvedOutcome === p.outcome) winCount += 1;
          } else {
            openValue +=
              p.quantity *
              priceForOutcome(
                p.market.qYes,
                p.market.qNo,
                p.market.liquidityB,
                p.outcome,
              );
          }
        }

        const totalValue = (u.wallet?.balance ?? 0) + openValue;
        const profit = totalValue - STARTING_BALANCE;
        const winRate =
          resolvedCount > 0 ? (winCount / resolvedCount) * 100 : 0;

        return {
          username: u.username,
          profit,
          winRate,
        };
      })
      .sort((a, b) => b.profit - a.profit)
      .map((row, i) => ({ rank: i + 1, ...row }));

    return rows;
  }
}
