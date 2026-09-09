import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProvidersWrapper } from './contexts/ProvidersWrapper';
import { useSeo } from './seo/useSeo';

import { Home } from './pages/Home';
import { Work } from './pages/Work';
import { CaseStudy } from './pages/CaseStudy';
import { Process } from './pages/Process';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Services } from './pages/Services';
import { AdminLogin } from './pages/AdminLogin';

/**
 * The CMS is loaded on demand, for two reasons.
 *
 * It is reachable only at /admin and never linked, yet statically importing it
 * put the whole editor — react-quill and Quill itself — into the bundle every
 * visitor downloads to read a case study.
 *
 * It also cannot be server-rendered: Quill touches `document` as soon as it is
 * imported, which would break the build-time prerender. A dynamic import keeps
 * it out of the server bundle entirely, since no prerendered route is under
 * /admin.
 */
const CMSLayout = lazy(() => import('./components/cms/CMSLayout').then((m) => ({ default: m.CMSLayout })));
const CMSDashboard = lazy(() => import('./components/cms/CMSDashboard').then((m) => ({ default: m.CMSDashboard })));
const ContentList = lazy(() => import('./components/cms/ContentList').then((m) => ({ default: m.ContentList })));
const ContentEditor = lazy(() => import('./components/cms/ContentEditor').then((m) => ({ default: m.ContentEditor })));
const MediaLibrary = lazy(() => import('./components/cms/MediaLibrary').then((m) => ({ default: m.MediaLibrary })));
const WebsiteContentEditor = lazy(() =>
  import('./components/cms/WebsiteContentEditor').then((m) => ({ default: m.WebsiteContentEditor })),
);
const ChatbotDashboard = lazy(() => import('./components/cms/ChatbotDashboard').then((m) => ({ default: m.ChatbotDashboard })));

/** Reset scroll position on navigation, but leave hash links alone. */
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

/**
 * Public shell.
 *
 * The old layout special-cased case-study pages: it hid the header and footer,
 * hard-coded a dark background, and pushed content down with a 120px magic
 * number to clear a dismissible banner. Case studies are the pages a recruiter
 * lands on from a link, so stranding them without navigation was the worst
 * place to do it. Everything now shares one shell.
 */
function PublicLayout() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--paper)', color: 'var(--ink)' }}>
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

/**
 * Everything inside a router, and nothing that assumes which router it is.
 *
 * `App` mounts it under a BrowserRouter in the browser; `entry-server.tsx`
 * mounts the same tree under a StaticRouter to prerender each route to static
 * HTML at build time. Keeping one component means the two can never drift.
 */
export function AppRoutes() {
  useSeo();

  return (
    <>
      <ScrollToTop />
      <Toaster position="bottom-right" />
      <Routes>
        {/* CMS — no public chrome. Reachable at /admin; not linked from the site. */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <Suspense fallback={null}>
              <CMSLayout />
            </Suspense>
          }
        >
          <Route index element={<Suspense fallback={null}><CMSDashboard /></Suspense>} />
          <Route path="content" element={<Suspense fallback={null}><ContentList /></Suspense>} />
          <Route path="content/new" element={<Suspense fallback={null}><ContentEditor /></Suspense>} />
          <Route path="content/edit/:id" element={<Suspense fallback={null}><ContentEditor /></Suspense>} />
          <Route path="media" element={<Suspense fallback={null}><MediaLibrary /></Suspense>} />
          <Route path="website-content/edit/main" element={<Suspense fallback={null}><WebsiteContentEditor /></Suspense>} />
          <Route path="chatbot" element={<Suspense fallback={null}><ChatbotDashboard /></Suspense>} />
        </Route>

        {/* Public site */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/work" element={<Work />} />
          <Route path="/case-study/:id" element={<CaseStudy />} />
          <Route path="/process" element={<Process />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <ProvidersWrapper>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ProvidersWrapper>
  );
}

function NotFound() {
  return (
    <section className="container-page" style={{ paddingTop: '12rem', paddingBottom: '12rem' }}>
      <p className="eyebrow">404</p>
      <h1 className="mt-6" style={{ maxWidth: '14ch' }}>
        This page doesn’t exist.
      </h1>
      <p className="lead mt-8" style={{ maxWidth: '40ch' }}>
        The link may be out of date. The work is the best place to start.
      </p>
      <a href="/work" className="btn btn-primary mt-10">
        See selected work
      </a>
    </section>
  );
}
