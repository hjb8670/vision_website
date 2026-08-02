import { useLanguageStore } from '../../store/languageStore';
import { en } from './en';
import { es } from './es';

const dictionaries = { en, es };

function lookup(dict: unknown, path: string): string | undefined {
  const value = path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, dict);
  return typeof value === 'string' ? value : undefined;
}

function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, key) => (key in vars ? String(vars[key]) : match));
}

export function useTranslation() {
  const lang = useLanguageStore((s) => s.lang);

  function t(key: string, vars?: Record<string, string | number>): string {
    const value = lookup(dictionaries[lang], key) ?? lookup(en, key) ?? key;
    return interpolate(value, vars);
  }

  return { t, lang };
}
