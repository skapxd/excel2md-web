import type { FormulaCell } from '@/lib/analyze/types';

/** Detecta cadenas de fórmulas que se referencian en círculo (máx. `limit` ciclos). */
export function findCircularReferences(cells: FormulaCell[], limit = 5): string[][] {
  const graph = new Map(cells.map((cell) => [cell.id, cell.deps]));
  const cycles: string[][] = [];
  const state = new Map<string, 'visiting' | 'done'>();

  const visit = (id: string, path: string[]): void => {
    if (cycles.length >= limit) return;
    const mark = state.get(id);
    if (mark === 'done') return;
    const cycleStart = path.indexOf(id);
    if (mark === 'visiting' && cycleStart >= 0) {
      cycles.push([...path.slice(cycleStart), id]);
      return;
    }
    if (mark === 'visiting') {
      return;
    }
    state.set(id, 'visiting');
    for (const dep of graph.get(id) ?? []) {
      if (graph.has(dep)) visit(dep, [...path, id]);
    }
    state.set(id, 'done');
  };

  for (const id of graph.keys()) visit(id, []);
  return cycles;
}
