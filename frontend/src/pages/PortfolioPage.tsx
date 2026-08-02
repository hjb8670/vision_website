import { usePositions } from '../hooks/usePositions';
import { PositionsTable } from '../components/PositionsTable';
import { useTranslation } from '../lib/i18n/useTranslation';

export function PortfolioPage() {
  const { data: positions, isLoading } = usePositions();
  const { t } = useTranslation();

  const totalValue = (positions ?? []).reduce((sum, p) => sum + p.currentValue, 0);
  const totalPnl = (positions ?? []).reduce((sum, p) => sum + p.unrealizedPnl, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('portfolioPage.heading')}</h1>
        {positions && positions.length > 0 && (
          <div className="text-right">
            <p className="text-sm text-text-secondary">{t('portfolioPage.positionsValue')}</p>
            <p className="text-xl font-bold">
              ${totalValue.toFixed(2)}{' '}
              <span style={{ color: totalPnl >= 0 ? 'var(--color-success)' : 'var(--color-error)' }}>
                ({totalPnl >= 0 ? '+' : ''}
                {totalPnl.toFixed(2)})
              </span>
            </p>
          </div>
        )}
      </div>

      {isLoading ? (
        <p className="text-text-secondary">{t('portfolioPage.loading')}</p>
      ) : (
        <PositionsTable positions={positions ?? []} />
      )}
    </div>
  );
}
