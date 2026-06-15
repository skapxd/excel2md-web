import type * as XLSX from 'xlsx';
import { extractFormulaRefs } from '@/lib/analyze/extract-formula-refs';
import { isCellObject } from '@/lib/xlsx/is-cell-object';
import type { FormulaCell } from '@/lib/analyze/types';

export function listFormulaCells(workbook: XLSX.WorkBook): FormulaCell[] {
  const cells: FormulaCell[] = [];
  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    if (sheet === undefined) continue;
    for (const [address, raw] of Object.entries(sheet)) {
      const isSheetMetadata = address.startsWith('!');
      if (isSheetMetadata) continue;
      if (!isCellObject(raw)) continue;
      const formula = raw.f;
      const hasFormula = typeof formula === 'string' && formula.length > 0;
      if (!hasFormula) continue;
      cells.push({
        cell: address,
        dependents: [],
        deps: extractFormulaRefs(formula, sheetName),
        formula,
        id: `${sheetName}!${address}`,
        sheet: sheetName,
        value: raw.w ?? String(raw.v ?? ''),
      });
    }
  }
  return cells;
}
