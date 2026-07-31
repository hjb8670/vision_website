const PALETTE = ['#E8362F', '#F2B134', '#B91F1F', '#3ECF5E', '#C9C9C9'];

function hashHue(text: string) {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

export function CategoryThumb({ label, className = '' }: { label: string; className?: string }) {
  const color = hashHue(label);
  return (
    <div
      className={`flex items-center justify-center font-bold text-white/90 ${className}`}
      style={{
        background: `linear-gradient(135deg, ${color}55, #12121200), radial-gradient(circle at 30% 20%, ${color}aa, #1c1c1c)`,
      }}
    >
      <span className="text-2xl opacity-80">{label.slice(0, 1)}</span>
    </div>
  );
}
