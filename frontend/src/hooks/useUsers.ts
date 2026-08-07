import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { UserProfile } from '../lib/types';

export function useUserProfile(username: string | undefined) {
  return useQuery({
    queryKey: ['user-profile', username],
    queryFn: async () => {
      const { data } = await api.get<UserProfile>(`/users/${username}`);
      return data;
    },
    enabled: !!username,
  });
}

export function useFollowers(userId: string | undefined) {
  return useQuery({
    queryKey: ['followers', userId],
    queryFn: async () => {
      const { data } = await api.get<UserProfile[]>(`/users/${userId}/followers`);
      return data;
    },
    enabled: !!userId,
  });
}

export function useFollowing(userId: string | undefined) {
  return useQuery({
    queryKey: ['following', userId],
    queryFn: async () => {
      const { data } = await api.get<UserProfile[]>(`/users/${userId}/following`);
      return data;
    },
    enabled: !!userId,
  });
}

export function useFollowUser(userId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post(`/users/${userId}/follow`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followers', userId] });
    },
  });
}

export function useUpdateBio(username: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (bio: string) => {
      const { data } = await api.patch<UserProfile>('/users/me', { bio });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile', username] });
    },
  });
}
