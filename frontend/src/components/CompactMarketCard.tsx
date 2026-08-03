import { Link } from 'react-router-dom';
import { MarketImage } from './MarketImage';
import { Sparkline } from './Sparkline';
import { useTranslation } from '../lib/i18n/useTranslation';
import { useCategoryLabel } from '../lib/i18n/categories';
import type { MarketSummary } from '../lib/types';

export function CompactMarketCard({ market }: { market: MarketSummary }) {
  const { t } = useTranslation();
  const categoryLabel = useCategoryLabel(market.category);
  const yesPct = Math.round(market.yesProbability * 100);
  const noPct = 100 - yesPct;

  return (
    <Link
      to={`/market/${market.slug}`}
      className="flex flex-col gap-3 rounded-2xl bg-bg-elevated p-4 h-full hover:shadow-[0_0_0_1px_var(--color-accent-primary)] transition-shadow"
    >
      <div className="flex items-start gap-2">
        <MarketImage imageUrl={market.imageUrl} categoryName={market.category.name} size={32} />
        <h4 className="text-sm font-semibold leading-snug line-clamp-2">{market.question}</h4>
      </div>

      <div className="flex items-center gap-3">
        <p
          className="text-2xl font-extrabold leading-none shrink-0"
          style={{ color: yesPct >= 50 ? 'var(--color-yes)' : 'var(--color-no)' }}
        >
          {yesPct}%
        </p>
        <div className="flex-1 min-w-0">
          <Sparkline points={market.sparkline} color="var(--color-accent-primary)" height={24} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <span
          className="py-1.5 rounded-md text-center text-xs font-bold"
          style={{ background: 'var(--color-yes)', color: 'var(--color-bg-primary)' }}
        >
          {t('common.yes')} {yesPct}¢
        </span>
        <span className="py-1.5 rounded-md text-center text-xs font-bold text-white" style={{ background: 'var(--color-no)' }}>
          {t('common.no')} {noPct}¢
        </span>
      </div>

      <p className="text-[11px] text-text-secondary mt-auto">
        {t('home.volShort', { amount: market.volume24h.toFixed(0) })} · {categoryLabel}
      </p>
    </Link>
  );
}
