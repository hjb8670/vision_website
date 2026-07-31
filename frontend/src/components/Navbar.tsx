import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useWalletBalance } from '../hooks/useWallet';
import { useCategories } from '../hooks/useCategories';

export function Navbar() {
  const { user, logout } = useAuthStore();
  const { data: wallet } = useWalletBalance();
  const { data: categories } = useCategories();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 bg-bg-secondary/95 backdrop-blur">
      <div className="max-w-7xl mx-auto flex items-center gap-4 px-4 h-16">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="w-9 h-9 rounded-lg bg-accent-primary flex items-center justify-center text-white font-bold text-lg">
            V
          </span>
          <span className="text-lg font-bold tracking-tight hidden sm:block">Vision</span>
        </Link>

        <div className="flex-1 flex">
          <div className="relative w-full max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input
              type="search"
              placeholder="Search markets..."
              className="w-full bg-white/5 rounded-full pl-9 pr-4 py-2 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-accent-primary"
            />
          </div>
        </div>

        <button
          type="button"
          aria-label="Notifications"
          className="p-2 rounded-full text-text-secondary hover:text-text-primary hover:bg-white/10"
        >
          <BellIcon />
        </button>

        {user ? (
          <div className="flex items-center gap-3">
            <Link to="/wallet" className="px-3.5 py-1.5 rounded-full bg-white/5 text-sm font-medium">
              ${wallet?.balance?.toFixed(2) ?? '—'}
            </Link>
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="w-9 h-9 rounded-full bg-accent-secondary flex items-center justify-center font-semibold text-sm"
              >
                {user.username.slice(0, 2).toUpperCase()}
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-bg-elevated rounded-xl shadow-lg py-1 text-sm">
                  <Link to="/portfolio" className="block px-3 py-2 hover:bg-white/5" onClick={() => setMenuOpen(false)}>
                    Portfolio
                  </Link>
                  <Link
                    to={`/profile/${user.username}`}
                    className="block px-3 py-2 hover:bg-white/5"
                    onClick={() => setMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    type="button"
                    className="w-full text-left px-3 py-2 hover:bg-white/5 text-error"
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                      navigate('/');
                    }}
                  >
                    Log out
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
              Log in
            </Link>
            <Link
              to="/register"
              className="px-4 py-1.5 rounded-full bg-accent-primary hover:bg-accent-secondary text-sm font-semibold text-white transition-colors"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>

      <nav className="max-w-7xl mx-auto flex items-center gap-1 px-4 pb-2.5 overflow-x-auto text-sm">
        <Link
          to="/markets?sf=trending"
          className="shrink-0 px-3 py-1 rounded-full font-medium text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
        >
          Trending
        </Link>
        <Link
          to="/leaderboard"
          className="shrink-0 px-3 py-1 rounded-full font-medium text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
        >
          Leaderboard
        </Link>
        <span className="w-px h-4 bg-white/10 mx-1 shrink-0" />
        {categories?.map((c) => (
          <Link
            key={c.id}
            to={`/markets?category=${c.slug}`}
            className="shrink-0 px-3 py-1 rounded-full text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
          >
            {c.name}
          </Link>
        ))}
      </nav>
    </header>
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

function SearchIcon({ className = '' }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
