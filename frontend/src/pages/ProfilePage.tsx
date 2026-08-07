import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import { useFollowers, useFollowing, useFollowUser, useUpdateBio, useUserProfile } from '../hooks/useUsers';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { useTranslation } from '../lib/i18n/useTranslation';

export function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { t, lang } = useTranslation();
  const push = useToastStore((s) => s.push);
  const currentUser = useAuthStore((s) => s.user);

  const { data: profile, isLoading } = useUserProfile(username);
  const { data: followers } = useFollowers(profile?.id);
  const { data: following } = useFollowing(profile?.id);
  const { data: leaderboard } = useLeaderboard();
  const followMutation = useFollowUser(profile?.id);
  const updateBioMutation = useUpdateBio(username);

  const [editingBio, setEditingBio] = useState(false);
  const [bioDraft, setBioDraft] = useState('');

  if (isLoading) {
    return <div className="max-w-2xl mx-auto px-4 py-16 text-text-secondary">{t('profilePage.loading')}</div>;
  }
  if (!profile) {
    return <div className="max-w-2xl mx-auto px-4 py-16 text-text-secondary">{t('profilePage.notFound')}</div>;
  }

  const isOwnProfile = currentUser?.username === profile.username;
  const isFollowing = !!currentUser && (followers ?? []).some((f) => f.id === currentUser.id);
  const stats = (leaderboard ?? []).find((row) => row.username === profile.username);

  function startEditingBio() {
    setBioDraft(profile?.bio ?? '');
    setEditingBio(true);
  }

  function saveBio() {
    updateBioMutation.mutate(bioDraft, {
      onSuccess: () => {
        push(t('profilePage.bioSaved'));
        setEditingBio(false);
      },
      onError: () => push(t('profilePage.bioSaveFailed'), 'error'),
    });
  }

  function follow() {
    followMutation.mutate(undefined, {
      onSuccess: () => push(t('profilePage.followSuccess', { username: profile?.username ?? '' })),
      onError: () => push(t('profilePage.followFailed'), 'error'),
    });
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="flex flex-col items-center text-center">
        {profile.avatarUrl ? (
          <img src={profile.avatarUrl} alt={profile.username} className="w-20 h-20 rounded-full object-cover mb-4" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-accent-secondary flex items-center justify-center text-2xl font-bold mb-4">
            {profile.username.slice(0, 2).toUpperCase()}
          </div>
        )}
        <h1 className="text-2xl font-bold">{profile.username}</h1>
        <p className="text-text-secondary text-sm mt-1">
          {t('profilePage.tradingSince', { date: new Date(profile.createdAt).toLocaleDateString(lang === 'es' ? 'es-MX' : 'en-US') })}
        </p>

        <div className="flex items-center gap-6 mt-4 text-sm">
          <span>
            <span className="font-bold">{following?.length ?? 0}</span>{' '}
            <span className="text-text-secondary">{t('profilePage.following')}</span>
          </span>
          <span>
            <span className="font-bold">{followers?.length ?? 0}</span>{' '}
            <span className="text-text-secondary">{t('profilePage.followers')}</span>
          </span>
        </div>

        {!isOwnProfile && currentUser && (
          <button
            type="button"
            onClick={follow}
            disabled={isFollowing || followMutation.isPending}
            className="mt-4 px-5 py-1.5 rounded-full bg-accent-primary hover:bg-accent-secondary disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold text-white transition-colors"
          >
            {isFollowing ? t('profilePage.alreadyFollowing') : t('profilePage.follow')}
          </button>
        )}
      </div>

      <div className="mt-8 bg-bg-elevated rounded-2xl p-5">
        {editingBio ? (
          <div className="space-y-3">
            <textarea
              value={bioDraft}
              onChange={(e) => setBioDraft(e.target.value)}
              maxLength={280}
              rows={3}
              placeholder={t('profilePage.bioPlaceholder')}
              className="w-full bg-black/20 border border-white/10 rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent-primary resize-none"
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setEditingBio(false)}
                className="px-4 py-1.5 rounded-full text-sm font-medium text-text-secondary hover:bg-white/5 transition-colors"
              >
                {t('profilePage.cancel')}
              </button>
              <button
                type="button"
                onClick={saveBio}
                disabled={updateBioMutation.isPending}
                className="px-4 py-1.5 rounded-full bg-accent-primary hover:bg-accent-secondary disabled:opacity-50 text-sm font-semibold text-white transition-colors"
              >
                {t('profilePage.save')}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm text-text-secondary whitespace-pre-wrap">{profile.bio || t('profilePage.noBio')}</p>
            {isOwnProfile && (
              <button
                type="button"
                onClick={startEditingBio}
                className="shrink-0 text-xs text-accent-primary font-medium hover:underline"
              >
                {t('profilePage.editBio')}
              </button>
            )}
          </div>
        )}
      </div>

      {stats && (
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-bg-elevated rounded-2xl p-5">
            <p className="text-sm text-text-secondary mb-1">{t('profilePage.profitLoss')}</p>
            <p className="text-2xl font-bold" style={{ color: stats.profit >= 0 ? 'var(--color-success)' : 'var(--color-error)' }}>
              {stats.profit >= 0 ? '+' : ''}MX${stats.profit.toFixed(2)}
            </p>
          </div>
          <div className="bg-bg-elevated rounded-2xl p-5">
            <p className="text-sm text-text-secondary mb-1">{t('profilePage.volumeTraded')}</p>
            <p className="text-2xl font-bold">MX${stats.volume.toFixed(2)}</p>
          </div>
        </div>
      )}
    </div>
  );
}
