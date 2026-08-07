import { Link } from 'react-router-dom';
import type { MarketSummary } from '../lib/types';
import { MarketImage } from './MarketImage';
import { PercentPill } from './PercentPill';
import { useTranslation } from '../lib/i18n/useTranslation';
import { useCategoryLabel } from '../lib/i18n/categories';

function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days;
}

export function MarketCard({ market }: { market: MarketSummary }) {
  const { t, lang } = useTranslation();
  const categoryLabel = useCategoryLabel(market.category);
  const isClosed = market.status !== 'OPEN';
  const days = daysUntil(market.closeDate);
  const yesPct = Math.round(market.yesProbability * 100);
  const noPct = 100 - yesPct;
  const closeDateShort = new Date(market.closeDate).toLocaleDateString(lang === 'es' ? 'es-MX' : 'en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <Link
      to={`/market/${market.slug}`}
      className={`group flex flex-col gap-3 rounded-2xl border border-border bg-bg-elevated p-4 transition-all hover:shadow-[0_0_0_1px_var(--color-accent-primary)] ${
        isClosed ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-center gap-2 min-w-0">
        <MarketImage imageUrl={market.imageUrl} categoryName={market.category.name} size={24} />
        <span className="text-[11px] font-bold tracking-wide text-text-secondary uppercase truncate">{categoryLabel}</span>
        <span className="ml-auto text-[11px] text-text-secondary shrink-0">{closeDateShort}</span>
      </div>

      <h3 className="text-sm font-semibold leading-snug line-clamp-3">{market.question}</h3>

      <div className="flex flex-col gap-2 mt-1">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{t('common.yes')}</p>
            <div className="h-1 rounded-full bg-overlay-2 mt-1.5">
              <div className="h-1 rounded-full" style={{ width: `${yesPct}%`, background: 'var(--color-yes)' }} />
            </div>
          </div>
          <PercentPill pct={yesPct} outcome="YES" size="sm" />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{t('common.no')}</p>
            <div className="h-1 rounded-full bg-overlay-2 mt-1.5">
              <div className="h-1 rounded-full" style={{ width: `${noPct}%`, background: 'var(--color-no)' }} />
            </div>
          </div>
          <PercentPill pct={noPct} outcome="NO" size="sm" />
        </div>
      </div>

      <div className="text-[11px] text-text-secondary">
        MX${market.volume24h.toFixed(0)} vol ·{' '}
        {isClosed
          ? t(market.status === 'RESOLVED' ? 'common.status.RESOLVED' : 'common.status.CLOSED')
          : days > 0
            ? t('marketCard.daysLeft', { days })
            : t('marketCard.closingSoon')}
      </div>
    </Link>
  );
}
