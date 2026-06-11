import { buildDependentTree } from '@/lib/grid/build-dependent-tree';
import { buildPrecedentTree } from '@/lib/grid/build-precedent-tree';
import { collectTreeCellIds } from '@/lib/grid/collect-tree-cell-ids';
import { expandRefToCells } from '@/lib/grid/expand-ref-to-cells';
import { findCellDependents } from '@/lib/grid/find-cell-dependents';
import type { CellRelations } from '@/lib/grid/types';
import type { WorkbookAnalysis } from '@/lib/analyze/types';

export function buildCellRelations(
  analysis: WorkbookAnalysis,
  sheet: string,
  cell: string | null,
): CellRelations {
  const cycleCells = new Set(analysis.cycles.flat());
  if (!cell) {
    return {
      cycleCells,
      dependentDeepSet: new Set(),
      dependentSet: new Set(),
      dependentTree: [],
      formula: '',
      precedentDeepSet: new Set(),
      precedentSet: new Set(),
      precedentTree: [],
      selectedId: null,
    };
  }

  const selectedId = `${sheet}!${cell}`;
  const formulaCell = analysis.formulaCells.find((entry) => entry.id === selectedId);

  const precedentTree = buildPrecedentTree(analysis.formulaCells, selectedId);
  const dependentTree = buildDependentTree(analysis.formulaCells, selectedId);

  const precedentSet = new Set(
    (formulaCell?.deps ?? []).flatMap((dep) => expandRefToCells(dep)),
  );
  const dependentSet = new Set(findCellDependents(analysis.formulaCells, selectedId));

  const precedentDeepSet = new Set(
    [...collectTreeCellIds(precedentTree)].filter((id) => !precedentSet.has(id)),
  );
  const dependentDeepSet = new Set(
    [...collectTreeCellIds(dependentTree)].filter((id) => !dependentSet.has(id)),
  );

  return {
    cycleCells,
    dependentDeepSet,
    dependentSet,
    dependentTree,
    formula: formulaCell?.formula ?? '',
    precedentDeepSet,
    precedentSet,
    precedentTree,
    selectedId,
  };
}
