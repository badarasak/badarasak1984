import { createContext, useContext, ReactNode } from 'react';
import { Language } from '../game/types';
import { translations } from './translations';

type TKey = keyof typeof translations.en;

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TKey) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => translations.en[key] ?? key,
});

export function LanguageProvider({
  children,
  language,
  setLanguage,
}: {
  children: ReactNode;
  language: Language;
  setLanguage: (lang: Language) => void;
}) {
  const t = (key: TKey) => translations[language][key] ?? translations.en[key] ?? key;
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
