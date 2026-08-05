import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMarkets } from '../hooks/useMarkets';
import { MarketCard } from '../components/MarketCard';
import { SpotlightMarketCard } from '../components/SpotlightMarketCard';
import { CompactMarketCard } from '../components/CompactMarketCard';
import { HeroSection } from '../components/HeroSection';
import { TrendingTopicsWidget } from '../components/TrendingTopicsWidget';
import { LeaderboardTeaserWidget } from '../components/LeaderboardTeaserWidget';
import { MultiMarketComparisonChart } from '../components/MultiMarketComparisonChart';
import { DepositProgressBanner } from '../components/DepositProgressBanner';
import { useTranslation } from '../lib/i18n/useTranslation';
import { useCategoryLabel } from '../lib/i18n/categories';
import type { MarketSummary, SortFilter } from '../lib/types';

function groupByFirstSeenCategory(markets: MarketSummary[]) {
  const seen = new Set<string>();
  const groups: MarketSummary[][] = [];
  for (const m of markets) {
    if (!seen.has(m.category.id)) {
      seen.add(m.category.id);
      groups.push(markets.filter((x) => x.category.id === m.category.id));
    }
  }
  return groups;
}

function SpotlightSkeleton() {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 w-64 rounded bg-bg-elevated animate-pulse" />
        <div className="h-4 w-24 rounded bg-bg-elevated animate-pulse" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
        <div className="lg:col-span-2 h-64 rounded-2xl bg-bg-elevated animate-pulse" />
        <div className="space-y-4">
          <div className="h-[124px] rounded-2xl bg-bg-elevated animate-pulse" />
          <div className="h-[124px] rounded-2xl bg-bg-elevated animate-pulse" />
        </div>
      </div>
    </section>
  );
}

function ComparisonSkeleton() {
  return (
    <section>
      <div className="h-[420px] rounded-2xl bg-bg-elevated animate-pulse" />
    </section>
  );
}

export function HomePage() {
  const { data: trending, isLoading: trendingLoading } = useMarkets('trending');
  const [allSf, setAllSf] = useState<SortFilter>('volume');
  const { data: allMarkets } = useMarkets(allSf);
  const { t } = useTranslation();

  const categoryGroups = groupByFirstSeenCategory(trending ?? []);
  const spotlightGroup = categoryGroups[0];
  const comparisonGroup = categoryGroups.slice(1).find((g) => g.length >= 3) ?? categoryGroups[1];

  const spotlightBig = spotlightGroup?.[0];
  const spotlightSmall = spotlightGroup?.slice(1, 3) ?? [];
  const spotlightCategoryLabel = useCategoryLabel(spotlightBig?.category);
  const spotlightVolume = (spotlightGroup ?? []).reduce((sum, m) => sum + m.volume24h, 0);

  const comparisonMarkets = (comparisonGroup ?? []).slice(0, 3);

  const SORTS: { value: SortFilter; label: string }[] = [
    { value: 'newest', label: t('filterBar.newest') },
    { value: 'trending', label: t('filterBar.trending') },
    { value: 'volume', label: t('filterBar.volume') },
    { value: 'ending', label: t('filterBar.endingSoon') },
  ];

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

      {trendingLoading ? (
        <SpotlightSkeleton />
      ) : (
        spotlightBig && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">
                {t('home.spotlightVolume', { category: spotlightCategoryLabel, amount: spotlightVolume.toFixed(0) })}
              </h2>
              <Link to={`/markets?category=${spotlightBig.category.slug}`} className="text-sm text-accent-primary hover:underline">
                {t('home.viewAllCategory')}
              </Link>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
              <div className="lg:col-span-2">
                <SpotlightMarketCard market={spotlightBig} />
              </div>
              <div className="space-y-4">
                {spotlightSmall.map((m) => (
                  <CompactMarketCard key={m.id} market={m} />
                ))}
              </div>
            </div>
          </section>
        )
      )}

      {trendingLoading ? (
        <ComparisonSkeleton />
      ) : (
        comparisonMarkets.length >= 3 && (
          <section>
            <MultiMarketComparisonChart markets={comparisonMarkets} />
          </section>
        )
      )}

      <DepositProgressBanner />

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">{t('home.allMarketsHeading')}</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-secondary">{t('home.sortLabel')}</span>
            <select
              value={allSf}
              onChange={(e) => setAllSf(e.target.value as SortFilter)}
              className="bg-bg-elevated border border-white/10 rounded-md px-2 py-1 text-sm focus:outline-none focus:border-accent-primary"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value} className="bg-bg-elevated text-text-primary">
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {(allMarkets ?? []).slice(0, 8).map((m) => (
            <MarketCard key={m.id} market={m} />
          ))}
        </div>
      </section>
    </div>
  );
}
