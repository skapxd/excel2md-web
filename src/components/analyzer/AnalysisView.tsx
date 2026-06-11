import { ArrowLeft, ClipboardList, FileSpreadsheet, FileText, Table } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { AccessibilityMenu } from '@/components/analyzer/AccessibilityMenu';
import { MarkdownPanel } from '@/components/analyzer/MarkdownPanel';
import { SpreadsheetPanel } from '@/components/analyzer/SpreadsheetPanel';
import { SummaryPanel } from '@/components/analyzer/SummaryPanel';
import { useA11ySettings } from '@/hooks/use-a11y-settings';
import { useWorkbookAnalysis } from '@/hooks/use-workbook-analysis';
import { useWorkbookStore } from '@/hooks/use-workbook-store';
import type { AnalyzerTab } from '@/hooks/use-workbook-store';

const TABS: { id: AnalyzerTab; label: string; icon: LucideIcon }[] = [
  { icon: Table, id: 'hoja', label: 'Hoja' },
  { icon: ClipboardList, id: 'resumen', label: 'Resumen' },
  { icon: FileText, id: 'markdown', label: 'Markdown' },
];

export function AnalysisView() {
  const session = useWorkbookStore();
  const analysis = useWorkbookAnalysis(session.workbook);
  const a11y = useA11ySettings();

  if (!session.workbook) return null;

  return (
    <div className="fixed inset-0 z-10 flex flex-col bg-slate-50 dark:bg-[#141517]">
      {/* Barra superior compacta: título + tabs + acción */}
      <header className="flex h-12 shrink-0 items-center gap-3 bg-gradient-to-r from-[#0b5c30] to-[#1d9e5f] px-3 shadow-md">
        <FileSpreadsheet className="h-5 w-5 shrink-0 text-white" aria-hidden="true" />
        <p className="min-w-0 truncate text-sm font-bold text-white">{session.fileName}</p>
        <p className="hidden shrink-0 text-xs text-emerald-100 xl:block">
          {analysis.stats.sheetCount} hoja(s) · {analysis.stats.formulaCount} fórmula(s) ·{' '}
          {analysis.stats.nonEmptyCells} celdas
        </p>
        <nav className="mx-auto flex shrink-0 gap-0.5 rounded-lg bg-white/15 p-0.5" aria-label="Secciones del análisis">
          {TABS.map((item) => (
            <button
              key={item.id}
              onClick={() => session.setTab(item.id)}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1 text-xs font-semibold transition sm:text-sm ${
                session.tab === item.id
                  ? 'bg-white text-[#0b5c30] shadow-sm'
                  : 'text-white hover:bg-white/15'
              }`}
            >
              <item.icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </button>
          ))}
        </nav>
        <AccessibilityMenu api={a11y} />
        <a
          href="/"
          className="flex shrink-0 items-center gap-1.5 rounded-md border border-white/40 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/25"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Otro archivo
        </a>
      </header>

      {session.tab === 'hoja' && <SpreadsheetPanel analysis={analysis} />}
      {session.tab === 'resumen' && (
        <div className="min-h-0 flex-1 overflow-auto p-4 lg:p-6">
          <div className="mx-auto max-w-7xl">
            <SummaryPanel analysis={analysis} onInspect={(id) => session.inspect(id)} />
          </div>
        </div>
      )}
      {session.tab === 'markdown' && (
        <div className="min-h-0 flex-1 overflow-auto p-4 lg:p-6">
          <div className="mx-auto max-w-[1500px]">
            <MarkdownPanel />
          </div>
        </div>
      )}
    </div>
  );
}
