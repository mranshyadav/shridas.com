import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getCaseStudy, getProject, projects } from '../data/projects';
import { Reveal } from '../components/site/Reveal';
import { ArrowLink } from '../components/site/ArrowLink';
import { Copy } from '../components/site/Copy';
import { ProjectShowcase } from '../components/site/ProjectShowcase';
import { DeviceFrame } from '../components/site/DeviceFrame';

/** Reading-progress hairline pinned under the header. */
function ReadingProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setPct(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div className="fixed inset-x-0 top-16 z-40 h-px md:top-[4.5rem]" aria-hidden="true">
      <div
        style={{
          height: '100%',
          width: `${pct * 100}%`,
          background: 'var(--signal)',
          transformOrigin: 'left',
          transition: 'width 80ms linear',
        }}
      />
    </div>
  );
}

/** A numbered long-form section with a sticky label in the left column. */
function Chapter({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rule-t grid gap-8 py-14 md:grid-cols-12 md:gap-8 md:py-20">
      <div className="md:col-span-3">
        <div className="md:sticky md:top-28">
          <p className="eyebrow">{n}</p>
          <h2 className="mt-4" style={{ fontSize: 'var(--fs-h3)' }}>
            {title}
          </h2>
        </div>
      </div>
      <div className="md:col-span-8 md:col-start-5">{children}</div>
    </section>
  );
}

/** Bulleted list with hairline separators rather than bullet glyphs. */
function RuledList({ items }: { items: string[] }) {
  return (
    <ul>
      {items.map((item, i) => (
        <li
          key={i}
          className={i === 0 ? 'py-3' : 'rule-t py-3'}
          style={{ color: 'var(--ink-secondary)', lineHeight: 'var(--lh-relaxed)' }}
        >
          <Copy>{item}</Copy>
        </li>
      ))}
    </ul>
  );
}

