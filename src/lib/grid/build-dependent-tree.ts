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
      const exhaustedNodeBudget = budget <= 0;
      if (exhaustedNodeBudget) break;
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
      const canDescendIntoDependents = depth < MAX_DEPTH;
      if (canDescendIntoDependents) {
        node.children = visit(dependentId, depth + 1, new Set([...path, dependentId]));
        nodes.push(node);
        continue;
      }
      node.truncated = findCellDependents(formulaCells, dependentId).length > 0;
      nodes.push(node);
    }
    return nodes;
  };

  return visit(rootId, 1, new Set([rootId]));
}
