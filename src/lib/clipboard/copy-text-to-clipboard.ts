import { Result } from '@skapxd/result';
import { copyWithNativeClipboard } from '@/lib/clipboard/copy-with-native-clipboard';
import { copyWithTextareaFallback } from '@/lib/clipboard/copy-with-textarea-fallback';

export type ClipboardError = { type: 'CLIPBOARD_FAILED'; message: string; cause: unknown };

export async function copyTextToClipboard(text: string): Promise<Result<void, ClipboardError>> {
  const nativeCopy = await copyWithNativeClipboard(text);
  if (nativeCopy.ok) return Result.ok(undefined);

  const fallbackCopy = copyWithTextareaFallback(text);
  if (!fallbackCopy.ok) {
    return Result.err({
      cause: fallbackCopy.error,
      message: 'No se pudo copiar al portapapeles.',
      type: 'CLIPBOARD_FAILED',
    });
  }

  return Result.ok(undefined);
}
