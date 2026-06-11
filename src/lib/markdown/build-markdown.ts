import { convertWorkbook } from '@skapxd/excel2md';
import { Result, trySafe } from '@skapxd/result';
import type * as XLSX from 'xlsx';
import type { BuildMarkdownError, MarkdownOptions } from '@/lib/markdown/types';

export function buildMarkdown(
  workbook: XLSX.WorkBook,
  options: MarkdownOptions,
): Result<string, BuildMarkdownError> {
  const converted = trySafe(() => convertWorkbook(workbook, options));
  if (!converted.ok) {
    return Result.err({
      cause: converted.error,
      message: 'No se pudo convertir el libro a Markdown.',
      type: 'CONVERT_FAILED',
    });
  }
  return Result.ok(converted.value);
}
