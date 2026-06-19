import type * as XLSX from 'xlsx';
import {
  DEFAULT_COLUMN_WIDTH_PX,
  EXCEL_CELL_PADDING_PX,
  EXCEL_CHAR_WIDTH_PX,
  MAX_COLUMN_WIDTH_PX,
  MIN_COLUMN_WIDTH_PX,
} from '@/lib/grid/build-sheet-grid/constants';
import { clampDimension } from '@/lib/grid/build-sheet-grid/clamp-dimension';

export function columnWidthPx(column: XLSX.ColInfo | undefined): number {
  if (column?.wpx !== undefined) {
    return clampDimension(column.wpx, MIN_COLUMN_WIDTH_PX, MAX_COLUMN_WIDTH_PX);
  }

  if (column?.wch !== undefined) {
    return clampDimension(
      column.wch * EXCEL_CHAR_WIDTH_PX + EXCEL_CELL_PADDING_PX,
      MIN_COLUMN_WIDTH_PX,
      MAX_COLUMN_WIDTH_PX,
    );
  }

  if (column?.width !== undefined) {
    const maxDigitWidth = column.MDW ?? EXCEL_CHAR_WIDTH_PX;
    return clampDimension(
      column.width * maxDigitWidth + EXCEL_CELL_PADDING_PX,
      MIN_COLUMN_WIDTH_PX,
      MAX_COLUMN_WIDTH_PX,
    );
  }

  return DEFAULT_COLUMN_WIDTH_PX;
}
