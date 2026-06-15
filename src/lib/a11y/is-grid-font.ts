import type { A11ySettings } from '@/lib/a11y/types';

export function isGridFont(value: unknown): value is A11ySettings['gridFont'] {
  return value === 'normal' || value === 'grande' || value === 'extra';
}
