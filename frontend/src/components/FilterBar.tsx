import { useCategories } from '../hooks/useCategories';
import type { SortFilter } from '../lib/types';

const SORTS: { value: SortFilter; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'trending', label: 'Trending' },
  { value: 'volume', label: 'Volume' },
  { value: 'ending', label: 'Ending Soon' },
];

interface FilterBarProps {
  sf: SortFilter;
  onSfChange: (sf: SortFilter) => void;
  category: string | undefined;
  onCategoryChange: (slug: string | undefined) => void;
}

export function FilterBar({ sf, onSfChange, category, onCategoryChange }: FilterBarProps) {
  const { data: categories } = useCategories();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        <button
          type="button"
          onClick={() => onCategoryChange(undefined)}
          className={`shrink-0 px-3 py-1.5 rounded-full text-sm border transition-colors ${
            !category
              ? 'bg-accent-primary border-accent-primary text-white font-semibold'
              : 'border-border text-text-secondary hover:text-text-primary'
          }`}
        >
          All
        </button>
        {categories?.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onCategoryChange(c.slug)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-sm border transition-colors ${
              category === c.slug
                ? 'bg-accent-primary border-accent-primary text-white font-semibold'
                : 'border-border text-text-secondary hover:text-text-primary'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-text-secondary">Sort:</span>
        <select
          value={sf}
          onChange={(e) => onSfChange(e.target.value as SortFilter)}
          className="bg-bg-secondary border border-border rounded-md px-2 py-1 text-sm focus:outline-none focus:border-accent-primary"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
