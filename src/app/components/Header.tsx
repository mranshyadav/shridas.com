import { Link, NavLink, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { nav, site } from '../data/site';

/**
 * Site header.
 *
 * Notes on what changed from the original:
 *  - There is now a real mobile navigation. The old header positioned its nav
 *    absolutely at the centre with no small-screen fallback, so on a phone the
 *    links overlapped the wordmark and there was no way to reach any page.
 *  - The "Login" button was removed. It opened the CMS auth modal, which is an
 *    admin surface — visitors have no account and it only added confusion.
 *    /admin still works; sign in there directly.
 *  - Hover styling moved out of inline JS handlers into CSS, so keyboard focus
 *    gets the same treatment as the mouse.
 */

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="site-icon-btn"
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Light theme' : 'Dark theme'}
    >
      {isDark ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path strokeLinecap="round" d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.4 15.4A8.5 8.5 0 0 1 8.6 3.6a9 9 0 1 0 11.8 11.8Z" />
        </svg>
      )}
    </button>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  /* Close the mobile menu whenever the route changes. */
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  /* Lock body scroll behind the mobile overlay. */
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  /* Escape closes the overlay. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  /* Solidify the bar once the page has moved. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <a href="#main" className="site-skip-link">
        Skip to content
      </a>

      <header
        className="fixed inset-x-0 top-0 z-50"
        style={{
          backgroundColor: scrolled || open ? 'var(--paper)' : 'transparent',
          borderBottom: `1px solid ${scrolled && !open ? 'var(--rule)' : 'transparent'}`,
          backdropFilter: scrolled && !open ? 'saturate(180%) blur(12px)' : 'none',
          transition: 'background-color var(--dur) var(--ease-out), border-color var(--dur) var(--ease-out)',
        }}
      >
        <div className="container-page flex h-16 items-center justify-between gap-6 md:h-[4.5rem]">
          {/* Wordmark */}
          <Link to="/" className="group flex items-baseline gap-2.5" aria-label={`${site.name} — home`}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.0625rem',
                fontWeight: 'var(--fw-semibold)',
                letterSpacing: '-0.02em',
              }}
            >
              {site.name}
            </span>
            <span className="eyebrow hidden sm:inline" style={{ color: 'var(--ink-tertiary)' }}>
              {site.role}
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:block" aria-label="Primary">
            <ul className="flex items-center gap-8">
              {nav.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} className={({ isActive }) => `site-nav-link${isActive ? ' is-active' : ''}`}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            <ThemeToggle />

            <a
              href={site.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost hidden md:inline-flex"
              style={{ padding: '0.625rem 1.125rem' }}
            >
              Résumé
            </a>

            <button
              type="button"
              className="site-icon-btn md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              {open ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path strokeLinecap="round" d="M3 7h18M3 17h18" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        id="mobile-nav"
        className="fixed inset-0 z-40 md:hidden"
        hidden={!open}
        style={{
          backgroundColor: 'var(--paper)',
          paddingTop: '4rem',
          opacity: open ? 1 : 0,
          transition: 'opacity var(--dur) var(--ease-out)',
        }}
      >
        <div className="container-page flex h-full flex-col justify-between pb-10 pt-6">
          <nav aria-label="Mobile">
            <ul>
              {nav.map((item, i) => (
                <li key={item.to} className="rule-b">
                  <NavLink
                    to={item.to}
                    className="flex items-baseline gap-4 py-5"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'var(--fs-h3)',
                      fontWeight: 'var(--fw-medium)',
                      letterSpacing: 'var(--tr-heading)',
                    }}
                  >
                    <span className="eyebrow">{String(i + 1).padStart(2, '0')}</span>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-5">
            <a href={site.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full">
              Download résumé
            </a>
            <a href={`mailto:${site.email}`} className="link-quiet" style={{ fontSize: 'var(--fs-sm)' }}>
              {site.email}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
