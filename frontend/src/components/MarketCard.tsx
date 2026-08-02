import { Link } from 'react-router-dom';
import type { MarketSummary } from '../lib/types';
import { MarketImage } from './MarketImage';
import { ProbabilityRing } from './ProbabilityRing';
import { useTranslation } from '../lib/i18n/useTranslation';
import { useCategoryLabel } from '../lib/i18n/categories';

function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days;
}

export function MarketCard({ market }: { market: MarketSummary }) {
  const { t } = useTranslation();
  const categoryLabel = useCategoryLabel(market.category);
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
          <MarketImage imageUrl={market.imageUrl} categoryName={market.category.name} size={44} />
          <h3 className="text-sm font-semibold leading-snug line-clamp-3 pt-0.5">{market.question}</h3>
        </div>
        <ProbabilityRing pct={yesPct} />
      </div>

      <div className="text-[11px] text-text-secondary">
        {categoryLabel} · ${market.volume24h.toFixed(0)} vol ·{' '}
        {isClosed
          ? t(market.status === 'RESOLVED' ? 'common.status.RESOLVED' : 'common.status.CLOSED')
          : days > 0
            ? t('marketCard.daysLeft', { days })
            : t('marketCard.closingSoon')}
      </div>
    </Link>
  );
}
