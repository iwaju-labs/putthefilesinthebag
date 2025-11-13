'use client';

import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [isDark, setIsDark] = useState(() => {
    // Only run on client-side
    if (globalThis.window === undefined) return false;
    
    const savedTheme = globalThis.localStorage?.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return globalThis.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Persist theme changes
  useEffect(() => {
    globalThis.localStorage?.setItem('theme', isDark ? 'dark' : 'light');
    globalThis.document?.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const value = useMemo(() => ({ isDark, toggleTheme }), [isDark]);

  return (
    <ThemeContext.Provider value={value}>
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
