import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { WalletCard } from '../components/WalletCard';
import { useTranslation } from '../lib/i18n/useTranslation';

export function WalletPage() {
  const user = useAuthStore((s) => s.user);
  const { t } = useTranslation();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t('walletPage.heading')}</h1>
      <WalletCard />
    </div>
  );
}
