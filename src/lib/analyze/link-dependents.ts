import type { FormulaCell } from '@/lib/analyze/types';

/** Rellena `dependents` (quién usa a quién) a partir de `deps`. Muta las celdas recibidas. */
export function linkDependents(cells: FormulaCell[]): void {
  const byId = new Map(cells.map((cell) => [cell.id, cell]));
  for (const cell of cells) {
    for (const dep of cell.deps) {
      const target = byId.get(dep);
      if (target) target.dependents.push(cell.id);
    }
  }
}
