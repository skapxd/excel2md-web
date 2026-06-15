import type { StoredFile } from '@/lib/stored-file/types';

export function isStoredFile(value: unknown): value is StoredFile {
  const isReadableObject = typeof value === 'object' && value !== null;
  const name: unknown = isReadableObject ? Reflect.get(value, 'name') : undefined;
  const bytes: unknown = isReadableObject ? Reflect.get(value, 'bytes') : undefined;

  return isReadableObject && typeof name === 'string' && bytes instanceof ArrayBuffer;
}
