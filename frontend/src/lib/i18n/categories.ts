import { useLanguageStore } from '../../store/languageStore';
import type { Category } from '../types';

const CATEGORY_LABELS: Record<string, { en: string; es: string }> = {
  politics: { en: 'Politics', es: 'Política' },
  sports: { en: 'Sports', es: 'Deportes' },
  crypto: { en: 'Crypto', es: 'Cripto' },
  esports: { en: 'Esports', es: 'Esports' },
  finance: { en: 'Finance', es: 'Finanzas' },
  geopolitics: { en: 'Geopolitics', es: 'Geopolítica' },
  tech: { en: 'Tech', es: 'Tecnología' },
  culture: { en: 'Culture', es: 'Cultura' },
  economy: { en: 'Economy', es: 'Economía' },
  weather: { en: 'Weather', es: 'Clima' },
  mentions: { en: 'Mentions', es: 'Menciones' },
  elections: { en: 'Elections', es: 'Elecciones' },
  art: { en: 'Art', es: 'Arte' },
  world: { en: 'World', es: 'Mundo' },
};

export function useCategoryLabel(category: Category | null | undefined): string {
  const lang = useLanguageStore((s) => s.lang);
  if (!category) return '';
  return CATEGORY_LABELS[category.slug]?.[lang] ?? category.name;
}
