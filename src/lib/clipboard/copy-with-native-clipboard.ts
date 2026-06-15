import { Result, trySafe } from '@skapxd/result';

export async function copyWithNativeClipboard(text: string): Promise<Result<void, unknown>> {
  const supportsNativeClipboard =
    typeof navigator !== 'undefined' && typeof navigator.clipboard.writeText === 'function';

  if (!supportsNativeClipboard) return Result.err(new Error('Clipboard API no disponible'));

  const copied = await trySafe(() => navigator.clipboard.writeText(text));
  if (!copied.ok) return Result.err(copied.error);

  return Result.ok(undefined);
}
