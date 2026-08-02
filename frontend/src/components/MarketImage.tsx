import { useState } from 'react';
import { CategoryIcon } from './CategoryIcon';

export function MarketImage({
  imageUrl,
  categoryName,
  size = 40,
}: {
  imageUrl?: string | null;
  categoryName: string;
  size?: number;
}) {
  const [failed, setFailed] = useState(false);

  if (!imageUrl || failed) {
    return <CategoryIcon label={categoryName} size={size} />;
  }

  return (
    <img
      src={imageUrl}
      alt=""
      onError={() => setFailed(true)}
      className="shrink-0 rounded-lg object-cover bg-white/5"
      style={{ width: size, height: size }}
    />
  );
}
