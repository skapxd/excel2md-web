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

/** Pinta la celda con el código de colores estilo Excel (cursor, ancla, precedentes…). */
export function getCellClass({ banded, cell, cursorId, relations, sheetName }: Args): string {
  const id = `${sheetName}!${cell.address}`;
  const align = cell.isNumber ? 'text-right' : 'text-left';

  let outline = '';
  if (id === cursorId) {
    outline = ' font-semibold outline-2 -outline-offset-2 outline-[var(--accent)]';
  } else if (id === relations.selectedId) {
    outline = ' outline-2 -outline-offset-2 outline-dashed outline-[var(--accent)]';
  }

  const dim = relations.selectedId && !outline ? DIM : '';

  if (id === relations.selectedId && !relations.precedentSet.has(id)) {
    return `${BASE} ${align} bg-[var(--cell-bg)]${outline}`;
  }
  if (relations.precedentSet.has(id)) return `${BASE} ${align} bg-[var(--cell-precedent)]${outline}`;
  if (relations.dependentSet.has(id)) return `${BASE} ${align} bg-[var(--cell-dependent)]${outline}`;
  if (relations.precedentDeepSet.has(id)) {
    return `${BASE} ${align} bg-[var(--cell-precedent-deep)]${outline}`;
  }
  if (relations.dependentDeepSet.has(id)) {
    return `${BASE} ${align} bg-[var(--cell-dependent-deep)]${outline}`;
  }

  if (relations.cycleCells.has(id)) {
    return `${BASE} ${align} bg-[var(--cell-cycle-bg)] text-[color:var(--cell-cycle-text)]${outline}${dim}`;
  }
  if (cell.formula) {
    return `${BASE} ${align} bg-[var(--cell-formula-bg)] text-[color:var(--cell-formula-text)]${outline}${dim}`;
  }
  return `${BASE} ${align} ${banded ? 'bg-[var(--cell-bg-banded)]' : 'bg-[var(--cell-bg)]'}${outline}${dim}`;
}
