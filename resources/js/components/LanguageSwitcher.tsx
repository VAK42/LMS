import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Globe } from 'lucide-react';
interface LanguageSwitcherProps {
  currentLocale?: string;
}
const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
];
export default function LanguageSwitcher({ currentLocale = 'en' }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [locale, setLocale] = useState(currentLocale);
  const changeLanguage = (newLocale: string) => {
    setLocale(newLocale);
    setIsOpen(false);
    router.post('/api/locale/change', {
      locale: newLocale,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        window.location.reload();
      },
    });
  };
  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <Globe className="w-4 h-4" />
        <span className="text-xl">{currentLanguage.flag}</span>
        <span className="hidden sm:inline text-sm font-medium">{currentLanguage.name}</span>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-2 z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${locale === lang.code ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
            >
              <span className="text-xl">{lang.flag}</span>
              <span className="text-sm font-medium">{lang.name}</span>
              {locale === lang.code && (
                <span className="ml-auto text-blue-600 dark:text-blue-400">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}