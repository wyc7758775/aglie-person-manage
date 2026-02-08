'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Locale, LanguageContextType } from './types';
import { zhCN, enUS, jaJP } from './dictionary';

const dictionaries: Record<Locale, Record<string, unknown>> = {
  'zh-CN': zhCN,
  'en-US': enUS,
  'ja-JP': jaJP,
};

const STORAGE_KEY = 'user-locale';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('zh-CN');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && (stored === 'zh-CN' || stored === 'en-US' || stored === 'ja-JP')) {
      setLocaleState(stored as Locale);
    } else {
      const browserLang = navigator.language;
      if (browserLang.startsWith('zh')) {
        setLocaleState('zh-CN');
      } else if (browserLang.startsWith('en')) {
        setLocaleState('en-US');
      } else if (browserLang.startsWith('ja')) {
        setLocaleState('ja-JP');
      }
      localStorage.setItem(STORAGE_KEY, locale);
    }
    setIsInitialized(true);
  }, [locale]);

  useEffect(() => {
    if (!isInitialized) return;

    const syncToDatabase = async () => {
      try {
        await fetch('/api/user/preference', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ locale }),
        });
      } catch (error) {
        console.error('Failed to sync locale to database:', error);
      }
    };

    const token = document.cookie.includes('auth-token');
    if (token) {
      syncToDatabase();
    }
  }, [locale, isInitialized]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(STORAGE_KEY, newLocale);
    window.location.reload();
  };

  const t = (key: string, params?: Record<string, string>): string => {
    const keys = key.split('.');
    let result: unknown = dictionaries[locale];

    for (const k of keys) {
      result = (result as Record<string, unknown>)?.[k];
    }

    if (typeof result !== 'string') {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }

    if (params) {
      return Object.entries(params).reduce(
        (str, [placeholder, value]) => str.replace(`{${placeholder}}`, value),
        result
      );
    }

    return result;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
