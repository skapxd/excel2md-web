import { marked } from 'marked';

export function renderMarkdownHtml(markdown: string): string {
  return marked.parse(markdown, { async: false });
}
