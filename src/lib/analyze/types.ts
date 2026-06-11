export type FormulaCell = {
  /** Id cualificado `Hoja!A1`. */
  id: string;
  sheet: string;
  cell: string;
  formula: string;
  value: string;
  /** Ids cualificados de las celdas/rangos de los que depende. */
  deps: string[];
  /** Ids de las celdas que usan esta celda. */
  dependents: string[];
};

export type ReferenceCount = { id: string; count: number };

export type WorkbookStats = {
  sheetCount: number;
  nonEmptyCells: number;
  formulaCount: number;
  crossSheetRefs: number;
  namedRanges: number;
};

export type WorkbookAnalysis = {
  sheets: string[];
  stats: WorkbookStats;
  formulaCells: FormulaCell[];
  topReferenced: ReferenceCount[];
  cycles: string[][];
};
