import { useRef, useState } from 'react';
import type { ChangeEvent, DragEvent, RefObject } from 'react';
import { reportDomainError } from '@/lib/errors/report-domain-error';
import { savePendingFile } from '@/lib/stored-file/save-pending-file';

export type UploadStatus =
  | { kind: 'idle' }
  | { kind: 'dragging' }
  | { kind: 'saving' }
  | { kind: 'error'; message: string };

export type UploadDropzoneApi = {
  status: UploadStatus;
  inputRef: RefObject<HTMLInputElement | null>;
  openPicker: () => void;
  onDrop: (event: DragEvent<HTMLElement>) => void;
  onDragOver: (event: DragEvent<HTMLElement>) => void;
  onDragLeave: () => void;
  onInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export function useUploadDropzone(): UploadDropzoneApi {
  const [status, setStatus] = useState<UploadStatus>({ kind: 'idle' });
  const inputRef = useRef<HTMLInputElement>(null);

  const acceptFile = async (file: File): Promise<void> => {
    const hasSupportedExcelExtension = /\.(xlsx|xlsm)$/i.test(file.name);
    if (!hasSupportedExcelExtension) {
      setStatus({ kind: 'error', message: 'Solo se aceptan archivos .xlsx o .xlsm' });
      return;
    }
    setStatus({ kind: 'saving' });
    const saved = await savePendingFile(file);
    if (!saved.ok) {
      reportDomainError('No se pudo guardar el archivo seleccionado.', saved.error);
      setStatus({ kind: 'error', message: saved.error.message });
      return;
    }
    window.location.assign('/analizar');
  };

  const onDrop = (event: DragEvent<HTMLElement>): void => {
    event.preventDefault();
    const file = event.dataTransfer.files.item(0);
    if (file !== null) {
      void acceptFile(file);
      return;
    }
    setStatus({ kind: 'idle' });
  };

  const onDragOver = (event: DragEvent<HTMLElement>): void => {
    event.preventDefault();
    setStatus({ kind: 'dragging' });
  };

  const onDragLeave = (): void => setStatus({ kind: 'idle' });

  const openPicker = (): void => inputRef.current?.click();

  const onInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.item(0);
    const selectedFileExists = file !== undefined && file !== null;
    if (selectedFileExists) void acceptFile(file);
    event.target.value = '';
  };

  return { inputRef, onDragLeave, onDragOver, onDrop, onInputChange, openPicker, status };
}
