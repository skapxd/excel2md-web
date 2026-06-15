import { AnalysisView } from '@/components/analyzer/analysis-view';
import { useOpenPendingWorkbook } from '@/hooks/use-open-pending-workbook';

export function AnalyzerApp() {
  const pending = useOpenPendingWorkbook();

  return (
    <div className="w-full">
      {pending.status === 'loading' && (
        <p className="rounded-xl bg-white p-8 text-center text-slate-500 shadow-sm dark:bg-[#202124] dark:text-slate-300">
          Cargando tu archivo…
        </p>
      )}
      {pending.status === 'empty' && (
        <div className="rounded-xl bg-white p-8 text-center shadow-sm dark:bg-[#202124]">
          <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">No hay ningún archivo para analizar</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Vuelve al inicio y arrastra un Excel para empezar.
          </p>
          <a
            href="/"
            className="mt-4 inline-block rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Subir un Excel
          </a>
        </div>
      )}
      {pending.status === 'error' && (
        <div className="rounded-xl bg-white p-8 text-center shadow-sm dark:bg-[#202124]">
          <p className="text-lg font-semibold text-red-700">{pending.message}</p>
          <a
            href="/"
            className="mt-4 inline-block rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Intentar con otro archivo
          </a>
        </div>
      )}
      {pending.status === 'ready' && <AnalysisView />}
    </div>
  );
}
