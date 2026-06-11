import { trySafe } from '@skapxd/result';
import { reportDomainError } from '@/lib/errors/report-domain-error';
import { A11Y_STORAGE_KEY, DEFAULT_A11Y_SETTINGS } from '@/lib/a11y/types';
import type { A11ySettings } from '@/lib/a11y/types';

type StoredSettings = Partial<A11ySettings> & { darkMode?: boolean };

export function loadA11ySettings(): A11ySettings {
  if (typeof localStorage === 'undefined') return DEFAULT_A11Y_SETTINGS;
  const raw = localStorage.getItem(A11Y_STORAGE_KEY);
  if (!raw) return DEFAULT_A11Y_SETTINGS;
  const parsed = trySafe(() => JSON.parse(raw) as StoredSettings);
  if (!parsed.ok) {
    reportDomainError('No se pudieron leer las preferencias de accesibilidad guardadas.', parsed.error);
    return DEFAULT_A11Y_SETTINGS;
  }

  // Migración del formato viejo (`darkMode: boolean`) al nuevo (`theme`).
  const legacyTheme = parsed.value.darkMode === true ? 'dark' : 'light';
  const theme = parsed.value.theme ?? (parsed.value.darkMode === undefined ? 'system' : legacyTheme);

  return {
    dimming: parsed.value.dimming ?? DEFAULT_A11Y_SETTINGS.dimming,
    gridFont: parsed.value.gridFont ?? DEFAULT_A11Y_SETTINGS.gridFont,
    panelAlpha: parsed.value.panelAlpha ?? DEFAULT_A11Y_SETTINGS.panelAlpha,
    theme,
  };
}
