import * as XLSX from 'xlsx';
import { buildColumns } from '@/lib/grid/build-sheet-grid/build-columns';
import { buildMergeLookup } from '@/lib/grid/build-sheet-grid/build-merge-lookup';
import { buildVisibleRows } from '@/lib/grid/build-sheet-grid/build-visible-rows';
import {
  EXTRA_TRAILING_COLS,
  EXTRA_TRAILING_ROWS,
  MAX_COLS,
  MAX_ROWS,
} from '@/lib/grid/build-sheet-grid/constants';
import { rowHeightPx } from '@/lib/grid/build-sheet-grid/row-height-px';
import { isCellObject } from '@/lib/xlsx/is-cell-object';
import type { GridCell, GridRow, SheetGrid } from '@/lib/grid/types';

export function buildSheetGrid(workbook: XLSX.WorkBook, sheetName: string): SheetGrid {
  const sheet = workbook.Sheets[sheetName];
  const ref = sheet?.['!ref'];
  const hasUsableSheetRange = sheet !== undefined && typeof ref === 'string' && ref.length > 0;
  if (!hasUsableSheetRange) return { columns: [], name: sheetName, rows: [], truncated: false, widthPx: 0 };

  const range = XLSX.utils.decode_range(ref);
  const contentEndRow = Math.min(range.e.r, range.s.r + MAX_ROWS - 1);
  const contentEndCol = Math.min(range.e.c, range.s.c + MAX_COLS - 1);
  const renderEndRow = contentEndRow + EXTRA_TRAILING_ROWS;
  const renderEndCol = contentEndCol + EXTRA_TRAILING_COLS;
  const truncated = contentEndRow < range.e.r || contentEndCol < range.e.c;
  const columns = buildColumns(sheet, range.s.c, renderEndCol);
  const visibleRows = buildVisibleRows(sheet, range.s.r, renderEndRow);
  const merges = buildMergeLookup(sheet['!merges'], visibleRows, columns);

  const rows: GridRow[] = [];
  for (const row of visibleRows) {
    const cells: GridCell[] = [];
    for (const column of columns) {
      const address = XLSX.utils.encode_cell({ c: column.index, r: row });
      const isCoveredByMerge = merges.covered.has(address);
      if (isCoveredByMerge) continue;
      const rawCell: unknown = sheet[address];
      const cell = isCellObject(rawCell) ? rawCell : undefined;
      const span = merges.spans.get(address);
      cells.push({
        address,
        colSpan: span?.colSpan ?? 1,
        formula: cell?.f ?? '',
        isNumber: cell?.t === 'n',
        rowSpan: span?.rowSpan ?? 1,
        value: cell?.w ?? String(cell?.v ?? ''),
      });
    }
    rows.push({ cells, heightPx: rowHeightPx(sheet['!rows']?.[row]), rowNumber: row + 1 });
  }

  return {
    columns,
    name: sheetName,
    rows,
    truncated,
    widthPx: columns.reduce((total, column) => total + column.widthPx, 0),
  };
}
