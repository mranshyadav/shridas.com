import { useState } from 'react';
import { Link } from 'react-router-dom';
import { services, process } from '../data/services';
import { site } from '../data/site';
import { PageHeader } from '../components/site/PageHeader';
import { SectionHeading } from '../components/site/SectionHeading';
import { Reveal } from '../components/site/Reveal';

/**
 * Services — freelance engagements, kept separate from the portfolio proper.
 *
 * Each service is a disclosure row rather than a card: the whole list is
 * scannable in one screen, and only the one you care about expands. The old
 * version rendered eight full-bleed image cards, which buried the pricing and
 * made comparison impossible without scrolling back and forth.
 */
export function Services() {
  const [open, setOpen] = useState<string | null>(services[0]?.id ?? null);

  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Freelance engagements."
        lead="Fixed-scope design work for teams without a designer in the building. Prices are starting points — the real number depends on scope, which we agree before anything begins."
        count={`${services.length} offerings`}
      />

      <section className="container-page">
        <div>
          {services.map((service) => {
            const isOpen = open === service.id;
            return (
              <div key={service.id} className="rule-t">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : service.id)}
                    aria-expanded={isOpen}
                    aria-controls={`panel-${service.id}`}
                    className="service-row"
                  >
                    <span className="service-row__title">{service.title}</span>

                    <span className="service-row__meta">
                      <span className="num" style={{ fontSize: 'var(--fs-sm)' }}>
                        {service.price}
                      </span>
                      <span
                        className="service-row__sign"
                        data-open={isOpen || undefined}
                        aria-hidden="true"
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M1 7h12" stroke="currentColor" strokeWidth="1.25" />
                          <path d="M7 1v12" stroke="currentColor" strokeWidth="1.25" className="service-row__bar" />
                        </svg>
                      </span>
                    </span>
                  </button>
                </h3>

                <div id={`panel-${service.id}`} hidden={!isOpen} className="pb-10">
                  <div className="grid gap-8 md:grid-cols-12">
                    <p
                      className="md:col-span-5"
                      style={{ color: 'var(--ink-secondary)', lineHeight: 'var(--lh-relaxed)' }}
                    >
                      {service.description}
                    </p>

                    <div className="md:col-span-4">
                      <p className="eyebrow">Deliverables</p>
                      <ul className="mt-4 flex flex-col gap-2.5">
                        {service.deliverables.map((d) => (
                          <li
                            key={d}
                            className="flex gap-3"
                            style={{ fontSize: 'var(--fs-sm)', color: 'var(--ink-secondary)' }}
                          >
                            <span aria-hidden="true" style={{ color: 'var(--signal)' }}>
                              —
                            </span>
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="md:col-span-3">
                      <dl className="meta-list">
                        <div className="meta-row">
                          <dt>Timeline</dt>
                          <dd>{service.timeline}</dd>
                        </div>
                      </dl>
                      <Link to="/contact" className="btn btn-ghost mt-6 w-full">
                        Enquire
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="rule-t" />
        </div>
      </section>

      {/* --------------------------------------------------------- process -- */}
      <section className="container-page section-y">
        <SectionHeading
          eyebrow="How it runs"
          title="Four stages, no surprises."
          lead="You see work at the end of every stage, and nothing moves forward until you have."
        />

        <div className="mt-12 grid gap-px md:mt-16 md:grid-cols-4" style={{ backgroundColor: 'var(--rule)' }}>
          {process.map((step, i) => (
            <Reveal key={step.n} delay={i * 70}>
              <div className="h-full py-8 md:px-6 md:py-9" style={{ backgroundColor: 'var(--paper)' }}>
                <p className="eyebrow">{step.n}</p>
                <h3 className="mt-5" style={{ fontSize: 'var(--fs-h4)' }}>
                  {step.title}
                </h3>
                <p
                  className="mt-3"
                  style={{ fontSize: 'var(--fs-sm)', color: 'var(--ink-secondary)', lineHeight: 'var(--lh-relaxed)' }}
                >
                  {step.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------ next -- */}
      <section className="container-page pb-24 md:pb-32">
        <Reveal>
          <div className="rule-t flex flex-wrap items-end justify-between gap-8 pt-12">
            <div>
              <h2 style={{ maxWidth: '16ch' }}>Not sure which one you need?</h2>
              <p className="lead mt-5" style={{ maxWidth: '42ch' }}>
                Describe the problem and I’ll tell you the smallest piece of work that would move it.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <Link to="/contact" className="btn btn-primary">
                Start a conversation
              </Link>
              <a href={`mailto:${site.email}`} className="link-quiet" style={{ fontSize: 'var(--fs-sm)' }}>
                {site.email}
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
