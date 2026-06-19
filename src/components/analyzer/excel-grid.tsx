import { useScrollToCell } from '@/hooks/use-scroll-to-cell';
import { decodeAddress } from '@/lib/grid/decode-address';
import { getCellClass } from '@/lib/grid/get-cell-class';
import type { CellRelations, SheetGrid } from '@/lib/grid/types';

type Props = {
  grid: SheetGrid;
  relations: CellRelations;
  selectedCell: string | null;
  onSelectCell: (address: string) => void;
};

const HEADER_BASE =
  'border border-[var(--header-border)] px-2 text-center text-xs font-semibold';
const HEADER_IDLE = 'bg-[var(--header-bg)] text-[color:var(--header-text)]';
const HEADER_ACTIVE = 'bg-[var(--accent)] text-white dark:text-[#0c1510]';
const ROW_HEADER_WIDTH_PX = 48;

export function ExcelGrid({ grid, onSelectCell, relations, selectedCell }: Props) {
  const selected = selectedCell ? decodeAddress(selectedCell) : null;
  const containerRef = useScrollToCell(selectedCell, grid.name);
  const tableWidth = ROW_HEADER_WIDTH_PX + grid.widthPx;

  return (
    <div ref={containerRef} className="h-full overflow-auto bg-[var(--cell-bg)]">
      <table className="table-fixed border-separate border-spacing-0" style={{ width: tableWidth }}>
        <colgroup>
          <col style={{ width: ROW_HEADER_WIDTH_PX }} />
          {grid.columns.map((column) => (
            <col key={column.label} style={{ width: column.widthPx }} />
          ))}
        </colgroup>
        <thead>
          <tr>
            <th className="sticky left-0 top-0 z-20 h-7 w-12 border border-[var(--header-border)] bg-[var(--header-bg)]">
              <span className="sr-only">Fila</span>
            </th>
            {grid.columns.map((column) => (
              <th
                key={column.label}
                className={`sticky top-0 z-10 h-7 ${HEADER_BASE} ${
                  selected && selected.colIndex === column.index ? HEADER_ACTIVE : HEADER_IDLE
                }`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {grid.rows.map((row) => (
            <tr key={row.rowNumber} style={{ height: row.heightPx }}>
              <th
                className={`sticky left-0 z-10 w-12 ${HEADER_BASE} ${
                  selected && selected.rowNumber === row.rowNumber ? HEADER_ACTIVE : HEADER_IDLE
                }`}
              >
                {row.rowNumber}
              </th>
              {row.cells.map((cell) => (
                <td
                  key={cell.address}
                  colSpan={cell.colSpan}
                  data-address={cell.address}
                  onClick={() => onSelectCell(cell.address)}
                  rowSpan={cell.rowSpan}
                  className={getCellClass({
                    banded: row.rowNumber % 2 === 0,
                    cell,
                    cursorId: selectedCell && `${grid.name}!${selectedCell}`,
                    relations,
                    sheetName: grid.name,
                  })}
                >
                  {cell.value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {grid.truncated && (
        <p className="border-t border-[var(--chrome-border)] bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-950 dark:text-amber-200">
          La hoja es muy grande: se muestra un recorte. El análisis y el Markdown sí cubren todo el
          contenido.
        </p>
      )}
    </div>
  );
}
