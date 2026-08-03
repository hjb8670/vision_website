import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useTranslation } from '../lib/i18n/useTranslation';

export function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { t, lang } = useTranslation();

  const { data: user, isLoading } = useQuery({
    queryKey: ['user', username],
    queryFn: async () => {
      const { data } = await api.get(`/users/${username}`);
      return data as { username: string; createdAt: string };
    },
    enabled: !!username,
  });

  if (isLoading) {
    return <div className="max-w-2xl mx-auto px-4 py-16 text-text-secondary">{t('profilePage.loading')}</div>;
  }
  if (!user) {
    return <div className="max-w-2xl mx-auto px-4 py-16 text-text-secondary">{t('profilePage.notFound')}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="w-20 h-20 rounded-full bg-accent-secondary flex items-center justify-center text-2xl font-bold mx-auto mb-4">
        {user.username.slice(0, 2).toUpperCase()}
      </div>
      <h1 className="text-2xl font-bold">{user.username}</h1>
      <p className="text-text-secondary text-sm mt-1">
        {t('profilePage.tradingSince', { date: new Date(user.createdAt).toLocaleDateString(lang === 'es' ? 'es-MX' : 'en-US') })}
      </p>
    </div>
  );
}
