import { Link } from 'react-router-dom';
import type { MarketSummary } from '../lib/types';
import { CategoryIcon } from './CategoryIcon';
import { ProbabilityRing } from './ProbabilityRing';

function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days;
}

export function MarketCard({ market }: { market: MarketSummary }) {
  const isClosed = market.status !== 'OPEN';
  const days = daysUntil(market.closeDate);
  const yesPct = Math.round(market.yesProbability * 100);

  return (
    <Link
      to={`/market/${market.slug}`}
      className={`group flex flex-col gap-4 rounded-2xl bg-bg-elevated p-4 transition-all hover:shadow-[0_0_0_1px_var(--color-accent-primary)] ${
        isClosed ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <CategoryIcon label={market.category.name} size={44} />
          <h3 className="text-sm font-semibold leading-snug line-clamp-3 pt-0.5">{market.question}</h3>
        </div>
        <ProbabilityRing pct={yesPct} />
      </div>

      <div className="text-[11px] text-text-secondary">
        {market.category.name} · ${market.volume24h.toFixed(0)} vol ·{' '}
        {isClosed ? (market.status === 'RESOLVED' ? 'Resolved' : 'Closed') : days > 0 ? `${days}d left` : 'closing soon'}
      </div>
    </Link>
  );
}
