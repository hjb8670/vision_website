import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { LeaderboardRow } from '../lib/types';

export function useLeaderboard() {
  return useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const { data } = await api.get<LeaderboardRow[]>('/leaderboard');
      return data;
    },
    refetchInterval: 8000,
  });
}
