import { useMemo } from 'react';
import type * as XLSX from 'xlsx';
import { analyzeWorkbook } from '@/lib/analyze/analyze-workbook';
import type { WorkbookAnalysis } from '@/lib/analyze/types';

const EMPTY_ANALYSIS: WorkbookAnalysis = {
  cycles: [],
  formulaCells: [],
  sheets: [],
  stats: { crossSheetRefs: 0, formulaCount: 0, namedRanges: 0, nonEmptyCells: 0, sheetCount: 0 },
  topReferenced: [],
};

export function useWorkbookAnalysis(workbook: XLSX.WorkBook | null): WorkbookAnalysis {
  return useMemo(() => (workbook ? analyzeWorkbook(workbook) : EMPTY_ANALYSIS), [workbook]);
}
