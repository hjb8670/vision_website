import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Lang = 'en' | 'es';

interface LanguageState {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      lang: 'es',
      setLang: (lang) => set({ lang }),
    }),
    { name: 'vision-language' },
  ),
);
