import { useMemo } from 'react';
import type * as XLSX from 'xlsx';
import { buildSheetGrid } from '@/lib/grid/build-sheet-grid';
import type { SheetGrid } from '@/lib/grid/types';

export function useSheetGrid(workbook: XLSX.WorkBook | null, sheetName: string): SheetGrid {
  return useMemo(
    () =>
      workbook
        ? buildSheetGrid(workbook, sheetName)
        : { columns: [], name: sheetName, rows: [], truncated: false },
    [workbook, sheetName],
  );
}
