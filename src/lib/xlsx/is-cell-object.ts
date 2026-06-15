import type * as XLSX from 'xlsx';

export function isCellObject(value: unknown): value is XLSX.CellObject {
  return typeof value === 'object' && value !== null;
}
