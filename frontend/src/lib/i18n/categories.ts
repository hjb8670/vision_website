import { useLanguageStore } from '../../store/languageStore';
import type { Category } from '../types';

const CATEGORY_LABELS: Record<string, { en: string; es: string }> = {
  deportes: { en: 'Sports', es: 'Deportes' },
  politica: { en: 'Politics', es: 'Política' },
  elecciones: { en: 'Elections', es: 'Elecciones' },
  cultura: { en: 'Culture', es: 'Cultura' },
  entretenimiento: { en: 'Entertainment', es: 'Entretenimiento' },
  cripto: { en: 'Crypto', es: 'Cripto' },
  clima: { en: 'Climate', es: 'Clima' },
  economia: { en: 'Economics', es: 'Economía' },
  finanzas: { en: 'Finance', es: 'Finanzas' },
  tecnologia: { en: 'Tech', es: 'Tecnología' },
  ciencia: { en: 'Science', es: 'Ciencia' },
};

export function useCategoryLabel(category: Category | null | undefined): string {
  const lang = useLanguageStore((s) => s.lang);
  if (!category) return '';
  return CATEGORY_LABELS[category.slug]?.[lang] ?? category.name;
}
