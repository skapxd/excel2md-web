export type GridCell = {
  /** Dirección A1 dentro de la hoja. */
  address: string;
  /** Texto a mostrar (formateado por Excel cuando existe). */
  value: string;
  /** Fórmula sin el `=` inicial, o '' si no tiene. */
  formula: string;
  isNumber: boolean;
};

export type GridRow = {
  rowNumber: number;
  cells: GridCell[];
};

export type SheetGrid = {
  name: string;
  columns: string[];
  rows: GridRow[];
  truncated: boolean;
};

export type DependencyNode = {
  /** Id cualificado `Hoja!A1` (o rango `Hoja!A1:B3`). */
  id: string;
  /** Fórmula del nodo ('' si es un dato suelto o un rango). */
  formula: string;
  children: DependencyNode[];
  /** El nodo vuelve sobre una celda ya visitada en la rama. */
  cyclic: boolean;
  /** Hay más niveles pero se cortó por profundidad o presupuesto. */
  truncated: boolean;
};

export type CellRelations = {
  /** Id cualificado `Hoja!A1` de la celda seleccionada, o null. */
  selectedId: string | null;
  /** Fórmula de la celda seleccionada ('' si no tiene). */
  formula: string;
  /** Árbol multinivel de precedentes (de qué se calcula). */
  precedentTree: DependencyNode[];
  /** Árbol multinivel de dependientes (quién la usa). */
  dependentTree: DependencyNode[];
  /** Celdas a pintar como precedentes directos. */
  precedentSet: Set<string>;
  /** Celdas a pintar como dependientes directos. */
  dependentSet: Set<string>;
  /** Precedentes de niveles más profundos (tinte más claro). */
  precedentDeepSet: Set<string>;
  /** Dependientes de niveles más profundos (tinte más claro). */
  dependentDeepSet: Set<string>;
  /** Celdas que participan en referencias circulares. */
  cycleCells: Set<string>;
};
