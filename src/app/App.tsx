import { useEffect } from 'react';
import { BrowserRouter, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProvidersWrapper } from './contexts/ProvidersWrapper';

import { Home } from './pages/Home';
import { Work } from './pages/Work';
import { CaseStudy } from './pages/CaseStudy';
import { Process } from './pages/Process';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Services } from './pages/Services';
import { AdminLogin } from './pages/AdminLogin';

import { CMSLayout } from './components/cms/CMSLayout';
import { CMSDashboard } from './components/cms/CMSDashboard';
import { ContentList } from './components/cms/ContentList';
import { ContentEditor } from './components/cms/ContentEditor';
import { MediaLibrary } from './components/cms/MediaLibrary';
import { WebsiteContentEditor } from './components/cms/WebsiteContentEditor';
import { ChatbotDashboard } from './components/cms/ChatbotDashboard';

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

export default function App() {
  return (
    <ProvidersWrapper>
      <BrowserRouter>
        <ScrollToTop />
        <Toaster position="bottom-right" />
        <Routes>
          {/* CMS — no public chrome. Reachable at /admin; not linked from the site. */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<CMSLayout />}>
            <Route index element={<CMSDashboard />} />
            <Route path="content" element={<ContentList />} />
            <Route path="content/new" element={<ContentEditor />} />
            <Route path="content/edit/:id" element={<ContentEditor />} />
            <Route path="media" element={<MediaLibrary />} />
            <Route path="website-content/edit/main" element={<WebsiteContentEditor />} />
            <Route path="chatbot" element={<ChatbotDashboard />} />
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
