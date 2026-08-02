import { Link } from 'react-router-dom';
import { useMarkets } from '../hooks/useMarkets';
import { useTranslation } from '../lib/i18n/useTranslation';

export function TrendingTopicsWidget() {
  const { data: trending } = useMarkets('trending');
  const { t } = useTranslation();
  const topics = (trending ?? []).slice(0, 5);

  if (topics.length === 0) return null;

  return (
    <div className="bg-bg-elevated rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold">{t('home.trendingTopics')}</h2>
        <Link to="/markets?sf=trending" className="text-xs text-accent-primary hover:underline">
          {t('home.viewAll')}
        </Link>
      </div>
      <ul className="space-y-3">
        {topics.map((m, i) => (
          <li key={m.id}>
            <Link to={`/market/${m.slug}`} className="flex items-center justify-between gap-3 group">
              <span className="flex items-center gap-2 min-w-0">
                <span className="text-xs text-text-secondary w-4 shrink-0">{i + 1}</span>
                <span className="text-sm truncate group-hover:text-accent-primary">{m.question}</span>
              </span>
              <span className="flex items-center gap-1 text-xs text-text-secondary shrink-0">
                {t('home.volShort', { amount: m.volume24h.toFixed(0) })}
                <TrendUpIcon />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TrendUpIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2.5">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}
