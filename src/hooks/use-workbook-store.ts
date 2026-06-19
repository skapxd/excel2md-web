import { create } from 'zustand';
import type * as XLSX from 'xlsx';
import { splitCellId } from '@/lib/grid/split-cell-id';

export type AnalyzerTab = 'hoja' | 'resumen' | 'markdown';

export type WorkbookSession = {
  fileName: string;
  workbook: XLSX.WorkBook | null;
  tab: AnalyzerTab;
  sheet: string;
  /** Cursor: celda navegada/resaltada en la hoja actual. */
  cell: string | null;
  /** Ancla del panel de dependencias (id `Hoja!A1`); solo cambia al hacer clic en la hoja. */
  inspectedId: string | null;
  closeCellDetails: () => void;
  openWorkbook: (fileName: string, workbook: XLSX.WorkBook) => void;
  setTab: (tab: AnalyzerTab) => void;
  selectSheet: (sheet: string) => void;
  /** Clic en la hoja: mueve el cursor Y re-enraíza el panel. */
  selectCell: (cell: string) => void;
  /** Abre una celda desde fuera de la hoja (p. ej. Resumen): navega y re-enraíza el panel. */
  inspect: (id: string) => void;
  /** Navegación desde los chips del panel: solo mueve el cursor, el panel no muta. */
  jumpTo: (id: string) => void;
};

export const useWorkbookStore = create<WorkbookSession>()((set) => ({
  cell: null,
  closeCellDetails: () => set({ inspectedId: null }),
  fileName: '',
  inspect: (id) => {
    const target = splitCellId(id);
    set({
      cell: target.cell,
      inspectedId: `${target.sheet}!${target.cell}`,
      sheet: target.sheet,
      tab: 'hoja',
    });
  },
  inspectedId: null,
  jumpTo: (id) => {
    const target = splitCellId(id);
    set({ cell: target.cell, sheet: target.sheet, tab: 'hoja' });
  },
  openWorkbook: (fileName, workbook) =>
    set({
      cell: null,
      fileName,
      inspectedId: null,
      sheet: workbook.SheetNames[0] ?? '',
      tab: 'hoja',
      workbook,
    }),
  selectCell: (cell) => set((state) => ({ cell, inspectedId: `${state.sheet}!${cell}` })),
  selectSheet: (sheet) => set({ cell: null, inspectedId: null, sheet }),
  setTab: (tab) => set({ tab }),
  sheet: '',
  tab: 'hoja',
  workbook: null,
}));
