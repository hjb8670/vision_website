import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useToastStore } from '../store/toastStore';
import type { MarketDetail } from '../lib/types';

export interface MarketFormInput {
  question: string;
  description: string;
  resolutionSource: string;
  categoryId: string;
  imageUrl?: string;
  closeDate: string;
  liquidityB?: number;
}

export function useCreateMarket() {
  const queryClient = useQueryClient();
  const push = useToastStore((s) => s.push);

  return useMutation({
    mutationFn: async (dto: MarketFormInput) => {
      const { data } = await api.post<MarketDetail>('/admin/markets', dto);
      return data;
    },
    onSuccess: () => {
      push('Market created', 'success');
      queryClient.invalidateQueries({ queryKey: ['markets'] });
    },
    onError: (err: any) => {
      push(err?.response?.data?.message ?? 'Failed to create market', 'error');
    },
  });
}

export function useUpdateMarket() {
  const queryClient = useQueryClient();
  const push = useToastStore((s) => s.push);

  return useMutation({
    mutationFn: async ({ id, dto }: { id: string; dto: Partial<MarketFormInput> }) => {
      const { data } = await api.patch<MarketDetail>(`/admin/markets/${id}`, dto);
      return data;
    },
    onSuccess: (data) => {
      push('Market updated', 'success');
      queryClient.invalidateQueries({ queryKey: ['markets'] });
      queryClient.invalidateQueries({ queryKey: ['market', data.slug] });
    },
    onError: (err: any) => {
      push(err?.response?.data?.message ?? 'Failed to update market', 'error');
    },
  });
}

export function useResolveMarket() {
  const queryClient = useQueryClient();
  const push = useToastStore((s) => s.push);

  return useMutation({
    mutationFn: async ({ id, outcome }: { id: string; outcome: 'YES' | 'NO' }) => {
      const { data } = await api.patch<MarketDetail>(`/admin/markets/${id}/resolve`, { outcome });
      return data;
    },
    onSuccess: (data) => {
      push(`Market resolved ${data.resolvedOutcome}`, 'success');
      queryClient.invalidateQueries({ queryKey: ['markets'] });
      queryClient.invalidateQueries({ queryKey: ['market', data.slug] });
    },
    onError: (err: any) => {
      push(err?.response?.data?.message ?? 'Failed to resolve market', 'error');
    },
  });
}
