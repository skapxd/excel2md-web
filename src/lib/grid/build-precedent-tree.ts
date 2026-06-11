import { expandRefToCells } from '@/lib/grid/expand-ref-to-cells';
import type { FormulaCell } from '@/lib/analyze/types';
import type { DependencyNode } from '@/lib/grid/types';

const MAX_DEPTH = 4;
const MAX_NODES = 40;

/** Árbol multinivel de precedentes: de qué celdas se calcula la raíz, recursivamente. */
export function buildPrecedentTree(formulaCells: FormulaCell[], rootId: string): DependencyNode[] {
  const byId = new Map(formulaCells.map((cell) => [cell.id, cell]));
  let budget = MAX_NODES;

  const visit = (id: string, depth: number, path: Set<string>): DependencyNode[] => {
    const cell = byId.get(id);
    if (!cell) return [];
    const children: DependencyNode[] = [];
    for (const dep of cell.deps) {
      if (budget <= 0) break;
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
      if (depCell && !cyclic) {
        if (depth < MAX_DEPTH) {
          node.children = visit(dep, depth + 1, new Set([...path, dep]));
          node.truncated = depCell.deps.length > 0 && node.children.length === 0 && budget <= 0;
        } else {
          node.truncated = depCell.deps.length > 0;
        }
      }
      if (!depCell && dep.includes(':') && depth < MAX_DEPTH) {
        // Rango: sus hijos son las celdas con fórmula dentro del rango.
        for (const innerId of expandRefToCells(dep)) {
          if (budget <= 0) break;
          const innerCell = byId.get(innerId);
          if (!innerCell || path.has(innerId)) continue;
          budget -= 1;
          node.children.push({
            children: visit(innerId, depth + 1, new Set([...path, innerId])),
            cyclic: false,
            formula: innerCell.formula,
            id: innerId,
            truncated: false,
          });
        }
      }
      children.push(node);
    }
    return children;
  };

  return visit(rootId, 1, new Set([rootId]));
}
