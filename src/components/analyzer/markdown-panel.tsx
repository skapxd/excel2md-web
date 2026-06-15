import { Bot, Check, Copy, Download } from 'lucide-react';
import { useState } from 'react';
import { useCopyFeedback } from '@/hooks/use-copy-feedback';
import { useMarkdownDocument } from '@/hooks/use-markdown-document';
import { useWorkbookStore } from '@/hooks/use-workbook-store';
import { buildAgentPrompt } from '@/lib/markdown/build-agent-prompt';
import { downloadTextFile } from '@/lib/download-text-file';
import type { MarkdownOptions } from '@/lib/markdown/types';

const OPTION_FIELDS: { key: keyof MarkdownOptions; label: string; hint: string }[] = [
  { hint: 'Cada celda calculada muestra su fórmula: 42 (=A1+B1)', key: 'formulas', label: 'Mostrar fórmulas' },
  { hint: 'Mapa inicial de qué celdas dependen de cuáles', key: 'deps', label: 'Resumen de dependencias' },
  { hint: 'Texto formateado (1.00%, Abr-24) en vez del valor crudo', key: 'excelFormat', label: 'Formato de Excel' },
  { hint: 'Comentarios HTML con la coordenada de cada celda (útil para IA)', key: 'cellRefs', label: 'Referencias de celda ocultas' },
];

/**
 * ## Panel de salida Markdown
 *
 * Centraliza las tres salidas del análisis: vista previa legible, Markdown
 * crudo y prompt copiable para otro agente, manteniendo las opciones de
 * serialización al lado del resultado.
 *
 * ```ts
 * MarkdownPanel()
 * // workbook -> opciones -> markdown/html -> copiar, descargar o previsualizar
 * ```
 */
export function MarkdownPanel() {
  const session = useWorkbookStore();
  const doc = useMarkdownDocument(session.workbook);
  const feedback = useCopyFeedback();
  const [view, setView] = useState<'preview' | 'raw'>('preview');

  const markdownText = doc.markdown.ok ? doc.markdown.value : '';
  const downloadName = session.fileName.replace(/\.(xlsx|xlsm)$/i, '') + '.md';

  return (
    <div className="w-full lg:grid lg:grid-cols-[24rem_minmax(0,1fr)] lg:items-start lg:gap-6">
      <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-[#202124] lg:sticky lg:top-6">
        <h3 className="font-semibold text-slate-900 dark:text-white">Markdown listo para otro agente</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Copia el contenido del Excel en un formato que cualquier IA entiende: con fórmulas
          visibles y mapa de dependencias incluido.
        </p>

        <fieldset className="mt-4">
          <div className="grid gap-3">
            {OPTION_FIELDS.map((field) => (
              <label key={field.key} className="flex cursor-pointer items-start gap-2">
                <input
                  type="checkbox"
                  checked={doc.options[field.key]}
                  onChange={() => doc.toggleOption(field.key)}
                  className="mt-1 h-4 w-4 accent-emerald-600"
                />
                <span>
                  <span className="block text-sm font-medium text-slate-800 dark:text-slate-200">{field.label}</span>
                  <span className="block text-xs text-slate-500 dark:text-slate-400">{field.hint}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-5 flex flex-col gap-2">
          <button
            onClick={() => void feedback.copy('markdown', markdownText)}
            className="flex items-center justify-center gap-2 rounded-lg bg-[#107c41] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0b5c30]"
          >
            {feedback.copiedKey === 'markdown' && <Check className="h-4 w-4" aria-hidden="true" />}
            {feedback.copiedKey !== 'markdown' && <Copy className="h-4 w-4" aria-hidden="true" />}
            {feedback.copiedKey === 'markdown' ? 'Copiado' : 'Copiar Markdown'}
          </button>
          <button
            onClick={() => void feedback.copy('prompt', buildAgentPrompt(session.fileName, markdownText))}
            className="flex items-center justify-center gap-2 rounded-lg bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700"
          >
            {feedback.copiedKey === 'prompt' && <Check className="h-4 w-4" aria-hidden="true" />}
            {feedback.copiedKey !== 'prompt' && <Bot className="h-4 w-4" aria-hidden="true" />}
            {feedback.copiedKey === 'prompt' ? 'Copiado' : 'Copiar como prompt para IA'}
          </button>
          <button
            onClick={() => downloadTextFile(downloadName, markdownText)}
            className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-[#43464c] dark:bg-[#2a2c30] dark:text-slate-200 dark:hover:bg-[#33363b]"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Descargar .md
          </button>
          {feedback.errorMessage && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {feedback.errorMessage}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 lg:mt-0">
        {!doc.markdown.ok && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {doc.markdown.error.message}
          </p>
        )}

        {doc.markdown.ok && (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-[#3c3f44] dark:bg-[#1a1b1e]">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2 dark:border-[#3c3f44] dark:bg-[#202124]">
              <p className="font-mono text-xs text-slate-500 dark:text-slate-400">{downloadName}</p>
              <div className="inline-flex rounded-lg border border-slate-300 bg-white p-0.5 text-sm dark:border-[#43464c] dark:bg-[#2a2c30]">
                <button
                  onClick={() => setView('preview')}
                  className={`rounded-md px-3 py-1 font-medium ${view === 'preview' ? 'bg-[#107c41] text-white' : 'text-slate-600 dark:text-slate-300'}`}
                >
                  Vista previa
                </button>
                <button
                  onClick={() => setView('raw')}
                  className={`rounded-md px-3 py-1 font-medium ${view === 'raw' ? 'bg-[#107c41] text-white' : 'text-slate-600 dark:text-slate-300'}`}
                >
                  Markdown
                </button>
              </div>
            </div>
            {view === 'preview' && (
              <div
                className="markdown-body max-h-[70vh] overflow-auto bg-white p-6"
                dangerouslySetInnerHTML={{ __html: doc.html }}
              />
            )}
            {view === 'raw' && (
              <pre className="max-h-[70vh] overflow-auto p-6 text-xs leading-relaxed text-slate-800 dark:text-slate-200">
                <code>{markdownText}</code>
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
