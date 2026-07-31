import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';

export function ReferralsPage() {
  const user = useAuthStore((s) => s.user);
  const push = useToastStore((s) => s.push);
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const referralLink = `${window.location.origin}/?ref=${user.username}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      push('Referral link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      push('Could not copy link', 'error');
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-1">
        <h1 className="text-3xl font-extrabold">Referrals</h1>
        <span className="text-lg">⚡</span>
        <span className="px-2 py-0.5 rounded-full bg-accent-secondary/30 text-accent-primary text-[11px] font-bold uppercase">
          Boosted
        </span>
      </div>
      <p className="text-text-secondary mb-6">
        Earn <span className="font-semibold text-text-primary">10% of fees</span> from direct referrals, and{' '}
        <span className="font-semibold text-text-primary">5% of fees</span> for all indirect referrals.{' '}
        <span className="text-accent-primary hover:underline cursor-pointer" onClick={() => push('Details coming soon.')}>
          Learn more
        </span>
      </p>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-full bg-accent-secondary flex items-center justify-center font-semibold text-sm shrink-0">
            {user.username.slice(0, 2).toUpperCase()}
          </span>
          <span className="font-semibold">{user.username}</span>
        </div>

        <button
          type="button"
          onClick={copyLink}
          className="flex items-center gap-3 bg-white/5 hover:bg-white/10 rounded-full px-4 py-2 text-sm transition-colors"
        >
          <span className="text-text-secondary truncate max-w-[220px]">{referralLink}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
            {copied ? <polyline points="20 6 9 17 4 12" /> : (
              <>
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </>
            )}
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Sign ups" value="0" />
        <StatCard label="Active Traders" value="0" />
        <StatCard label="Earnings" value="$0.00" accent />
      </div>

      <p className="text-xs text-text-secondary mt-6">
        Referral tracking isn't live in this demo yet — this page is integration-ready for the next phase.
      </p>
    </div>
  );
}

function StatCard({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`bg-bg-elevated rounded-2xl p-5 ${accent ? 'border-b-2 border-accent-primary' : ''}`}>
      <p className="text-sm text-text-secondary mb-2">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
