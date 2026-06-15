import type { FormulaCell } from '@/lib/analyze/types';

/** Detecta cadenas de fórmulas que se referencian en círculo (máx. `limit` ciclos). */
export function findCircularReferences(cells: FormulaCell[], limit = 5): string[][] {
  const graph = new Map(cells.map((cell) => [cell.id, cell.deps]));
  const cycles: string[][] = [];
  const state = new Map<string, 'visiting' | 'done'>();

  const visit = (id: string, path: string[]): void => {
    const reachedCycleLimit = cycles.length >= limit;
    if (reachedCycleLimit) return;
    const mark = state.get(id);
    const alreadyResolvedNode = mark === 'done';
    if (alreadyResolvedNode) return;
    const cycleStart = path.indexOf(id);
    const closesCurrentPathCycle = mark === 'visiting' && cycleStart >= 0;
    if (closesCurrentPathCycle) {
      cycles.push([...path.slice(cycleStart), id]);
      return;
    }
    const isVisitingOutsideCurrentPath = mark === 'visiting';
    if (isVisitingOutsideCurrentPath) {
      return;
    }
    state.set(id, 'visiting');
    for (const dep of graph.get(id) ?? []) {
      const dependencyHasFormulaNode = graph.has(dep);
      if (dependencyHasFormulaNode) visit(dep, [...path, id]);
    }
    state.set(id, 'done');
  };

  for (const id of graph.keys()) visit(id, []);
  return cycles;
}
