import { useEffect, useState } from 'react';
import { priceForOutcome, type Outcome } from '../lib/amm';
import { TradePanel } from './TradePanel';
import { useTranslation } from '../lib/i18n/useTranslation';
import type { MarketDetail } from '../lib/types';

export function MobileTradeBar({ market }: { market: MarketDetail }) {
  const [sheetOutcome, setSheetOutcome] = useState<Outcome | null>(null);
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();
  const isClosed = market.status !== 'OPEN';

  useEffect(() => {
    if (!sheetOutcome) {
      setVisible(false);
      return;
    }
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, [sheetOutcome]);

  const yesPct = Math.round(priceForOutcome(market.qYes, market.qNo, market.liquidityB, 'YES') * 100);
  const noPct = 100 - yesPct;

  return (
    <>
      <div
        className="lg:hidden fixed left-0 right-0 z-20 bg-bg-secondary/95 backdrop-blur border-t border-border px-4 py-3"
        style={{ bottom: 'calc(4rem + var(--safe-bottom))' }}
      >
        <div className="flex items-center gap-3">
          <p className="flex-1 min-w-0 text-xs text-text-secondary truncate">{market.question}</p>
          <button
            type="button"
            onClick={() => setSheetOutcome('YES')}
            disabled={isClosed}
            className="shrink-0 px-5 py-2.5 rounded-xl font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: 'var(--color-yes)', color: 'var(--color-bg-primary)' }}
          >
            {t('common.yes')} {yesPct}¢
          </button>
          <button
            type="button"
            onClick={() => setSheetOutcome('NO')}
            disabled={isClosed}
            className="shrink-0 px-5 py-2.5 rounded-xl font-bold text-sm text-white disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: 'var(--color-no)' }}
          >
            {t('common.no')} {noPct}¢
          </button>
        </div>
      </div>

      {sheetOutcome && (
        <div className="lg:hidden fixed inset-0 z-40">
          <button
            type="button"
            aria-label={t('tradePanel.closeSheet')}
            className={`absolute inset-0 bg-black/60 transition-opacity duration-200 ${visible ? 'opacity-100' : 'opacity-0'}`}
            onClick={() => setSheetOutcome(null)}
          />
          <div
            className={`absolute left-0 right-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-bg-secondary p-4 pt-3 transition-transform duration-300 ease-out ${
              visible ? 'translate-y-0' : 'translate-y-full'
            }`}
            style={{ paddingBottom: 'calc(1rem + var(--safe-bottom))' }}
          >
            <div className="w-10 h-1 rounded-full bg-overlay-3 mx-auto mb-4" />
            <TradePanel market={market} initialOutcome={sheetOutcome} onTraded={() => setSheetOutcome(null)} />
          </div>
        </div>
      )}
    </>
  );
}
