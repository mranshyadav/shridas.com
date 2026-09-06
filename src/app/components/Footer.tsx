import { Link } from 'react-router-dom';
import { nav, site } from '../data/site';
import { ArrowLink } from './site/ArrowLink';

/**
 * Footer. Deliberately quiet: contact, navigation, elsewhere, colophon.
 * The original version carried five large social cards and a duplicate contact
 * form, which competed with the contact page for the same action.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="container-page" style={{ paddingBottom: '3rem' }}>
      <div className="rule-t pt-12 md:pt-16">
        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          {/* Contact */}
          <div className="md:col-span-5">
            <p className="eyebrow">Get in touch</p>
            <a
              href={`mailto:${site.email}`}
              className="link mt-5 inline-block"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--fs-h3)',
                fontWeight: 'var(--fw-medium)',
                letterSpacing: 'var(--tr-heading)',
              }}
            >
              {site.email}
            </a>
            <p className="mt-4" style={{ fontSize: 'var(--fs-sm)', color: 'var(--ink-tertiary)' }}>
              {site.location} · {site.timezone}
            </p>
            {site.availability.open ? (
              <p className="mt-5 flex items-center gap-2.5" style={{ fontSize: 'var(--fs-sm)', color: 'var(--ink-secondary)' }}>
                <span className="live-dot" aria-hidden="true" />
                {site.availability.label}
              </p>
            ) : null}
          </div>

          {/* Navigation */}
          <nav className="md:col-span-3 md:col-start-7" aria-label="Footer">
            <p className="eyebrow">Pages</p>
            <ul className="mt-5 flex flex-col gap-3">
              <li>
                <Link to="/" className="link" style={{ fontSize: 'var(--fs-sm)' }}>
                  Home
                </Link>
              </li>
              {nav.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="link" style={{ fontSize: 'var(--fs-sm)' }}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Elsewhere */}
          <div className="md:col-span-3 md:col-start-10">
            <p className="eyebrow">Elsewhere</p>
            <ul className="mt-5 flex flex-col gap-3">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <ArrowLink href={s.url} size="sm">
                    {s.label}
                  </ArrowLink>
                </li>
              ))}
              <li>
                <ArrowLink href={site.resumeUrl} size="sm">
                  Résumé
                </ArrowLink>
              </li>
            </ul>
          </div>
        </div>

        {/* Colophon */}
        <div
          className="rule-t mt-16 flex flex-wrap items-center justify-between gap-4 pt-6"
          style={{ fontSize: 'var(--fs-xs)', color: 'var(--ink-tertiary)' }}
        >
          <p>
            © {year} {site.name}
          </p>
          <p>
            Set in Inter Tight &amp; JetBrains Mono. Built with React and Tailwind.
          </p>
        </div>
      </div>
    </footer>
  );
}
