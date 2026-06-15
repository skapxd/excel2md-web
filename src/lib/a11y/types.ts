export type ThemeMode = 'light' | 'dark' | 'system';

export type A11ySettings = {
  /** Tema: claro, oscuro, o el que dicte el sistema operativo. */
  theme: ThemeMode;
  /** Qué tanto se ensombrece el resto de la hoja al seleccionar (0 = nada, 0.8 = mucho). */
  dimming: number;
  /** Opacidad del fondo del panel flotante (0.6 a 1). */
  panelAlpha: number;
  gridFont: 'normal' | 'grande' | 'extra';
};

export const A11Y_PERCENT_FACTOR = 100;
export const A11Y_DIMMING_MIN = 0;
export const A11Y_DIMMING_MAX = 0.8;
export const A11Y_PANEL_ALPHA_MIN = 0.6;
export const A11Y_PANEL_ALPHA_MAX = 1;

export const DEFAULT_A11Y_SETTINGS: A11ySettings = {
  dimming: 0.65,
  gridFont: 'normal',
  panelAlpha: 0.95,
  theme: 'system',
};

export const A11Y_STORAGE_KEY = 'excel2md-a11y-settings';
