import * as XLSX from 'xlsx';
import { columnWidthPx } from '@/lib/grid/build-sheet-grid/column-width-px';
import { isVisibleColumn } from '@/lib/grid/build-sheet-grid/is-visible-column';
import type { GridColumn } from '@/lib/grid/types';

export function buildColumns(sheet: XLSX.WorkSheet, startCol: number, endCol: number): GridColumn[] {
  const columns: GridColumn[] = [];
  for (let col = startCol; col <= endCol; col += 1) {
    const shouldRenderColumn = isVisibleColumn(sheet, col);
    if (!shouldRenderColumn) continue;
    columns.push({
      index: col,
      label: XLSX.utils.encode_col(col),
      widthPx: columnWidthPx(sheet['!cols']?.[col]),
    });
  }
  return columns;
}
