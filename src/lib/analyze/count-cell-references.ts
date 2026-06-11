import type { FormulaCell, ReferenceCount } from '@/lib/analyze/types';

/** Celdas más referenciadas por otras fórmulas: las "críticas" del libro. */
export function countCellReferences(cells: FormulaCell[], limit: number): ReferenceCount[] {
  const counts = new Map<string, number>();
  for (const cell of cells) {
    for (const dep of cell.deps) {
      counts.set(dep, (counts.get(dep) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([id, count]) => ({ count, id }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}
