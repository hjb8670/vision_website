import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { Position } from '../lib/types';
import { useAuthStore } from '../store/authStore';

export function usePositions() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: ['positions'],
    queryFn: async () => {
      const { data } = await api.get<Position[]>('/positions');
      return data;
    },
    enabled: !!token,
    refetchInterval: 5000,
  });
}
