import { useNavigate } from 'react-router-dom';
import { useWalletBalance, useWalletTransactions } from '../hooks/useWallet';
import { useTranslation } from '../lib/i18n/useTranslation';

export function WalletCard() {
  const { data: wallet, isLoading } = useWalletBalance();
  const { data: transactions } = useWalletTransactions(5);
  const navigate = useNavigate();
  const { t, lang } = useTranslation();
  const dateLocale = lang === 'es' ? 'es-MX' : 'en-US';

  const TYPE_LABEL: Record<string, string> = {
    SEED: t('walletCard.typeSeed'),
    TRADE: t('walletCard.typeTrade'),
    PAYOUT: t('walletCard.typePayout'),
    DEPOSIT: t('walletCard.typeDeposit'),
  };

  return (
    <div className="space-y-6">
      <div className="bg-bg-elevated rounded-2xl p-6">
        <p className="text-text-secondary text-sm mb-1">{t('walletCard.virtualBalance')}</p>
        <p className="text-4xl font-extrabold">
          {isLoading || wallet?.balance == null ? '—' : `MX$${wallet.balance.toFixed(2)}`}
        </p>

        <div className="flex gap-2 mt-4">
          <button
            type="button"
            onClick={() => navigate('/deposit')}
            className="flex-1 py-2 rounded-full bg-accent-primary hover:bg-accent-secondary text-white text-sm font-semibold transition-colors"
          >
            {t('walletCard.deposit')}
          </button>
          <button
            type="button"
            disabled
            title={t('walletCard.comingSoon')}
            className="flex-1 py-2 rounded-full bg-white/5 text-text-secondary text-sm font-semibold cursor-not-allowed"
          >
            {t('walletCard.withdrawComingSoon')}
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-text-secondary mb-2">{t('walletCard.recentTransactions')}</h2>
        {!transactions || transactions.length === 0 ? (
          <p className="text-sm text-text-secondary">{t('walletCard.noTransactions')}</p>
        ) : (
          <ul className="divide-y divide-white/5 bg-bg-elevated rounded-2xl overflow-hidden">
            {transactions.map((tx) => (
              <li key={tx.id} className="flex items-center justify-between px-4 py-3 bg-bg-elevated">
                <div>
                  <p className="text-sm">{tx.note || TYPE_LABEL[tx.type]}</p>
                  <p className="text-xs text-text-secondary">{new Date(tx.createdAt).toLocaleString(dateLocale)}</p>
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
