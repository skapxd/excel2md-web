import { useEffect } from 'react';

/** Cierra el panel de dependencias con Escape sin capturar el resto del teclado de la hoja. */
export function useCloseCellDetailsOnEscape(active: boolean, onClose: () => void): void {
  useEffect(() => {
    if (!active) return;

    const controller = new AbortController();
    const onKeyDown = (event: KeyboardEvent): void => {
      const requestedDetailsClose = event.key === 'Escape';
      if (requestedDetailsClose) onClose();
    };

    document.addEventListener('keydown', onKeyDown, { signal: controller.signal });
    return () => controller.abort();
  }, [active, onClose]);
}
