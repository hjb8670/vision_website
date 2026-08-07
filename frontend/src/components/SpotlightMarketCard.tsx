import { Link } from 'react-router-dom';
import { MarketImage } from './MarketImage';
import { Sparkline } from './Sparkline';
import { PercentPill } from './PercentPill';
import { useTranslation } from '../lib/i18n/useTranslation';
import { useCategoryLabel } from '../lib/i18n/categories';
import type { MarketSummary } from '../lib/types';

function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function SpotlightMarketCard({ market }: { market: MarketSummary }) {
  const { t } = useTranslation();
  const categoryLabel = useCategoryLabel(market.category);
  const yesPct = Math.round(market.yesProbability * 100);
  const noPct = 100 - yesPct;
  const days = daysUntil(market.closeDate);

  return (
    <Link
      to={`/market/${market.slug}`}
      className="flex flex-col gap-5 rounded-2xl bg-bg-elevated p-5 h-full hover:shadow-[0_0_0_1px_var(--color-accent-primary)] transition-shadow"
    >
      <div className="flex items-start gap-3">
        <MarketImage imageUrl={market.imageUrl} categoryName={market.category.name} size={48} />
        <div className="min-w-0">
          <p className="text-[11px] font-bold tracking-wide text-text-secondary uppercase">{categoryLabel}</p>
          <h3 className="text-base md:text-lg font-bold leading-snug line-clamp-2">{market.question}</h3>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="shrink-0 flex flex-col items-center gap-1.5">
          <PercentPill pct={yesPct} outcome="YES" />
          <p className="text-xs text-text-secondary">{t('common.yes')}</p>
        </div>
        <div className="flex-1 min-w-0">
          <Sparkline points={market.sparkline} color="var(--color-accent-primary)" height={36} />
        </div>
        <div className="shrink-0 flex flex-col items-center gap-1.5">
          <PercentPill pct={noPct} outcome="NO" />
          <p className="text-xs text-text-secondary">{t('common.no')}</p>
        </div>
      </div>

      <p className="text-xs text-text-secondary mt-auto">
        {t('home.volShort', { amount: market.volume24h.toFixed(0) })} ·{' '}
        {days > 0 ? t('home.closesInDays', { days }) : t('home.closesToday')}
      </p>
    </Link>
  );
}
