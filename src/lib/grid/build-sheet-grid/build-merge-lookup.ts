import * as XLSX from 'xlsx';
import { filterVisibleIndexes } from '@/lib/grid/build-sheet-grid/filter-visible-indexes';
import type { MergeLookup } from '@/lib/grid/build-sheet-grid/types';
import type { GridColumn } from '@/lib/grid/types';

export function buildMergeLookup(
  merges: XLSX.Range[] | undefined,
  visibleRows: number[],
  visibleColumns: GridColumn[],
): MergeLookup {
  const covered = new Set<string>();
  const spans = new Map<string, { colSpan: number; rowSpan: number }>();
  const visibleColumnIndexes = visibleColumns.map((column) => column.index);

  for (const merge of merges ?? []) {
    const mergeRows = filterVisibleIndexes(visibleRows, merge.s.r, merge.e.r);
    const mergeColumns = filterVisibleIndexes(visibleColumnIndexes, merge.s.c, merge.e.c);
    const anchorRow = mergeRows[0];
    const anchorColumn = mergeColumns[0];
    const hasRenderableMerge = anchorRow !== undefined && anchorColumn !== undefined;
    if (!hasRenderableMerge) continue;

    const anchorAddress = XLSX.utils.encode_cell({ c: anchorColumn, r: anchorRow });
    spans.set(anchorAddress, { colSpan: mergeColumns.length, rowSpan: mergeRows.length });

    for (const row of mergeRows) {
      for (const column of mergeColumns) {
        const address = XLSX.utils.encode_cell({ c: column, r: row });
        const isMergeAnchor = address === anchorAddress;
        if (!isMergeAnchor) covered.add(address);
      }
    }
  }

  return { covered, spans };
}
