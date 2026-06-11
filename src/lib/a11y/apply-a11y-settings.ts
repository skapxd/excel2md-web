import { isDarkTheme } from '@/lib/a11y/is-dark-theme';
import type { A11ySettings } from '@/lib/a11y/types';

const GRID_FONTS: Record<A11ySettings['gridFont'], string> = {
  extra: '1.125rem',
  grande: '1rem',
  normal: '0.875rem',
};

/** Traslada las preferencias a la raíz del documento (clase dark + variables CSS). */
export function applyA11ySettings(settings: A11ySettings): void {
  const root = document.documentElement;
  root.classList.toggle('dark', isDarkTheme(settings.theme));
  root.style.setProperty('--dim-opacity', String(1 - settings.dimming));
  root.style.setProperty('--panel-alpha', String(settings.panelAlpha));
  root.style.setProperty('--grid-font', GRID_FONTS[settings.gridFont]);
}
