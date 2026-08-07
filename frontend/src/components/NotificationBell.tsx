import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useMarkNotificationRead, useNotifications } from '../hooks/useNotifications';
import { useTranslation } from '../lib/i18n/useTranslation';
import type { AppNotification } from '../lib/types';

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const user = useAuthStore((s) => s.user);
  const { data: notifications, isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();
  const { t, lang } = useTranslation();
  const dateLocale = lang === 'es' ? 'es-MX' : 'en-US';

  const unreadCount = (notifications ?? []).filter((n) => !n.read_at).length;

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  function handleSelect(n: AppNotification) {
    if (!n.read_at) markRead.mutate(n.id);
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t('navbar.notifications')}
        className="relative shrink-0 p-1.5 sm:p-2 rounded-full text-text-secondary hover:text-text-primary hover:bg-overlay-2"
      >
        <BellIcon />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 min-w-[16px] h-4 px-1 rounded-full bg-accent-primary text-white text-[10px] font-bold flex items-center justify-center leading-none">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed left-4 right-4 top-16 sm:absolute sm:left-auto sm:right-0 sm:top-auto sm:mt-2 sm:w-80 sm:inset-x-auto max-w-full sm:max-w-[calc(100vw-2rem)] bg-bg-elevated rounded-2xl shadow-lg text-sm overflow-hidden z-30">
          <div className="px-4 py-3 font-semibold border-b border-border">{t('notificationsPanel.heading')}</div>
          <div className="max-h-96 overflow-y-auto">
            {!user ? (
              <p className="px-4 py-6 text-center text-text-secondary">{t('notificationsPanel.loginPrompt')}</p>
            ) : isLoading ? (
              <p className="px-4 py-6 text-center text-text-secondary">{t('notificationsPanel.loading')}</p>
            ) : !notifications || notifications.length === 0 ? (
              <p className="px-4 py-6 text-center text-text-secondary">{t('notificationsPanel.empty')}</p>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => handleSelect(n)}
                  className={`w-full text-left px-4 py-3 flex gap-3 hover:bg-overlay-1 border-b border-border last:border-0 ${
                    n.read_at ? '' : 'bg-white/[0.03]'
                  }`}
                >
                  <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${n.read_at ? '' : 'bg-accent-primary'}`} />
                  <span className="min-w-0">
                    <span className="block font-medium">{n.title}</span>
                    <span className="block text-text-secondary text-xs mt-0.5">{n.message}</span>
                    <span className="block text-text-secondary text-[11px] mt-1">
                      {new Date(n.created_at).toLocaleString(dateLocale)}
                    </span>
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}
