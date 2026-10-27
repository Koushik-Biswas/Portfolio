import { cp, mkdir, rm, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const out = resolve(root, 'dist');
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
for (const file of ['index.html', 'styles.css', 'app.js', 'robots.txt', '404.html', 'resume.html', 'resume.js', '.nojekyll']) {
  await copyFile(resolve(root, file), resolve(out, file));
}
await cp(resolve(root, 'assets'), resolve(out, 'assets'), { recursive: true });
console.log('Built static portfolio in dist/');
