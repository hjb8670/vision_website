import { Link } from 'react-router-dom';
import type { MarketSummary } from '../lib/types';
import { CategoryIcon } from './CategoryIcon';

function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days;
}

export function MarketCard({ market }: { market: MarketSummary }) {
  const isClosed = market.status !== 'OPEN';
  const days = daysUntil(market.closeDate);
  const yesPct = Math.round(market.yesProbability * 100);
  const noPct = 100 - yesPct;

  return (
    <Link
      to={`/market/${market.slug}`}
      className={`group flex flex-col gap-4 rounded-lg border border-white/10 bg-bg-elevated p-4 transition-all hover:border-accent-primary hover:shadow-[0_0_0_1px_var(--color-accent-primary)] ${
        isClosed ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <CategoryIcon label={market.category.name} size={36} />
        <h3 className="text-sm font-semibold leading-snug line-clamp-2 min-h-[2.5rem]">{market.question}</h3>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div
          className="flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs font-bold"
          style={{ background: 'color-mix(in srgb, var(--color-yes) 15%, transparent)', color: 'var(--color-yes)' }}
        >
          <span>YES</span>
          <span>{yesPct}%</span>
        </div>
        <div
          className="flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs font-bold"
          style={{ background: 'color-mix(in srgb, var(--color-no) 15%, transparent)', color: 'var(--color-no)' }}
        >
          <span>NO</span>
          <span>{noPct}%</span>
        </div>
      </div>

      <div className="text-[11px] text-text-secondary">
        {market.category.name} · ${market.volume24h.toFixed(0)} vol ·{' '}
        {isClosed ? (market.status === 'RESOLVED' ? 'Resolved' : 'Closed') : days > 0 ? `${days}d left` : 'closing soon'}
      </div>
    </Link>
  );
}
