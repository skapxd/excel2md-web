import { match } from 'ts-pattern';
import type { ThemeMode } from '@/lib/a11y/types';

/** Resuelve el tema efectivo: `system` delega en `prefers-color-scheme` del OS. */
export function isDarkTheme(theme: ThemeMode): boolean {
  return match(theme)
    .with('dark', () => true)
    .with('light', () => false)
    .with('system', () => typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    .exhaustive();
}
