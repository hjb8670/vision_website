import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { LeaderboardRow, BiggestWin } from '../lib/types';

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

export function useBiggestWins() {
  return useQuery({
    queryKey: ['leaderboard-biggest-wins'],
    queryFn: async () => {
      const { data } = await api.get<BiggestWin[]>('/leaderboard/biggest-wins');
      return data;
    },
    refetchInterval: 15000,
  });
}
