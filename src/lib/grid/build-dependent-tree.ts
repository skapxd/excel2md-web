import { findCellDependents } from '@/lib/grid/find-cell-dependents';
import type { FormulaCell } from '@/lib/analyze/types';
import type { DependencyNode } from '@/lib/grid/types';

const MAX_DEPTH = 3;
const MAX_NODES = 40;

/** Árbol multinivel de dependientes: quién usa la raíz, y quién usa a esos, recursivamente. */
export function buildDependentTree(formulaCells: FormulaCell[], rootId: string): DependencyNode[] {
  const byId = new Map(formulaCells.map((cell) => [cell.id, cell]));
  let budget = MAX_NODES;

  const visit = (id: string, depth: number, path: Set<string>): DependencyNode[] => {
    const nodes: DependencyNode[] = [];
    for (const dependentId of findCellDependents(formulaCells, id)) {
      if (budget <= 0) break;
      budget -= 1;
      const cell = byId.get(dependentId);
      const cyclic = path.has(dependentId);
      const node: DependencyNode = {
        children: [],
        cyclic,
        formula: cell?.formula ?? '',
        id: dependentId,
        truncated: false,
      };
      if (cyclic) {
        nodes.push(node);
        continue;
      }
      if (depth < MAX_DEPTH) {
        node.children = visit(dependentId, depth + 1, new Set([...path, dependentId]));
      } else {
        node.truncated = findCellDependents(formulaCells, dependentId).length > 0;
      }
      nodes.push(node);
    }
    return nodes;
  };

  return visit(rootId, 1, new Set([rootId]));
}
