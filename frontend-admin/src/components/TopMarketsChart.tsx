import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

function truncate(text: string, max: number) {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

export function TopMarketsChart({
  topMarkets,
}: {
  topMarkets: { question: string; slug: string; orderCount: number }[];
}) {
  const data = topMarkets.map((m) => ({ ...m, label: truncate(m.question, 40) }));

  return (
    <div className="bg-bg-elevated rounded-2xl p-5">
      <h2 className="text-lg font-bold mb-4">Most active markets</h2>
      {data.length === 0 ? (
        <p className="text-text-secondary text-sm">No trading activity yet.</p>
      ) : (
        <div style={{ height: Math.max(56 * data.length, 120) }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" horizontal={false} />
              <XAxis
                type="number"
                allowDecimals={false}
                stroke="var(--color-text-secondary)"
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="label"
                stroke="var(--color-text-secondary)"
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={220}
              />
              <Tooltip
                cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                contentStyle={{
                  background: 'var(--color-bg-elevated)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  fontSize: 12,
                }}
                formatter={(v) => [v, 'Orders']}
                labelFormatter={(_, payload) => payload?.[0]?.payload?.question ?? ''}
              />
              <Bar dataKey="orderCount" fill="var(--color-accent-primary)" radius={[0, 4, 4, 0]} maxBarSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
