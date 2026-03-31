'use client';
import { createContext, useContext, useState } from 'react';
import { getTranslations } from './index';

const LanguageContext = createContext(null);

export function LanguageProvider({ initialLang = 'hi', children }) {
  const [lang, setLang] = useState(initialLang);
  const t = getTranslations(lang);

  function changeLang(newLang) {
    setLang(newLang);
  }

  return (
    <LanguageContext.Provider value={{ lang, t, changeLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
