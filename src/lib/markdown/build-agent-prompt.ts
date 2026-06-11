/** Envuelve el markdown en un prompt listo para pegar en otro agente de IA. */
export function buildAgentPrompt(fileName: string, markdown: string): string {
  return [
    `Te comparto el contenido del archivo de Excel "${fileName}" convertido a Markdown.`,
    'Las celdas calculadas muestran su fórmula como `valor (=FORMULA)` y al inicio hay un resumen de qué celdas dependen de cuáles (`Celda <- dependencias`).',
    'Usa ese mapa para navegar el archivo. Analízalo y responde mis preguntas sobre él.',
    '',
    '---',
    '',
    markdown,
  ].join('\n');
}
