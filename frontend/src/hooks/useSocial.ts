import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { PostComment, SocialPost } from '../lib/types';

export function useSocialFeed() {
  return useQuery({
    queryKey: ['social-feed'],
    queryFn: async () => {
      const { data } = await api.get<SocialPost[]>('/social/feed');
      return data;
    },
    refetchInterval: 15000,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { text: string; sentiment?: string; tags?: string[] }) => {
      const { data } = await api.post<SocialPost>('/social/posts', input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-feed'] });
    },
  });
}

export function useTogglePostLike() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (postId: string) => {
      const { data } = await api.post<{ liked: boolean; likesCount: number }>(`/social/posts/${postId}/like`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-feed'] });
    },
  });
}

export function useComments(postId: string, enabled: boolean) {
  return useQuery({
    queryKey: ['post-comments', postId],
    queryFn: async () => {
      const { data } = await api.get<PostComment[]>(`/social/posts/${postId}/comments`);
      return data;
    },
    enabled,
  });
}

export function useCreateComment(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (text: string) => {
      const { data } = await api.post<PostComment>(`/social/posts/${postId}/comments`, { text });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post-comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['social-feed'] });
    },
  });
}
