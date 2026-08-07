import { Link } from 'react-router-dom';
import { useMarkets } from '../hooks/useMarkets';
import { CategoryIcon } from './CategoryIcon';
import { PercentPill } from './PercentPill';
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

  const hasPhoto = !!featured?.imageUrl;

  return (
    <section className="relative overflow-hidden rounded-2xl border border-border bg-bg-elevated min-h-[320px] md:min-h-[380px]">
      {hasPhoto ? (
        <>
          <img src={featured!.imageUrl!} alt="" className="absolute inset-0 w-full h-full object-cover" />
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
                'radial-gradient(ellipse at 15% 10%, rgba(232, 54, 47, 0.14), transparent 55%), radial-gradient(ellipse at 100% 100%, rgba(0, 0, 0, 0.03), transparent 50%)',
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
        <FeaturedMarketCard
          market={featured}
          hasPhoto={hasPhoto}
          relatedCount={(trending ?? []).filter((m) => m.category.id === featured.category.id).length - 1}
        />
      ) : (
        <div className="relative h-full flex items-center justify-center p-8">
          <p className="text-text-secondary">{t('marketsPage.loading')}</p>
        </div>
      )}
    </section>
  );
}

function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function FeaturedMarketCard({
  market,
  hasPhoto,
  relatedCount,
}: {
  market: MarketSummary;
  hasPhoto: boolean;
  relatedCount: number;
}) {
  const { t } = useTranslation();
  const categoryLabel = useCategoryLabel(market.category);
  const yesPct = Math.round(market.yesProbability * 100);
  const noPct = 100 - yesPct;
  const days = daysUntil(market.closeDate);

  const headingColor = hasPhoto ? 'text-white' : 'text-text-primary';
  const mutedColor = hasPhoto ? 'text-white/70' : 'text-text-secondary';
  const rowClass = hasPhoto
    ? 'bg-black/20 hover:bg-black/30 text-white'
    : 'bg-overlay-1 hover:bg-overlay-2 text-text-primary';

  return (
    <div className="relative p-8 md:p-12 flex flex-col gap-6">
      {days > 0 && days <= 14 && (
        <span className="inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full bg-accent-primary/90 text-xs font-bold uppercase tracking-wide text-white">
          <span className="w-1.5 h-1.5 rounded-full bg-white" />
          {t('home.closesInDays', { days })}
        </span>
      )}
      <p className="text-xs font-bold tracking-wide text-accent-primary uppercase">
        {t('home.featuredMarket')} · {categoryLabel}
      </p>
      <h1 className={`text-2xl md:text-4xl font-extrabold leading-tight max-w-2xl ${headingColor}`}>{market.question}</h1>

      <div className="flex flex-col gap-2 max-w-md">
        <Link
          to={`/market/${market.slug}`}
          className={`flex items-center justify-between gap-3 rounded-xl px-4 py-3 transition-colors ${rowClass}`}
        >
          <span className="font-semibold">{t('common.yes')}</span>
          <PercentPill pct={yesPct} outcome="YES" />
        </Link>
        <Link
          to={`/market/${market.slug}`}
          className={`flex items-center justify-between gap-3 rounded-xl px-4 py-3 transition-colors ${rowClass}`}
        >
          <span className="font-semibold">{t('common.no')}</span>
          <PercentPill pct={noPct} outcome="NO" />
        </Link>
      </div>

      <p className={`text-sm ${mutedColor}`}>
        {t('home.volShort', { amount: market.volume24h.toFixed(0) })}
        {relatedCount > 0 && <> · {t('home.relatedMarkets', { count: relatedCount })}</>}
        {' · '}
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
      className="rounded-2xl border border-border bg-bg-elevated p-8 md:p-12 text-center"
      style={{
        backgroundImage:
          'radial-gradient(ellipse at 20% 0%, rgba(232, 54, 47, 0.12), transparent 55%), radial-gradient(ellipse at 100% 100%, rgba(0, 0, 0, 0.03), transparent 50%)',
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
