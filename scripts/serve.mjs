import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.pdf': 'application/pdf', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8' };
const portFlag = process.argv.indexOf('--port');
const port = Number(portFlag >= 0 ? process.argv[portFlag + 1] : process.env.PORT || 3000);
createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    let name = decodeURIComponent(url.pathname);
    if (name === '/Portfolio' || name.startsWith('/Portfolio/')) name = name.slice('/Portfolio'.length) || '/';
    const path = resolve(root, '.' + name + (name.endsWith('/') ? 'index.html' : ''));
    if (!path.startsWith(root.endsWith(sep) ? root : root + sep)) { res.writeHead(403); res.end(); return; }
    if (!(await stat(path)).isFile()) throw new Error('Not a file');
    const data = await readFile(path);
    res.writeHead(200, { 'Content-Type': types[extname(path)] || 'application/octet-stream', 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff' });
    res.end(data);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(await readFile(resolve(root, '404.html')));
  }
}).listen(port, '0.0.0.0', () => console.log('Portfolio running on port ' + port));
