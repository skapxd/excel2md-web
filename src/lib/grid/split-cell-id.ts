/** Separa un id `Hoja!A1` (o `Hoja!A1:B3`) en hoja y celda ancla. */
export function splitCellId(id: string): { sheet: string; cell: string } {
  const splitAt = id.lastIndexOf('!');
  const sheet = splitAt >= 0 ? id.slice(0, splitAt) : '';
  const ref = splitAt >= 0 ? id.slice(splitAt + 1) : id;
  const cell = ref.split(':')[0] ?? ref;
  return { cell, sheet };
}
