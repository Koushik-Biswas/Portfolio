import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const html = await readFile(resolve(root, 'index.html'), 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
assert.equal(new Set(ids).size, ids.length, 'Duplicate HTML IDs');
for (const [, href] of html.matchAll(/\bhref="([^"]+)"/g)) {
  if (href.startsWith('#')) assert(ids.includes(href.slice(1)), 'Missing anchor ' + href);
  if (href.startsWith('./')) await access(resolve(root, href));
}
for (const [, src] of html.matchAll(/\bsrc="(\.\/[^"]+)"/g)) await access(resolve(root, src));
assert(html.includes('href="tel:+919339741545"'), 'Phone link is required');
assert(html.includes('href="mailto:koushikbiswas2423@gmail.com"'), 'Gmail link is required');
assert(html.includes('action="https://formsubmit.co/koushikbiswas2423@gmail.com"'), 'Form recipient is required');
for (const field of ['name', 'email', 'subject', 'message']) {
  assert(html.includes('for="' + field + '"'), 'Missing field label: ' + field);
}
console.log('PASS: local assets, anchors, unique IDs, field labels, phone, Gmail, contact recipient');
