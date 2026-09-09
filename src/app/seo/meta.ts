/**
 * Per-route metadata — the single source of truth for what a crawler sees.
 *
 * The site is a client-rendered SPA, so until now every URL served the same
 * `index.html`: one title, one description, and an empty `<div id="root">`.
 * Anything that does not execute JavaScript — most social-card unfurlers, LLM
 * fetchers, and the cheaper end of search crawling — saw a blank page on all
 * twenty-six public URLs.
 *
 * Two consumers read this module, and they must agree:
 *
 *   1. `scripts/prerender.mjs` at build time, which bakes `renderHeadTags()`
 *      into the static HTML written for every route.
 *   2. `useSeo()` in the browser, which re-applies the same values to the live
 *      document on client-side navigation.
 *
 * Keep both fed from `metaFor()` — never hand-write a tag in one place only.
 */

import { orgCount, projects, type Project } from '../data/projects';
import { services } from '../data/services';
import { site } from '../data/site';

export const SITE_URL = 'https://shridas.com';

/**
 * Fallback share image. There is no purpose-built OG card yet, so this borrows
 * the lead Query.ai screenshot — real work, correct aspect ratio, already in
 * `public/`. Replace with a dedicated `/og.jpg` (1200x630) when one exists and
 * this constant is the only line that needs to change.
 */
const DEFAULT_IMAGE = '/work/query-ai/desktop.jpg';

export interface PageMeta {
  /** Canonical pathname, no trailing slash except for the root. */
  path: string;
  title: string;
  description: string;
  /** Site-relative path to the share image. */
  image: string;
  type: 'website' | 'article';
  /** Kept out of the sitemap and marked `noindex` for crawlers. */
  noindex: boolean;
  /** Sitemap priority. */
  priority: number;
  /** Structured data blocks, emitted as separate ld+json scripts. */
  jsonLd: Record<string, unknown>[];
}

/* -------------------------------------------------------------------------- */
/*  Text helpers                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Portfolio copy carries unwritten passages in [square brackets] (see
 * `components/site/Copy.tsx`). Those must never reach a search result, so they
 * are stripped rather than truncated around.
 */
function plain(text: string): string {
  return text
    .replace(/\[[^\]]*\]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.;:])/g, '$1')
    .trim();
}

/** Trim to a length search engines will actually display, at a word boundary. */
function clamp(text: string, max = 158): string {
  const clean = plain(text);
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:.—-]$/, '')}…`;
}

export function absoluteUrl(path: string): string {
  return path.startsWith('http') ? path : `${SITE_URL}${path}`;
}

/* -------------------------------------------------------------------------- */
/*  Structured data                                                           */
/* -------------------------------------------------------------------------- */

const PERSON_ID = `${SITE_URL}/#person`;

/** The one Person node every other block points at, rather than restating it. */
function personNode(): Record<string, unknown> {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: site.name,
    url: SITE_URL,
    jobTitle: site.role,
    email: `mailto:${site.email}`,
    telephone: site.phoneHref,
    address: { '@type': 'PostalAddress', addressLocality: 'New Delhi', addressCountry: 'IN' },
    sameAs: site.socials.map((s) => s.url),
    knowsAbout: [
      'Product design',
      'User experience design',
      'Design systems',
      'Interaction design',
      'User research',
      'Enterprise software',
    ],
  };
}

function websiteNode(): Record<string, unknown> {
  return {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: `${site.name} — ${site.role}`,
    inLanguage: 'en',
    publisher: { '@id': PERSON_ID },
  };
}

