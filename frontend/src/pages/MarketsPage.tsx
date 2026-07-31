import { useState } from 'react';
import { useMarkets } from '../hooks/useMarkets';
import { MarketCard } from '../components/MarketCard';
import { FilterBar } from '../components/FilterBar';
import type { SortFilter } from '../lib/types';

export function MarketsPage() {
  const [sf, setSf] = useState<SortFilter>('newest');
  const [category, setCategory] = useState<string | undefined>(undefined);
  const { data: markets, isLoading } = useMarkets(sf, category);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold">Markets</h1>
      <FilterBar sf={sf} onSfChange={setSf} category={category} onCategoryChange={setCategory} />

      {isLoading ? (
        <p className="text-text-secondary">Loading markets…</p>
      ) : markets && markets.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {markets.map((m) => (
            <MarketCard key={m.id} market={m} />
          ))}
        </div>
      ) : (
        <p className="text-text-secondary">No markets found in this category.</p>
      )}
    </div>
  );
}
