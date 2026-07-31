import type { ReactNode } from 'react';

const ICON_PROPS = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const ICONS: Record<string, ReactNode> = {
  politics: (
    <>
      <polyline points="4,9 12,4 20,9" />
      <line x1="4" y1="9" x2="20" y2="9" />
      <line x1="6" y1="9" x2="6" y2="18" />
      <line x1="10" y1="9" x2="10" y2="18" />
      <line x1="14" y1="9" x2="14" y2="18" />
      <line x1="18" y1="9" x2="18" y2="18" />
      <line x1="4" y1="20" x2="20" y2="20" />
    </>
  ),
  sports: (
    <>
      <circle cx="12" cy="9" r="5" />
      <path d="M9 13.5 7 20l5-2.5 5 2.5-2-6.5" />
    </>
  ),
  crypto: (
    <>
      <circle cx="12" cy="12" r="8" />
      <line x1="12" y1="6.5" x2="12" y2="17.5" />
      <path d="M15 9.3c0-1.3-1.4-1.8-3-1.8s-3 .7-3 1.8 1.4 1.7 3 1.7 3 .4 3 1.7-1.4 1.8-3 1.8-3-.5-3-1.8" />
    </>
  ),
  esports: (
    <>
      <rect x="3" y="9" width="18" height="8" rx="4" />
      <line x1="7" y1="11" x2="7" y2="15" />
      <line x1="5" y1="13" x2="9" y2="13" />
      <circle cx="15" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="17.5" cy="14.5" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  finance: (
    <>
      <line x1="4" y1="20" x2="20" y2="20" />
      <rect x="6" y="13" width="3" height="7" />
      <rect x="11" y="9" width="3" height="11" />
      <rect x="16" y="5" width="3" height="15" />
    </>
  ),
  geopolitics: (
    <>
      <circle cx="10" cy="12" r="7" />
      <ellipse cx="10" cy="12" rx="3" ry="7" />
      <line x1="3" y1="12" x2="17" y2="12" />
      <line x1="18" y1="5" x2="18" y2="19" />
      <path d="M18 5.5h3.5L19.5 7.5 21.5 9.5H18" />
    </>
  ),
  tech: (
    <>
      <rect x="7" y="7" width="10" height="10" rx="1" />
      <rect x="10" y="10" width="4" height="4" />
      <line x1="9" y1="3" x2="9" y2="7" />
      <line x1="15" y1="3" x2="15" y2="7" />
      <line x1="9" y1="17" x2="9" y2="21" />
      <line x1="15" y1="17" x2="15" y2="21" />
      <line x1="3" y1="9" x2="7" y2="9" />
      <line x1="3" y1="15" x2="7" y2="15" />
      <line x1="17" y1="9" x2="21" y2="9" />
      <line x1="17" y1="15" x2="21" y2="15" />
    </>
  ),
  culture: (
    <>
      <rect x="3" y="8" width="18" height="12" rx="1" />
      <path d="M3 8l3-4 3 4M9 8l3-4 3 4M15 8l3-4 3 4" />
    </>
  ),
  economy: (
    <>
      <polyline points="4,17 9,11 13,14 20,6" />
      <polyline points="14,6 20,6 20,12" />
    </>
  ),
  weather: <path d="M7 17a4 4 0 0 1 .5-8 5 5 0 0 1 9.5 2 3.5 3.5 0 0 1-1 6.9H7z" />,
  mentions: (
    <>
      <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-4 4v-4H6a2 2 0 0 1-2-2V6z" />
      <circle cx="9" cy="10" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="12" cy="10" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="15" cy="10" r="0.8" fill="currentColor" stroke="none" />
    </>
  ),
  elections: (
    <>
      <rect x="4" y="6" width="16" height="14" rx="1" />
      <line x1="8" y1="6" x2="16" y2="6" />
      <polyline points="9,13 11,15 15,10" />
    </>
  ),
  art: (
    <>
      <path d="M12 3a9 9 0 1 0 0 18c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.3 0-1.1.9-2 2-2h2.3A4.2 4.2 0 0 0 21 12c0-5-4-9-9-9z" />
      <circle cx="7.5" cy="10.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="10.5" cy="7.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="7.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="17" cy="10.5" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  world: (
    <>
      <circle cx="12" cy="12" r="8" />
      <ellipse cx="12" cy="12" rx="3.5" ry="8" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <path d="M5.5 7.5h13M5.5 16.5h13" />
    </>
  ),
};

const DEFAULT_ICON = (
  <>
    <circle cx="12" cy="12" r="8" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </>
);

export function CategoryThumb({ label, className = '' }: { label: string; className?: string }) {
  const icon = ICONS[label.toLowerCase()] ?? DEFAULT_ICON;

  return (
    <div
      className={`relative flex items-center justify-center bg-bg-elevated overflow-hidden ${className}`}
      style={{
        backgroundImage:
          'radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.06), transparent 60%), linear-gradient(135deg, rgba(255,255,255,0.03), transparent 60%)',
      }}
    >
      <svg {...ICON_PROPS} width={30} height={30} className="text-text-secondary/80">
        {icon}
      </svg>
    </div>
  );
}
