import type * as XLSX from 'xlsx';
import { extractFormulaRefs } from '@/lib/analyze/extract-formula-refs';
import type { FormulaCell } from '@/lib/analyze/types';

export function listFormulaCells(workbook: XLSX.WorkBook): FormulaCell[] {
  const cells: FormulaCell[] = [];
  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) continue;
    for (const [address, raw] of Object.entries(sheet)) {
      if (address.startsWith('!')) continue;
      const cell = raw as XLSX.CellObject;
      if (!cell.f) continue;
      cells.push({
        cell: address,
        dependents: [],
        deps: extractFormulaRefs(cell.f, sheetName),
        formula: cell.f,
        id: `${sheetName}!${address}`,
        sheet: sheetName,
        value: cell.w ?? String(cell.v ?? ''),
      });
    }
  }
  return cells;
}