export function CaseStudy() {
  const { id } = useParams<{ id: string }>();
  const project = getProject(id);
  const study = getCaseStudy(id);

  if (!project || !study) {
    return (
      <section className="container-page" style={{ paddingTop: '12rem', paddingBottom: '12rem' }}>
        <p className="eyebrow">404</p>
        <h1 className="mt-6" style={{ maxWidth: '16ch' }}>
          That case study doesn’t exist.
        </h1>
        <p className="mt-8">
          <ArrowLink to="/work">Back to all work</ArrowLink>
        </p>
      </section>
    );
  }

  const position = projects.findIndex((p) => p.id === project.id);
  const next = projects[(position + 1) % projects.length];

  return (
    <>
      <ReadingProgress />

      {/* ------------------------------------------------------------ title -- */}
      <header className="container-page" style={{ paddingTop: 'clamp(6rem, 15vh, 10rem)' }}>
        <Reveal>
          <div className="flex items-baseline justify-between gap-6">
            <p className="eyebrow">
              {project.index} — Case study
            </p>
            <Link to="/work" className="eyebrow link">
              All work
            </Link>
          </div>
        </Reveal>

        <Reveal delay={60}>
          <h1 className="mt-7" style={{ maxWidth: '16ch' }}>
            {project.title}
          </h1>
        </Reveal>

        <Reveal delay={120}>
          <p className="lead mt-8" style={{ maxWidth: '52ch' }}>
            <Copy>{project.context}</Copy>
          </p>
        </Reveal>

        <Reveal delay={160}>
          <dl className="meta-list mt-14 md:grid-cols-2 md:gap-x-16" style={{ display: 'grid' }}>
            <div className="meta-row">
              <dt>Role</dt>
              <dd>
                <Copy>{study.role}</Copy>
              </dd>
            </div>
            <div className="meta-row">
              <dt>Timeline</dt>
              <dd>
                <Copy>{study.timeline}</Copy>
              </dd>
            </div>
            <div className="meta-row">
              <dt>Product</dt>
              <dd>{study.productType}</dd>
            </div>
            <div className="meta-row">
              <dt>Team</dt>
              <dd>
                <Copy>{study.context.teamSize}</Copy>
              </dd>
            </div>
          </dl>
        </Reveal>
      </header>

      {/* ---------------------------------------------------------- hero -- */}
      <Reveal delay={200}>
        <div className="container-page mt-14 md:mt-20">
          <ProjectShowcase project={project} priority />
        </div>
      </Reveal>

      {/* ----------------------------------------------------------- body -- */}
      <div className="container-page mt-20 md:mt-28">
        <Chapter n="01" title="The problem">
          <div className="flex flex-col gap-10">
            <div>
              <p className="eyebrow">For the business</p>
              <p className="mt-4" style={{ fontSize: 'var(--fs-lead)', lineHeight: 'var(--lh-relaxed)', color: 'var(--ink-secondary)' }}>
                <Copy>{study.businessProblem}</Copy>
              </p>
            </div>
            <div>
              <p className="eyebrow">For the people using it</p>
              <p className="mt-4" style={{ fontSize: 'var(--fs-lead)', lineHeight: 'var(--lh-relaxed)', color: 'var(--ink-secondary)' }}>
                <Copy>{study.userProblem}</Copy>
              </p>
            </div>
          </div>
        </Chapter>

        <Chapter n="02" title="Constraints">
          <div className="grid gap-10 sm:grid-cols-2">
            <div>
              <p className="eyebrow">What limited us</p>
              <div className="mt-3">
                <RuledList items={study.context.techLimitations} />
              </div>
            </div>
            <div>
              <p className="eyebrow">What we were aiming at</p>
              <div className="mt-3">
                <RuledList items={study.context.businessGoals} />
              </div>
            </div>
          </div>
        </Chapter>

        <Chapter n="03" title="My scope">
          <div className="grid gap-10 sm:grid-cols-2">
            <div>
              <p className="eyebrow">What I owned</p>
              <div className="mt-3">
                <RuledList items={study.ownership.whatIDid} />
              </div>
            </div>
            <div>
              <p className="eyebrow">What I didn’t</p>
              <div className="mt-3">
                <RuledList items={study.ownership.whatIDidNot} />
              </div>
            </div>
          </div>
        </Chapter>

        <Chapter n="04" title="Research">
          <div className="grid gap-10 sm:grid-cols-2">
            <div>
              <p className="eyebrow">What we found</p>
              <div className="mt-3">
                <RuledList items={study.research.keyFindings} />
              </div>
            </div>
            <div>
              <p className="eyebrow">Where it hurt</p>
              <div className="mt-3">
                <RuledList items={study.research.painPoints} />
              </div>
            </div>
          </div>
        </Chapter>

        <Chapter n="05" title="Decisions">
          <div className="flex flex-col gap-12">
            {study.designDecisions.map((d, i) => (
              <div key={i}>
                <p className="eyebrow">Decision {String(i + 1).padStart(2, '0')}</p>
                <h3 className="mt-4" style={{ fontSize: 'var(--fs-h4)' }}>
                  <Copy>{d.problem}</Copy>
                </h3>

                <div className="mt-6 border-l pl-6" style={{ borderColor: 'var(--signal-rule)' }}>
                  <p className="eyebrow">Chosen</p>
                  <p className="mt-2" style={{ color: 'var(--ink)', lineHeight: 'var(--lh-relaxed)' }}>
                    <Copy>{d.optionChosen}</Copy>
                  </p>
                </div>

                <div className="mt-5 pl-6">
                  <p className="eyebrow">Rejected, and why</p>
                  <p className="mt-2" style={{ color: 'var(--ink-secondary)', fontSize: 'var(--fs-sm)', lineHeight: 'var(--lh-relaxed)' }}>
                    <Copy>{d.whyOthersRejected}</Copy>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Chapter>
      </div>

      {/* --------------------------------------------------------- gallery -- */}
      <section className="container-page section-y" style={{ paddingBottom: 0 }}>
        <div className="rule-t pt-8">
          <p className="eyebrow">06 — The work</p>
        </div>

        <div className="mt-10 grid gap-x-8 gap-y-14 md:grid-cols-2">
          {study.screens.map((screen, i) => (
            <Reveal
              key={i}
              delay={(i % 2) * 80}
              /* The lead desktop shot takes the full measure; everything else
                 sits two-up so the gallery has a rhythm instead of a wall. */
              className={screen.wide ? 'md:col-span-2' : undefined}
            >
              <figure>
                <div
                  className={
                    screen.platform === 'mobile'
                      ? 'mx-auto max-w-[15rem]'
                      : screen.platform === 'tablet'
                        ? 'mx-auto max-w-[22rem]'
                        : ''
                  }
                >
                  <DeviceFrame
                    platform={screen.platform}
                    src={screen.src}
                    alt={screen.src ? `${project.title} — ${screen.platform} view` : ''}
                    expects={`public/work/${project.id}/${screen.platform}.png`}
                  />
                </div>
                <figcaption
                  className="mt-4 flex gap-4"
                  style={{ fontSize: 'var(--fs-sm)', color: 'var(--ink-tertiary)' }}
                >
                  <span className="num shrink-0">{String(i + 1).padStart(2, '0')}</span>
                  <span>
                    <Copy>{screen.caption}</Copy>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------- impact -- */}
      <div className="container-page mt-24 md:mt-32">
        <Chapter n="07" title="What happened">
          <div className="flex flex-col gap-10">
            <div>
              <p className="eyebrow">Measured</p>
              <div className="mt-3">
                <RuledList items={study.impact.metrics} />
              </div>
            </div>
            <div>
              <p className="eyebrow">Knock-on effects</p>
              <div className="mt-3">
                <RuledList items={study.impact.outcomes} />
              </div>
            </div>
          </div>
        </Chapter>

        <Chapter n="08" title="In hindsight">
          <div className="grid gap-10 sm:grid-cols-2">
            <div>
              <p className="eyebrow">I’d do differently</p>
              <div className="mt-3">
                <RuledList items={study.reflection.improvements} />
              </div>
            </div>
            <div>
              <p className="eyebrow">What it taught me</p>
              <div className="mt-3">
                <RuledList items={study.reflection.learnings} />
              </div>
            </div>
          </div>
        </Chapter>
      </div>

      {/* ------------------------------------------------------ next project -- */}
      <section className="container-page pb-20 md:pb-28">
        <Link to={`/case-study/${next.id}`} className="index-row group relative block px-2 py-12 md:py-16">
          <span className="index-row__wash" aria-hidden="true" />
          <div className="relative flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Next — {next.index}</p>
              <h2 className="index-row__title mt-4" style={{ fontSize: 'var(--fs-h2)' }}>
                {next.title}
              </h2>
            </div>
            <span className="eyebrow pb-2">{next.domain}</span>
          </div>
        </Link>
      </section>
    </>
  );
}
