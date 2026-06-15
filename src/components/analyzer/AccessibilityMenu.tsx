import { Accessibility, Blend, Monitor, Moon, RotateCcw, Sun, SunDim, Type, X } from 'lucide-react';
import { usePopover } from '@/hooks/use-popover';
import {
  A11Y_DIMMING_MAX,
  A11Y_DIMMING_MIN,
  A11Y_PANEL_ALPHA_MAX,
  A11Y_PANEL_ALPHA_MIN,
  A11Y_PERCENT_FACTOR,
} from '@/lib/a11y/types';
import type { CSSProperties } from 'react';
import type { LucideIcon } from 'lucide-react';
import type { A11ySettings, ThemeMode } from '@/lib/a11y/types';
import type { A11ySettingsApi } from '@/hooks/use-a11y-settings';

type Props = {
  api: A11ySettingsApi;
};

type RangeFillStyle = CSSProperties & { '--range-fill': string };

const THEME_OPTIONS: { value: ThemeMode; label: string; icon: LucideIcon }[] = [
  { icon: Sun, label: 'Claro', value: 'light' },
  { icon: Moon, label: 'Oscuro', value: 'dark' },
  { icon: Monitor, label: 'Sistema', value: 'system' },
];

const FONT_OPTIONS: { value: A11ySettings['gridFont']; label: string; sample: string }[] = [
  { label: 'Normal', sample: 'text-xs', value: 'normal' },
  { label: 'Grande', sample: 'text-sm', value: 'grande' },
  { label: 'Extra', sample: 'text-base', value: 'extra' },
];

const DIMMING_SLIDER_MIN = A11Y_DIMMING_MIN * A11Y_PERCENT_FACTOR;
const DIMMING_SLIDER_MAX = A11Y_DIMMING_MAX * A11Y_PERCENT_FACTOR;
const PANEL_ALPHA_SLIDER_MIN = A11Y_PANEL_ALPHA_MIN * A11Y_PERCENT_FACTOR;
const PANEL_ALPHA_SLIDER_MAX = A11Y_PANEL_ALPHA_MAX * A11Y_PERCENT_FACTOR;

export function AccessibilityMenu({ api }: Props) {
  const popover = usePopover();
  const dimmingPct = Math.round(api.settings.dimming * A11Y_PERCENT_FACTOR);
  const panelPct = Math.round(api.settings.panelAlpha * A11Y_PERCENT_FACTOR);
  const dimmingFill = ((dimmingPct - DIMMING_SLIDER_MIN) / (DIMMING_SLIDER_MAX - DIMMING_SLIDER_MIN)) * A11Y_PERCENT_FACTOR;
  const panelFill =
    ((panelPct - PANEL_ALPHA_SLIDER_MIN) / (PANEL_ALPHA_SLIDER_MAX - PANEL_ALPHA_SLIDER_MIN)) * A11Y_PERCENT_FACTOR;
  const dimmingRangeStyle: RangeFillStyle = { '--range-fill': `${dimmingFill}%` };
  const panelRangeStyle: RangeFillStyle = { '--range-fill': `${panelFill}%` };

  return (
    <div ref={popover.containerRef} className="relative shrink-0">
      <button
        onClick={popover.toggle}
        aria-expanded={popover.open}
        aria-label="Opciones de accesibilidad"
        title="Accesibilidad"
        className="flex items-center gap-1 rounded-md border border-white/40 bg-white/10 px-2.5 py-1.5 text-xs font-bold text-white transition hover:bg-white/25"
      >
        <Accessibility className="h-4 w-4" aria-hidden="true" />
        Aa
      </button>

      {popover.open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-[#43464c] dark:bg-[#202124]">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <Accessibility className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
              Accesibilidad
            </p>
            <button
              onClick={popover.close}
              aria-label="Cerrar"
              className="rounded p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-[#2e3034] dark:hover:text-slate-200"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          {/* Tema: claro / oscuro / según el sistema operativo */}
          <div className="mt-5">
            <span className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              <Moon className="h-4 w-4 text-slate-400" aria-hidden="true" />
              Tema
            </span>
            <div className="mt-2 grid grid-cols-3 gap-1 rounded-lg bg-slate-100 p-1 dark:bg-[#2a2c30]">
              {THEME_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => api.update({ theme: option.value })}
                  aria-pressed={api.settings.theme === option.value}
                  className={`flex flex-col items-center gap-1 rounded-md px-2 py-1.5 transition ${
                    api.settings.theme === option.value
                      ? 'bg-white font-bold text-[#0b5c30] shadow-sm dark:bg-[#3a3d42] dark:text-[#4ade80]'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <option.icon className="h-4 w-4" aria-hidden="true" />
                  <span className="text-[10px]">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Atenuación: slider con pista rellena */}
          <label className="mt-5 block">
            <span className="flex items-center justify-between text-sm font-medium text-slate-700 dark:text-slate-200">
              <span className="flex items-center gap-2">
                <SunDim className="h-4 w-4 text-slate-400" aria-hidden="true" />
                Atenuación al seleccionar
              </span>
              <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-[#0b5c30] dark:bg-[#2a2c30] dark:text-[#4ade80]">
                {dimmingPct}%
              </span>
            </span>
            <input
              type="range"
              min={DIMMING_SLIDER_MIN}
              max={DIMMING_SLIDER_MAX}
              value={dimmingPct}
              onChange={(event) => api.update({ dimming: Number(event.target.value) / A11Y_PERCENT_FACTOR })}
              className="a11y-range mt-2 w-full"
              style={dimmingRangeStyle}
            />
            <span className="text-xs text-slate-400">0% = la hoja nunca se ensombrece</span>
          </label>

          {/* Opacidad del panel: slider con pista rellena */}
          <label className="mt-4 block">
            <span className="flex items-center justify-between text-sm font-medium text-slate-700 dark:text-slate-200">
              <span className="flex items-center gap-2">
                <Blend className="h-4 w-4 text-slate-400" aria-hidden="true" />
                Opacidad del panel flotante
              </span>
              <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-[#0b5c30] dark:bg-[#2a2c30] dark:text-[#4ade80]">
                {panelPct}%
              </span>
            </span>
            <input
              type="range"
              min={PANEL_ALPHA_SLIDER_MIN}
              max={PANEL_ALPHA_SLIDER_MAX}
              value={panelPct}
              onChange={(event) => api.update({ panelAlpha: Number(event.target.value) / A11Y_PERCENT_FACTOR })}
              className="a11y-range mt-2 w-full"
              style={panelRangeStyle}
            />
          </label>

          {/* Tamaño del texto: segmented control */}
          <div className="mt-4">
            <span className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              <Type className="h-4 w-4 text-slate-400" aria-hidden="true" />
              Tamaño del texto de la hoja
            </span>
            <div className="mt-2 grid grid-cols-3 gap-1 rounded-lg bg-slate-100 p-1 dark:bg-[#2a2c30]">
              {FONT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => api.update({ gridFont: option.value })}
                  aria-pressed={api.settings.gridFont === option.value}
                  className={`flex flex-col items-center rounded-md px-2 py-1.5 transition ${
                    api.settings.gridFont === option.value
                      ? 'bg-white font-bold text-[#0b5c30] shadow-sm dark:bg-[#3a3d42] dark:text-[#4ade80]'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <span className={`${option.sample} font-serif leading-none`}>A</span>
                  <span className="mt-1 text-[10px]">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => api.reset()}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-[#43464c] dark:text-slate-300 dark:hover:bg-[#2e3034]"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Restablecer valores
          </button>
        </div>
      )}
    </div>
  );
}
