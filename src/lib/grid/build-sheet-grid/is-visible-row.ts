import type * as XLSX from 'xlsx';

export function isVisibleRow(sheet: XLSX.WorkSheet, row: number): boolean {
  return sheet['!rows']?.[row]?.hidden !== true;
}
