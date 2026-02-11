'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface ThemeConfig {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export const defaultTheme: ThemeConfig = {
  primary: '#f97316',      // orange-500 - 与登录界面提示框颜色一致
  primaryLight: '#fb923c', // orange-400
  primaryDark: '#ea580c',  // orange-600
  secondary: '#6b7280',    // gray-500
  secondaryLight: '#9ca3af', // gray-400
  secondaryDark: '#4b5563',  // gray-600
  success: '#10b981',      // emerald-500
  warning: '#f59e0b',      // amber-500
  error: '#ef4444',        // red-500
  info: '#3b82f6',         // blue-500
};

interface ThemeContextType {
  theme: ThemeConfig;
  setTheme: (theme: ThemeConfig) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children, initialTheme = defaultTheme }: { children: ReactNode; initialTheme?: ThemeConfig }) {
  const [theme, setTheme] = useState<ThemeConfig>(initialTheme);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
