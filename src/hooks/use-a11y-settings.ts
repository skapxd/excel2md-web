import { useEffect, useRef, useState } from 'react';
import { applyA11ySettings } from '@/lib/a11y/apply-a11y-settings';
import { isDarkTheme } from '@/lib/a11y/is-dark-theme';
import { loadA11ySettings } from '@/lib/a11y/load-a11y-settings';
import { runThemeTransition } from '@/lib/a11y/run-theme-transition';
import { A11Y_STORAGE_KEY, DEFAULT_A11Y_SETTINGS } from '@/lib/a11y/types';
import type { A11ySettings } from '@/lib/a11y/types';

export type A11ySettingsApi = {
  settings: A11ySettings;
  update: (partial: Partial<A11ySettings>) => void;
  reset: () => void;
};

export function useA11ySettings(): A11ySettingsApi {
  const [settings, setSettings] = useState<A11ySettings>(() => loadA11ySettings());
  const previousDark = useRef(isDarkTheme(settings.theme));

  useEffect(() => {
    const apply = (): void => {
      applyA11ySettings(settings);
      localStorage.setItem(A11Y_STORAGE_KEY, JSON.stringify(settings));
    };
    const dark = isDarkTheme(settings.theme);
    const darkChanged = previousDark.current !== dark;
    previousDark.current = dark;
    if (darkChanged) {
      void runThemeTransition(apply);
    } else {
      apply();
    }

    // En modo "sistema", reaccionar en vivo cuando el OS cambia de tema.
    if (settings.theme !== 'system') return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onSystemChange = (): void => {
      previousDark.current = media.matches;
      void runThemeTransition(apply);
    };
    media.addEventListener('change', onSystemChange);
    return () => media.removeEventListener('change', onSystemChange);
  }, [settings]);

  const update = (partial: Partial<A11ySettings>): void =>
    setSettings((prev) => ({ ...prev, ...partial }));

  const reset = (): void => setSettings(DEFAULT_A11Y_SETTINGS);

  return { reset, settings, update };
}
