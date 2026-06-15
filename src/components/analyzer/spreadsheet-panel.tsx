import { CellDetails } from '@/components/analyzer/cell-details';
import { ExcelGrid } from '@/components/analyzer/excel-grid';
import { FormulaBar } from '@/components/analyzer/formula-bar';
import { SheetTabs } from '@/components/analyzer/sheet-tabs';
import { useCellRelations } from '@/hooks/use-cell-relations';
import { useSheetGrid } from '@/hooks/use-sheet-grid';
import { useWorkbookStore } from '@/hooks/use-workbook-store';
import { getGridCell } from '@/lib/grid/get-grid-cell';
import { splitCellId } from '@/lib/grid/split-cell-id';
import type { WorkbookAnalysis } from '@/lib/analyze/types';

type Props = {
  analysis: WorkbookAnalysis;
};

export function SpreadsheetPanel({ analysis }: Props) {
  const session = useWorkbookStore();
  const grid = useSheetGrid(session.workbook, session.sheet);

  // El panel se enraíza en la celda inspeccionada, no en el cursor.
  const inspected = session.inspectedId ? splitCellId(session.inspectedId) : null;
  const relations = useCellRelations(analysis, inspected?.sheet ?? '', inspected?.cell ?? null);

  // La barra de fórmulas sí sigue al cursor, como en Excel.
  const cursorCell = getGridCell(grid, session.cell);
  const barContent = cursorCell?.formula ? `=${cursorCell.formula}` : (cursorCell?.value ?? '');

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[var(--cell-bg)]">
      <FormulaBar address={session.cell ?? ''} content={barContent} />
      <div className="relative min-h-0 flex-1">
        <ExcelGrid
          grid={grid}
          relations={relations}
          selectedCell={session.cell}
          onSelectCell={(address) => session.selectCell(address)}
        />
        {/* Panel flotante anclado a la celda inspeccionada: los chips navegan sin mutarlo */}
        <div className="absolute bottom-4 right-4 z-20 w-max min-w-[24rem] max-w-[min(46rem,calc(100vw-2rem))]">
          <CellDetails relations={relations} sheetName={inspected?.sheet ?? session.sheet} />
        </div>
      </div>
      <SheetTabs
        active={session.sheet}
        sheets={session.workbook?.SheetNames ?? []}
        onSelectSheet={(sheet) => session.selectSheet(sheet)}
      />
    </div>
  );
}
