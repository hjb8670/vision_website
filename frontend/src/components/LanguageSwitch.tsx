import { useLanguageStore } from '../store/languageStore';

export function LanguageSwitch() {
  const { lang, setLang } = useLanguageStore();

  return (
    <div className="flex items-center rounded-full bg-overlay-1 p-0.5 text-xs font-semibold shrink-0">
      <button
        type="button"
        onClick={() => setLang('en')}
        className={`px-2 py-1 rounded-full transition-colors ${
          lang === 'en' ? 'bg-accent-primary text-white' : 'text-text-secondary hover:text-text-primary'
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang('es')}
        className={`px-2 py-1 rounded-full transition-colors ${
          lang === 'es' ? 'bg-accent-primary text-white' : 'text-text-secondary hover:text-text-primary'
        }`}
      >
        ES
      </button>
    </div>
  );
}
