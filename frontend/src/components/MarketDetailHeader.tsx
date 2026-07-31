import { useState } from 'react';
import type { MarketDetail } from '../lib/types';

export function MarketDetailHeader({ market }: { market: MarketDetail }) {
  const [expanded, setExpanded] = useState(false);
  const yesPct = Math.round(market.yesProbability * 100);
  const closeDate = new Date(market.closeDate).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-[11px] uppercase tracking-wide text-text-secondary bg-bg-elevated px-2 py-0.5 rounded">
          {market.category.name}
        </span>
        <span className="text-xs text-text-secondary">Closes {closeDate}</span>
        {market.status === 'RESOLVED' && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-bg-elevated">
            Resolved: {market.resolvedOutcome}
          </span>
        )}
      </div>

      <h1 className="text-2xl md:text-3xl font-bold leading-tight">{market.question}</h1>

      <div className="flex items-baseline gap-2">
        <span
          className="text-4xl font-extrabold"
          style={{ color: yesPct > 50 ? 'var(--color-yes)' : 'var(--color-no)' }}
        >
          {yesPct}%
        </span>
        <span className="text-text-secondary text-sm">chance YES</span>
      </div>

      <p className={`text-sm text-text-secondary ${expanded ? '' : 'line-clamp-2'}`}>{market.description}</p>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="text-xs text-accent-primary font-medium hover:underline"
      >
        {expanded ? 'Read less' : 'Read more'}
      </button>

      <div className="text-xs text-text-secondary border-t border-border pt-2">
        <span className="font-medium text-text-primary">Resolution source: </span>
        {market.resolutionSource}
      </div>
    </div>
  );
}
