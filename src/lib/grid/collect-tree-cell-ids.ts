import { expandRefToCells } from '@/lib/grid/expand-ref-to-cells';
import type { DependencyNode } from '@/lib/grid/types';

/** Todas las celdas individuales que aparecen en un árbol de dependencias (rangos expandidos). */
export function collectTreeCellIds(nodes: DependencyNode[]): Set<string> {
  const ids = new Set<string>();
  const walk = (list: DependencyNode[]): void => {
    for (const node of list) {
      for (const cellId of expandRefToCells(node.id)) ids.add(cellId);
      walk(node.children);
    }
  };
  walk(nodes);
  return ids;
}
