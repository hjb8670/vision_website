import { useCategories } from '../hooks/useCategories';
import { useTranslation } from '../lib/i18n/useTranslation';
import { useCategoryLabel } from '../lib/i18n/categories';
import type { Category, SortFilter } from '../lib/types';

interface FilterBarProps {
  sf: SortFilter;
  onSfChange: (sf: SortFilter) => void;
  category: string | undefined;
  onCategoryChange: (slug: string | undefined) => void;
}

export function FilterBar({ sf, onSfChange, category, onCategoryChange }: FilterBarProps) {
  const { data: categories } = useCategories();
  const { t } = useTranslation();

  const SORTS: { value: SortFilter; label: string }[] = [
    { value: 'newest', label: t('filterBar.newest') },
    { value: 'trending', label: t('filterBar.trending') },
    { value: 'volume', label: t('filterBar.volume') },
    { value: 'ending', label: t('filterBar.endingSoon') },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        <button
          type="button"
          onClick={() => onCategoryChange(undefined)}
          className={`shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
            !category ? 'bg-accent-primary text-white' : 'bg-overlay-1 text-text-secondary hover:text-text-primary'
          }`}
        >
          {t('filterBar.all')}
        </button>
        {categories?.map((c) => (
          <CategoryFilterPill key={c.id} category={c} active={category === c.slug} onSelect={onCategoryChange} />
        ))}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-text-secondary">{t('filterBar.sort')}</span>
        <select
          value={sf}
          onChange={(e) => onSfChange(e.target.value as SortFilter)}
          className="bg-bg-elevated border border-border rounded-md px-2 py-1 text-sm focus:outline-none focus:border-accent-primary"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value} className="bg-bg-elevated text-text-primary">
              {s.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function CategoryFilterPill({
  category,
  active,
  onSelect,
}: {
  category: Category;
  active: boolean;
  onSelect: (slug: string) => void;
}) {
  const label = useCategoryLabel(category);
  return (
    <button
      type="button"
      onClick={() => onSelect(category.slug)}
      className={`shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
        active ? 'bg-accent-primary text-white' : 'bg-overlay-1 text-text-secondary hover:text-text-primary'
      }`}
    >
      {label}
    </button>
  );
}
