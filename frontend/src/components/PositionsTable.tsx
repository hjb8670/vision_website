import { Link } from 'react-router-dom';
import { useTranslation } from '../lib/i18n/useTranslation';
import type { Position } from '../lib/types';

export function PositionsTable({ positions }: { positions: Position[] }) {
  const { t } = useTranslation();

  if (positions.length === 0) {
    return (
      <div className="text-center py-16 border border-dashed border-white/15 rounded-2xl">
        <p className="text-text-secondary mb-4">{t('positionsTable.empty')}</p>
        <Link
          to="/markets"
          className="inline-block px-4 py-2 rounded-md bg-accent-primary hover:bg-accent-secondary font-semibold text-white transition-colors"
        >
          {t('positionsTable.browseMarkets')}
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="sm:hidden space-y-3">
        {positions.map((p) => (
          <Link
            key={p.id}
            to={`/market/${p.market.slug}`}
            className="block bg-bg-elevated rounded-2xl p-4 space-y-3 hover:bg-white/5"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium line-clamp-2 min-w-0">{p.market.question}</p>
              <span
                className="shrink-0 text-xs font-bold px-2 py-0.5 rounded"
                style={{
                  background: p.outcome === 'YES' ? 'var(--color-yes)' : 'var(--color-no)',
                  color: p.outcome === 'YES' ? 'var(--color-bg-primary)' : '#fff',
                }}
              >
                {t(p.outcome === 'YES' ? 'common.yes' : 'common.no').toUpperCase()}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <p className="text-text-secondary mb-0.5">{t('positionsTable.qty')}</p>
                <p className="font-medium">{p.quantity.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-text-secondary mb-0.5">{t('positionsTable.avgEntry')}</p>
                <p className="font-medium">{(p.avgEntryPrice * 100).toFixed(1)}¢</p>
              </div>
              <div>
                <p className="text-text-secondary mb-0.5">{t('positionsTable.currentValue')}</p>
                <p className="font-medium">MX${p.currentValue.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10">
              <span className="text-text-secondary">{t('positionsTable.unrealizedPnl')}</span>
              <span
                className="font-semibold"
                style={{ color: p.unrealizedPnl >= 0 ? 'var(--color-success)' : 'var(--color-error)' }}
              >
                {p.unrealizedPnl >= 0 ? '+' : ''}
                {p.unrealizedPnl.toFixed(2)}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="hidden sm:block overflow-x-auto bg-bg-elevated rounded-2xl">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-text-secondary border-b border-white/10">
            <th className="px-4 py-3 font-medium">{t('positionsTable.market')}</th>
            <th className="px-4 py-3 font-medium">{t('positionsTable.outcome')}</th>
            <th className="px-4 py-3 font-medium text-right">{t('positionsTable.qty')}</th>
            <th className="px-4 py-3 font-medium text-right">{t('positionsTable.avgEntry')}</th>
            <th className="px-4 py-3 font-medium text-right">{t('positionsTable.currentValue')}</th>
            <th className="px-4 py-3 font-medium text-right">{t('positionsTable.unrealizedPnl')}</th>
          </tr>
        </thead>
        <tbody>
          {positions.map((p) => (
            <tr key={p.id} className="border-b border-white/10 last:border-0 hover:bg-white/5">
              <td className="px-4 py-3 max-w-[280px]">
                <Link to={`/market/${p.market.slug}`} className="hover:text-accent-primary line-clamp-1">
                  {p.market.question}
                </Link>
              </td>
              <td className="px-4 py-3">
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded"
                  style={{
                    background: p.outcome === 'YES' ? 'var(--color-yes)' : 'var(--color-no)',
                    color: p.outcome === 'YES' ? 'var(--color-bg-primary)' : '#fff',
                  }}
                >
                  {t(p.outcome === 'YES' ? 'common.yes' : 'common.no').toUpperCase()}
                </span>
              </td>
              <td className="px-4 py-3 text-right">{p.quantity.toFixed(2)}</td>
              <td className="px-4 py-3 text-right">{(p.avgEntryPrice * 100).toFixed(1)}¢</td>
              <td className="px-4 py-3 text-right">MX${p.currentValue.toFixed(2)}</td>
              <td
                className="px-4 py-3 text-right font-medium"
                style={{ color: p.unrealizedPnl >= 0 ? 'var(--color-success)' : 'var(--color-error)' }}
              >
                {p.unrealizedPnl >= 0 ? '+' : ''}
                {p.unrealizedPnl.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </>
  );
}
