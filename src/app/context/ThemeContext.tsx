import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const STORAGE_KEY = 'portfolio-theme';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Reads the theme the inline script in index.html already applied before first
 * paint, so React never disagrees with what is on screen.
 *
 * The previous version hardcoded `useState('dark')` and wrote that value to
 * localStorage on mount. That meant the pre-paint script's choice was thrown
 * away on every load, everyone was pinned to dark regardless of their system
 * setting, and the "no preference yet" state was destroyed the first time the
 * page was opened.
 */
function readInitialTheme(): Theme {
  if (typeof document === 'undefined') return 'light';

  const applied = document.documentElement.getAttribute('data-theme');
  if (applied === 'light' || applied === 'dark') return applied;

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    /* Storage can be blocked; fall through to the system preference. */
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readInitialTheme);

  /* Apply to the document, and remember the choice. */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* Not fatal — the theme still applies for this session. */
    }
  }, [theme]);

  /* Follow the system if the visitor has never chosen for themselves. */
  useEffect(() => {
    let chosen = false;
    try {
      chosen = localStorage.getItem(STORAGE_KEY) !== null;
    } catch {
      chosen = true;
    }
    if (chosen) return;

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e: MediaQueryListEvent) => setThemeState(e.matches ? 'dark' : 'light');
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  const setTheme = useCallback((next: Theme) => setThemeState(next), []);
  const toggleTheme = useCallback(
    () => setThemeState((prev) => (prev === 'light' ? 'dark' : 'light')),
    [],
  );

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
