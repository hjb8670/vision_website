import { useMemo, useState } from 'react';
import { useSocialFeed } from '../hooks/useSocial';
import { PostComposer } from '../components/PostComposer';
import { PostCard } from '../components/PostCard';
import { useTranslation } from '../lib/i18n/useTranslation';

const WINDOWS = ['now', 'today', 'week', 'month'] as const;
const WINDOW_MS: Record<(typeof WINDOWS)[number], number> = {
  now: 60 * 60 * 1000,
  today: 24 * 60 * 60 * 1000,
  week: 7 * 24 * 60 * 60 * 1000,
  month: 30 * 24 * 60 * 60 * 1000,
};

export function SocialPage() {
  const { data: posts, isLoading } = useSocialFeed();
  const { t } = useTranslation();
  const [timeWindow, setTimeWindow] = useState<(typeof WINDOWS)[number]>('month');

  const WINDOW_LABEL: Record<(typeof WINDOWS)[number], string> = {
    now: t('social.filterNow'),
    today: t('social.filterToday'),
    week: t('social.filterWeek'),
    month: t('social.filterMonth'),
  };

  const filtered = useMemo(() => {
    const cutoff = Date.now() - WINDOW_MS[timeWindow];
    return (posts ?? []).filter((p) => new Date(p.createdAt).getTime() >= cutoff);
  }, [posts, timeWindow]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
      <h1 className="text-2xl font-bold">{t('social.heading')}</h1>

      <PostComposer />

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {WINDOWS.map((w) => (
          <button
            key={w}
            type="button"
            onClick={() => setTimeWindow(w)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
              timeWindow === w ? 'bg-overlay-2 text-text-primary' : 'text-text-secondary hover:bg-overlay-1'
            }`}
          >
            {WINDOW_LABEL[w]}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-text-secondary text-sm">{t('social.loading')}</p>
      ) : filtered.length === 0 ? (
        <p className="text-text-secondary text-sm py-8 text-center">{t('social.empty')}</p>
      ) : (
        <div className="space-y-4">
          {filtered.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
