import type * as XLSX from 'xlsx';
import { isCellObject } from '@/lib/xlsx/is-cell-object';

export function countNonEmptyCells(workbook: XLSX.WorkBook): number {
  let total = 0;
  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    if (sheet === undefined) continue;
    for (const [address, raw] of Object.entries(sheet)) {
      const isSheetMetadata = address.startsWith('!');
      if (isSheetMetadata) continue;
      if (!isCellObject(raw)) continue;
      const value: unknown = raw.v;
      const hasDisplayableCellValue = value !== undefined && value !== null && value !== '';
      if (hasDisplayableCellValue) total += 1;
    }
  }
  return total;
}
