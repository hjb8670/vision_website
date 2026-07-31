import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { WalletCard } from '../components/WalletCard';

export function WalletPage() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Wallet</h1>
      <WalletCard />
    </div>
  );
}
