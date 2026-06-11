import { PENDING_FILE_KEY, PENDING_FILE_STORE } from '@/lib/stored-file/constants';
import type { StoredFile } from '@/lib/stored-file/types';

/** Frontera que lanza: los callers la envuelven en `trySafe`. */
export function putPendingFileRecord(db: IDBDatabase, record: StoredFile): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(PENDING_FILE_STORE, 'readwrite');
    transaction.objectStore(PENDING_FILE_STORE).put(record, PENDING_FILE_KEY);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error('No se pudo guardar el archivo'));
  });
}
