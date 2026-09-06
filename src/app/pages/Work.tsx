import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PROMINENT_CONTRIBUTIONS, orgCount, ownedOutrightCount, projects } from '../data/projects';
import { PageHeader } from '../components/site/PageHeader';
import { Reveal } from '../components/site/Reveal';
import { ProjectShowcase } from '../components/site/ProjectShowcase';
import { ArrowLink } from '../components/site/ArrowLink';
import { Copy } from '../components/site/Copy';
import { words, Words } from '../utils/words';

/**
 * Work.
 *
 * Every project is shown in the devices it actually ships on, rather than
 * behind a stock photograph. Meta sits in the left column so the page stays
 * scannable, and the showcase takes the wide column so the work is the largest
 * thing on screen.
 */
export function Work() {
  const [active, setActive] = useState('All');

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(projects.map((p) => p.category)))],
    [],
  );

  const filtered = useMemo(
    () => (active === 'All' ? projects : projects.filter((p) => p.category === active)),
    [active],
  );

  return (
    <>
      <PageHeader
        eyebrow="Work"
        title={`${Words(projects.length)} products across ${words(orgCount)} companies.`}
        lead={`${Words(ownedOutrightCount)} of these were mine outright — designed alone, or designed and built. On the rest I contributed design, features and testing to products that already existed. Each entry says which.`}
        count={`${projects.length} products`}
      />

      <section className="container-page pb-24 md:pb-32">
        <Reveal>
          <div
            className="rule-t rule-b flex flex-wrap items-center gap-x-1 gap-y-2 py-4"
            role="group"
            aria-label="Filter projects by category"
          >
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setActive(c)}
                aria-pressed={c === active}
                className="filter-chip"
                data-active={c === active || undefined}
              >
                {c}
                {c !== 'All' ? (
                  <span className="num ml-2" style={{ fontSize: 'var(--fs-mono)', opacity: 0.55 }}>
                    {projects.filter((p) => p.category === c).length}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </Reveal>

        {filtered.length === 0 ? (
          <p className="py-24 text-center" style={{ color: 'var(--ink-tertiary)' }}>
            Nothing in this category yet.
          </p>
        ) : (
          filtered.map((project, i) => (
            <Reveal key={project.id}>
              <article className="rule-t py-14 md:py-20">
                <div className="grid gap-10 md:grid-cols-12 md:gap-8">
                  {/* ---------------------------------------------- meta -- */}
                  <div className="md:col-span-4">
                    <div className="md:sticky md:top-28">
                      <div className="flex items-baseline justify-between gap-4">
                        <span className="eyebrow">{project.index}</span>
                        <span className="eyebrow">
                          <Copy>{project.year}</Copy>
                        </span>
                      </div>

                      <h2 className="mt-5" style={{ fontSize: 'var(--fs-h2)' }}>
                        {project.title}
                      </h2>

                      <p
                        className="mt-4"
                        style={{ fontSize: 'var(--fs-sm)', color: 'var(--ink-tertiary)' }}
                      >
                        {project.org} · {project.domain}
                      </p>

                      {/* What you built versus what you improved. Stating this
                          plainly is more convincing than letting a reader
                          assume you owned everything equally. */}
                      <p className="mt-5 flex flex-wrap items-center gap-2">
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: 'var(--fs-mono)',
                            letterSpacing: 'var(--tr-mono)',
                            textTransform: 'uppercase',
                            padding: '0.3rem 0.625rem',
                            borderRadius: '999px',
                            color: PROMINENT_CONTRIBUTIONS.includes(project.contribution)
                              ? 'var(--signal)'
                              : 'var(--ink-tertiary)',
                            border: `1px solid ${
                              PROMINENT_CONTRIBUTIONS.includes(project.contribution)
                                ? 'var(--signal-rule)'
                                : 'var(--rule)'
                            }`,
                          }}
                        >
                          {project.contribution}
                        </span>
                        {project.ongoing ? <span className="eyebrow">Ongoing</span> : null}
                      </p>

                      <p
                        className="mt-6"
                        style={{ color: 'var(--ink-secondary)', lineHeight: 'var(--lh-relaxed)' }}
                      >
                        <Copy>{project.outcome}</Copy>
                      </p>

                      <dl className="meta-list mt-8">
                        <div className="meta-row">
                          <dt>Role</dt>
                          <dd>
                            <Copy>{project.role}</Copy>
                          </dd>
                        </div>
                        <div className="meta-row">
                          <dt>Scope</dt>
                          <dd>{project.tags.join(', ')}</dd>
                        </div>
                      </dl>

                      <div className="mt-8 flex flex-col gap-3">
                        <ArrowLink to={`/case-study/${project.id}`}>Read the case study</ArrowLink>
                        {/* A URL a hiring manager can click beats any description. */}
                        {project.liveUrl ? (
                          <ArrowLink href={project.liveUrl} size="sm">
                            {project.liveUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                          </ArrowLink>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {/* ------------------------------------------ showcase -- */}
                  <div className="md:col-span-8">
                    <Link
                      to={`/case-study/${project.id}`}
                      aria-label={`${project.title} — read the case study`}
                      className="block"
                    >
                      <ProjectShowcase project={project} priority={i === 0} />
                    </Link>
                  </div>
                </div>
              </article>
            </Reveal>
          ))
        )}

        <div className="rule-t" />
      </section>
    </>
  );
}
