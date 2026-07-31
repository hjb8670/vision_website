import { useLeaderboard } from '../hooks/useLeaderboard';
import { LeaderboardTable } from '../components/LeaderboardTable';

export function LeaderboardPage() {
  const { data: rows, isLoading } = useLeaderboard();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold">Leaderboard</h1>
      {isLoading ? (
        <p className="text-text-secondary">Loading leaderboard…</p>
      ) : (
        <LeaderboardTable rows={rows ?? []} />
      )}
    </div>
  );
}
