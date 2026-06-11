# Analizador de Excel

<p>
  <img src="public/favicon.svg" alt="Logo: mini hoja de cálculo con una celda resaltada" width="64" height="64" />
</p>

Sube un archivo de Excel (`.xlsx`, `.xlsm`) y descubre cómo está construido — **100% en tu navegador**: el archivo nunca se sube a ningún servidor.

- **Hoja de cálculo interactiva**: cuadrícula con coordenadas, barra de fórmulas `fx` y pestañas de hojas, como Excel.
- **Rastreo de dependencias multinivel**: haz clic en una celda y ve resaltado de qué celdas sale su valor y quién lo usa, incluso entre hojas; árbol colapsable con navegación por chips y spotlight sobre la cadena de cálculo.
- **Resumen del libro**: estadísticas, celdas críticas (las más referenciadas) y detección de dependencias circulares.
- **Markdown para IA**: convierte el libro a Markdown conservando las fórmulas (con [`@skapxd/excel2md`](https://github.com/skapxd/excel2md)) y cópialo como prompt listo para otro agente.
- **Accesibilidad**: tema claro/oscuro/sistema, atenuación del spotlight y tamaño de texto configurables.

## Desarrollo

Requiere Node 22+ (hay `.nvmrc`) y [pnpm](https://pnpm.io).

```sh
pnpm install
pnpm dev        # http://localhost:4321
```

| Comando | Qué hace |
| --- | --- |
| `pnpm build` | Build de producción en `dist/` |
| `pnpm lint` | ESLint con los guardrails de [`@skapxd/eslint-opinionated`](https://www.npmjs.com/package/@skapxd/eslint-opinionated) |
| `pnpm lint:changed` | Lintea solo los archivos tocados (git) |
| `pnpm lint:web` | Audita el sitio servido con [webhint](https://webhint.io) (requiere `pnpm dev` corriendo) |

## Stack

Astro + isla React + Tailwind 4 + zustand. La conversión y el análisis corren client-side con [SheetJS](https://sheetjs.com) y `@skapxd/excel2md`.

## Licencia

MIT
