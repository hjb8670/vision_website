import { useState, type ReactNode } from 'react';
import { useDepositModalStore } from '../store/depositModalStore';
import { useToastStore } from '../store/toastStore';
import { useWalletBalance } from '../hooks/useWallet';
import { useTranslation } from '../lib/i18n/useTranslation';

type Tab = 'cash' | 'crypto';

interface Method {
  key: string;
  labelKey: string;
  subKey: string;
  subVars?: Record<string, string>;
  icon: ReactNode;
}

const CASH_METHODS: Method[] = [
  {
    key: 'card',
    labelKey: 'depositModal.card',
    subKey: 'depositModal.limitInstant',
    subVars: { limit: '115k' },
    icon: (
      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
        </svg>
      </div>
    ),
  },
  {
    key: 'apple-pay',
    labelKey: 'depositModal.applePay',
    subKey: 'depositModal.limitInstant',
    subVars: { limit: '115k' },
    icon: (
      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#000">
          <path d="M12 6c1 0 2.2-.7 2.9-1.6.6-.8 1.1-1.9 1-3-1 .1-2.1.7-2.8 1.5-.6.7-1.1 1.8-1.1 2.9zm2.9 2.5c-1.6-.1-3 .9-3.7.9-.8 0-2-.9-3.3-.9-1.7 0-3.2 1-4.1 2.5-1.7 3-.4 7.5 1.3 10 .8 1.2 1.8 2.5 3.1 2.5 1.2 0 1.7-.8 3.2-.8s1.9.8 3.2.8c1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.3-2.8-.1 0-2.6-1-2.6-3.9 0-2.5 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-2.2z" />
        </svg>
      </div>
    ),
  },
  {
    key: 'cash-app',
    labelKey: 'depositModal.cashApp',
    subKey: 'depositModal.cashAppLimit',
    icon: (
      <div className="w-10 h-10 rounded-xl bg-[#00D64B] flex items-center justify-center text-black font-bold text-lg">
        $
      </div>
    ),
  },
  {
    key: 'google-pay',
    labelKey: 'depositModal.googlePay',
    subKey: 'depositModal.limitInstant',
    subVars: { limit: '115k' },
    icon: (
      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black font-bold">G</div>
    ),
  },
];

const CRYPTO_METHODS: Method[] = [
  {
    key: 'transfer-crypto',
    labelKey: 'depositModal.transferCrypto',
    subKey: 'depositModal.noLimitInstant',
    icon: (
      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      </div>
    ),
  },
  {
    key: 'lightning',
    labelKey: 'depositModal.bitcoinLightning',
    subKey: 'depositModal.bitcoinLightningLimit',
    icon: (
      <div className="w-10 h-10 rounded-full bg-[#F2A900] flex items-center justify-center text-black font-bold">
        ₿
      </div>
    ),
  },
  {
    key: 'exchange',
    labelKey: 'depositModal.connectExchange',
    subKey: 'depositModal.noLimitTwoMin',
    icon: (
      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 21V9l8-6 8 6v12" />
          <path d="M9 21v-6h6v6" />
        </svg>
      </div>
    ),
  },
];

export function DepositModal() {
  const { isOpen, close } = useDepositModalStore();
  const push = useToastStore((s) => s.push);
  const { data: wallet } = useWalletBalance();
  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>('cash');

  if (!isOpen) return null;

  const methods = tab === 'cash' ? CASH_METHODS : CRYPTO_METHODS;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={close}
    >
      <div
        className="w-full max-w-md bg-bg-elevated rounded-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-1">
          <div className="flex-1 text-center">
            <h2 className="text-xl font-bold">{t('depositModal.heading')}</h2>
            <p className="text-sm text-text-secondary mt-0.5">
              {t('depositModal.balance', { amount: wallet?.balance?.toFixed(2) ?? '0.00' })}
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label={t('depositModal.close')}
            className="p-1 -mt-1 -mr-1 rounded-full text-text-secondary hover:text-text-primary hover:bg-white/10"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-1 bg-black/30 rounded-full p-1 mt-5 mb-5">
          <button
            type="button"
            onClick={() => setTab('crypto')}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-full text-sm font-semibold transition-colors ${
              tab === 'crypto' ? 'bg-white/10 text-text-primary' : 'text-text-secondary'
            }`}
          >
            ₿ {t('depositModal.useCrypto')}
          </button>
          <button
            type="button"
            onClick={() => setTab('cash')}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-full text-sm font-semibold transition-colors ${
              tab === 'cash' ? 'bg-white/10 text-text-primary' : 'text-text-secondary'
            }`}
          >
            $ {t('depositModal.useCash')}
          </button>
        </div>

        <div className="space-y-2">
          {methods.map((m) => (
            <button
              key={m.key}
              type="button"
              onClick={() => push(t('depositModal.comingSoon'), 'success')}
              className="w-full flex items-center gap-3 rounded-xl bg-white/5 hover:bg-white/10 px-4 py-3 text-left transition-colors"
            >
              {m.icon}
              <div>
                <div className="text-sm font-semibold">{t(m.labelKey)}</div>
                <div className="text-xs text-text-secondary">{t(m.subKey, m.subVars)}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
