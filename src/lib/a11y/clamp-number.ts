export function clampNumber(value: unknown, fallback: number, min: number, max: number): number {
  const hasFiniteStoredNumber = typeof value === 'number' && Number.isFinite(value);
  return hasFiniteStoredNumber ? Math.min(Math.max(value, min), max) : fallback;
}
