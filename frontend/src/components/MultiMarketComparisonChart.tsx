import { Link } from 'react-router-dom';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useMarketHistory } from '../hooks/useMarkets';
import { useTranslation } from '../lib/i18n/useTranslation';
import type { MarketSummary, PricePoint } from '../lib/types';

const COLORS = ['var(--color-accent-primary)', 'var(--color-yes)', 'var(--color-success)'];

function mergeSeries(seriesList: { key: string; points: PricePoint[] }[]) {
  const allTimes = Array.from(
    new Set(seriesList.flatMap((s) => s.points.map((p) => p.timestamp))),
  ).sort();

  return allTimes.map((time) => {
    const row: Record<string, number | null | string> = { time };
    for (const s of seriesList) {
      let val: number | null = null;
      for (const p of s.points) {
        if (p.timestamp <= time) val = p.yesProbability;
        else break;
      }
      row[s.key] = val === null ? null : Math.round(val * 1000) / 10;
    }
    return row;
  });
}

export function MultiMarketComparisonChart({ markets }: { markets: MarketSummary[] }) {
  const { t, lang } = useTranslation();
  const dateLocale = lang === 'es' ? 'es-MX' : 'en-US';
  const h0 = useMarketHistory(markets[0]?.id, '1M');
  const h1 = useMarketHistory(markets[1]?.id, '1M');
  const h2 = useMarketHistory(markets[2]?.id, '1M');
  const histories = [h0, h1, h2];

  const isLoading = markets.some((_, i) => histories[i]?.isLoading);
  const chartData = mergeSeries(
    markets.map((_, i) => ({ key: `m${i}`, points: histories[i]?.data ?? [] })),
  );

  return (
    <div className="bg-bg-elevated rounded-2xl p-5">
      <h2 className="text-lg font-bold mb-1">{t('home.comparisonHeading')}</h2>
      <div className="h-64 mt-3">
        {isLoading || chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-text-secondary text-sm">
            {t('marketsPage.loading')}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis
                dataKey="time"
                tickFormatter={(t) => new Date(t).toLocaleDateString(dateLocale, { month: 'short', day: 'numeric' })}
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
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelFormatter={(t) => new Date(t as string).toLocaleDateString(dateLocale)}
                formatter={(v, key) => {
                  const idx = Number(String(key).replace('m', ''));
                  return [`${v}%`, markets[idx]?.question.slice(0, 30) ?? key];
                }}
              />
              {markets.map((_, i) => (
                <Line
                  key={i}
                  type="monotone"
                  dataKey={`m${i}`}
                  stroke={COLORS[i % COLORS.length]}
                  strokeWidth={2}
                  dot={false}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <ul className="mt-4 space-y-1.5">
        {markets.map((m, i) => (
          <li key={m.id} className="flex items-center gap-2 text-sm min-w-0">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
            <Link to={`/market/${m.slug}`} className="truncate hover:text-accent-primary">
              {m.question}
            </Link>
            <span className="text-text-secondary shrink-0 ml-auto">{Math.round(m.yesProbability * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
