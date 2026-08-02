import type { LeaderboardRow } from '../lib/types';
import { useAuthStore } from '../store/authStore';
import { useTranslation } from '../lib/i18n/useTranslation';

function avatarColor(username: string) {
  let hash = 0;
  for (let i = 0; i < username.length; i++) hash = (hash * 31 + username.charCodeAt(i)) >>> 0;
  const hue = hash % 360;
  return `linear-gradient(135deg, hsl(${hue}, 70%, 55%), hsl(${(hue + 60) % 360}, 70%, 45%))`;
}

const MEDALS: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

interface LeaderboardTableProps {
  rows: LeaderboardRow[];
  sortBy: 'profit' | 'volume';
}

export function LeaderboardTable({ rows, sortBy }: LeaderboardTableProps) {
  const currentUsername = useAuthStore((s) => s.user?.username);
  const { t } = useTranslation();

  return (
    <div className="bg-bg-elevated rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 text-xs text-text-secondary border-b border-white/5">
        <span />
        <div className="flex gap-10">
          <span className={sortBy === 'profit' ? 'text-text-primary font-semibold' : ''}>{t('leaderboardTable.profitLoss')}</span>
          <span className={sortBy === 'volume' ? 'text-text-primary font-semibold' : ''}>{t('leaderboardTable.volume')}</span>
        </div>
      </div>
      {rows.length === 0 ? (
        <p className="text-sm text-text-secondary text-center py-10">{t('leaderboardTable.noMatches')}</p>
      ) : (
        rows.map((row) => {
          const isYou = row.username === currentUsername;
          return (
            <div
              key={row.username}
              className={`flex items-center justify-between px-4 py-3.5 border-b border-white/5 last:border-0 ${
                isYou ? 'bg-white/5' : 'hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-5 text-sm text-text-secondary shrink-0">{MEDALS[row.rank] ?? row.rank}</span>
                <span
                  className="w-8 h-8 rounded-full shrink-0"
                  style={{ background: avatarColor(row.username) }}
                />
                <span className="text-sm font-medium truncate">
                  {row.username}
                  {isYou && <span className="text-text-secondary font-normal">{t('leaderboardTable.you')}</span>}
                </span>
              </div>
              <div className="flex gap-10 text-sm shrink-0">
                <span
                  className="w-24 text-right font-semibold"
                  style={{ color: row.profit >= 0 ? 'var(--color-success)' : 'var(--color-error)' }}
                >
                  {row.profit >= 0 ? '+' : ''}${row.profit.toFixed(2)}
                </span>
                <span className="w-24 text-right text-text-secondary">${row.volume.toFixed(2)}</span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
