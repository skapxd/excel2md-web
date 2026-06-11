import { match } from 'ts-pattern';
import type { UploadStatus } from '@/hooks/use-upload-dropzone';

export function getDropzoneTitle(status: UploadStatus): string {
  return match(status)
    .with({ kind: 'dragging' }, () => '¡Suéltalo aquí!')
    .with({ kind: 'saving' }, () => 'Preparando el análisis…')
    .with({ kind: 'error' }, () => 'Algo salió mal, intenta de nuevo')
    .with({ kind: 'idle' }, () => 'Arrastra tu Excel aquí')
    .exhaustive();
}
