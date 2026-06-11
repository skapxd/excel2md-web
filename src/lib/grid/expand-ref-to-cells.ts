import * as XLSX from 'xlsx';

const MAX_AREA = 500;

/** Expande un id `Hoja!A1:B3` a las celdas individuales `Hoja!A1`, `Hoja!A2`… */
export function expandRefToCells(refId: string): string[] {
  const splitAt = refId.lastIndexOf('!');
  if (splitAt < 0) return [refId];
  const sheet = refId.slice(0, splitAt);
  const ref = refId.slice(splitAt + 1);

  const range = XLSX.utils.decode_range(ref);
  const area = (range.e.r - range.s.r + 1) * (range.e.c - range.s.c + 1);
  if (Number.isNaN(area) || area < 1 || area > MAX_AREA) return [refId];

  const cells: string[] = [];
  for (let row = range.s.r; row <= range.e.r; row += 1) {
    for (let col = range.s.c; col <= range.e.c; col += 1) {
      cells.push(`${sheet}!${XLSX.utils.encode_cell({ c: col, r: row })}`);
    }
  }
  return cells;
}
