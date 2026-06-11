import * as XLSX from 'xlsx';

/** Convierte una dirección `D4` en índices: columna `D` → 3, fila `4` → 4 (1-based). */
export function decodeAddress(address: string): { colIndex: number; rowNumber: number } {
  const decoded = XLSX.utils.decode_cell(address);
  return { colIndex: decoded.c, rowNumber: decoded.r + 1 };
}
