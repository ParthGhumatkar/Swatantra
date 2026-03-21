import en from './en';
import hi from './hi';
import mr from './mr';

const translations = { en, hi, mr };

export function getTranslations(lang = 'en') {
  return translations[lang] || translations.en;
}

export const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी' },
  { code: 'mr', name: 'मराठी' },
];
