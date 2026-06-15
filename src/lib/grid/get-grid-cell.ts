import type { GridCell, SheetGrid } from '@/lib/grid/types';

export function getGridCell(grid: SheetGrid, address: string | null): GridCell | null {
  if (address === null) return null;
  for (const row of grid.rows) {
    for (const cell of row.cells) {
      const foundRequestedCell = cell.address === address;
      if (foundRequestedCell) return cell;
    }
  }
  return null;
}
