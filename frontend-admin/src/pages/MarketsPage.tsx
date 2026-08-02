import { useState } from 'react';
import { useMarkets, useResolveMarket, useSetMarketStatus, useDeleteMarket } from '../hooks/useMarkets';
import { MarketFormModal } from '../components/MarketFormModal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import type { MarketSummary } from '../lib/types';

const STATUS_STYLES: Record<MarketSummary['status'], string> = {
  OPEN: 'bg-success/15 text-success',
  CLOSED: 'bg-warning/15 text-warning',
  RESOLVED: 'bg-white/10 text-text-secondary',
};

type ConfirmAction =
  | { type: 'resolve'; market: MarketSummary; outcome: 'YES' | 'NO' }
  | { type: 'delete'; market: MarketSummary };

export function MarketsPage() {
  const { data: markets, isLoading } = useMarkets();
  const resolveMutation = useResolveMarket();
  const statusMutation = useSetMarketStatus();
  const deleteMutation = useDeleteMarket();

  const [editing, setEditing] = useState<MarketSummary | 'new' | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);

  function runConfirmedAction() {
    if (!confirmAction) return;
    if (confirmAction.type === 'resolve') {
      resolveMutation.mutate({ id: confirmAction.market.id, outcome: confirmAction.outcome });
    } else {
      deleteMutation.mutate(confirmAction.market.id);
    }
    setConfirmAction(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Markets</h1>
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
                <th className="px-4 py-3 font-medium">Volume</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {markets.map((m) => (
                <tr key={m.id} className="border-b border-white/5 last:border-0 align-top">
                  <td className="px-4 py-3 max-w-xs truncate">{m.question}</td>
                  <td className="px-4 py-3 text-text-secondary whitespace-nowrap">{m.category.name}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[m.status]}`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                    {new Date(m.closeDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">{Math.round(m.yesProbability * 100)}%</td>
                  <td className="px-4 py-3 text-text-secondary">${m.volume24h.toFixed(0)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setEditing(m)}
                        className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/15 text-xs font-semibold transition-colors"
                      >
                        Edit
                      </button>

                      {m.status !== 'RESOLVED' && (
                        <button
                          type="button"
                          disabled={statusMutation.isPending}
                          onClick={() => statusMutation.mutate({ id: m.id, status: m.status === 'OPEN' ? 'CLOSED' : 'OPEN' })}
                          className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/15 text-xs font-semibold transition-colors disabled:opacity-50"
                        >
                          {m.status === 'OPEN' ? 'Pause' : 'Reopen'}
                        </button>
                      )}

                      {m.status !== 'RESOLVED' && (
                        <>
                          <button
                            type="button"
                            onClick={() => setConfirmAction({ type: 'resolve', market: m, outcome: 'YES' })}
                            className="px-3 py-1 rounded-full bg-yes/15 text-yes hover:bg-yes/25 text-xs font-semibold transition-colors"
                          >
                            Resolve YES
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmAction({ type: 'resolve', market: m, outcome: 'NO' })}
                            className="px-3 py-1 rounded-full bg-no/15 text-no hover:bg-no/25 text-xs font-semibold transition-colors"
                          >
                            Resolve NO
                          </button>
                        </>
                      )}

                      <button
                        type="button"
                        onClick={() => setConfirmAction({ type: 'delete', market: m })}
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
        <p className="text-text-secondary">No markets yet.</p>
      )}

      {editing && (
        <MarketFormModal
          mode={editing === 'new' ? 'create' : 'edit'}
          market={editing === 'new' ? undefined : editing}
          onClose={() => setEditing(null)}
        />
      )}

      {confirmAction && (
        <ConfirmDialog
          title={confirmAction.type === 'resolve' ? `Resolve as ${confirmAction.outcome}?` : 'Delete market?'}
          message={
            confirmAction.type === 'resolve'
              ? `"${confirmAction.market.question}" will be resolved ${confirmAction.outcome} and winning positions will be paid out. This can't be undone.`
              : `"${confirmAction.market.question}" will be permanently deleted. Only possible if it has no trades yet.`
          }
          confirmLabel={confirmAction.type === 'resolve' ? `Resolve ${confirmAction.outcome}` : 'Delete'}
          danger={confirmAction.type === 'delete'}
          onConfirm={runConfirmedAction}
          onCancel={() => setConfirmAction(null)}
        />
      )}
    </div>
  );
}
