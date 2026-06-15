import { expandRefToCells } from '@/lib/grid/expand-ref-to-cells';
import type { FormulaCell } from '@/lib/analyze/types';
import type { DependencyNode } from '@/lib/grid/types';

const MAX_DEPTH = 4;
const MAX_NODES = 40;

/**
 * ## Árbol de precedentes
 *
 * Expande de forma acotada las celdas que alimentan una fórmula para que la UI
 * pueda mostrar una cadena navegable sin congelarse en libros grandes.
 *
 * ```ts
 * buildPrecedentTree([{ id: 'Hoja1!C1', deps: ['Hoja1!A1'] }], 'Hoja1!C1')
 * // -> [{ id: 'Hoja1!A1', children: [], cyclic: false, truncated: false }]
 * ```
 */
export function buildPrecedentTree(formulaCells: FormulaCell[], rootId: string): DependencyNode[] {
  const byId = new Map(formulaCells.map((cell) => [cell.id, cell]));
  let budget = MAX_NODES;

  const visit = (id: string, depth: number, path: Set<string>): DependencyNode[] => {
    const cell = byId.get(id);
    if (cell === undefined) return [];
    const children: DependencyNode[] = [];

    const addFormulaChildren = (
      node: DependencyNode,
      depCell: FormulaCell | undefined,
      dep: string,
    ): void => {
      const cannotExpandFormulaNode = depCell === undefined || node.cyclic;
      if (cannotExpandFormulaNode) return;
      const canDescendIntoPrecedents = depth < MAX_DEPTH;
      if (canDescendIntoPrecedents) {
        node.children = visit(dep, depth + 1, new Set([...path, dep]));
        node.truncated = depCell.deps.length > 0 && node.children.length === 0 && budget <= 0;
        return;
      }
      node.truncated = depCell.deps.length > 0;
    };

    const addRangeChildren = (node: DependencyNode, depCell: FormulaCell | undefined, dep: string): void => {
      const canExpandRangeNode = depCell === undefined && dep.includes(':') && depth < MAX_DEPTH;
      if (!canExpandRangeNode) return;
      // Rango: sus hijos son las celdas con fórmula dentro del rango.
      for (const innerId of expandRefToCells(dep)) {
        const exhaustedNodeBudget = budget <= 0;
        if (exhaustedNodeBudget) break;
        const innerCell = byId.get(innerId);
        const cannotAddRangeChild = innerCell === undefined || path.has(innerId);
        if (cannotAddRangeChild) continue;
        budget -= 1;
        node.children.push({
          children: visit(innerId, depth + 1, new Set([...path, innerId])),
          cyclic: false,
          formula: innerCell.formula,
          id: innerId,
          truncated: false,
        });
      }
    };

    for (const dep of cell.deps) {
      const exhaustedNodeBudget = budget <= 0;
      if (exhaustedNodeBudget) break;
      budget -= 1;
      const depCell = byId.get(dep);
      const cyclic = path.has(dep);
      const node: DependencyNode = {
        children: [],
        cyclic,
        formula: depCell?.formula ?? '',
        id: dep,
        truncated: false,
      };
      addFormulaChildren(node, depCell, dep);
      addRangeChildren(node, depCell, dep);
      children.push(node);
    }
    return children;
  };

  return visit(rootId, 1, new Set([rootId]));
}
