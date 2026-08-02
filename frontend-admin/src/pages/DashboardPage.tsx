import { useStats } from '../hooks/useStats';
import { StatCard } from '../components/StatCard';

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

      <div className="bg-bg-elevated rounded-2xl p-5">
        <h2 className="text-lg font-bold mb-4">Most active markets</h2>
        {stats.topMarkets.length === 0 ? (
          <p className="text-text-secondary text-sm">No trading activity yet.</p>
        ) : (
          <ul className="space-y-3">
            {stats.topMarkets.map((m) => (
              <li key={m.slug} className="flex items-center justify-between text-sm">
                <span className="truncate pr-4">{m.question}</span>
                <span className="text-text-secondary shrink-0">{m.orderCount} orders</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