/** Trail back to the home page, so results render a path instead of a bare URL. */
function breadcrumbs(trail: Array<{ name: string; path: string }>): Record<string, unknown> {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Home', path: '/' }, ...trail].map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

/* -------------------------------------------------------------------------- */
/*  Case studies                                                              */
/* -------------------------------------------------------------------------- */

function caseStudyPath(project: Project): string {
  return `/case-study/${project.id}`;
}

function caseStudyMeta(project: Project): PageMeta {
  const image = project.screens.desktop ?? project.screens.tablet ?? project.screens.mobile ?? DEFAULT_IMAGE;
  /* Deliberately article-free: `domain` is a noun phrase written in title
     case ("Enterprise data analytics & AI"), so gluing "a"/"an" in front of it
     mangles both the grammar and the acronyms. */
  const description = clamp(
    `${project.contribution} — ${project.title}, ${project.domain} at ${project.org}. ${project.context}`,
  );

  return {
    path: caseStudyPath(project),
    title: `${project.title} — ${project.domain} case study · ${site.name}`,
    description,
    image,
    type: 'article',
    noindex: false,
    priority: 0.8,
    jsonLd: [
      {
        '@type': 'Article',
        headline: `${project.title} — ${project.domain}`,
        description,
        image: absoluteUrl(image),
        url: absoluteUrl(caseStudyPath(project)),
        author: { '@id': PERSON_ID },
        publisher: { '@id': PERSON_ID },
        about: plain(project.domain),
        keywords: project.tags.join(', '),
        isPartOf: { '@id': `${SITE_URL}/#website` },
      },
      personNode(),
      breadcrumbs([
        { name: 'Work', path: '/work' },
        { name: project.title, path: caseStudyPath(project) },
      ]),
    ],
  };
}

/* -------------------------------------------------------------------------- */
/*  Static routes                                                             */
/* -------------------------------------------------------------------------- */

const STATIC_PAGES: PageMeta[] = [
  {
    path: '/',
    title: `${site.name} — ${site.role}`,
    description: clamp(
      `${site.name}, ${site.role.toLowerCase()}. ${projects.length} products across ${orgCount} companies — enterprise analytics, fleet operations, payments and design systems. Shipped, not concepts.`,
    ),
    image: DEFAULT_IMAGE,
    type: 'website',
    noindex: false,
    priority: 1,
    jsonLd: [
      websiteNode(),
      personNode(),
      {
        '@type': 'ProfilePage',
        url: SITE_URL,
        mainEntity: { '@id': PERSON_ID },
      },
    ],
  },
  {
    path: '/work',
    title: `Selected work — ${site.name}`,
    description: clamp(
      `${projects.length} products across ${orgCount} companies — enterprise analytics, fleet management, payments, internal tooling and design systems. Each entry states what was mine.`,
    ),
    image: DEFAULT_IMAGE,
    type: 'website',
    noindex: false,
    priority: 0.9,
    jsonLd: [
      {
        '@type': 'CollectionPage',
        url: absoluteUrl('/work'),
        name: 'Selected work',
        isPartOf: { '@id': `${SITE_URL}/#website` },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: projects.length,
          itemListElement: projects.map((project, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: absoluteUrl(caseStudyPath(project)),
            name: `${project.title} — ${project.domain}`,
          })),
        },
      },
      breadcrumbs([{ name: 'Work', path: '/work' }]),
    ],
  },
  {
    path: '/about',
    title: `About — ${site.name}, ${site.role}`,
    description: clamp(
      'I design the parts of software people can’t avoid — the settings screen, the bulk action, the empty state at 2am when something has gone wrong.',
    ),
    image: DEFAULT_IMAGE,
    type: 'website',
    noindex: false,
    priority: 0.8,
    jsonLd: [
      { '@type': 'AboutPage', url: absoluteUrl('/about'), mainEntity: { '@id': PERSON_ID } },
      personNode(),
      breadcrumbs([{ name: 'About', path: '/about' }]),
    ],
  },
  {
    path: '/services',
    title: `Freelance design services — ${site.name}`,
    description: clamp(
      'Fixed-scope product and UX design for teams without a designer in the building: websites, mobile and web apps, design systems and end-to-end UX.',
    ),
    image: DEFAULT_IMAGE,
    type: 'website',
    noindex: false,
    priority: 0.7,
    jsonLd: [
      {
        '@type': 'CollectionPage',
        url: absoluteUrl('/services'),
        name: 'Freelance engagements',
        isPartOf: { '@id': `${SITE_URL}/#website` },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: services.length,
          itemListElement: services.map((service, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: {
              '@type': 'Service',
              name: service.title,
              description: plain(service.description),
              serviceType: service.title,
              provider: { '@id': PERSON_ID },
              areaServed: 'Worldwide',
            },
          })),
        },
      },
      breadcrumbs([{ name: 'Services', path: '/services' }]),
    ],
  },
  {
    path: '/process',
    title: `How a project runs — ${site.name}`,
    description: clamp(
      'Four stages, from framing to handoff. You see work at the end of each one, and nothing moves forward until you have.',
    ),
    image: DEFAULT_IMAGE,
    type: 'website',
    noindex: false,
    priority: 0.5,
    jsonLd: [breadcrumbs([{ name: 'Process', path: '/process' }])],
  },
  {
    path: '/contact',
    title: `Contact — ${site.name}`,
    description: clamp(
      'Get in touch about a product design role or a freelance engagement. Based in New Delhi, working remotely. I read everything that comes in.',
    ),
    image: DEFAULT_IMAGE,
    type: 'website',
    noindex: false,
    priority: 0.6,
    jsonLd: [
      { '@type': 'ContactPage', url: absoluteUrl('/contact'), mainEntity: { '@id': PERSON_ID } },
      personNode(),
      breadcrumbs([{ name: 'Contact', path: '/contact' }]),
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*  Lookup                                                                    */
/* -------------------------------------------------------------------------- */

/** Every public URL worth prerendering and listing in the sitemap. */
export const PUBLIC_ROUTES: string[] = [
  ...STATIC_PAGES.map((page) => page.path),
  ...projects.map(caseStudyPath),
];

/**
 * The CMS routes, which get an empty prerendered shell rather than markup —
 * they are client-only and must not be indexed. They still need a file each,
 * so that a direct hit on /admin/media resolves to something instead of the
 * 404 page. Mirrors the /admin routes in App.tsx.
 *
 * `/admin/content/edit/:id` is dynamic and cannot be enumerated; the shell
 * written for `/admin/content/edit` backs it via a rewrite in vercel.json.
 */
export const ADMIN_SHELL_ROUTES: string[] = [
  '/admin',
  '/admin/login',
  '/admin/content',
  '/admin/content/new',
  '/admin/content/edit',
  '/admin/media',
  '/admin/website-content/edit/main',
  '/admin/chatbot',
];

function normalise(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
}

/**
 * The CMS. Never prerendered and never indexed, but it still needs a title of
 * its own — without this it would fall through to the 404 entry and every
 * admin screen would read "Page not found" in the tab.
 */
const ADMIN: PageMeta = {
  path: '/admin',
  title: 'Admin — shridas.com',
  description: 'Content management for shridas.com.',
  image: DEFAULT_IMAGE,
  type: 'website',
  noindex: true,
  priority: 0,
  jsonLd: [],
};

const NOT_FOUND: PageMeta = {
  path: '/404',
  title: `Page not found — ${site.name}`,
  description: 'This page doesn’t exist. The work is the best place to start.',
  image: DEFAULT_IMAGE,
  type: 'website',
  noindex: true,
  priority: 0,
  jsonLd: [],
};

/**
 * Metadata for a pathname. Unknown paths — including `/admin`, which must never
 * be indexed — fall through to a `noindex` result rather than inheriting the
 * home page's tags, which is what a single static `index.html` gave them.
 */
export function metaFor(pathname: string): PageMeta {
  const path = normalise(pathname);

  const staticPage = STATIC_PAGES.find((page) => page.path === path);
  if (staticPage) return staticPage;

  if (path === '/admin' || path.startsWith('/admin/')) return { ...ADMIN, path };

  const caseStudy = path.startsWith('/case-study/')
    ? projects.find((project) => project.id === path.slice('/case-study/'.length))
    : undefined;
  if (caseStudy) return caseStudyMeta(caseStudy);

  return { ...NOT_FOUND, path };
}

/* -------------------------------------------------------------------------- */
/*  Head rendering (build time)                                               */
/* -------------------------------------------------------------------------- */

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** `</script>` inside JSON would close the tag early; escape the angle bracket. */
function escapeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

/**
 * The `<head>` block baked into each prerendered file. Mirrors what `useSeo()`
 * applies in the browser — change one, change the other.
 */
export function renderHeadTags(meta: PageMeta, options: { imageExists?: (path: string) => boolean } = {}): string {
  const url = absoluteUrl(meta.path);
  const hasImage = options.imageExists ? options.imageExists(meta.image) : true;
  const image = absoluteUrl(meta.image);

  const tags = [
    `<title>${escapeAttr(meta.title)}</title>`,
    `<meta name="description" content="${escapeAttr(meta.description)}" />`,
    `<meta name="author" content="${escapeAttr(site.name)}" />`,
    `<link rel="canonical" href="${escapeAttr(url)}" />`,
    meta.noindex
      ? `<meta name="robots" content="noindex, ${meta.path.startsWith('/admin') ? 'nofollow' : 'follow'}" />`
      : '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />',
    `<meta property="og:type" content="${meta.type}" />`,
    `<meta property="og:site_name" content="${escapeAttr(site.name)}" />`,
    `<meta property="og:title" content="${escapeAttr(meta.title)}" />`,
    `<meta property="og:description" content="${escapeAttr(meta.description)}" />`,
    `<meta property="og:url" content="${escapeAttr(url)}" />`,
    '<meta property="og:locale" content="en_US" />',
    ...(hasImage
      ? [
          `<meta property="og:image" content="${escapeAttr(image)}" />`,
          `<meta property="og:image:alt" content="${escapeAttr(meta.title)}" />`,
          '<meta name="twitter:card" content="summary_large_image" />',
          `<meta name="twitter:image" content="${escapeAttr(image)}" />`,
        ]
      : ['<meta name="twitter:card" content="summary" />']),
    `<meta name="twitter:title" content="${escapeAttr(meta.title)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(meta.description)}" />`,
    ...meta.jsonLd.map(
      (block) =>
        `<script type="application/ld+json">${escapeJsonLd({ '@context': 'https://schema.org', ...block })}</script>`,
    ),
  ];

  return tags.join('\n    ');
}
