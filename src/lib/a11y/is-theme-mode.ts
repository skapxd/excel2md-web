import type { ThemeMode } from '@/lib/a11y/types';

export function isThemeMode(value: unknown): value is ThemeMode {
  return value === 'light' || value === 'dark' || value === 'system';
}
