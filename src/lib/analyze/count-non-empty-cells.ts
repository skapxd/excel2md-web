import type * as XLSX from 'xlsx';

export function countNonEmptyCells(workbook: XLSX.WorkBook): number {
  let total = 0;
  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) continue;
    for (const [address, raw] of Object.entries(sheet)) {
      if (address.startsWith('!')) continue;
      const value = (raw as XLSX.CellObject).v;
      if (value !== undefined && value !== null && value !== '') total += 1;
    }
  }
  return total;
}
