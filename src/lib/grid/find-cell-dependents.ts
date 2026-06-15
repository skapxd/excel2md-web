import { refIncludesCell } from '@/lib/grid/ref-includes-cell';
import type { FormulaCell } from '@/lib/analyze/types';

/** Ids de las fórmulas que usan la celda dada (directamente o dentro de un rango). */
export function findCellDependents(formulaCells: FormulaCell[], cellId: string): string[] {
  const dependents: string[] = [];
  for (const formulaCell of formulaCells) {
    const formulaReferencesCell = formulaCell.deps.some((dep) => refIncludesCell(dep, cellId));
    if (formulaReferencesCell) {
      dependents.push(formulaCell.id);
    }
  }
  return dependents;
}
