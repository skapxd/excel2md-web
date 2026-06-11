import { Result, trySafe } from '@skapxd/result';
import { openPendingFileDb } from '@/lib/stored-file/open-pending-file-db';
import { putPendingFileRecord } from '@/lib/stored-file/put-pending-file-record';
import type { StoredFileError } from '@/lib/stored-file/types';

export async function savePendingFile(file: File): Promise<Result<void, StoredFileError>> {
  const bytes = await trySafe(() => file.arrayBuffer());
  if (!bytes.ok) {
    return Result.err({
      cause: bytes.error,
      message: 'No se pudo leer el archivo seleccionado.',
      type: 'STORAGE_FAILED',
    });
  }

  const db = await trySafe(() => openPendingFileDb());
  if (!db.ok) {
    return Result.err({
      cause: db.error,
      message: 'Tu navegador no permitió guardar el archivo localmente.',
      type: 'STORAGE_FAILED',
    });
  }

  const saved = await trySafe(() => putPendingFileRecord(db.value, { bytes: bytes.value, name: file.name }));
  if (!saved.ok) {
    return Result.err({
      cause: saved.error,
      message: 'No se pudo guardar el archivo en el navegador.',
      type: 'STORAGE_FAILED',
    });
  }

  return Result.ok(undefined);
}
