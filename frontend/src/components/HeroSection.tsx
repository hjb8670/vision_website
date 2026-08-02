import { Link } from 'react-router-dom';
import { useMarkets } from '../hooks/useMarkets';
import { CategoryIcon } from './CategoryIcon';
import { useTranslation } from '../lib/i18n/useTranslation';
import { useCategoryLabel } from '../lib/i18n/categories';
import type { MarketSummary } from '../lib/types';

export function HeroSection() {
  const { data: trending, isLoading } = useMarkets('trending');
  const featured = trending?.[0];
  const { t } = useTranslation();

  if (!isLoading && !featured) {
    return <FallbackHero />;
  }

  return (
    <section className="relative overflow-hidden rounded-2xl bg-bg-elevated min-h-[320px] md:min-h-[380px]">
      {featured?.imageUrl ? (
        <>
          <img
            src={featured.imageUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(to top, rgba(10,10,10,0.95), rgba(10,10,10,0.5) 60%, rgba(10,10,10,0.25))',
            }}
          />
        </>
      ) : (
        <>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(ellipse at 15% 10%, rgba(232, 54, 47, 0.25), transparent 55%), radial-gradient(ellipse at 100% 100%, rgba(255, 255, 255, 0.05), transparent 50%)',
            }}
          />
          {featured && (
            <div className="absolute -right-10 -bottom-10 opacity-[0.06] pointer-events-none">
              <CategoryIcon label={featured.category.name} size={260} />
            </div>
          )}
        </>
      )}

      {featured ? (
        <FeaturedMarketCard market={featured} />
      ) : (
        <div className="relative h-full flex items-center justify-center p-8">
          <p className="text-text-secondary">{t('marketsPage.loading')}</p>
        </div>
      )}
    </section>
  );
}

function FeaturedMarketCard({ market }: { market: MarketSummary }) {
  const { t } = useTranslation();
  const categoryLabel = useCategoryLabel(market.category);
  const yesPct = Math.round(market.yesProbability * 100);
  const noPct = 100 - yesPct;

  return (
    <div className="relative p-8 md:p-12 flex flex-col gap-6">
      <p className="text-xs font-bold tracking-wide text-accent-primary uppercase">
        {t('home.featuredMarket')} · {categoryLabel}
      </p>
      <h1 className="text-2xl md:text-4xl font-extrabold leading-tight max-w-2xl">{market.question}</h1>

      <div className="flex flex-wrap gap-3">
        <Link
          to={`/market/${market.slug}`}
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-lg"
          style={{ background: 'var(--color-yes)', color: 'var(--color-bg-primary)' }}
        >
          {t('common.yes')} {yesPct}%
        </Link>
        <Link
          to={`/market/${market.slug}`}
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-lg text-white"
          style={{ background: 'var(--color-no)' }}
        >
          {t('common.no')} {noPct}%
        </Link>
      </div>

      <p className="text-sm text-text-secondary">
        {t('home.volShort', { amount: market.volume24h.toFixed(0) })} ·{' '}
        <Link to={`/market/${market.slug}`} className="text-accent-primary hover:underline">
          {t('home.viewMarket')}
        </Link>
      </p>
    </div>
  );
}

function FallbackHero() {
  const { t } = useTranslation();
  return (
    <section
      className="rounded-2xl bg-bg-elevated p-8 md:p-12 text-center"
      style={{
        backgroundImage:
          'radial-gradient(ellipse at 20% 0%, rgba(232, 54, 47, 0.15), transparent 55%), radial-gradient(ellipse at 100% 100%, rgba(255, 255, 255, 0.04), transparent 50%)',
      }}
    >
      <h1 className="text-3xl md:text-5xl font-extrabold mb-3">{t('home.heroFallbackTitle')}</h1>
      <p className="text-text-secondary max-w-xl mx-auto mb-6">{t('home.heroFallbackSubtitle')}</p>
      <Link
        to="/markets"
        className="inline-block px-6 py-3 rounded-full bg-accent-primary hover:bg-accent-secondary font-bold text-white transition-colors"
      >
        {t('home.exploreMarkets')}
      </Link>
    </section>
  );
}
