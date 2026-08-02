import { useEffect, useState } from 'react';
import { useCategories } from '../hooks/useCategories';
import { useMarket, useCreateMarket, useUpdateMarket, type MarketFormInput } from '../hooks/useMarkets';
import type { MarketSummary } from '../lib/types';

const EMPTY_FORM: MarketFormInput = {
  question: '',
  description: '',
  resolutionSource: '',
  categoryId: '',
  imageUrl: '',
  closeDate: '',
  liquidityB: undefined,
};

function toDatetimeLocal(iso: string): string {
  return new Date(iso).toISOString().slice(0, 16);
}

const inputClass =
  'w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent-primary';

export function MarketFormModal({
  mode,
  market,
  onClose,
}: {
  mode: 'create' | 'edit';
  market?: MarketSummary;
  onClose: () => void;
}) {
  const { data: categories } = useCategories();
  const { data: detail } = useMarket(mode === 'edit' ? market?.slug : undefined);
  const createMutation = useCreateMarket();
  const updateMutation = useUpdateMarket();

  const [form, setForm] = useState<MarketFormInput>(EMPTY_FORM);

  useEffect(() => {
    if (mode === 'edit' && detail) {
      setForm({
        question: detail.question,
        description: detail.description,
        resolutionSource: detail.resolutionSource,
        categoryId: detail.category.id,
        imageUrl: detail.imageUrl ?? '',
        closeDate: toDatetimeLocal(detail.closeDate),
        liquidityB: detail.liquidityB,
      });
    }
  }, [mode, detail]);

  const isEdit = mode === 'edit';
  const isSaving = createMutation.isPending || updateMutation.isPending;
  const loadingDetail = isEdit && !detail;

  function update<K extends keyof MarketFormInput>(key: K, value: MarketFormInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const dto: MarketFormInput = {
      ...form,
      closeDate: new Date(form.closeDate).toISOString(),
      imageUrl: form.imageUrl || undefined,
    };

    if (isEdit && market) {
      updateMutation.mutate({ id: market.id, dto }, { onSuccess: onClose });
    } else {
      createMutation.mutate(dto, { onSuccess: onClose });
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg bg-bg-elevated rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-xl font-bold">{isEdit ? 'Edit Market' : 'New Market'}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1 -mt-1 -mr-1 rounded-full text-text-secondary hover:text-text-primary hover:bg-white/10"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {loadingDetail ? (
          <p className="text-text-secondary text-sm">Loading market…</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Question">
              <input
                required
                minLength={5}
                value={form.question}
                onChange={(e) => update('question', e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Description">
              <textarea
                required
                rows={3}
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                className={`${inputClass} resize-none`}
              />
            </Field>

            <Field label="Resolution source">
              <input
                required
                value={form.resolutionSource}
                onChange={(e) => update('resolutionSource', e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Category">
              <select
                required
                value={form.categoryId}
                onChange={(e) => update('categoryId', e.target.value)}
                className={inputClass}
              >
                <option value="" disabled className="bg-bg-elevated text-text-primary">
                  Select a category
                </option>
                {categories?.map((c) => (
                  <option key={c.id} value={c.id} className="bg-bg-elevated text-text-primary">
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Image URL (optional)">
              <input
                value={form.imageUrl}
                onChange={(e) => update('imageUrl', e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Close date">
              <input
                required
                type="datetime-local"
                value={form.closeDate}
                onChange={(e) => update('closeDate', e.target.value)}
                className={inputClass}
              />
            </Field>

            {!isEdit && (
              <Field label="Liquidity (optional, default 75)">
                <input
                  type="number"
                  min={1}
                  value={form.liquidityB ?? ''}
                  onChange={(e) => update('liquidityB', e.target.value ? Number(e.target.value) : undefined)}
                  className={inputClass}
                />
              </Field>
            )}

            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-2.5 rounded-full bg-accent-primary hover:bg-accent-secondary disabled:opacity-50 text-sm font-semibold text-white transition-colors"
            >
              {isSaving ? 'Saving…' : isEdit ? 'Save changes' : 'Create market'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-text-secondary">{label}</span>
      {children}
    </label>
  );
}
