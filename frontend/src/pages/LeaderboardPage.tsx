import { useMemo, useState } from 'react';
import { useLeaderboard, useBiggestWins } from '../hooks/useLeaderboard';
import { LeaderboardTable } from '../components/LeaderboardTable';
import { useToastStore } from '../store/toastStore';

const TIME_WINDOWS = ['Today', 'Weekly', 'Monthly', 'All'] as const;
const PRODUCT_TABS = ['Predictions', 'Perps', 'Combos'] as const;

export function LeaderboardPage() {
  const { data: rows, isLoading } = useLeaderboard();
  const { data: wins } = useBiggestWins();
  const push = useToastStore((s) => s.push);

  const [tab, setTab] = useState<(typeof PRODUCT_TABS)[number]>('Predictions');
  const [timeWindow, setTimeWindow] = useState<(typeof TIME_WINDOWS)[number]>('All');
  const [sortBy, setSortBy] = useState<'profit' | 'volume'>('profit');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const list = (rows ?? []).filter((r) => r.username.toLowerCase().includes(search.toLowerCase()));
    return [...list].sort((a, b) => (sortBy === 'profit' ? b.profit - a.profit : b.volume - a.volume));
  }, [rows, search, sortBy]);

  function stub(feature: string) {
    push(`${feature} is coming soon in this demo.`, 'success');
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold mb-6">Leaderboard</h1>

      <div className="flex items-center gap-6 border-b border-white/10 mb-4 text-sm">
        {PRODUCT_TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => (t === 'Predictions' ? setTab(t) : stub(t))}
            className={`pb-3 font-semibold border-b-2 -mb-px transition-colors ${
              tab === t ? 'border-accent-primary text-text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-4 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {TIME_WINDOWS.map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => (w === 'All' ? setTimeWindow(w) : stub(`${w} leaderboard`))}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  timeWindow === w ? 'bg-white/10 text-text-primary' : 'text-text-secondary hover:bg-white/5'
                }`}
              >
                {w}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="relative flex-1 max-w-xs">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name"
                className="w-full bg-white/5 rounded-full pl-9 pr-4 py-2 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-accent-primary"
              />
            </div>
            <div className="flex gap-10 pr-4 text-xs text-text-secondary shrink-0">
              <button
                type="button"
                onClick={() => setSortBy('profit')}
                className={`w-24 text-right font-semibold ${sortBy === 'profit' ? 'text-text-primary' : ''}`}
              >
                Profit/Loss
              </button>
              <button
                type="button"
                onClick={() => setSortBy('volume')}
                className={`w-24 text-right font-semibold ${sortBy === 'volume' ? 'text-text-primary' : ''}`}
              >
                Volume
              </button>
            </div>
          </div>

          {isLoading ? (
            <p className="text-text-secondary">Loading leaderboard…</p>
          ) : (
            <LeaderboardTable rows={filtered} sortBy={sortBy} />
          )}
        </div>

        <div className="bg-bg-elevated rounded-2xl p-5 h-fit">
          <h2 className="font-bold mb-4">Biggest wins this month</h2>
          {!wins || wins.length === 0 ? (
            <p className="text-sm text-text-secondary">No resolved payouts yet.</p>
          ) : (
            <ul className="space-y-4">
              {wins.map((w, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-sm text-text-secondary w-4 pt-0.5">{i + 1}</span>
                  <div className="min-w-0">
                    <p className="text-sm">
                      <span className="font-bold">{w.username}</span>{' '}
                      <span className="text-text-secondary line-clamp-1">{w.note?.replace('Payout for resolved market: ', '')}</span>
                    </p>
                    <p className="text-sm font-semibold" style={{ color: 'var(--color-success)' }}>
                      +${w.amount.toFixed(2)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function SearchIcon({ className = '' }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
