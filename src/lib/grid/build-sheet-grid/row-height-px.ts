import type * as XLSX from 'xlsx';
import {
  DEFAULT_ROW_HEIGHT_PX,
  MAX_ROW_HEIGHT_PX,
  MIN_ROW_HEIGHT_PX,
  POINT_TO_PX,
} from '@/lib/grid/build-sheet-grid/constants';
import { clampDimension } from '@/lib/grid/build-sheet-grid/clamp-dimension';

export function rowHeightPx(row: XLSX.RowInfo | undefined): number {
  if (row?.hpx !== undefined) {
    return clampDimension(row.hpx, MIN_ROW_HEIGHT_PX, MAX_ROW_HEIGHT_PX);
  }

  if (row?.hpt !== undefined) {
    return clampDimension(row.hpt * POINT_TO_PX, MIN_ROW_HEIGHT_PX, MAX_ROW_HEIGHT_PX);
  }

  return DEFAULT_ROW_HEIGHT_PX;
}
