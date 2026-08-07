import { useMemo, useState } from 'react';
import { useLeaderboard, useBiggestWins } from '../hooks/useLeaderboard';
import { LeaderboardTable } from '../components/LeaderboardTable';
import { useToastStore } from '../store/toastStore';
import { useTranslation } from '../lib/i18n/useTranslation';

const TIME_WINDOWS = ['Today', 'Weekly', 'Monthly', 'All'] as const;
const PRODUCT_TABS = ['Predictions', 'Perps', 'Combos'] as const;

export function LeaderboardPage() {
  const { data: rows, isLoading } = useLeaderboard();
  const { data: wins } = useBiggestWins();
  const push = useToastStore((s) => s.push);
  const { t } = useTranslation();

  const [tab, setTab] = useState<(typeof PRODUCT_TABS)[number]>('Predictions');
  const [timeWindow, setTimeWindow] = useState<(typeof TIME_WINDOWS)[number]>('All');
  const [sortBy, setSortBy] = useState<'profit' | 'volume'>('profit');
  const [search, setSearch] = useState('');

  const TAB_LABELS: Record<(typeof PRODUCT_TABS)[number], string> = {
    Predictions: t('leaderboardPage.tabPredictions'),
    Perps: t('leaderboardPage.tabPerps'),
    Combos: t('leaderboardPage.tabCombos'),
  };
  const TIME_LABELS: Record<(typeof TIME_WINDOWS)[number], string> = {
    Today: t('leaderboardPage.timeToday'),
    Weekly: t('leaderboardPage.timeWeekly'),
    Monthly: t('leaderboardPage.timeMonthly'),
    All: t('leaderboardPage.timeAll'),
  };

  const filtered = useMemo(() => {
    const list = (rows ?? []).filter((r) => r.username.toLowerCase().includes(search.toLowerCase()));
    return [...list].sort((a, b) => (sortBy === 'profit' ? b.profit - a.profit : b.volume - a.volume));
  }, [rows, search, sortBy]);

  function stub(feature: string) {
    push(t('navbar.comingSoon', { feature }), 'success');
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold mb-6">{t('leaderboardPage.heading')}</h1>

      <div className="flex items-center gap-6 border-b border-white/10 mb-4 text-sm">
        {PRODUCT_TABS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => (p === 'Predictions' ? setTab(p) : stub(TAB_LABELS[p]))}
            className={`pb-3 font-semibold border-b-2 -mb-px transition-colors ${
              tab === p ? 'border-accent-primary text-text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            {TAB_LABELS[p]}
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
                onClick={() => (w === 'All' ? setTimeWindow(w) : stub(t('leaderboardPage.leaderboardComingSoon', { window: TIME_LABELS[w] })))}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  timeWindow === w ? 'bg-white/10 text-text-primary' : 'text-text-secondary hover:bg-white/5'
                }`}
              >
                {TIME_LABELS[w]}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 sm:max-w-xs">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('leaderboardPage.searchPlaceholder')}
                className="w-full bg-white/5 rounded-full pl-9 pr-4 py-2 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-accent-primary"
              />
            </div>
            <div className="flex gap-4 sm:gap-10 sm:pr-4 text-xs text-text-secondary shrink-0">
              <button
                type="button"
                onClick={() => setSortBy('profit')}
                className={`w-24 text-right truncate font-semibold ${sortBy === 'profit' ? 'text-text-primary' : ''}`}
              >
                {t('leaderboardTable.profitLoss')}
              </button>
              <button
                type="button"
                onClick={() => setSortBy('volume')}
                className={`w-24 text-right truncate font-semibold ${sortBy === 'volume' ? 'text-text-primary' : ''}`}
              >
                {t('leaderboardTable.volume')}
              </button>
            </div>
          </div>

          {isLoading ? (
            <p className="text-text-secondary">{t('leaderboardPage.loading')}</p>
          ) : (
            <LeaderboardTable rows={filtered} sortBy={sortBy} />
          )}
        </div>

        <div className="bg-bg-elevated rounded-2xl p-5 h-fit">
          <h2 className="font-bold mb-4">{t('leaderboardPage.biggestWins')}</h2>
          {!wins || wins.length === 0 ? (
            <p className="text-sm text-text-secondary">{t('leaderboardPage.noPayouts')}</p>
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
                      +MX${w.amount.toFixed(2)}
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
