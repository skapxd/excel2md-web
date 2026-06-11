import { useEffect, useState } from 'react';
import type * as XLSX from 'xlsx';
import { loadPendingFile } from '@/lib/stored-file/load-pending-file';
import { readWorkbook } from '@/lib/read-workbook';

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
      if (!stored.ok) {
        if (stored.error.type === 'NOT_FOUND') {
          setState({ status: 'empty' });
          return;
        }
        setState({ message: stored.error.message, status: 'error' });
        return;
      }
      const workbook = readWorkbook(stored.value.bytes);
      if (!workbook.ok) {
        setState({ message: workbook.error.message, status: 'error' });
        return;
      }
      setState({ fileName: stored.value.name, status: 'ready', workbook: workbook.value });
    };
    void load();
  }, []);

  return state;
}
