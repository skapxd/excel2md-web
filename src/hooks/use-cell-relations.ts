import { useMemo } from 'react';
import { buildCellRelations } from '@/lib/grid/build-cell-relations';
import type { CellRelations } from '@/lib/grid/types';
import type { WorkbookAnalysis } from '@/lib/analyze/types';

export function useCellRelations(
  analysis: WorkbookAnalysis,
  sheet: string,
  cell: string | null,
): CellRelations {
  return useMemo(() => buildCellRelations(analysis, sheet, cell), [analysis, sheet, cell]);
}
