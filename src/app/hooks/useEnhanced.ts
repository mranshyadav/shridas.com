import { useEffect, useState } from 'react';

/**
 * False during the build-time prerender and the hydrating render, true from
 * the first effect onwards.
 *
 * Every route here is prerendered to static HTML (scripts/prerender.mjs), so a
 * layout that only exists once JavaScript has run would strip its content out
 * of the markup a crawler reads. Components set `data-enhanced` from this and
 * let CSS key the interactive layout off that attribute — which means the
 * prerendered page, and the page a visitor gets if the bundle never arrives,
 * is the plain one that still works.
 */
export function useEnhanced(): boolean {
  const [enhanced, setEnhanced] = useState(false);
  useEffect(() => setEnhanced(true), []);
  return enhanced;
}
