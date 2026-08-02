import { Link } from 'react-router-dom';
import { useMarkets } from '../hooks/useMarkets';
import { MarketCard } from '../components/MarketCard';
import { HeroSection } from '../components/HeroSection';
import { TrendingTopicsWidget } from '../components/TrendingTopicsWidget';
import { LeaderboardTeaserWidget } from '../components/LeaderboardTeaserWidget';
import { MultiMarketComparisonChart } from '../components/MultiMarketComparisonChart';
import { DepositProgressBanner } from '../components/DepositProgressBanner';
import { useTranslation } from '../lib/i18n/useTranslation';
import { useCategoryLabel } from '../lib/i18n/categories';

export function HomePage() {
  const { data: trending } = useMarkets('trending');
  const { data: newest } = useMarkets('newest');
  const { t } = useTranslation();

  const comparisonMarkets = (trending ?? []).slice(0, 3);
  const sideCards = (trending ?? []).slice(3, 5);
  const topCategoryLabel = useCategoryLabel(comparisonMarkets[0]?.category);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <HeroSection />
        </div>
        <div className="space-y-4">
          <TrendingTopicsWidget />
          <LeaderboardTeaserWidget />
        </div>
      </div>

      {comparisonMarkets.length >= 3 && (
        <section>
          <h2 className="text-xl font-bold mb-4">{t('home.comparisonSubheading', { category: topCategoryLabel })}</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <MultiMarketComparisonChart markets={comparisonMarkets} />
            </div>
            <div className="space-y-4">
              {sideCards.map((m) => (
                <MarketCard key={m.id} market={m} />
              ))}
            </div>
          </div>
        </section>
      )}

      <DepositProgressBanner />

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">{t('home.allMarketsHeading')}</h2>
          <Link to="/markets" className="text-sm text-accent-primary hover:underline">
            {t('home.viewAll')}
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {(newest ?? []).slice(0, 8).map((m) => (
            <MarketCard key={m.id} market={m} />
          ))}
        </div>
      </section>
    </div>
  );
}
