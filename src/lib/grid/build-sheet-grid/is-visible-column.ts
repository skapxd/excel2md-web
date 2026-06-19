import type * as XLSX from 'xlsx';

export function isVisibleColumn(sheet: XLSX.WorkSheet, col: number): boolean {
  return sheet['!cols']?.[col]?.hidden !== true;
}
