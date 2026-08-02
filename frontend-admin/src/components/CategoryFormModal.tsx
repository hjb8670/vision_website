import { useState } from 'react';
import { useCreateCategory, useUpdateCategory } from '../hooks/useCategories';
import type { Category } from '../lib/types';

export function CategoryFormModal({
  category,
  onClose,
}: {
  category?: Category;
  onClose: () => void;
}) {
  const isEdit = !!category;
  const [name, setName] = useState(category?.name ?? '');
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const isSaving = createMutation.isPending || updateMutation.isPending;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isEdit) {
      updateMutation.mutate({ id: category.id, name }, { onSuccess: onClose });
    } else {
      createMutation.mutate(name, { onSuccess: onClose });
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div className="w-full max-w-sm bg-bg-elevated rounded-2xl p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-xl font-bold">{isEdit ? 'Edit Category' : 'New Category'}</h2>
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-text-secondary">Name</span>
            <input
              required
              minLength={2}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent-primary"
            />
          </label>
          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-2.5 rounded-full bg-accent-primary hover:bg-accent-secondary disabled:opacity-50 text-sm font-semibold text-white transition-colors"
          >
            {isSaving ? 'Saving…' : isEdit ? 'Save changes' : 'Create category'}
          </button>
        </form>
      </div>
    </div>
  );
}
