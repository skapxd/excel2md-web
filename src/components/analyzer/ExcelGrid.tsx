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

export function ExcelGrid({ grid, onSelectCell, relations, selectedCell }: Props) {
  const selected = selectedCell ? decodeAddress(selectedCell) : null;
  const containerRef = useScrollToCell(selectedCell, grid.name);

  return (
    <div ref={containerRef} className="h-full overflow-auto bg-[var(--cell-bg)]">
      <table className="border-separate border-spacing-0">
        <thead>
          <tr>
            <th className="sticky left-0 top-0 z-20 h-7 w-12 border border-[var(--header-border)] bg-[var(--header-bg)]">
              <span className="sr-only">Fila</span>
            </th>
            {grid.columns.map((column, index) => (
              <th
                key={column}
                className={`sticky top-0 z-10 h-7 min-w-[4.5rem] ${HEADER_BASE} ${
                  selected && selected.colIndex === index ? HEADER_ACTIVE : HEADER_IDLE
                }`}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {grid.rows.map((row) => (
            <tr key={row.rowNumber}>
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
                  data-address={cell.address}
                  onClick={() => onSelectCell(cell.address)}
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
