import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const STATUS_COLORS: Record<string, string> = {
  OPEN: 'var(--color-success)',
  CLOSED: 'var(--color-warning)',
  RESOLVED: 'var(--color-text-secondary)',
};

export function MarketsByStatusChart({
  marketsByStatus,
}: {
  marketsByStatus: { OPEN: number; CLOSED: number; RESOLVED: number };
}) {
  const data = [
    { status: 'OPEN', count: marketsByStatus.OPEN },
    { status: 'CLOSED', count: marketsByStatus.CLOSED },
    { status: 'RESOLVED', count: marketsByStatus.RESOLVED },
  ];

  return (
    <div className="bg-bg-elevated rounded-2xl p-5">
      <h2 className="text-lg font-bold mb-4">Markets by status</h2>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <XAxis
              dataKey="status"
              stroke="var(--color-text-secondary)"
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              stroke="var(--color-text-secondary)"
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={32}
            />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.04)' }}
              contentStyle={{
                background: 'var(--color-bg-elevated)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={(v) => [v, 'Markets']}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={64}>
              {data.map((d) => (
                <Cell key={d.status} fill={STATUS_COLORS[d.status]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
