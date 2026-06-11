import * as XLSX from 'xlsx';

/** ¿La referencia `Hoja!A1:B3` (o `Hoja!A1`) contiene a la celda `Hoja!A2`? */
export function refIncludesCell(refId: string, cellId: string): boolean {
  if (refId === cellId) return true;
  const refSplit = refId.lastIndexOf('!');
  const cellSplit = cellId.lastIndexOf('!');
  if (refSplit < 0 || cellSplit < 0) return false;
  if (refId.slice(0, refSplit) !== cellId.slice(0, cellSplit)) return false;

  const range = XLSX.utils.decode_range(refId.slice(refSplit + 1));
  const cell = XLSX.utils.decode_cell(cellId.slice(cellSplit + 1));
  return cell.r >= range.s.r && cell.r <= range.e.r && cell.c >= range.s.c && cell.c <= range.e.c;
}
