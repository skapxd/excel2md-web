import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { DependencyTree } from '@/components/analyzer/dependency-tree';
import { useWorkbookStore } from '@/hooks/use-workbook-store';
import { splitCellId } from '@/lib/grid/split-cell-id';
import type { DependencyNode } from '@/lib/grid/types';

type Props = {
  node: DependencyNode;
};

/**
 * El tono (precedente azul / dependiente dorado) lo define el ancestro con
 * `data-tone` + clase `group`, así la recursión no reenvía props.
 */
const CHIP =
  'shrink-0 rounded-md border px-2 py-0.5 font-mono text-xs text-slate-800 transition group-data-[tone=precedent]:border-[#9dc3e6] group-data-[tone=precedent]:bg-[#cfe3f5] group-data-[tone=precedent]:hover:bg-[#bcd8f0] group-data-[tone=dependent]:border-[#e6c45c] group-data-[tone=dependent]:bg-[#ffedb3] group-data-[tone=dependent]:hover:bg-[#f7e6ad]';

/**
 * ## Nodo navegable de dependencias
 *
 * Cada celda del árbol debe poder abrirse, contraerse y navegar al grid sin
 * duplicar estado entre niveles recursivos.
 *
 * ```ts
 * DependencyTreeNode(A1 -> [B1, C1])
 * // Renderiza A1 como chip; si esta abierto, delega B1 y C1 a DependencyTree.
 * ```
 */
export function DependencyTreeNode({ node }: Props) {
  const session = useWorkbookStore();
  const [open, setOpen] = useState(true);
  const ownPrefix = session.inspectedId ? `${splitCellId(session.inspectedId).sheet}!` : '';
  const hasChildren = node.children.length > 0;

  return (
    <li className="min-w-0">
      <div className="flex min-w-0 items-center gap-1.5">
        {hasChildren && (
          <button
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={open ? 'Contraer dependencias' : 'Expandir dependencias'}
            className="shrink-0 rounded p-0.5 text-slate-400 transition hover:text-slate-700 dark:hover:text-slate-200"
          >
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform ${open ? '' : '-rotate-90'}`}
              aria-hidden="true"
            />
          </button>
        )}
        {!hasChildren && <span className="w-[1.15rem] shrink-0" />}
        <button
          onClick={() => session.jumpTo(node.id)}
          title={node.formula ? `=${node.formula}` : undefined}
          className={CHIP}
        >
          {ownPrefix && node.id.startsWith(ownPrefix) ? node.id.slice(ownPrefix.length) : node.id}
          {node.cyclic && ' ⟲'}
        </button>
        {!open && hasChildren && (
          <span className="shrink-0 rounded-full bg-slate-200 px-1.5 text-[10px] font-semibold text-slate-600 dark:bg-[#2a2c30] dark:text-slate-300">
            +{node.children.length}
          </span>
        )}
        {node.formula && (
          <code className="min-w-0 truncate font-mono text-[11px] text-slate-400">
            ={node.formula}
          </code>
        )}
      </div>
      {open && hasChildren && (
        <div className="ml-[1.05rem] mt-1.5 border-l-2 border-slate-300 pl-3 dark:border-[#4a5160]">
          <DependencyTree nodes={node.children} />
        </div>
      )}
      {node.truncated && (
        <p className="ml-[1.15rem] mt-0.5 text-[11px] italic text-slate-400">
          …sigue más profundo — haz clic en la celda para continuar
        </p>
      )}
    </li>
  );
}
