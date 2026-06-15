const REF_PATTERN =
  /(?<![A-Za-z0-9_'])(?:('[^']+'|[A-Za-z_][A-Za-z0-9_.]*)!)?(\$?[A-Z]{1,3}\$?[0-9]+(?::\$?[A-Z]{1,3}\$?[0-9]+)?)(?![A-Za-z0-9_(])/g;

/** Extrae referencias de celda de una fórmula como ids cualificados `Hoja!A1`. */
export function extractFormulaRefs(formula: string, ownSheet: string): string[] {
  const refs = new Set<string>();
  for (const found of formula.matchAll(REF_PATTERN)) {
    const explicitSheetName = found[1];
    const sheet = explicitSheetName === undefined ? ownSheet : explicitSheetName.replaceAll("'", '');
    const cell = found[2]?.replaceAll('$', '');
    if (cell === undefined) continue;
    refs.add(`${sheet}!${cell}`);
  }
  return [...refs];
}
