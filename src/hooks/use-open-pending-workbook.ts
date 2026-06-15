import { useEffect } from 'react';
import { usePendingWorkbook } from '@/hooks/use-pending-workbook';
import { useWorkbookStore } from '@/hooks/use-workbook-store';
import type { PendingWorkbook } from '@/hooks/use-pending-workbook';

/** Carga el archivo pendiente y, cuando está listo, abre la sesión en el store. */
export function useOpenPendingWorkbook(): PendingWorkbook {
  const pending = usePendingWorkbook();
  const openWorkbook = useWorkbookStore((state) => state.openWorkbook);

  useEffect(() => {
    const hasLoadedWorkbook = pending.status === 'ready';
    if (hasLoadedWorkbook) openWorkbook(pending.fileName, pending.workbook);
  }, [pending, openWorkbook]);

  return pending;
}
