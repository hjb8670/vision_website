import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { MarketSummary, MarketDetail, PricePoint, SortFilter } from '../lib/types';

export function useMarkets(sf: SortFilter = 'newest', category?: string) {
  return useQuery({
    queryKey: ['markets', sf, category],
    queryFn: async () => {
      const { data } = await api.get<MarketSummary[]>('/markets', { params: { sf, category } });
      return data;
    },
    refetchInterval: 5000,
  });
}

export function useMarket(slug: string | undefined) {
  return useQuery({
    queryKey: ['market', slug],
    queryFn: async () => {
      const { data } = await api.get<MarketDetail>(`/markets/${slug}`);
      return data;
    },
    enabled: !!slug,
    refetchInterval: 4000,
  });
}

export function useMarketHistory(marketId: string | undefined, range: '1D' | '1W' | '1M' | 'ALL') {
  return useQuery({
    queryKey: ['market-history', marketId, range],
    queryFn: async () => {
      const { data } = await api.get<PricePoint[]>(`/markets/${marketId}/history`, { params: { range } });
      return data;
    },
    enabled: !!marketId,
    refetchInterval: 5000,
  });
}
