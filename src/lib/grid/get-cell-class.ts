import type { CellRelations, GridCell } from '@/lib/grid/types';

type Args = {
  cell: GridCell;
  sheetName: string;
  relations: CellRelations;
  banded: boolean;
  /** Id cualificado del cursor (celda navegada), independiente del ancla del panel. */
  cursorId: string | null;
};

const BASE =
  'h-[calc(var(--grid-font)*2.1)] min-w-[4.5rem] max-w-[16rem] cursor-cell truncate whitespace-nowrap border border-[var(--cell-border)] px-2 text-[length:var(--grid-font)] text-[color:var(--cell-text)] transition hover:bg-[var(--cell-hover)]';

/** Atenuación "spotlight" parametrizable: lo que no participa en la cadena se ensombrece. */
const DIM = ' opacity-[var(--dim-opacity)] hover:opacity-100';

/**
 * ## Clase visual de celda
 *
 * Convierte las relaciones de fórmula en estados visuales compatibles con una
 * grilla tipo Excel: cursor, ancla, precedentes, dependientes, ciclos y celdas
 * atenuadas.
 *
 * ```ts
 * getCellClass({ cell, sheetName: 'Hoja1', relations, banded: false, cursorId: 'Hoja1!A1' })
 * // -> '... outline-[var(--accent)] ...'
 * ```
 */
export function getCellClass({ banded, cell, cursorId, relations, sheetName }: Args): string {
  const id = `${sheetName}!${cell.address}`;
  const align = cell.isNumber ? 'text-right' : 'text-left';
  const isCursorCell = id === cursorId;
  const isSelectedCell = id === relations.selectedId;
  const isDirectPrecedent = relations.precedentSet.has(id);
  const isDirectDependent = relations.dependentSet.has(id);
  const isDeepPrecedent = relations.precedentDeepSet.has(id);
  const isDeepDependent = relations.dependentDeepSet.has(id);
  const participatesInCycle = relations.cycleCells.has(id);
  const hasFormula = cell.formula.length > 0;

  let outline = '';
  if (isCursorCell) {
    outline = ' font-semibold outline-2 -outline-offset-2 outline-[var(--accent)]';
  }
  if (isSelectedCell) {
    outline = ' outline-2 -outline-offset-2 outline-dashed outline-[var(--accent)]';
  }

  const shouldDimUnrelatedCell = relations.selectedId !== null && outline === '';
  const dim = shouldDimUnrelatedCell ? DIM : '';

  const isSelectedDataCell = isSelectedCell && !isDirectPrecedent;
  if (isSelectedDataCell) {
    return `${BASE} ${align} bg-[var(--cell-bg)]${outline}`;
  }
  if (isDirectPrecedent) return `${BASE} ${align} bg-[var(--cell-precedent)]${outline}`;
  if (isDirectDependent) return `${BASE} ${align} bg-[var(--cell-dependent)]${outline}`;
  if (isDeepPrecedent) {
    return `${BASE} ${align} bg-[var(--cell-precedent-deep)]${outline}`;
  }
  if (isDeepDependent) {
    return `${BASE} ${align} bg-[var(--cell-dependent-deep)]${outline}`;
  }

  if (participatesInCycle) {
    return `${BASE} ${align} bg-[var(--cell-cycle-bg)] text-[color:var(--cell-cycle-text)]${outline}${dim}`;
  }
  if (hasFormula) {
    return `${BASE} ${align} bg-[var(--cell-formula-bg)] text-[color:var(--cell-formula-text)]${outline}${dim}`;
  }
  return `${BASE} ${align} ${banded ? 'bg-[var(--cell-bg-banded)]' : 'bg-[var(--cell-bg)]'}${outline}${dim}`;
}
