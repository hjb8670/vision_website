import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useMarkets } from '../hooks/useMarkets';
import { useResolveMarket } from '../hooks/useAdminMarkets';
import { AdminMarketFormModal } from '../components/AdminMarketFormModal';
import type { MarketSummary } from '../lib/types';

const STATUS_STYLES: Record<MarketSummary['status'], string> = {
  OPEN: 'bg-success/15 text-success',
  CLOSED: 'bg-warning/15 text-warning',
  RESOLVED: 'bg-white/10 text-text-secondary',
};

export function AdminPage() {
  const { user } = useAuthStore();
  const { data: markets, isLoading } = useMarkets('newest');
  const resolveMutation = useResolveMarket();
  const [editing, setEditing] = useState<MarketSummary | 'new' | null>(null);

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-text-secondary">You don't have access to this page.</p>
      </div>
    );
  }

  function handleResolve(market: MarketSummary, outcome: 'YES' | 'NO') {
    if (!window.confirm(`Resolve "${market.question}" as ${outcome}? This pays out winning positions and can't be undone.`)) {
      return;
    }
    resolveMutation.mutate({ id: market.id, outcome });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin — Markets</h1>
        <button
          type="button"
          onClick={() => setEditing('new')}
          className="px-4 py-2 rounded-full bg-accent-primary hover:bg-accent-secondary text-sm font-semibold text-white transition-colors"
        >
          New Market
        </button>
      </div>

      {isLoading ? (
        <p className="text-text-secondary">Loading markets…</p>
      ) : markets && markets.length > 0 ? (
        <div className="bg-bg-elevated rounded-2xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-text-secondary border-b border-white/10">
                <th className="px-4 py-3 font-medium">Question</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Closes</th>
                <th className="px-4 py-3 font-medium">Yes %</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {markets.map((m) => (
                <tr key={m.id} className="border-b border-white/5 last:border-0">
                  <td className="px-4 py-3 max-w-xs truncate">{m.question}</td>
                  <td className="px-4 py-3 text-text-secondary">{m.category.name}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[m.status]}`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                    {new Date(m.closeDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">{Math.round(m.yesProbability * 100)}%</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditing(m)}
                        className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/15 text-xs font-semibold transition-colors"
                      >
                        Edit
                      </button>
                      {m.status !== 'RESOLVED' && (
                        <>
                          <button
                            type="button"
                            disabled={resolveMutation.isPending}
                            onClick={() => handleResolve(m, 'YES')}
                            className="px-3 py-1 rounded-full bg-yes/15 text-yes hover:bg-yes/25 text-xs font-semibold transition-colors disabled:opacity-50"
                          >
                            Resolve YES
                          </button>
                          <button
                            type="button"
                            disabled={resolveMutation.isPending}
                            onClick={() => handleResolve(m, 'NO')}
                            className="px-3 py-1 rounded-full bg-no/15 text-no hover:bg-no/25 text-xs font-semibold transition-colors disabled:opacity-50"
                          >
                            Resolve NO
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-text-secondary">No markets yet.</p>
      )}

      {editing && (
        <AdminMarketFormModal
          mode={editing === 'new' ? 'create' : 'edit'}
          market={editing === 'new' ? undefined : editing}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
