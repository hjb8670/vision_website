import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { DashboardStats } from '../lib/types';

export function useStats() {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const { data } = await api.get<DashboardStats>('/admin/stats');
      return data;
    },
    refetchInterval: 15000,
  });
}
