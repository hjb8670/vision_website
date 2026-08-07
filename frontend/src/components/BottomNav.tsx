import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useTranslation } from '../lib/i18n/useTranslation';

export function BottomNav() {
  const user = useAuthStore((s) => s.user);
  const { t } = useTranslation();
  const { pathname } = useLocation();

  // `active` (not `to`) drives highlighting so logged-out tabs that all fall back to
  // /login don't all light up together — only a tab whose real page matches the URL does.
  const items = [
    { to: '/', label: t('bottomNav.home'), icon: HomeIcon, active: pathname === '/' },
    { to: '/markets', label: t('bottomNav.markets'), icon: MarketsIcon, active: pathname.startsWith('/markets') || pathname.startsWith('/market/') },
    {
      to: user ? '/portfolio' : '/login',
      label: t('navbar.portfolio'),
      icon: PortfolioIcon,
      active: !!user && pathname === '/portfolio',
    },
    {
      to: user ? '/wallet' : '/login',
      label: t('navbar.wallet'),
      icon: WalletIcon,
      active: !!user && pathname === '/wallet',
    },
    {
      to: user ? `/profile/${user.username}` : '/login',
      label: user ? t('bottomNav.profile') : t('navbar.logIn'),
      icon: ProfileIcon,
      active: user ? pathname === `/profile/${user.username}` : pathname === '/login' || pathname === '/register',
    },
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-bg-secondary/95 backdrop-blur border-t border-white/10"
      style={{ paddingBottom: 'var(--safe-bottom)' }}
    >
      <div className="grid grid-cols-5 h-16">
        {items.map((item) => (
          <Link
            key={item.label + item.to}
            to={item.to}
            className={`flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors ${
              item.active ? 'text-accent-primary' : 'text-text-secondary'
            }`}
          >
            <item.icon />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

function HomeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9.5 12 3l9 6.5" />
      <path d="M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10" />
    </svg>
  );
}

function MarketsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 3v18h18" />
      <path d="M7 15l4-4 3 3 5-6" />
    </svg>
  );
}

function PortfolioIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v2" />
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M17 13.5h.01" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" />
    </svg>
  );
}
