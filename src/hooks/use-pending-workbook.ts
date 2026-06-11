import { useEffect, useState } from 'react';
import type * as XLSX from 'xlsx';
import { loadPendingFile } from '@/lib/stored-file/load-pending-file';
import { readWorkbook } from '@/lib/read-workbook';
import { reportDomainError } from '@/lib/errors/report-domain-error';

export type PendingWorkbook =
  | { status: 'loading' }
  | { status: 'empty' }
  | { status: 'error'; message: string }
  | { status: 'ready'; fileName: string; workbook: XLSX.WorkBook };

export function usePendingWorkbook(): PendingWorkbook {
  const [state, setState] = useState<PendingWorkbook>({ status: 'loading' });

  useEffect(() => {
    const load = async (): Promise<void> => {
      const stored = await loadPendingFile();
      if (!stored.ok && stored.error.type === 'NOT_FOUND') {
        setState({ status: 'empty' });
        return;
      }
      if (!stored.ok) {
        reportDomainError('No se pudo cargar el archivo pendiente.', stored.error);
        setState({ message: stored.error.message, status: 'error' });
        return;
      }
      const workbook = readWorkbook(stored.value.bytes);
      if (!workbook.ok) {
        reportDomainError('No se pudo leer el libro de Excel.', workbook.error);
        setState({ message: workbook.error.message, status: 'error' });
        return;
      }
      setState({ fileName: stored.value.name, status: 'ready', workbook: workbook.value });
    };
    void load();
  }, []);

  return state;
}
