/**
 * Keeps the live document head in sync with `metaFor()` during client-side
 * navigation.
 *
 * The prerendered HTML already carries the correct tags for the URL that was
 * requested, so this is a no-op on first paint. It matters from the second
 * route onwards: react-router swaps the view without touching `<head>`, so
 * without this the tab title, the canonical URL and any share preview
 * generated from the live DOM would still describe the landing page.
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { absoluteUrl, metaFor } from './meta';

type Selector = { attr: 'name' | 'property'; key: string };

function upsertMeta({ attr, key }: Selector, content: string): void {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function upsertCanonical(href: string): void {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  link.href = href;
}

/** Replaces every structured-data block, so stale ones never linger. */
function replaceJsonLd(blocks: Record<string, unknown>[]): void {
  document.head
    .querySelectorAll('script[type="application/ld+json"]')
    .forEach((node) => node.remove());

  for (const block of blocks) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({ '@context': 'https://schema.org', ...block });
    document.head.appendChild(script);
  }
}

export function useSeo(): null {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = metaFor(pathname);
    const url = absoluteUrl(meta.path);
    const image = absoluteUrl(meta.image);

    document.title = meta.title;

    upsertMeta({ attr: 'name', key: 'description' }, meta.description);
    upsertMeta(
      { attr: 'name', key: 'robots' },
      meta.noindex
        ? `noindex, ${meta.path.startsWith('/admin') ? 'nofollow' : 'follow'}`
        : 'index, follow, max-image-preview:large, max-snippet:-1',
    );
    upsertMeta({ attr: 'property', key: 'og:type' }, meta.type);
    upsertMeta({ attr: 'property', key: 'og:title' }, meta.title);
    upsertMeta({ attr: 'property', key: 'og:description' }, meta.description);
    upsertMeta({ attr: 'property', key: 'og:url' }, url);
    upsertMeta({ attr: 'property', key: 'og:image' }, image);
    upsertMeta({ attr: 'name', key: 'twitter:title' }, meta.title);
    upsertMeta({ attr: 'name', key: 'twitter:description' }, meta.description);
    upsertMeta({ attr: 'name', key: 'twitter:image' }, image);
    upsertCanonical(url);
    replaceJsonLd(meta.jsonLd);
  }, [pathname]);

  return null;
}
