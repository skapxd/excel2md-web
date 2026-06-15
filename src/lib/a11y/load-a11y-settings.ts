import { trySafe } from '@skapxd/result';
import { match } from 'ts-pattern';
import { clampNumber } from '@/lib/a11y/clamp-number';
import { isGridFont } from '@/lib/a11y/is-grid-font';
import { isObjectRecord } from '@/lib/a11y/is-object-record';
import { isThemeMode } from '@/lib/a11y/is-theme-mode';
import { reportDomainError } from '@/lib/errors/report-domain-error';
import { A11Y_STORAGE_KEY, DEFAULT_A11Y_SETTINGS } from '@/lib/a11y/types';
import type { A11ySettings, ThemeMode } from '@/lib/a11y/types';

export function loadA11ySettings(): A11ySettings {
  const lacksBrowserStorage = typeof localStorage === 'undefined';
  if (lacksBrowserStorage) return DEFAULT_A11Y_SETTINGS;
  const raw = localStorage.getItem(A11Y_STORAGE_KEY);
  if (!raw) return DEFAULT_A11Y_SETTINGS;
  const parsed = trySafe((): unknown => JSON.parse(raw));
  if (!parsed.ok) {
    reportDomainError('No se pudieron leer las preferencias de accesibilidad guardadas.', parsed.error);
    return DEFAULT_A11Y_SETTINGS;
  }
  if (!isObjectRecord(parsed.value)) return DEFAULT_A11Y_SETTINGS;

  // Migración del formato viejo (`darkMode: boolean`) al nuevo (`theme`).
  const storedTheme = parsed.value.theme;
  const legacyTheme: ThemeMode = parsed.value.darkMode === true ? 'dark' : 'light';
  const theme = isThemeMode(storedTheme)
    ? storedTheme
    : match(parsed.value.darkMode)
        .with(undefined, () => 'system' as const)
        .otherwise(() => legacyTheme);
  const gridFont = isGridFont(parsed.value.gridFont)
    ? parsed.value.gridFont
    : DEFAULT_A11Y_SETTINGS.gridFont;

  return {
    dimming: clampNumber(parsed.value.dimming, DEFAULT_A11Y_SETTINGS.dimming, 0, 0.8),
    gridFont,
    panelAlpha: clampNumber(parsed.value.panelAlpha, DEFAULT_A11Y_SETTINGS.panelAlpha, 0.6, 1),
    theme,
  };
}
