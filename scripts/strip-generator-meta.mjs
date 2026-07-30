// Post-build: strip Astro's auto-injected <meta name="generator"> (version
// disclosure) from the prerendered Starlight pages. Runs AFTER `astro build`
// (chained in the `build` npm script) so Astro's final HTML write is already
// complete and the strip sticks.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const re = /<meta\s+name="generator"[^>]*>\s*/gi;
const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist', 'client');

let found = 0;
let stripped = 0;

async function walk(d) {
  let entries;
  try {
    entries = await readdir(d, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    const p = join(d, e.name);
    if (e.isDirectory()) {
      await walk(p);
    } else if (e.name.endsWith('.html')) {
      found++;
      const h = await readFile(p, 'utf8');
      const c = h.replace(re, '');
      if (c !== h) {
        await writeFile(p, c);
        stripped++;
      }
    }
  }
}

await walk(root);
console.log(`[strip-generator-meta] found=${found} stripped=${stripped}`);