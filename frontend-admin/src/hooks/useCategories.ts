import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useToastStore } from '../store/toastStore';
import type { Category } from '../lib/types';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get<Category[]>('/categories');
      return data;
    },
    staleTime: 60_000,
  });
}

function useInvalidateCategories() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: ['categories'] });
}

export function useCreateCategory() {
  const invalidate = useInvalidateCategories();
  const push = useToastStore((s) => s.push);
  return useMutation({
    mutationFn: async (name: string) => {
      const { data } = await api.post<Category>('/admin/categories', { name });
      return data;
    },
    onSuccess: () => {
      push('Category created');
      invalidate();
    },
    onError: (err: any) => push(err?.response?.data?.message ?? 'Failed to create category', 'error'),
  });
}

export function useUpdateCategory() {
  const invalidate = useInvalidateCategories();
  const push = useToastStore((s) => s.push);
  return useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const { data } = await api.patch<Category>(`/admin/categories/${id}`, { name });
      return data;
    },
    onSuccess: () => {
      push('Category updated');
      invalidate();
    },
    onError: (err: any) => push(err?.response?.data?.message ?? 'Failed to update category', 'error'),
  });
}

export function useDeleteCategory() {
  const invalidate = useInvalidateCategories();
  const push = useToastStore((s) => s.push);
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/categories/${id}`);
    },
    onSuccess: () => {
      push('Category deleted');
      invalidate();
    },
    onError: (err: any) => push(err?.response?.data?.message ?? 'Failed to delete category', 'error'),
  });
}
