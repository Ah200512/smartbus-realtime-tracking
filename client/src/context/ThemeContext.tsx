import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  themeMode: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  return 'dark';
}

function hydrateThemeMode(): ThemeMode {
  try {
    const saved = localStorage.getItem('smartbus_theme_mode');
    if (saved === 'light' || saved === 'dark' || saved === 'system') return saved;
    // Migrate from old theme key
    const oldTheme = localStorage.getItem('smartbus_theme');
    if (oldTheme === 'light' || oldTheme === 'dark') return oldTheme;
  } catch { /* ignore */ }
  return 'dark';
}

function applyTheme(resolved: 'light' | 'dark') {
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(resolved);
  // Also keep backward compat with old toggle
  root.classList.toggle('dark', resolved === 'dark');
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(hydrateThemeMode);
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => {
    const mode = hydrateThemeMode();
    return mode === 'system' ? getSystemTheme() : mode;
  });

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem('smartbus_theme_mode', mode);
    // Also keep backward compat
    const resolved = mode === 'system' ? getSystemTheme() : mode;
    localStorage.setItem('smartbus_theme', resolved);
    setResolvedTheme(resolved);
    applyTheme(resolved);
  }, []);

  // Listen for system theme changes when mode is 'system'
  useEffect(() => {
    if (themeMode !== 'system') return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      const resolved = e.matches ? 'dark' : 'light';
      setResolvedTheme(resolved);
      applyTheme(resolved);
      localStorage.setItem('smartbus_theme', resolved);
    };
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [themeMode]);

  // Apply theme on initial mount
  useEffect(() => {
    applyTheme(resolvedTheme);
  }, []);

  return (
    <ThemeContext.Provider value={{ themeMode, resolvedTheme, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
