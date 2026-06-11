import { Result, trySafe } from '@skapxd/result';
import { getPendingFileRecord } from '@/lib/stored-file/get-pending-file-record';
import { openPendingFileDb } from '@/lib/stored-file/open-pending-file-db';
import type { StoredFile, StoredFileError } from '@/lib/stored-file/types';

export async function loadPendingFile(): Promise<Result<StoredFile, StoredFileError>> {
  const db = await trySafe(() => openPendingFileDb());
  if (!db.ok) {
    return Result.err({
      cause: db.error,
      message: 'No se pudo abrir el almacenamiento del navegador.',
      type: 'STORAGE_FAILED',
    });
  }

  const record = await trySafe(() => getPendingFileRecord(db.value));
  if (!record.ok) {
    return Result.err({
      cause: record.error,
      message: 'No se pudo leer el archivo guardado.',
      type: 'STORAGE_FAILED',
    });
  }

  if (!record.value) {
    return Result.err({ message: 'No hay ningún archivo pendiente de análisis.', type: 'NOT_FOUND' });
  }

  return Result.ok(record.value);
}
