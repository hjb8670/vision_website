import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const since = new Date(Date.now() - 13 * 24 * 60 * 60 * 1000);
    since.setHours(0, 0, 0, 0);

    const [totalUsers, marketsByStatusRaw, volumeAgg, walletAgg, topMarketsRaw, recentPoints] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.market.groupBy({ by: ['status'], _count: true }),
        this.prisma.pricePoint.aggregate({ _sum: { volume: true } }),
        this.prisma.wallet.aggregate({ _sum: { balance: true } }),
        this.prisma.order.groupBy({
          by: ['marketId'],
          _count: { marketId: true },
          orderBy: { _count: { marketId: 'desc' } },
          take: 5,
        }),
        this.prisma.pricePoint.findMany({
          where: { timestamp: { gte: since } },
          select: { timestamp: true, volume: true },
        }),
      ]);

    const volumeByDayMap = new Map<string, number>();
    for (const p of recentPoints) {
      const day = p.timestamp.toISOString().slice(0, 10);
      volumeByDayMap.set(day, (volumeByDayMap.get(day) ?? 0) + p.volume);
    }
    const volumeByDay = Array.from({ length: 14 }, (_, i) => {
      const d = new Date(since.getTime() + i * 24 * 60 * 60 * 1000);
      const date = d.toISOString().slice(0, 10);
      return { date, volume: volumeByDayMap.get(date) ?? 0 };
    });

    const marketsByStatus = {
      OPEN: 0,
      CLOSED: 0,
      RESOLVED: 0,
      ...Object.fromEntries(marketsByStatusRaw.map((m) => [m.status, m._count])),
    };

    const topMarkets = await Promise.all(
      topMarketsRaw.map(async (t) => {
        const market = await this.prisma.market.findUnique({
          where: { id: t.marketId },
          select: { question: true, slug: true },
        });
        return { ...market, orderCount: t._count.marketId };
      }),
    );

    return {
      totalUsers,
      marketsByStatus,
      totalVolume: volumeAgg._sum.volume ?? 0,
      totalWalletBalance: walletAgg._sum.balance ?? 0,
      topMarkets,
      volumeByDay,
    };
  }
}
