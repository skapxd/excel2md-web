import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

export type PopoverApi = {
  open: boolean;
  toggle: () => void;
  close: () => void;
  /** Ref del contenedor (trigger + caja): los clics fuera de él cierran el popover. */
  containerRef: RefObject<HTMLDivElement | null>;
};

/** Popover con "light dismiss": se cierra con Escape o clic fuera del contenedor. */
export function usePopover(): PopoverApi {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    const { signal } = controller;
    const onPointerDown = (event: PointerEvent): void => {
      const node = containerRef.current;
      if (node && event.target instanceof Node && !node.contains(event.target)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown, { signal });
    document.addEventListener('keydown', onKeyDown, { signal });
    return () => controller.abort();
  }, [open]);

  const toggle = (): void => setOpen((prev) => !prev);
  const close = (): void => setOpen(false);

  return { close, containerRef, open, toggle };
}
