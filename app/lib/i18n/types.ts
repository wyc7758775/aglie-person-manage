export type Locale = 'zh-CN' | 'en-US';

export interface LanguagePreferences {
  locale: Locale;
  updatedAt: string;
}

export type NestedDictionary = Record<string, string | Record<string, unknown>>;

export interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string>) => string;
  isRtl?: boolean;
}
