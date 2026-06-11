export type StoredFile = {
  name: string;
  bytes: ArrayBuffer;
};

export type StoredFileError =
  | { type: 'STORAGE_FAILED'; message: string; cause: unknown }
  | { type: 'NOT_FOUND'; message: string };
