import type { GridCell, SheetGrid } from '@/lib/grid/types';

export function getGridCell(grid: SheetGrid, address: string | null): GridCell | null {
  if (!address) return null;
  for (const row of grid.rows) {
    for (const cell of row.cells) {
      if (cell.address === address) return cell;
    }
  }
  return null;
}
