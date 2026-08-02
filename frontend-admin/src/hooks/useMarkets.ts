import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useToastStore } from '../store/toastStore';
import type { MarketDetail, MarketSummary } from '../lib/types';

export interface MarketFormInput {
  question: string;
  description: string;
  resolutionSource: string;
  categoryId: string;
  imageUrl?: string;
  closeDate: string;
  liquidityB?: number;
}

export function useMarkets() {
  return useQuery({
    queryKey: ['markets'],
    queryFn: async () => {
      const { data } = await api.get<MarketSummary[]>('/markets');
      return data;
    },
    refetchInterval: 10000,
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
  });
}

function useInvalidateMarkets() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: ['markets'] });
    qc.invalidateQueries({ queryKey: ['admin-stats'] });
  };
}

export function useCreateMarket() {
  const invalidate = useInvalidateMarkets();
  const push = useToastStore((s) => s.push);
  return useMutation({
    mutationFn: async (dto: MarketFormInput) => {
      const { data } = await api.post<MarketDetail>('/admin/markets', dto);
      return data;
    },
    onSuccess: () => {
      push('Market created');
      invalidate();
    },
    onError: (err: any) => push(err?.response?.data?.message ?? 'Failed to create market', 'error'),
  });
}

export function useUpdateMarket() {
  const queryClient = useQueryClient();
  const invalidate = useInvalidateMarkets();
  const push = useToastStore((s) => s.push);
  return useMutation({
    mutationFn: async ({ id, dto }: { id: string; dto: Partial<MarketFormInput> }) => {
      const { data } = await api.patch<MarketDetail>(`/admin/markets/${id}`, dto);
      return data;
    },
    onSuccess: (data) => {
      push('Market updated');
      invalidate();
      queryClient.invalidateQueries({ queryKey: ['market', data.slug] });
    },
    onError: (err: any) => push(err?.response?.data?.message ?? 'Failed to update market', 'error'),
  });
}

export function useResolveMarket() {
  const invalidate = useInvalidateMarkets();
  const push = useToastStore((s) => s.push);
  return useMutation({
    mutationFn: async ({ id, outcome }: { id: string; outcome: 'YES' | 'NO' }) => {
      const { data } = await api.patch<MarketDetail>(`/admin/markets/${id}/resolve`, { outcome });
      return data;
    },
    onSuccess: (data) => {
      push(`Market resolved ${data.resolvedOutcome}`);
      invalidate();
    },
    onError: (err: any) => push(err?.response?.data?.message ?? 'Failed to resolve market', 'error'),
  });
}

export function useSetMarketStatus() {
  const invalidate = useInvalidateMarkets();
  const push = useToastStore((s) => s.push);
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'OPEN' | 'CLOSED' }) => {
      const { data } = await api.patch<MarketDetail>(`/admin/markets/${id}/status`, { status });
      return data;
    },
    onSuccess: (data) => {
      push(data.status === 'OPEN' ? 'Market reopened' : 'Market paused');
      invalidate();
    },
    onError: (err: any) => push(err?.response?.data?.message ?? 'Failed to update market status', 'error'),
  });
}

export function useDeleteMarket() {
  const invalidate = useInvalidateMarkets();
  const push = useToastStore((s) => s.push);
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/markets/${id}`);
    },
    onSuccess: () => {
      push('Market deleted');
      invalidate();
    },
    onError: (err: any) => push(err?.response?.data?.message ?? 'Failed to delete market', 'error'),
  });
}
