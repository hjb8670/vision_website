import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMarkets } from '../hooks/useMarkets';
import { MarketCard } from '../components/MarketCard';
import { FilterBar } from '../components/FilterBar';
import { useTranslation } from '../lib/i18n/useTranslation';
import type { SortFilter } from '../lib/types';

export function MarketsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sf, setSf] = useState<SortFilter>((searchParams.get('sf') as SortFilter) ?? 'newest');
  const category = searchParams.get('category') ?? undefined;
  const { t } = useTranslation();

  const { data: markets, isLoading } = useMarkets(sf, category);

  function handleCategoryChange(slug: string | undefined) {
    setSearchParams(slug ? { category: slug } : {});
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold">{t('marketsPage.heading')}</h1>
      <FilterBar sf={sf} onSfChange={setSf} category={category} onCategoryChange={handleCategoryChange} />

      {isLoading ? (
        <p className="text-text-secondary">{t('marketsPage.loading')}</p>
      ) : markets && markets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {markets.map((m) => (
            <MarketCard key={m.id} market={m} />
          ))}
        </div>
      ) : (
        <p className="text-text-secondary">{t('marketsPage.empty')}</p>
      )}
    </div>
  );
}
