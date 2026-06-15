import * as XLSX from 'xlsx';
import { isCellObject } from '@/lib/xlsx/is-cell-object';
import type { GridCell, GridRow, SheetGrid } from '@/lib/grid/types';

const MAX_ROWS = 300;
const MAX_COLS = 40;

export function buildSheetGrid(workbook: XLSX.WorkBook, sheetName: string): SheetGrid {
  const sheet = workbook.Sheets[sheetName];
  const ref = sheet?.['!ref'];
  const hasUsableSheetRange = sheet !== undefined && typeof ref === 'string' && ref.length > 0;
  if (!hasUsableSheetRange) return { columns: [], name: sheetName, rows: [], truncated: false };

  const range = XLSX.utils.decode_range(ref);
  const endRow = Math.min(range.e.r, range.s.r + MAX_ROWS - 1);
  const endCol = Math.min(range.e.c, range.s.c + MAX_COLS - 1);
  const truncated = endRow < range.e.r || endCol < range.e.c;

  const columns: string[] = [];
  for (let col = range.s.c; col <= endCol; col += 1) {
    columns.push(XLSX.utils.encode_col(col));
  }

  const rows: GridRow[] = [];
  for (let row = range.s.r; row <= endRow; row += 1) {
    const cells: GridCell[] = [];
    for (let col = range.s.c; col <= endCol; col += 1) {
      const address = XLSX.utils.encode_cell({ c: col, r: row });
      const rawCell: unknown = sheet[address];
      const cell = isCellObject(rawCell) ? rawCell : undefined;
      cells.push({
        address,
        formula: cell?.f ?? '',
        isNumber: cell?.t === 'n',
        value: cell?.w ?? String(cell?.v ?? ''),
      });
    }
    rows.push({ cells, rowNumber: row + 1 });
  }

  return { columns, name: sheetName, rows, truncated };
}
