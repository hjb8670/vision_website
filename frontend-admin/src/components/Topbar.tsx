import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LogoutIcon } from './icons';

export function Topbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header className="h-16 shrink-0 border-b border-white/10 flex items-center justify-end gap-4 px-6">
      <span className="text-sm text-text-secondary">
        Signed in as <span className="text-text-primary font-medium">{user?.username}</span>
      </span>
      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors"
      >
        <LogoutIcon /> Log out
      </button>
    </header>
  );
}
