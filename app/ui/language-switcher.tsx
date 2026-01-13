'use client';

import { useLanguage } from '@/app/lib/i18n';

interface LanguageSwitcherProps {
  value: string;
  onChange: (value: string) => void;
}

export default function LanguageSwitcher({ value, onChange }: LanguageSwitcherProps) {
  const { setLocale } = useLanguage();

  const languages = [
    { value: 'zh-CN', label: '中文' },
    { value: 'en-US', label: 'English' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value as 'zh-CN' | 'en-US';
    onChange(newLocale);
    setLocale(newLocale);
  };

  return (
    <select
      value={value}
      onChange={handleChange}
      className="block w-48 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
    >
      {languages.map((lang) => (
        <option key={lang.value} value={lang.value}>
          {lang.label}
        </option>
      ))}
    </select>
  );
}
