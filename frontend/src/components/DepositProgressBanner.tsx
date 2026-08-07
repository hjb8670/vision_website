import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useWalletBalance } from '../hooks/useWallet';
import { useTranslation } from '../lib/i18n/useTranslation';

const STARTING_BALANCE = 1000;

export function DepositProgressBanner() {
  const user = useAuthStore((s) => s.user);
  const { data: wallet } = useWalletBalance();
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (!user || wallet?.balance !== STARTING_BALANCE) return null;

  return (
    <div className="rounded-2xl bg-bg-elevated p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="w-10 h-2 rounded-full bg-overlay-2 overflow-hidden shrink-0">
          <div className="h-full w-1/2 bg-accent-primary" />
        </div>
        <div>
          <p className="text-xs text-text-secondary uppercase font-bold tracking-wide">{t('home.depositHeading')}</p>
          <p className="text-sm text-text-secondary">{t('home.depositDescription')}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => navigate('/deposit')}
        className="px-5 py-2.5 rounded-full bg-accent-primary hover:bg-accent-secondary text-sm font-semibold text-white transition-colors shrink-0"
      >
        {t('navbar.deposit')}
      </button>
    </div>
  );
}
