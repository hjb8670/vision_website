import { useState } from 'react';
import type { MarketDetail } from '../lib/types';
import { MarketImage } from './MarketImage';
import { useToastStore } from '../store/toastStore';
import { useTranslation } from '../lib/i18n/useTranslation';
import { useCategoryLabel } from '../lib/i18n/categories';

export function MarketDetailHeader({ market }: { market: MarketDetail }) {
  const [expanded, setExpanded] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const push = useToastStore((s) => s.push);
  const { t, lang } = useTranslation();
  const categoryLabel = useCategoryLabel(market.category);
  const yesPct = Math.round(market.yesProbability * 100);
  const closeDate = new Date(market.closeDate).toLocaleDateString(lang === 'es' ? 'es-MX' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      push(t('marketDetailHeader.linkCopied'));
    } catch {
      push(t('marketDetailHeader.couldNotCopyLink'), 'error');
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <MarketImage imageUrl={market.imageUrl} categoryName={market.category.name} size={56} />
          <div className="min-w-0">
            <p className="text-sm text-text-secondary mb-1">
              {categoryLabel}
              {market.status === 'RESOLVED' && (
                <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded bg-white/10 text-text-primary">
                  {t('marketDetailHeader.resolved', {
                    outcome: t(market.resolvedOutcome === 'YES' ? 'common.yes' : 'common.no').toUpperCase(),
                  })}
                </span>
              )}
            </p>
            <h1 className="text-xl md:text-2xl font-bold leading-tight">{market.question}</h1>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={copyLink}
            aria-label={t('marketDetailHeader.copyLink')}
            className="p-2 rounded-full text-text-secondary hover:text-text-primary hover:bg-white/10"
          >
            <LinkIcon />
          </button>
          <button
            type="button"
            onClick={() => setBookmarked((v) => !v)}
            aria-label={t('marketDetailHeader.bookmark')}
            className="p-2 rounded-full text-text-secondary hover:text-text-primary hover:bg-white/10"
          >
            <BookmarkIcon filled={bookmarked} />
          </button>
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-extrabold" style={{ color: yesPct > 50 ? 'var(--color-yes)' : 'var(--color-no)' }}>
          {yesPct}%
        </span>
        <span className="text-text-secondary text-sm">{t('marketDetailHeader.chanceCloses', { date: closeDate })}</span>
      </div>

      <div>
        <p className={`text-sm text-text-secondary ${expanded ? '' : 'line-clamp-2'}`}>{market.description}</p>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="text-xs text-accent-primary font-medium hover:underline mt-1"
        >
          {expanded ? t('marketDetailHeader.readLess') : t('marketDetailHeader.readMore')}
        </button>
      </div>

      <div className="text-xs text-text-secondary border-t border-white/10 pt-3">
        <span className="font-medium text-text-primary">{t('marketDetailHeader.resolutionSource')}</span>
        {market.resolutionSource}
      </div>
    </div>
  );
}

function LinkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}
