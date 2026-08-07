import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import { useComments, useCreateComment, useTogglePostLike } from '../hooks/useSocial';
import { useTranslation } from '../lib/i18n/useTranslation';
import type { SocialPost } from '../lib/types';

export function PostCard({ post }: { post: SocialPost }) {
  const { token } = useAuthStore();
  const { t, lang } = useTranslation();
  const push = useToastStore((s) => s.push);
  const toggleLike = useTogglePostLike();
  const createComment = useCreateComment(post.id);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const { data: comments, isLoading: commentsLoading } = useComments(post.id, commentsOpen);

  const sentimentLabel =
    post.sentiment === 'bullish'
      ? t('social.sentimentBullish')
      : post.sentiment === 'bearish'
        ? t('social.sentimentBearish')
        : post.sentiment === 'neutral'
          ? t('social.sentimentNeutral')
          : null;
  const sentimentColor = post.sentiment === 'bullish' ? 'var(--color-yes)' : post.sentiment === 'bearish' ? 'var(--color-no)' : null;

  function like() {
    if (!token) {
      push(t('social.loginPrompt'));
      return;
    }
    toggleLike.mutate(post.id);
  }

  function sendComment() {
    if (!commentText.trim()) return;
    createComment.mutate(commentText.trim(), {
      onSuccess: () => setCommentText(''),
      onError: () => push(t('social.commentFailed'), 'error'),
    });
  }

  return (
    <div className="rounded-2xl border border-border bg-bg-elevated p-4">
      <div className="flex items-center gap-3">
        {post.user.avatarUrl ? (
          <img src={post.user.avatarUrl} alt={post.user.username} className="w-9 h-9 rounded-full object-cover shrink-0" />
        ) : (
          <div className="w-9 h-9 rounded-full bg-accent-secondary flex items-center justify-center text-xs font-bold shrink-0">
            {post.user.username.slice(0, 2).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <Link to={`/profile/${post.user.username}`} className="text-sm font-semibold hover:underline">
            {post.user.username}
          </Link>
          <p className="text-xs text-text-secondary">
            {new Date(post.createdAt).toLocaleString(lang === 'es' ? 'es-MX' : 'en-US', {
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            })}
          </p>
        </div>
        {sentimentLabel && (
          <span
            className="ml-auto shrink-0 px-2.5 py-0.5 rounded-full border text-[11px] font-bold"
            style={sentimentColor ? { borderColor: sentimentColor, color: sentimentColor } : undefined}
          >
            {sentimentLabel}
          </span>
        )}
      </div>

      <p className="text-sm mt-3 whitespace-pre-wrap">{post.text}</p>

      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {post.tags.map((tag) => (
            <span key={tag} className="px-2 py-0.5 rounded-full bg-overlay-1 text-text-secondary text-[11px]">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {post.images[0] && <img src={post.images[0]} alt="" className="mt-3 rounded-xl w-full max-h-80 object-cover" />}

      <div className="flex items-center gap-5 mt-3 pt-3 border-t border-border text-text-secondary">
        <button
          type="button"
          onClick={like}
          className={`flex items-center gap-1.5 text-sm hover:text-accent-primary transition-colors ${
            post.likedByMe ? 'text-accent-primary' : ''
          }`}
        >
          <HeartIcon filled={post.likedByMe} />
          {post.likesCount}
        </button>
        <button
          type="button"
          onClick={() => setCommentsOpen((v) => !v)}
          className="flex items-center gap-1.5 text-sm hover:text-text-primary transition-colors"
        >
          <CommentIcon />
          {post.commentsCount}
        </button>
      </div>

      {commentsOpen && (
        <div className="mt-3 pt-3 border-t border-border space-y-3">
          {commentsLoading ? (
            <p className="text-xs text-text-secondary">{t('social.loading')}</p>
          ) : !comments || comments.length === 0 ? (
            <p className="text-xs text-text-secondary">{t('social.noComments')}</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="flex items-start gap-2">
                <span className="w-6 h-6 rounded-full bg-accent-secondary flex items-center justify-center text-[10px] font-bold shrink-0">
                  {c.user.username.slice(0, 2).toUpperCase()}
                </span>
                <p className="text-xs min-w-0">
                  <span className="font-semibold">{c.user.username}</span> <span className="text-text-secondary">{c.text}</span>
                </p>
              </div>
            ))
          )}
          {token && (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={t('social.commentPlaceholder')}
                className="flex-1 bg-overlay-1 rounded-full px-3 py-1.5 text-xs text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-accent-primary"
              />
              <button
                type="button"
                onClick={sendComment}
                disabled={!commentText.trim() || createComment.isPending}
                className="shrink-0 text-xs font-semibold text-accent-primary disabled:opacity-40"
              >
                {t('social.send')}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}
