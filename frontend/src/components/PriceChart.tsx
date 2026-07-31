import { useState } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useMarketHistory } from '../hooks/useMarkets';

const RANGES: Array<'1D' | '1W' | '1M' | 'ALL'> = ['1D', '1W', '1M', 'ALL'];

export function PriceChart({ marketId }: { marketId: string }) {
  const [range, setRange] = useState<'1D' | '1W' | '1M' | 'ALL'>('1M');
  const { data, isLoading } = useMarketHistory(marketId, range);

  const chartData = (data ?? []).map((p) => ({
    time: new Date(p.timestamp).getTime(),
    yes: Math.round(p.yesProbability * 1000) / 10,
  }));

  return (
    <div className="bg-bg-elevated rounded-2xl p-4">
      <div className="flex items-center justify-end gap-1 mb-2">
        {RANGES.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRange(r)}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              range === r ? 'bg-accent-primary text-white' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="h-64">
        {isLoading || chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-text-secondary text-sm">
            {isLoading ? 'Loading chart…' : 'No data yet'}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="yesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-accent-primary)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="var(--color-accent-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                type="number"
                domain={['dataMin', 'dataMax']}
                tickFormatter={(t) => new Date(t).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                stroke="var(--color-text-secondary)"
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                minTickGap={40}
              />
              <YAxis
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
                stroke="var(--color-text-secondary)"
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--color-bg-elevated)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelFormatter={(t) => new Date(t as number).toLocaleString()}
                formatter={(v) => [`${v}%`, 'YES']}
              />
              <Area
                type="monotone"
                dataKey="yes"
                stroke="var(--color-accent-primary)"
                strokeWidth={2}
                fill="url(#yesGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
