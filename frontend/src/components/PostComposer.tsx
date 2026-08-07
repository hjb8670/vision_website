import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import { useCreatePost } from '../hooks/useSocial';
import { useTranslation } from '../lib/i18n/useTranslation';

const SENTIMENTS = ['bullish', 'bearish', 'neutral'] as const;

export function PostComposer() {
  const { token } = useAuthStore();
  const push = useToastStore((s) => s.push);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const createPost = useCreatePost();

  const [text, setText] = useState('');
  const [sentiment, setSentiment] = useState<(typeof SENTIMENTS)[number] | null>(null);

  const SENTIMENT_LABEL: Record<(typeof SENTIMENTS)[number], string> = {
    bullish: t('social.sentimentBullish'),
    bearish: t('social.sentimentBearish'),
    neutral: t('social.sentimentNeutral'),
  };

  if (!token) {
    return (
      <div className="rounded-2xl border border-border bg-bg-elevated p-5 text-center">
        <p className="text-sm text-text-secondary mb-3">{t('social.loginPrompt')}</p>
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="px-5 py-2 rounded-full bg-accent-primary hover:bg-accent-secondary font-semibold text-white transition-colors"
        >
          {t('navbar.logIn')}
        </button>
      </div>
    );
  }

  function submit() {
    if (!text.trim()) return;
    createPost.mutate(
      { text: text.trim(), sentiment: sentiment ?? undefined },
      {
        onSuccess: () => {
          setText('');
          setSentiment(null);
        },
        onError: () => push(t('social.postFailed'), 'error'),
      },
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-bg-elevated p-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t('social.placeholder')}
        maxLength={2000}
        rows={3}
        className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-secondary focus:outline-none resize-none"
      />
      <div className="flex items-center justify-between gap-3 mt-2">
        <div className="flex items-center gap-1.5">
          {SENTIMENTS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSentiment((v) => (v === s ? null : s))}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                sentiment === s ? 'bg-accent-primary text-white' : 'bg-overlay-1 text-text-secondary hover:bg-overlay-2'
              }`}
            >
              {SENTIMENT_LABEL[s]}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={submit}
          disabled={!text.trim() || createPost.isPending}
          className="shrink-0 px-5 py-1.5 rounded-full bg-accent-primary hover:bg-accent-secondary disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-white text-sm transition-colors"
        >
          {createPost.isPending ? t('social.posting') : t('social.post')}
        </button>
      </div>
    </div>
  );
}
