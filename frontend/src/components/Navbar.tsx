import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useWalletBalance } from '../hooks/useWallet';

export function Navbar() {
  const { user, logout } = useAuthStore();
  const { data: wallet } = useWalletBalance();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { to: '/markets', label: 'Markets' },
    { to: '/leaderboard', label: 'Leaderboard' },
  ];

  return (
    <header className="sticky top-0 z-20 bg-bg-secondary/95 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto flex items-center gap-4 px-4 h-16">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="w-9 h-9 rounded-lg bg-accent-primary flex items-center justify-center text-white font-bold text-lg">
            V
          </span>
          <span className="text-lg font-bold tracking-tight hidden sm:block">Vision</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="px-3 py-2 rounded-md text-sm text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex-1 hidden sm:flex">
          <input
            type="search"
            placeholder="Search markets..."
            className="w-full max-w-md bg-bg-primary/40 border border-border rounded-md px-3 py-1.5 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent-primary"
          />
        </div>

        <button
          type="button"
          aria-label="Notifications"
          className="p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-elevated"
        >
          <BellIcon />
        </button>

        {user ? (
          <div className="flex items-center gap-3">
            <Link
              to="/wallet"
              className="px-3 py-1.5 rounded-md bg-bg-elevated border border-border text-sm font-medium"
            >
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
                <div className="absolute right-0 mt-2 w-44 bg-bg-elevated border border-border rounded-md shadow-lg py-1 text-sm">
                  <Link
                    to="/portfolio"
                    className="block px-3 py-2 hover:bg-bg-primary/30"
                    onClick={() => setMenuOpen(false)}
                  >
                    Portfolio
                  </Link>
                  <Link
                    to={`/profile/${user.username}`}
                    className="block px-3 py-2 hover:bg-bg-primary/30"
                    onClick={() => setMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    type="button"
                    className="w-full text-left px-3 py-2 hover:bg-bg-primary/30 text-error"
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
          <div className="flex items-center gap-2">
            <Link to="/login" className="px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary">
              Log in
            </Link>
            <Link
              to="/register"
              className="px-3 py-1.5 rounded-md bg-accent-primary hover:bg-accent-secondary text-sm font-semibold text-white transition-colors"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
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
