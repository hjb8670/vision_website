import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { AdminUser } from '../lib/types';

export function useUsers(search: string) {
  return useQuery({
    queryKey: ['admin-users', search],
    queryFn: async () => {
      const { data } = await api.get<AdminUser[]>('/admin/users', { params: search ? { search } : undefined });
      return data;
    },
  });
}
