/**
 * Turns the SPA build into one static HTML file per public route.
 *
 * Run after both Vite builds (see the `build` script in package.json):
 *
 *   dist/          the normal client build — assets, and an index.html shell
 *   .ssr/          the server bundle built from src/entry-server.tsx
 *
 * For every route this renders the real React tree to markup, injects the
 * route's own <head> tags, and writes dist/<route>/index.html. The result is a
 * site whose content is in the HTML for any crawler that does not run
 * JavaScript, while the client bundle still hydrates it into the same SPA.
 *
 * Also writes sitemap.xml, and an empty app.html shell for the CMS, which is
 * deliberately not prerendered.
 */

import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(root, 'dist');
const ssrEntry = path.join(root, '.ssr', 'entry-server.js');

const SEO_BLOCK = /<!--seo:start-->[\s\S]*?<!--seo:end-->/;
const ROOT_DIV = '<div id="root"></div>';

if (!existsSync(ssrEntry)) {
  throw new Error(`Missing ${path.relative(root, ssrEntry)} — run the SSR build first.`);
}

const { PUBLIC_ROUTES, ADMIN_SHELL_ROUTES, metaFor, renderHeadTags, render } = await import(
  pathToFileURL(ssrEntry).href,
);

const template = await readFile(path.join(distDir, 'index.html'), 'utf8');

if (!SEO_BLOCK.test(template) || !template.includes(ROOT_DIV)) {
  throw new Error('dist/index.html is missing the seo markers or the empty #root div.');
}

/** Drop og:image for a screenshot that was never added to public/. */
const imageExists = (imagePath) => existsSync(path.join(distDir, imagePath.replace(/^\//, '')));

/** '/' -> dist/index.html, '/work' -> dist/work/index.html. */
function outputPath(route) {
  return route === '/'
    ? path.join(distDir, 'index.html')
    : path.join(distDir, route.replace(/^\//, ''), 'index.html');
}

function buildPage({ head, body }) {
  return template
    .replace(SEO_BLOCK, head)
    .replace(ROOT_DIV, `<div id="root">${body}</div>`);
}

async function writePage(file, html) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, html, 'utf8');
}

/* ------------------------------------------------------------------ routes */

const routes = [...PUBLIC_ROUTES];
let rendered = 0;

for (const route of routes) {
  const meta = metaFor(route);
  const head = renderHeadTags(meta, { imageExists });
  const body = render(route);

  await writePage(outputPath(route), buildPage({ head, body }));
  rendered += 1;
  console.log(`  ${route.padEnd(38)} ${(body.length / 1024).toFixed(1)} kB`);
}

/* --------------------------------------------------------------------- 404 */

/* Vercel serves this for any path that matches no file, so an unknown URL
   returns a real 404 instead of a 200 with the home page on it. */
const notFound = metaFor('/404');
await writePage(
  path.join(distDir, '404.html'),
  buildPage({ head: renderHeadTags(notFound, { imageExists }), body: render('/404') }),
);

/* ----------------------------------------------------------- CMS shells */

/* The CMS is client-only and must never be indexed, so each of its routes gets
   a file with an EMPTY root. main.tsx then takes the createRoot path instead of
   trying to hydrate markup that was rendered for some other URL.

   Giving them real files rather than one rewrite target keeps every route on
   this site resolving by the same mechanism — a static file at its own path —
   so nothing depends on how a particular host rewrites URLs. */
const adminHead = renderHeadTags(metaFor('/admin'), { imageExists });

for (const route of ADMIN_SHELL_ROUTES) {
  await writePage(outputPath(route), template.replace(SEO_BLOCK, adminHead));
}

/* ----------------------------------------------------------------- sitemap */

const lastmod = new Date().toISOString().slice(0, 10);
const indexable = routes.map(metaFor).filter((meta) => !meta.noindex);

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...indexable.map((meta) =>
    [
      '  <url>',
      `    <loc>https://shridas.com${meta.path === '/' ? '/' : meta.path}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      `    <priority>${meta.priority.toFixed(1)}</priority>`,
      '  </url>',
    ].join('\n'),
  ),
  '</urlset>',
  '',
].join('\n');

await writeFile(path.join(distDir, 'sitemap.xml'), sitemap, 'utf8');

console.log(
  `\nPrerendered ${rendered} routes + 404.html, ${ADMIN_SHELL_ROUTES.length} admin shells, ` +
    `${indexable.length} URLs in sitemap.xml`,
);
