import { useWalletBalance, useWalletTransactions } from '../hooks/useWallet';

const TYPE_LABEL: Record<string, string> = {
  SEED: 'Starting balance',
  TRADE: 'Trade',
  PAYOUT: 'Market payout',
};

export function WalletCard() {
  const { data: wallet, isLoading } = useWalletBalance();
  const { data: transactions } = useWalletTransactions(5);

  return (
    <div className="space-y-6">
      <div className="bg-bg-elevated border border-white/10 rounded-xl p-6">
        <p className="text-text-secondary text-sm mb-1">Virtual balance</p>
        <p className="text-4xl font-extrabold">{isLoading ? '—' : `$${wallet?.balance.toFixed(2)}`}</p>

        <div className="flex gap-2 mt-4">
          <button
            type="button"
            disabled
            title="Coming soon"
            className="flex-1 py-2 rounded-md bg-white/5 border border-white/10 text-text-secondary text-sm font-medium cursor-not-allowed"
          >
            Deposit — Coming Soon
          </button>
          <button
            type="button"
            disabled
            title="Coming soon"
            className="flex-1 py-2 rounded-md bg-white/5 border border-white/10 text-text-secondary text-sm font-medium cursor-not-allowed"
          >
            Withdraw — Coming Soon
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-text-secondary mb-2">Recent transactions</h2>
        {!transactions || transactions.length === 0 ? (
          <p className="text-sm text-text-secondary">No transactions yet.</p>
        ) : (
          <ul className="divide-y divide-border border border-white/10 rounded-xl overflow-hidden">
            {transactions.map((tx) => (
              <li key={tx.id} className="flex items-center justify-between px-4 py-3 bg-bg-elevated">
                <div>
                  <p className="text-sm">{tx.note || TYPE_LABEL[tx.type]}</p>
                  <p className="text-xs text-text-secondary">{new Date(tx.createdAt).toLocaleString()}</p>
                </div>
                <span
                  className="text-sm font-semibold"
                  style={{ color: tx.amount >= 0 ? 'var(--color-success)' : 'var(--color-error)' }}
                >
                  {tx.amount >= 0 ? '+' : ''}
                  {tx.amount.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
