import type * as XLSX from 'xlsx';
import { countCellReferences } from '@/lib/analyze/count-cell-references';
import { countNonEmptyCells } from '@/lib/analyze/count-non-empty-cells';
import { findCircularReferences } from '@/lib/analyze/find-circular-references';
import { linkDependents } from '@/lib/analyze/link-dependents';
import { listFormulaCells } from '@/lib/analyze/list-formula-cells';
import type { WorkbookAnalysis } from '@/lib/analyze/types';

export function analyzeWorkbook(workbook: XLSX.WorkBook): WorkbookAnalysis {
  const formulaCells = listFormulaCells(workbook);
  linkDependents(formulaCells);

  let crossSheetRefs = 0;
  for (const cell of formulaCells) {
    for (const dep of cell.deps) {
      const targetsAnotherSheet = !dep.startsWith(`${cell.sheet}!`);
      if (targetsAnotherSheet) crossSheetRefs += 1;
    }
  }

  return {
    cycles: findCircularReferences(formulaCells),
    formulaCells,
    sheets: workbook.SheetNames,
    stats: {
      crossSheetRefs,
      formulaCount: formulaCells.length,
      namedRanges: workbook.Workbook?.Names?.length ?? 0,
      nonEmptyCells: countNonEmptyCells(workbook),
      sheetCount: workbook.SheetNames.length,
    },
    topReferenced: countCellReferences(formulaCells, 8),
  };
}
