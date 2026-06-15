import * as XLSX from 'xlsx';

/** ¿La referencia `Hoja!A1:B3` (o `Hoja!A1`) contiene a la celda `Hoja!A2`? */
export function refIncludesCell(refId: string, cellId: string): boolean {
  const referencesExactCell = refId === cellId;
  if (referencesExactCell) return true;
  const refSplit = refId.lastIndexOf('!');
  const cellSplit = cellId.lastIndexOf('!');
  const lacksQualifiedReference = refSplit < 0 || cellSplit < 0;
  if (lacksQualifiedReference) return false;
  const targetsDifferentSheet = refId.slice(0, refSplit) !== cellId.slice(0, cellSplit);
  if (targetsDifferentSheet) return false;

  const range = XLSX.utils.decode_range(refId.slice(refSplit + 1));
  const cell = XLSX.utils.decode_cell(cellId.slice(cellSplit + 1));
  return cell.r >= range.s.r && cell.r <= range.e.r && cell.c >= range.s.c && cell.c <= range.e.c;
}
