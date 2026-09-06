import { Link } from 'react-router-dom';
import { site } from '../data/site';
import { PageHeader } from '../components/site/PageHeader';
import { SectionHeading } from '../components/site/SectionHeading';
import { Reveal } from '../components/site/Reveal';
import { Copy } from '../components/site/Copy';
import { Portrait } from '../components/site/Portrait';
import { careerStartYear, experience } from '../data/experience';
import { words, Words } from '../utils/words';

const toolkit = [
  { group: 'Design', items: ['Information architecture', 'Wireframing', 'Interaction design', 'Design systems'] },
  { group: 'Research', items: ['User interviews', 'Usability testing', 'Journey mapping', 'Competitive analysis'] },
  { group: 'Tools', items: ['Figma', 'Adobe XD', 'Adobe Illustrator', 'Adobe Photoshop'] },
  { group: 'Working with eng', items: ['Design specs', 'Component handoff', 'Selenium testing', 'QA passes'] },
];

export function About() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="I design the parts of software people can’t avoid."
        lead="Not the landing page — the settings screen, the bulk action, the empty state at 2am when something has gone wrong. That’s where products are actually won or lost."
      />

      {/* --------------------------------------------------- portrait + bio -- */}
      <section className="container-page">
        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          <Reveal className="md:col-span-5">
            <Portrait />
            <figcaption className="eyebrow mt-4">
              {site.name} — {site.location}
            </figcaption>
          </Reveal>

          <Reveal delay={100} className="md:col-span-6 md:col-start-7">
            <div className="prose-body">
              <p>
                I started at Nityom in 2022 as a graphic design intern. Six months in I moved to a UI/UX
                internship, and stayed on as a junior designer for another year and four months —{' '}
                <Copy>[what changed for you between making things look right and making them work]</Copy>.
              </p>
              <p>
                At Neuromotion Systems I worked as a product designer inside the product engineering team,
                sitting with the people building what I drew.{' '}
                <Copy>
                  [What you shipped there, and what designing next to engineers taught you about scope.]
                </Copy>
              </p>
              <p>
                I now work part-time with CheckMed and SRIIO, and at both I design the work and then build
                the front end of it. At CheckMed that spans several interconnected products, which means
                holding a whole platform in my head rather than one screen at a time — including its design
                system, which I built from scratch and ships as an npm package. At SRIIO I am the only
                designer on four products at once — a payment orchestration platform and its client portal,
                a storefront, and the authentication system they all sign in through.{' '}
                <Copy>[Add the part you find most interesting about that.]</Copy>
              </p>
              <p>
                <Copy>
                  [Close with what you want next, and be specific — team size, product stage, the problems
                  you want to work on. Vagueness here costs you the interviews you actually want.]
                </Copy>
              </p>
            </div>

            <dl className="meta-list mt-10">
              <div className="meta-row">
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${site.email}`} className="link">
                    {site.email}
                  </a>
                </dd>
              </div>
              <div className="meta-row">
                <dt>LinkedIn</dt>
                <dd>
                  <a href={site.socials[0].url} target="_blank" rel="noopener noreferrer" className="link">
                    {site.socials[0].handle}
                  </a>
                </dd>
              </div>
              <div className="meta-row">
                <dt>Résumé</dt>
                <dd>
                  <a href={site.resumeUrl} target="_blank" rel="noopener noreferrer" className="link">
                    Download PDF
                  </a>
                </dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </section>

      {/* -------------------------------------------------------- experience -- */}
      <section className="container-page section-y">
        <SectionHeading
          eyebrow="01 — Experience"
          title={`${Words(new Date().getFullYear() - careerStartYear)} years, ${words(experience.length)} companies.`}
          lead="Graphic design to interface design to product design, in that order. The two current roles run alongside each other."
        />

        <div className="mt-12 md:mt-16">
          {experience.map((position, i) => (
            <Reveal key={position.company} delay={i * 70}>
              <div className="rule-t grid gap-4 py-9 md:grid-cols-12 md:gap-8 md:py-11">
                {/* Company + dates */}
                <div className="md:col-span-4">
                  <div className="flex items-center gap-2.5">
                    {position.current ? <span className="live-dot" aria-hidden="true" /> : null}
                    <h3 style={{ fontSize: 'var(--fs-h4)' }}>{position.company}</h3>
                  </div>
                  <p className="eyebrow mt-3">
                    {position.span} · {position.duration}
                  </p>
                  <p className="mt-2" style={{ fontSize: 'var(--fs-sm)', color: 'var(--ink-tertiary)' }}>
                    {position.location}
                  </p>
                </div>

                {/* Roles held there */}
                <div className="md:col-span-8">
                  {position.roles.map((role, j) => (
                    <div
                      key={role.title}
                      className={j > 0 ? 'mt-7 border-t pt-7' : ''}
                      style={j > 0 ? { borderColor: 'var(--rule)' } : undefined}
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                        <p style={{ fontWeight: 'var(--fw-medium)' }}>{role.title}</p>
                        <p className="eyebrow">
                          {role.employment}
                          {role.arrangement ? ` · ${role.arrangement}` : ''}
                        </p>
                      </div>

                      {/* Only repeat the dates when a company had more than one role. */}
                      {position.roles.length > 1 ? (
                        <p className="mt-1.5" style={{ fontSize: 'var(--fs-sm)', color: 'var(--ink-tertiary)' }}>
                          {role.period} · {role.duration}
                        </p>
                      ) : null}

                      <p
                        className="mt-3"
                        style={{
                          fontSize: 'var(--fs-sm)',
                          color: 'var(--ink-secondary)',
                          lineHeight: 'var(--lh-relaxed)',
                          maxWidth: '58ch',
                        }}
                      >
                        <Copy>{role.note}</Copy>
                      </p>

                      {role.skills ? (
                        <ul className="mt-4 flex flex-wrap gap-x-2 gap-y-2">
                          {role.skills.map((skill) => (
                            <li
                              key={skill}
                              style={{
                                fontSize: 'var(--fs-xs)',
                                color: 'var(--ink-tertiary)',
                                border: '1px solid var(--rule)',
                                borderRadius: '999px',
                                padding: '0.25rem 0.625rem',
                              }}
                            >
                              {skill}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
          <div className="rule-t" />
        </div>
      </section>

      {/* ----------------------------------------------------------- toolkit -- */}
      <section className="container-page section-y" style={{ paddingTop: 0 }}>
        <SectionHeading
          eyebrow="02 — Toolkit"
          title="What I actually use."
          lead="Listed by what it’s for rather than by logo, because a tool list tells you nothing about whether someone can run a research round."
        />

        <div className="mt-12 grid gap-px md:mt-16 md:grid-cols-4" style={{ backgroundColor: 'var(--rule)' }}>
          {toolkit.map((t, i) => (
            <Reveal key={t.group} delay={i * 60}>
              <div className="h-full py-8 md:px-6 md:py-9" style={{ backgroundColor: 'var(--paper)' }}>
                <p className="eyebrow">{t.group}</p>
                <ul className="mt-5 flex flex-col gap-2.5">
                  {t.items.map((item) => (
                    <li key={item} style={{ fontSize: 'var(--fs-sm)', color: 'var(--ink-secondary)' }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------------- next -- */}
      <section className="container-page section-y" style={{ paddingTop: 0 }}>
        <Reveal>
          <div className="rule-t flex flex-wrap items-end justify-between gap-8 pt-12 md:pt-16">
            <h2 style={{ maxWidth: '14ch' }}>Read the work instead.</h2>
            <Link to="/work" className="btn btn-primary">
              Selected work
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
