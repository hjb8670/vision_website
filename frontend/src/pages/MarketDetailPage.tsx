import { useParams } from 'react-router-dom';
import { useMarket } from '../hooks/useMarkets';
import { MarketDetailHeader } from '../components/MarketDetailHeader';
import { PriceChart } from '../components/PriceChart';
import { TradePanel } from '../components/TradePanel';
import { MobileTradeBar } from '../components/MobileTradeBar';
import { useTranslation } from '../lib/i18n/useTranslation';

export function MarketDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: market, isLoading } = useMarket(slug);
  const { t } = useTranslation();

  if (isLoading) {
    return <div className="max-w-7xl mx-auto px-4 py-12 text-text-secondary">{t('marketDetailPage.loading')}</div>;
  }
  if (!market) {
    return <div className="max-w-7xl mx-auto px-4 py-12 text-text-secondary">{t('marketDetailPage.notFound')}</div>;
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8 pb-[4.5rem] lg:pb-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <MarketDetailHeader market={market} />
          <PriceChart marketId={market.id} />
        </div>
        <div className="hidden lg:block">
          <div className="lg:sticky lg:top-20">
            <TradePanel market={market} />
          </div>
        </div>
      </div>
      <MobileTradeBar market={market} />
    </>
  );
}
