import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';

/** Desplaza la cuadrícula hasta la celda seleccionada (busca por `data-address`). */
export function useScrollToCell(
  selectedCell: string | null,
  sheetName: string,
): RefObject<HTMLDivElement | null> {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedCell || !containerRef.current) return;
    const target = containerRef.current.querySelector(`[data-address="${selectedCell}"]`);
    target?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
  }, [selectedCell, sheetName]);

  return containerRef;
}
