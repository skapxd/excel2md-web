import eslintPluginAstro from 'eslint-plugin-astro';
import skapxd from '@skapxd/eslint-opinionated';

export default [
  { ignores: ['dist/', '.astro/', 'node_modules/'] },
  ...eslintPluginAstro.configs.recommended,
  ...skapxd.configs.astro,
  {
    files: ['src/**/*.{ts,tsx}'],
    ...skapxd.configs.shared.frontend,
  },
];
