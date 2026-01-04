import { usePage } from '@inertiajs/react';
export default function useTranslation() {
  const { translations } = usePage().props as any;
  const t = (key: string, replacements: { [key: string]: string | number } = {}) => {
    let translation = translations[key] || key;
    Object.keys(replacements).forEach(placeholder => {
      translation = translation.replace(`:${placeholder}`, String(replacements[placeholder]));
    });
    return translation;
  };
  return { t };
}