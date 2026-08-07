export function PercentPill({
  pct,
  outcome,
  size = 'md',
}: {
  pct: number;
  outcome: 'YES' | 'NO';
  size?: 'sm' | 'md';
}) {
  const color = outcome === 'YES' ? 'var(--color-yes)' : 'var(--color-no)';
  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3.5 py-1 text-sm';

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border font-bold shrink-0 ${sizeClasses}`}
      style={{ borderColor: color, color }}
    >
      {Math.round(pct)}%
    </span>
  );
}
