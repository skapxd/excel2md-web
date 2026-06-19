import type * as XLSX from 'xlsx';
import { isVisibleRow } from '@/lib/grid/build-sheet-grid/is-visible-row';

export function buildVisibleRows(sheet: XLSX.WorkSheet, startRow: number, endRow: number): number[] {
  const rows: number[] = [];
  for (let row = startRow; row <= endRow; row += 1) {
    const shouldRenderRow = isVisibleRow(sheet, row);
    if (!shouldRenderRow) continue;
    rows.push(row);
  }
  return rows;
}
