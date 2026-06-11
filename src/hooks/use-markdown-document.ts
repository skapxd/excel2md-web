import { useMemo, useState } from 'react';
import { Result } from '@skapxd/result';
import type * as XLSX from 'xlsx';
import { buildMarkdown } from '@/lib/markdown/build-markdown';
import { renderMarkdownHtml } from '@/lib/markdown/render-markdown-html';
import type { BuildMarkdownError, MarkdownOptions } from '@/lib/markdown/types';

export type MarkdownDocumentApi = {
  markdown: Result<string, BuildMarkdownError>;
  html: string;
  options: MarkdownOptions;
  toggleOption: (key: keyof MarkdownOptions) => void;
};

export function useMarkdownDocument(workbook: XLSX.WorkBook | null): MarkdownDocumentApi {
  const [options, setOptions] = useState<MarkdownOptions>({
    cellRefs: false,
    deps: true,
    excelFormat: false,
    formulas: true,
  });

  const markdown = useMemo(
    () =>
      workbook
        ? buildMarkdown(workbook, options)
        : Result.err<BuildMarkdownError>({
            cause: null,
            message: 'No hay ningún libro cargado.',
            type: 'CONVERT_FAILED',
          }),
    [workbook, options],
  );
  const html = useMemo(
    () => (markdown.ok ? renderMarkdownHtml(markdown.value) : ''),
    [markdown],
  );

  const toggleOption = (key: keyof MarkdownOptions): void =>
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));

  return { html, markdown, options, toggleOption };
}
