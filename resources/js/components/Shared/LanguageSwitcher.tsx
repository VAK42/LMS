import { usePage, router } from '@inertiajs/react';
import { Globe } from 'lucide-react';
import { useState } from 'react';
export default function LanguageSwitcher() {
  const { locale, translations } = usePage().props as any;
  const [isOpen, setIsOpen] = useState(false);
  const languages = [
    { code: 'en', label: translations.english },
    { code: 'es', label: translations.spanish },
    { code: 'fr', label: translations.french },
    { code: 'de', label: translations.german },
    { code: 'vn', label: translations.vietnamese },
    { code: 'kr', label: translations.korean },
    { code: 'jp', label: translations.japanese },
    { code: 'zh', label: translations.chinese },
    { code: 'ru', label: translations.russian },
    { code: 'it', label: translations.italian },
  ];
  const handleLanguageChange = (code: string) => {
    router.post('/language', { locale: code }, {
      preserveState: true,
      preserveScroll: true,
      onFinish: () => setIsOpen(false),
    });
  };
  return (
    <div className="relative cursor-pointer">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-zinc-600 hover:text-green-950 dark:text-zinc-300 dark:hover:text-white transition-colors cursor-pointer rounded border border-transparent hover:border-green-950 dark:hover:border-white"
      >
        <Globe className="w-4 h-4" />
        <span className="uppercase">{locale}</span>
      </button>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-lg z-50 py-1 rounded">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer ${locale === lang.code ? 'font-medium text-green-950 dark:text-white' : 'text-zinc-600 dark:text-zinc-400'}`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}