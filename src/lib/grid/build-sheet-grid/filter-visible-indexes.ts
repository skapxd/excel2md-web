export function filterVisibleIndexes(indexes: number[], start: number, end: number): number[] {
  return indexes.filter((index) => index >= start && index <= end);
}
