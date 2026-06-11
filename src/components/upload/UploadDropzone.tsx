import { FileSpreadsheet } from 'lucide-react';
import { getDropzoneTitle } from '@/components/upload/get-dropzone-title';
import { useUploadDropzone } from '@/hooks/use-upload-dropzone';

export function UploadDropzone() {
  const dropzone = useUploadDropzone();
  const dragging = dropzone.status.kind === 'dragging';

  return (
    <div className="w-full">
      <div
        role="button"
        tabIndex={0}
        aria-label="Subir archivo de Excel para analizar"
        onClick={dropzone.openPicker}
        onKeyDown={(event) => event.key === 'Enter' && dropzone.openPicker()}
        onDragOver={dropzone.onDragOver}
        onDragLeave={dropzone.onDragLeave}
        onDrop={dropzone.onDrop}
        className={`group cursor-pointer rounded-3xl border-2 border-dashed bg-white p-10 text-center shadow-xl transition-all dark:bg-[#202124] sm:p-12 ${
          dragging
            ? 'scale-[1.02] border-[#107c41] bg-emerald-50 shadow-2xl dark:bg-emerald-950'
            : 'border-emerald-300 hover:border-[#107c41] hover:shadow-2xl dark:border-emerald-900 dark:hover:border-emerald-500'
        }`}
      >
        <input
          ref={dropzone.inputRef}
          type="file"
          accept=".xlsx,.xlsm"
          className="hidden"
          onChange={dropzone.onInputChange}
        />
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0b5c30] to-emerald-500 shadow-md">
          <FileSpreadsheet className="h-8 w-8 text-white" aria-hidden="true" />
        </div>
        <p className="mt-5 text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
          {getDropzoneTitle(dropzone.status)}
        </p>
        <span className="mt-5 inline-block rounded-xl bg-[#107c41] px-6 py-3 text-sm font-semibold text-white shadow-md transition group-hover:bg-[#0b5c30]">
          Elegir archivo de Excel
        </span>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">…o arrástralo y suéltalo aquí (.xlsx / .xlsm)</p>
      </div>
      {dropzone.status.kind === 'error' && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {dropzone.status.message}
        </p>
      )}
    </div>
  );
}
