import { Result, trySafe } from '@skapxd/result';
import * as XLSX from 'xlsx';

export type ReadWorkbookError = { type: 'INVALID_FILE'; message: string; cause: unknown };

export function readWorkbook(bytes: ArrayBuffer): Result<XLSX.WorkBook, ReadWorkbookError> {
  const parsed = trySafe(() =>
    XLSX.read(bytes, { cellFormula: true, cellNF: true, cellStyles: true, cellText: true }),
  );
  if (!parsed.ok) {
    return Result.err({
      cause: parsed.error,
      message: 'El archivo no parece ser un Excel válido (¿está dañado o protegido con contraseña?).',
      type: 'INVALID_FILE',
    });
  }
  return Result.ok(parsed.value);
}
