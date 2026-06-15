import { Result, trySafe } from '@skapxd/result';

export function copyWithTextareaFallback(text: string): Result<void, unknown> {
  const supportsSelectionCopy =
    typeof document !== 'undefined' && typeof document.execCommand === 'function';

  if (!supportsSelectionCopy) return Result.err(new Error('Fallback de copia no disponible'));

  const copied = trySafe(() => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '0';
    document.body.append(textarea);
    textarea.select();
    const succeeded = document.execCommand('copy');
    textarea.remove();
    if (!succeeded) throw new Error('El navegador rechazo la copia por seleccion');
  });

  if (!copied.ok) return Result.err(copied.error);

  return Result.ok(undefined);
}
