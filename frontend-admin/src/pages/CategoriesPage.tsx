import { useState } from 'react';
import { useCategories, useDeleteCategory } from '../hooks/useCategories';
import { CategoryFormModal } from '../components/CategoryFormModal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import type { Category } from '../lib/types';

export function CategoriesPage() {
  const { data: categories, isLoading } = useCategories();
  const deleteMutation = useDeleteCategory();

  const [editing, setEditing] = useState<Category | 'new' | null>(null);
  const [deleting, setDeleting] = useState<Category | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categories</h1>
        <button
          type="button"
          onClick={() => setEditing('new')}
          className="px-4 py-2 rounded-full bg-accent-primary hover:bg-accent-secondary text-sm font-semibold text-white transition-colors"
        >
          New Category
        </button>
      </div>

      {isLoading ? (
        <p className="text-text-secondary">Loading categories…</p>
      ) : categories && categories.length > 0 ? (
        <div className="bg-bg-elevated rounded-2xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-text-secondary border-b border-white/10">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className="border-b border-white/5 last:border-0">
                  <td className="px-4 py-3">{c.name}</td>
                  <td className="px-4 py-3 text-text-secondary">{c.slug}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setEditing(c)}
                        className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/15 text-xs font-semibold transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleting(c)}
                        className="px-3 py-1 rounded-full bg-error/15 text-error hover:bg-error/25 text-xs font-semibold transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-text-secondary">No categories yet.</p>
      )}

      {editing && (
        <CategoryFormModal category={editing === 'new' ? undefined : editing} onClose={() => setEditing(null)} />
      )}

      {deleting && (
        <ConfirmDialog
          title="Delete category?"
          message={`"${deleting.name}" will be permanently deleted. This only works if no markets are assigned to it.`}
          confirmLabel="Delete"
          danger
          onConfirm={() => {
            deleteMutation.mutate(deleting.id);
            setDeleting(null);
          }}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
