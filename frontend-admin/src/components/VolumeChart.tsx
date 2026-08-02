import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export function VolumeChart({ data }: { data: { date: string; volume: number }[] }) {
  const hasActivity = data.some((d) => d.volume > 0);

  return (
    <div className="bg-bg-elevated rounded-2xl p-5">
      <h2 className="text-lg font-bold mb-4">Trading volume — last 14 days</h2>
      <div className="h-56">
        {!hasActivity ? (
          <div className="h-full flex items-center justify-center text-text-secondary text-sm">
            No trading activity yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="volumeFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-accent-primary)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--color-accent-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={(d) => new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                stroke="var(--color-text-secondary)"
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                minTickGap={30}
              />
              <YAxis
                tickFormatter={(v) => `$${v}`}
                stroke="var(--color-text-secondary)"
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={48}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--color-bg-elevated)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelFormatter={(d) => new Date(d as string).toLocaleDateString()}
                formatter={(v) => [`$${v}`, 'Volume']}
              />
              <Area
                type="monotone"
                dataKey="volume"
                stroke="var(--color-accent-primary)"
                strokeWidth={2}
                fill="url(#volumeFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
