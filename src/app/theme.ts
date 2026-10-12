import { useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/schema';

export type Theme = 'system' | 'light' | 'dark';

export function useTheme(): [Theme, (t: Theme) => Promise<void>] {
  const stored = useLiveQuery(() => db.settings.get('theme'), []);
  const theme = ((stored?.value as Theme | undefined) ?? 'system') as Theme;

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', theme);
  }, [theme]);

  const setTheme = async (t: Theme) => {
    await db.settings.put({ key: 'theme', value: t });
  };
  return [theme, setTheme];
}
