import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  LocateFixed,
  MousePointerClick,
  X,
} from 'lucide-react';
import { DependencyTree } from '@/components/analyzer/dependency-tree';
import { IconTextRow } from '@/components/analyzer/icon-text-row';
import { useWorkbookStore } from '@/hooks/use-workbook-store';
import type { CellRelations } from '@/lib/grid/types';

type Props = {
  onClose: () => void;
  relations: CellRelations;
  sheetName: string;
};

const LEGEND_ITEMS = [
  { colorClass: 'bg-[#9fd8b6]', label: 'Celda con fórmula' },
  { colorClass: 'bg-[#7eb3e3]', label: 'Alimenta a la celda seleccionada' },
  { colorClass: 'bg-[#eccb62]', label: 'Usa la celda seleccionada' },
  { colorClass: 'bg-[#e89a9a]', label: 'Referencia circular' },
];

export function CellDetails({ onClose, relations, sheetName }: Props) {
  const session = useWorkbookStore();
  const ownPrefix = `${sheetName}!`;

  return (
    <div className="flex max-h-[60vh] flex-col overflow-hidden rounded-xl border border-slate-200 bg-[rgb(var(--panel-bg)/var(--panel-alpha))] shadow-2xl backdrop-blur dark:border-[#43464c]">
      <div className="flex items-center justify-end border-b border-slate-200 bg-[rgb(var(--panel-bg)/var(--panel-alpha))] px-3 py-2 dark:border-[#2b2f37]">
        <button
          type="button"
          onClick={onClose}
          title="Cerrar panel de dependencias"
          aria-label="Cerrar panel de dependencias"
          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-300 dark:hover:bg-[#2b2f37] dark:hover:text-white"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <div className="overflow-y-auto overscroll-contain p-4">
        {!relations.selectedId && (
          <IconTextRow
            as="p"
            icon={MousePointerClick}
            iconClassName="h-4 w-4 shrink-0 text-[#107c41] dark:text-[#6ee7a0]"
          >
            Haz clic en cualquier celda de la hoja para ver de dónde sale su valor.
          </IconTextRow>
        )}

        {relations.selectedId && (
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => relations.selectedId && session.jumpTo(relations.selectedId)}
                title="Volver a la celda de origen"
                className="flex items-center gap-1.5 rounded-md bg-[#107c41] px-2.5 py-1 font-mono text-sm font-bold text-white transition hover:bg-[#0b5c30]"
              >
                <LocateFixed className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {relations.selectedId}
              </button>
              {relations.formula && (
                <code className="min-w-0 truncate font-mono text-xs text-slate-400">
                  ={relations.formula}
                </code>
              )}
            </div>

            {relations.cycleCells.has(relations.selectedId) && (
              <p className="mt-3 flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                Esta celda forma parte de una referencia circular: su valor depende, en cadena, de
                sí mismo.
              </p>
            )}

            {relations.precedentTree.length > 0 && (
              <div className="mt-4">
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                  Se calcula a partir de
                </p>
                <div className="group mt-2" data-tone="precedent">
                  <DependencyTree nodes={relations.precedentTree} />
                </div>
              </div>
            )}

            {relations.dependentTree.length > 0 && (
              <div className="mt-4">
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  Su valor se usa en
                </p>
                <div className="group mt-2" data-tone="dependent">
                  <DependencyTree nodes={relations.dependentTree} />
                </div>
              </div>
            )}

            {!relations.formula && relations.dependentTree.length === 0 && (
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                Esta celda es un dato suelto: no tiene fórmula y ninguna fórmula la usa.
              </p>
            )}

            {/* Leyenda informativa (no interactiva): puntos de color, no checkboxes */}
            <details className="mt-4 border-t border-slate-100 pt-2 dark:border-[#2b2f37]">
              <summary className="cursor-pointer list-none text-[11px] font-semibold uppercase tracking-wide text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 [&::-webkit-details-marker]:hidden">
                ¿Qué significan los colores?
              </summary>
              <ul className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                {LEGEND_ITEMS.map((item) => (
                  <li key={item.label} className="flex items-center gap-2">
                    <span
                      className={`inline-block h-2.5 w-2.5 rounded-full ${item.colorClass}`}
                    />
                    {item.label}
                  </li>
                ))}
              </ul>
              <p className="mt-1.5 text-[11px] text-slate-400">
                Los tonos más claros marcan niveles más profundos de la cadena.
              </p>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}
