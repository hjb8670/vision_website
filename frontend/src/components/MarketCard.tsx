import { Link } from 'react-router-dom';
import type { MarketSummary } from '../lib/types';
import { CategoryThumb } from './CategoryIcon';
import { Sparkline } from './Sparkline';

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
      className={`group block rounded-xl border border-border bg-bg-secondary overflow-hidden transition-all hover:border-accent-primary hover:shadow-[0_0_0_1px_var(--color-accent-primary)] ${
        isClosed ? 'opacity-60' : ''
      }`}
    >
      <CategoryThumb label={market.category.name} className="h-28 w-full" />
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] uppercase tracking-wide text-text-secondary bg-bg-elevated px-2 py-0.5 rounded">
            {market.category.name}
          </span>
          {isClosed ? (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-bg-elevated text-text-secondary">
              {market.status === 'RESOLVED' ? 'Resolved' : 'Closed'}
            </span>
          ) : (
            <span className="text-[11px] text-text-secondary">
              {days > 0 ? `closes in ${days}d` : 'closing soon'}
            </span>
          )}
        </div>

        <h3 className="text-sm font-semibold leading-snug line-clamp-2 min-h-[2.5rem]">{market.question}</h3>

        <div className="flex items-end justify-between mt-3">
          <div>
            <div
              className="text-2xl font-bold"
              style={{ color: yesPct > 50 ? 'var(--color-yes)' : 'var(--color-no)' }}
            >
              {yesPct}%
            </div>
            <div className="text-[11px] text-text-secondary">chance YES</div>
          </div>
          <Sparkline data={market.sparkline} width={72} height={28} />
        </div>

        <div className="mt-2 text-[11px] text-text-secondary">
          ${market.volume24h.toFixed(0)} vol (24h)
        </div>
      </div>
    </Link>
  );
}
