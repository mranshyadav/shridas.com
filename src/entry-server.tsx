/**
 * Build-time server entry.
 *
 * Vite bundles this for Node (`vite build --ssr`), then `scripts/prerender.mjs`
 * imports it and calls `render()` once per public route to produce real HTML.
 * Nothing here runs in the browser or ships to visitors.
 */

import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';

import { AppRoutes } from './app/App';
import { ProvidersWrapper } from './app/contexts/ProvidersWrapper';

export { ADMIN_SHELL_ROUTES, PUBLIC_ROUTES, metaFor, renderHeadTags } from './app/seo/meta';

/** Markup for the `<div id="root">` of a single route. */
export function render(url: string): string {
  return renderToString(
    <ProvidersWrapper>
      <StaticRouter location={url}>
        <AppRoutes />
      </StaticRouter>
    </ProvidersWrapper>,
  );
}
