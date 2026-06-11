import type { ConvertOptions } from '@skapxd/excel2md';

export type MarkdownOptions = Required<
  Pick<ConvertOptions, 'formulas' | 'deps' | 'excelFormat' | 'cellRefs'>
>;

export type BuildMarkdownError = { type: 'CONVERT_FAILED'; message: string; cause: unknown };
