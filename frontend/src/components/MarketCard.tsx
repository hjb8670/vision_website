import { Link } from 'react-router-dom';
import type { MarketSummary } from '../lib/types';
import { CategoryIcon } from './CategoryIcon';
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
  const noPct = 100 - yesPct;

  return (
    <Link
      to={`/market/${market.slug}`}
      className={`group flex flex-col gap-3 rounded-lg border border-white/10 bg-bg-elevated p-3.5 transition-all hover:border-accent-primary hover:shadow-[0_0_0_1px_var(--color-accent-primary)] ${
        isClosed ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start gap-2.5">
        <CategoryIcon label={market.category.name} size={38} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-wide text-text-secondary">{market.category.name}</span>
            {isClosed ? (
              <span className="text-[10px] font-semibold text-text-secondary">
                {market.status === 'RESOLVED' ? 'Resolved' : 'Closed'}
              </span>
            ) : (
              <span className="text-[10px] text-text-secondary shrink-0">
                {days > 0 ? `${days}d left` : 'closing soon'}
              </span>
            )}
          </div>
          <h3 className="text-sm font-semibold leading-snug line-clamp-2 min-h-[2.5rem]">{market.question}</h3>
        </div>
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

      <div className="flex items-center justify-between pt-0.5">
        <span className="text-[11px] text-text-secondary">${market.volume24h.toFixed(0)} vol</span>
        <Sparkline data={market.sparkline} width={64} height={22} />
      </div>
    </Link>
  );
}
