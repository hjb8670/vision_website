import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { WalletBalance, WalletTransaction } from '../lib/types';
import { useAuthStore } from '../store/authStore';

export function useWalletBalance() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: ['wallet-balance'],
    queryFn: async () => {
      const { data } = await api.get<WalletBalance>('/wallet/balance');
      return data;
    },
    enabled: !!token,
    refetchInterval: 4000,
  });
}

export function useWalletTransactions(limit = 50) {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: ['wallet-transactions', limit],
    queryFn: async () => {
      const { data } = await api.get<WalletTransaction[]>('/wallet/transactions', { params: { limit } });
      return data;
    },
    enabled: !!token,
    refetchInterval: 5000,
  });
}
