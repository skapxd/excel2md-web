import { Result, trySafe } from '@skapxd/result';

export type ClipboardError = { type: 'CLIPBOARD_FAILED'; message: string; cause: unknown };

export async function copyTextToClipboard(text: string): Promise<Result<void, ClipboardError>> {
  const copied = await trySafe(() => navigator.clipboard.writeText(text));
  if (!copied.ok) {
    return Result.err({
      cause: copied.error,
      message: 'No se pudo copiar al portapapeles.',
      type: 'CLIPBOARD_FAILED',
    });
  }
  return Result.ok(undefined);
}
