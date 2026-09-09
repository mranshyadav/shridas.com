/**
 * Serves dist/ the way a static host does, for checking a build locally.
 *
 * `vite preview` cannot be used for this: it resolves extensionless URLs with
 * `extensions: []`, so a request for /work never looks at work/index.html and
 * falls straight through to the SPA fallback — showing the home page and
 * hiding whether prerendering worked at all.
 *
 * Resolution order here matches a static host: exact file, then `.html`, then
 * a directory index, then 404.html with a real 404 status.
 */

import { existsSync, statSync } from 'node:fs';
import { createReadStream } from 'node:fs';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(root, 'dist');
const port = Number(process.env.PORT ?? 4173);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
};

const isFile = (p) => existsSync(p) && statSync(p).isFile();

/** Mirrors the rewrite in vercel.json for the one dynamic CMS route. */
function rewrite(pathname) {
  return /^\/admin\/content\/edit\/[^/]+$/.test(pathname) ? '/admin/content/edit' : pathname;
}

function resolve(pathname) {
  const clean = rewrite(pathname).replace(/\/+$/, '') || '/';
  const base = path.join(distDir, clean);

  for (const candidate of [base, `${base}.html`, path.join(base, 'index.html')]) {
    if (isFile(candidate)) return candidate;
  }
  return null;
}

createServer((req, res) => {
  const pathname = decodeURIComponent(req.url.split('?')[0]);
  const file = resolve(pathname);
  const served = file ?? path.join(distDir, '404.html');

  res.writeHead(file ? 200 : 404, {
    'content-type': TYPES[path.extname(served)] ?? 'application/octet-stream',
  });
  createReadStream(served).pipe(res);
}).listen(port, () => {
  console.log(`dist/ served at http://localhost:${port} — static resolution, no SPA fallback`);
});
