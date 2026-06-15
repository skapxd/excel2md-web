import { DependencyTreeNode } from '@/components/analyzer/dependency-tree-node';
import type { DependencyNode } from '@/lib/grid/types';

type Props = {
  nodes: DependencyNode[];
};

export function DependencyTree({ nodes }: Props) {
  return (
    <ul className="space-y-1.5">
      {nodes.map((node) => (
        <DependencyTreeNode key={node.id} node={node} />
      ))}
    </ul>
  );
}
