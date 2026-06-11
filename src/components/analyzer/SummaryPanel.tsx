import { AlertTriangle, Hash, Layers, RefreshCw, Shuffle, Sigma, Tag, Target } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { WorkbookAnalysis } from '@/lib/analyze/types';

type Props = {
  analysis: WorkbookAnalysis;
  onInspect: (id: string) => void;
};

export function SummaryPanel({ analysis, onInspect }: Props) {
  const stats: { accent: string; icon: LucideIcon; iconColor: string; label: string; value: number }[] = [
    { accent: 'border-l-[#107c41]', icon: Layers, iconColor: 'text-[#107c41]', label: 'Hojas', value: analysis.stats.sheetCount },
    { accent: 'border-l-sky-500', icon: Hash, iconColor: 'text-sky-500', label: 'Celdas con datos', value: analysis.stats.nonEmptyCells },
    { accent: 'border-l-emerald-500', icon: Sigma, iconColor: 'text-emerald-500', label: 'Fórmulas', value: analysis.stats.formulaCount },
    { accent: 'border-l-violet-500', icon: Shuffle, iconColor: 'text-violet-500', label: 'Referencias entre hojas', value: analysis.stats.crossSheetRefs },
    { accent: 'border-l-amber-500', icon: Tag, iconColor: 'text-amber-500', label: 'Rangos con nombre', value: analysis.stats.namedRanges },
    { accent: 'border-l-red-500', icon: RefreshCw, iconColor: 'text-red-500', label: 'Dependencias circulares', value: analysis.cycles.length },
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-xl border-l-4 bg-white p-5 shadow-sm transition hover:shadow-md dark:bg-[#202124] ${stat.accent}`}
          >
            <p className="flex items-center gap-2 text-3xl font-bold text-slate-900 dark:text-white">
              <stat.icon className={`h-6 w-6 ${stat.iconColor}`} aria-hidden="true" />
              {stat.value}
            </p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {analysis.cycles.length > 0 && (
        <div className="mt-6 rounded-xl border border-amber-300 bg-amber-50 p-5 dark:border-amber-600 dark:bg-amber-950">
          <h3 className="flex items-center gap-2 font-semibold text-amber-900 dark:text-amber-200">
            <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            Dependencias circulares detectadas
          </h3>
          <p className="mt-1 text-sm text-amber-800">
            Estas celdas se referencian en círculo; suelen ser errores en el libro. Haz clic en
            una celda para verla en la hoja:
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {analysis.cycles.map((cycle) => (
              <li key={cycle.join('>')} className="flex flex-wrap items-center gap-1">
                {cycle.map((id, index) => (
                  <span key={`${id}-${index}`} className="flex items-center gap-1">
                    <button
                      onClick={() => onInspect(id)}
                      className="rounded border border-red-200 bg-white px-2 py-0.5 font-mono text-red-800 hover:bg-red-100"
                    >
                      {id}
                    </button>
                    {index < cycle.length - 1 && <span className="text-amber-700">→</span>}
                  </span>
                ))}
              </li>
            ))}
          </ul>
        </div>
      )}

      {analysis.topReferenced.length > 0 && (
        <div className="mt-6 rounded-xl bg-white p-5 shadow-sm dark:bg-[#202124]">
          <h3 className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
            <Target className="h-4 w-4 text-red-500" aria-hidden="true" />
            Celdas críticas
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Las celdas o rangos más usados por otras fórmulas. Si cambias una de estas, el efecto
            se propaga por todo el libro. Haz clic para verla en la hoja.
          </p>
          <ul className="mt-3 divide-y divide-slate-100 dark:divide-[#3c3f44]">
            {analysis.topReferenced.map((entry) => (
              <li key={entry.id}>
                <button
                  onClick={() => onInspect(entry.id)}
                  className="flex w-full items-center justify-between py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-[#2e3034]"
                >
                  <span className="font-mono text-slate-800 dark:text-slate-200">{entry.id}</span>
                  <span className="rounded-full bg-emerald-100 px-3 py-0.5 font-semibold text-emerald-800">
                    {entry.count} referencia(s)
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {analysis.stats.formulaCount === 0 && (
        <p className="mt-6 rounded-xl bg-white p-5 text-sm text-slate-500 shadow-sm dark:bg-[#202124] dark:text-slate-400">
          Este libro no tiene fórmulas: es solo datos. La pestaña “Markdown para IA” te da el
          contenido listo para copiar.
        </p>
      )}
    </div>
  );
}
