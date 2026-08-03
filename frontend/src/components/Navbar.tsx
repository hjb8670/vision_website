import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useWalletBalance } from '../hooks/useWallet';
import { useCategories } from '../hooks/useCategories';
import { useDepositModalStore } from '../store/depositModalStore';
import { useToastStore } from '../store/toastStore';
import { useTranslation } from '../lib/i18n/useTranslation';
import { useCategoryLabel } from '../lib/i18n/categories';
import { LanguageSwitch } from './LanguageSwitch';
import visionLogo from '../assets/vision-logo.png';

export function Navbar() {
  const { user, logout } = useAuthStore();
  const { data: wallet } = useWalletBalance();
  const { data: categories } = useCategories();
  const openDeposit = useDepositModalStore((s) => s.open);
  const push = useToastStore((s) => s.push);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  function stub(feature: string) {
    push(t('navbar.comingSoon', { feature }), 'success');
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-20 bg-bg-secondary/95 backdrop-blur">
      <div className="max-w-7xl mx-auto flex items-center gap-4 px-4 h-16">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src={visionLogo} alt="Vision" className="w-9 h-9 rounded-lg object-cover" />
          <span className="text-lg font-bold tracking-tight hidden sm:block">Vision</span>
        </Link>

        <div className="flex-1 flex">
          <div className="relative w-full max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input
              type="search"
              placeholder={t('navbar.searchPlaceholder')}
              className="w-full bg-white/5 rounded-full pl-9 pr-4 py-2 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-accent-primary"
            />
          </div>
        </div>

        <LanguageSwitch />

        <button
          type="button"
          aria-label={t('navbar.notifications')}
          className="p-2 rounded-full text-text-secondary hover:text-text-primary hover:bg-white/10"
        >
          <BellIcon />
        </button>

        {user ? (
          <div className="flex items-center gap-3">
            <Link to="/wallet" className="px-3.5 py-1.5 rounded-full bg-white/5 text-sm font-medium hidden sm:block">
              MX${wallet?.balance?.toFixed(2) ?? '—'}
            </Link>
            <button
              type="button"
              onClick={openDeposit}
              className="px-4 py-1.5 rounded-full bg-accent-primary hover:bg-accent-secondary text-sm font-semibold text-white transition-colors"
            >
              {t('navbar.deposit')}
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="w-9 h-9 rounded-full bg-accent-secondary flex items-center justify-center font-semibold text-sm"
              >
                {user.username.slice(0, 2).toUpperCase()}
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-bg-elevated rounded-2xl shadow-lg py-2 text-sm">
                  <div className="flex items-center justify-between px-4 py-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-8 h-8 rounded-full bg-accent-secondary flex items-center justify-center font-semibold text-xs shrink-0">
                        {user.username.slice(0, 2).toUpperCase()}
                      </span>
                      <span className="font-semibold truncate">{user.username}</span>
                    </div>
                    <Link
                      to={`/profile/${user.username}`}
                      onClick={() => setMenuOpen(false)}
                      aria-label={t('navbar.settings')}
                      className="p-1.5 rounded-full text-text-secondary hover:text-text-primary hover:bg-white/10 shrink-0"
                    >
                      <GearIcon />
                    </Link>
                  </div>

                  <div className="h-px bg-white/10 my-1.5" />

                  <Link to="/portfolio" className="flex items-center gap-3 px-4 py-2 hover:bg-white/5" onClick={() => setMenuOpen(false)}>
                    <RowIcon>📊</RowIcon> {t('navbar.portfolio')}
                  </Link>
                  <Link to="/wallet" className="flex items-center gap-3 px-4 py-2 hover:bg-white/5" onClick={() => setMenuOpen(false)}>
                    <RowIcon>👛</RowIcon> {t('navbar.wallet')}
                  </Link>
                  <Link to="/leaderboard" className="flex items-center gap-3 px-4 py-2 hover:bg-white/5" onClick={() => setMenuOpen(false)}>
                    <RowIcon>🏆</RowIcon> {t('navbar.leaderboard')}
                  </Link>
                  <button type="button" onClick={() => stub(t('navbar.rewards'))} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-white/5 text-left">
                    <RowIcon>💰</RowIcon> {t('navbar.rewards')}
                  </button>
                  <button type="button" onClick={() => stub(t('navbar.apis'))} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-white/5 text-left">
                    <RowIcon>🔌</RowIcon> {t('navbar.apis')}
                  </button>
                  <Link to="/referral" className="flex items-center gap-3 px-4 py-2 hover:bg-white/5" onClick={() => setMenuOpen(false)}>
                    <RowIcon>🎁</RowIcon> {t('navbar.referEarn')}
                  </Link>
                  <button type="button" onClick={() => stub(t('navbar.builders'))} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-white/5 text-left">
                    <RowIcon>🛠️</RowIcon> {t('navbar.builders')}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      push(t('navbar.lightModeComingSoon'));
                      setDarkMode((v) => !v);
                    }}
                    className="w-full flex items-center justify-between px-4 py-2 hover:bg-white/5"
                  >
                    <span className="flex items-center gap-3">
                      <RowIcon>🌙</RowIcon> {t('navbar.darkMode')}
                    </span>
                    <span
                      className={`w-9 h-5 rounded-full flex items-center px-0.5 transition-colors ${
                        darkMode ? 'bg-accent-primary justify-end' : 'bg-white/15 justify-start'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full bg-white" />
                    </span>
                  </button>

                  <div className="h-px bg-white/10 my-1.5" />

                  <button type="button" onClick={() => stub(t('navbar.accuracy'))} className="w-full text-left px-4 py-2 hover:bg-white/5 text-text-secondary">
                    {t('navbar.accuracy')}
                  </button>
                  <button type="button" onClick={() => stub(t('navbar.support'))} className="w-full text-left px-4 py-2 hover:bg-white/5 text-text-secondary">
                    {t('navbar.support')}
                  </button>
                  <button type="button" onClick={() => stub(t('navbar.status'))} className="w-full text-left px-4 py-2 hover:bg-white/5 text-text-secondary">
                    {t('navbar.status')}
                  </button>

                  <div className="h-px bg-white/10 my-1.5" />

                  <button
                    type="button"
                    className="w-full text-left px-4 py-2 hover:bg-white/5 text-error"
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                      navigate('/');
                    }}
                  >
                    {t('navbar.logOut')}
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/login"
              className="px-4 py-1.5 rounded-full border border-white/15 text-sm font-medium hover:bg-white/5 transition-colors"
            >
              {t('navbar.logIn')}
            </Link>
            <Link
              to="/register"
              className="px-4 py-1.5 rounded-full bg-accent-primary hover:bg-accent-secondary text-sm font-semibold text-white transition-colors"
            >
              {t('navbar.signUp')}
            </Link>
          </div>
        )}
      </div>

      <nav className="max-w-7xl mx-auto flex items-center gap-1 px-4 pb-2.5 overflow-x-auto text-sm">
        <Link
          to="/markets?sf=trending"
          className="shrink-0 px-3 py-1 rounded-full font-medium text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
        >
          {t('navbar.trending')}
        </Link>
        <Link
          to="/leaderboard"
          className="shrink-0 px-3 py-1 rounded-full font-medium text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
        >
          {t('navbar.leaderboard')}
        </Link>
        <span className="w-px h-4 bg-white/10 mx-1 shrink-0" />
        {categories?.map((c) => (
          <CategoryPill key={c.id} category={c} />
        ))}
      </nav>
    </header>
  );
}

function CategoryPill({ category }: { category: { id: string; slug: string; name: string } }) {
  const label = useCategoryLabel(category);
  return (
    <Link
      to={`/markets?category=${category.slug}`}
      className="shrink-0 px-3 py-1 rounded-full text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
    >
      {label}
    </Link>
  );
}

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function RowIcon({ children }: { children: string }) {
  return <span className="w-5 text-center shrink-0">{children}</span>;
}

function SearchIcon({ className = '' }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
