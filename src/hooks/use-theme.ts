import { useCallback, useEffect, useState } from 'react';
import { authStorage } from './auth-storage';

export type ThemePreference = 'light' | 'dark' | 'system';

function getThemeStorageKey() {
  const userId = authStorage.getUserId();
  return `theme:${userId ?? 'guest'}`;
}

function applyTheme(theme: ThemePreference) {
  const root = document.documentElement;

  if (theme === 'system') {
    root.removeAttribute('data-theme');
    return;
  }

  root.setAttribute('data-theme', theme);
}

function readStoredTheme(storageKey: string): ThemePreference {
  const stored = localStorage.getItem(storageKey);
  return stored === 'light' || stored === 'dark' ? stored : 'system';
}

function useTheme() {
  const [theme, setThemeState] = useState<ThemePreference>(() =>
    readStoredTheme(getThemeStorageKey())
  );

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = useCallback((next: ThemePreference) => {
    const storageKey = getThemeStorageKey();

    if (next === 'system') {
      localStorage.removeItem(storageKey);
    } else {
      localStorage.setItem(storageKey, next);
    }
    setThemeState(next);
  }, []);

  return { theme, setTheme };
}

export { useTheme };
