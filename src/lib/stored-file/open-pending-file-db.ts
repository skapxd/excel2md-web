import { PENDING_FILE_DB, PENDING_FILE_STORE } from '@/lib/stored-file/constants';

/** Frontera que lanza: los callers la envuelven en `trySafe`. */
export function openPendingFileDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(PENDING_FILE_DB, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(PENDING_FILE_STORE);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('No se pudo abrir IndexedDB'));
  });
}
