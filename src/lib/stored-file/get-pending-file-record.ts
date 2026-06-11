import { PENDING_FILE_KEY, PENDING_FILE_STORE } from '@/lib/stored-file/constants';
import type { StoredFile } from '@/lib/stored-file/types';

/** Frontera que lanza: los callers la envuelven en `trySafe`. */
export function getPendingFileRecord(db: IDBDatabase): Promise<StoredFile | undefined> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(PENDING_FILE_STORE, 'readonly');
    const request = transaction.objectStore(PENDING_FILE_STORE).get(PENDING_FILE_KEY);
    request.onsuccess = () => resolve(request.result as StoredFile | undefined);
    request.onerror = () => reject(request.error ?? new Error('No se pudo leer el archivo guardado'));
  });
}
