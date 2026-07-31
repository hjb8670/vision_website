import type { LeaderboardRow } from '../lib/types';

const MEDAL_STYLES: Record<number, string> = {
  1: 'bg-[#F2B134]/20 text-[#F2B134]',
  2: 'bg-[#C9C9C9]/20 text-[#C9C9C9]',
  3: 'bg-[#B91F1F]/20 text-[#E8362F]',
};

export function LeaderboardTable({ rows }: { rows: LeaderboardRow[] }) {
  return (
    <div className="overflow-x-auto border border-white/10 rounded-xl">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-text-secondary border-b border-white/10">
            <th className="px-4 py-3 font-medium">Rank</th>
            <th className="px-4 py-3 font-medium">Trader</th>
            <th className="px-4 py-3 font-medium text-right">Virtual profit</th>
            <th className="px-4 py-3 font-medium text-right">Win rate</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.username} className="border-b border-white/10 last:border-0 hover:bg-bg-elevated/50">
              <td className="px-4 py-3">
                <span
                  className={`inline-flex w-7 h-7 items-center justify-center rounded-full font-bold text-xs ${
                    MEDAL_STYLES[row.rank] ?? 'bg-bg-elevated text-text-secondary'
                  }`}
                >
                  {row.rank}
                </span>
              </td>
              <td className="px-4 py-3 font-medium">{row.username}</td>
              <td
                className="px-4 py-3 text-right font-semibold"
                style={{ color: row.profit >= 0 ? 'var(--color-success)' : 'var(--color-error)' }}
              >
                {row.profit >= 0 ? '+' : ''}${row.profit.toFixed(2)}
              </td>
              <td className="px-4 py-3 text-right text-text-secondary">{row.winRate.toFixed(0)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
