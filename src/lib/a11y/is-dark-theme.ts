import type { ThemeMode } from '@/lib/a11y/types';

/** Resuelve el tema efectivo: `system` delega en `prefers-color-scheme` del OS. */
export function isDarkTheme(theme: ThemeMode): boolean {
  if (theme === 'dark') return true;
  if (theme === 'light') return false;
  return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
}
