import { build } from 'bun';

await build({
  entrypoints: ['./index.ts'],
  outdir: './dist',
  target: 'bun',
});
