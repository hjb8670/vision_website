import { useStats } from '../hooks/useStats';
import { StatCard } from '../components/StatCard';
import { VolumeChart } from '../components/VolumeChart';
import { MarketsByStatusChart } from '../components/MarketsByStatusChart';
import { TopMarketsChart } from '../components/TopMarketsChart';

export function DashboardPage() {
  const { data: stats, isLoading } = useStats();

  if (isLoading || !stats) {
    return <p className="text-text-secondary">Loading dashboard…</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total users" value={stats.totalUsers.toLocaleString()} />
        <StatCard
          label="Open markets"
          value={stats.marketsByStatus.OPEN.toLocaleString()}
          sub={`${stats.marketsByStatus.CLOSED} closed · ${stats.marketsByStatus.RESOLVED} resolved`}
        />
        <StatCard
          label="Total volume"
          value={`$${stats.totalVolume.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
        />
        <StatCard
          label="Wallet balance issued"
          value={`$${stats.totalWalletBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <VolumeChart data={stats.volumeByDay} />
        </div>
        <MarketsByStatusChart marketsByStatus={stats.marketsByStatus} />
      </div>

      <TopMarketsChart topMarkets={stats.topMarkets} />
    </div>
  );
}
