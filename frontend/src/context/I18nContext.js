import React, { createContext, useContext, useMemo, useState } from 'react';
import en from '../i18n/en.json';
import es from '../i18n/es.json';

const dictionaries = { en, es };

const I18nContext = createContext({
  lang: 'en',
  t: (key) => key,
  setLang: () => {}
});

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'en');

  const value = useMemo(() => {
    const dict = dictionaries[lang] || dictionaries.en;
    function t(key, vars = {}) {
      const raw = key.split('.').reduce((acc, k) => (acc ? acc[k] : undefined), dict) || key;
      return Object.entries(vars).reduce((s, [k, v]) => s.replaceAll(`{${k}}`, String(v)), raw);
    }
    localStorage.setItem('lang', lang);
    return { lang, setLang, t };
  }, [lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}