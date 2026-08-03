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
  deportes: (
    <>
      <circle cx="12" cy="9" r="5" />
      <path d="M9 13.5 7 20l5-2.5 5 2.5-2-6.5" />
    </>
  ),
  política: (
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
  elecciones: (
    <>
      <rect x="4" y="6" width="16" height="14" rx="1" />
      <line x1="8" y1="6" x2="16" y2="6" />
      <polyline points="9,13 11,15 15,10" />
    </>
  ),
  cultura: (
    <>
      <rect x="3" y="8" width="18" height="12" rx="1" />
      <path d="M3 8l3-4 3 4M9 8l3-4 3 4M15 8l3-4 3 4" />
    </>
  ),
  entretenimiento: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <polygon points="10,9 15,12 10,15" fill="currentColor" stroke="none" />
    </>
  ),
  cripto: (
    <>
      <circle cx="12" cy="12" r="8" />
      <line x1="12" y1="6.5" x2="12" y2="17.5" />
      <path d="M15 9.3c0-1.3-1.4-1.8-3-1.8s-3 .7-3 1.8 1.4 1.7 3 1.7 3 .4 3 1.7-1.4 1.8-3 1.8-3-.5-3-1.8" />
    </>
  ),
  clima: <path d="M7 17a4 4 0 0 1 .5-8 5 5 0 0 1 9.5 2 3.5 3.5 0 0 1-1 6.9H7z" />,
  economía: (
    <>
      <polyline points="4,17 9,11 13,14 20,6" />
      <polyline points="14,6 20,6 20,12" />
    </>
  ),
  finanzas: (
    <>
      <line x1="4" y1="20" x2="20" y2="20" />
      <rect x="6" y="13" width="3" height="7" />
      <rect x="11" y="9" width="3" height="11" />
      <rect x="16" y="5" width="3" height="15" />
    </>
  ),
  tecnología: (
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
  ciencia: (
    <>
      <path d="M10 3h4" />
      <path d="M10.5 3v5.5L5.8 17a2 2 0 0 0 1.7 3h9a2 2 0 0 0 1.7-3l-4.7-8.5V3" />
      <line x1="8.5" y1="14" x2="15.5" y2="14" />
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

export function CategoryIcon({ label, size = 40 }: { label: string; size?: number }) {
  const icon = ICONS[label.toLowerCase()] ?? DEFAULT_ICON;

  return (
    <div
      className="shrink-0 flex items-center justify-center rounded-lg bg-white/5"
      style={{ width: size, height: size }}
    >
      <svg {...ICON_PROPS} width={size * 0.55} height={size * 0.55} className="text-text-secondary">
        {icon}
      </svg>
    </div>
  );
}
