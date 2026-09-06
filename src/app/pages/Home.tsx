import { Link } from 'react-router-dom';
import { orgCount, ownedOutrightCount, projects } from '../data/projects';
import { site } from '../data/site';
import { careerStartYear, currentCompanies, previousCompanies } from '../data/experience';
import { WorkIndex } from '../components/site/WorkIndex';
import { SectionHeading } from '../components/site/SectionHeading';
import { Reveal } from '../components/site/Reveal';
import { ArrowLink } from '../components/site/ArrowLink';
import { words, Words } from '../utils/words';

const capabilities = [
  {
    n: '01',
    title: 'Research & framing',
    body: 'Interviews, usability testing and behavioural data — used to narrow a vague brief into a problem worth solving, before anything gets drawn.',
  },
  {
    n: '02',
    title: 'Systems & interaction',
    body: 'Information architecture, flows and component libraries for products with real complexity: permissions, edge cases, states nobody wants to design.',
  },
  {
    n: '03',
    title: 'Shipping with engineers',
    body: 'Specs that survive contact with a sprint. Close review during build, and the willingness to cut scope rather than ship a broken half of something.',
  },
];

const principles = [
  {
    k: 'Constraints first',
    v: 'The technical and business limits are part of the brief, not an obstacle to it. Designs that ignore them get redrawn later at someone else’s cost.',
  },
  {
    k: 'Show the reasoning',
    v: 'Every screen in my case studies carries the alternative that lost and why. A decision you can’t explain isn’t a decision, it’s a preference.',
  },
  {
    k: 'Measure honestly',
    v: 'If a change didn’t move anything, that gets said too. Portfolios full of wins are portfolios missing the interesting half.',
  },
];

export function Home() {

  return (
    <>
      {/* ------------------------------------------------------------- hero -- */}
      <section className="container-page" style={{ paddingTop: 'clamp(5rem, 14vh, 9rem)' }}>
        <Reveal>
          <div className="flex items-center gap-2.5">
            {site.availability.open ? <span className="live-dot" aria-hidden="true" /> : null}
            <p className="eyebrow" style={{ color: 'var(--ink-secondary)' }}>
              {site.availability.label}
            </p>
          </div>
        </Reveal>

        <Reveal delay={60}>
          <h1 className="display mt-8" style={{ maxWidth: '15ch' }}>
            Product designer working on complex systems.
          </h1>
        </Reveal>

        <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-12 md:gap-8">
          <Reveal delay={120} className="md:col-span-7">
            <p className="lead" style={{ maxWidth: '48ch' }}>
              I design software where the hard part isn’t the surface — it’s the model underneath.
              Dashboards, workflows and tools that people use every day, for hours, on purpose.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link to="/work" className="btn btn-primary">
                See selected work
              </Link>
              <a href={site.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                Download résumé
              </a>
            </div>
          </Reveal>

          <Reveal delay={180} className="md:col-span-4 md:col-start-9">
            <dl className="meta-list">
              <div className="meta-row">
                <dt>Currently</dt>
                <dd>Product Designer at {currentCompanies.join(' and ')}</dd>
              </div>
              <div className="meta-row">
                <dt>Previously</dt>
                <dd>{previousCompanies.join(', ')}</dd>
              </div>
              <div className="meta-row">
                <dt>Based in</dt>
                <dd>{site.location}</dd>
              </div>
              <div className="meta-row">
                <dt>Designing since</dt>
                <dd className="num">{careerStartYear}</dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------- selected work -- */}
      <section className="container-page section-y" id="work">
        <SectionHeading
          eyebrow="01 — Selected work"
          title={`${Words(projects.length)} products, ${words(orgCount)} companies.`}
          lead={`${Words(ownedOutrightCount)} were mine outright — designed alone, or designed and built. On the rest I contributed design, features and testing. Full write-ups on the work page.`}
          aside={<ArrowLink to="/work">All work</ArrowLink>}
        />

        <div className="mt-12 md:mt-16">
          <WorkIndex projects={projects} />
        </div>
      </section>

      {/* ----------------------------------------------------- capabilities -- */}
      <section className="container-page section-y" style={{ paddingTop: 0 }}>
        <SectionHeading eyebrow="02 — What I do" title="Three things, done properly." />

        <div className="mt-12 grid gap-px md:mt-16 md:grid-cols-3" style={{ backgroundColor: 'var(--rule)' }}>
          {capabilities.map((c, i) => (
            <Reveal key={c.n} delay={i * 80}>
              <div className="h-full px-0 py-8 md:px-8 md:py-10" style={{ backgroundColor: 'var(--paper)' }}>
                <p className="eyebrow">{c.n}</p>
                <h3 className="mt-5">{c.title}</h3>
                <p className="mt-4" style={{ color: 'var(--ink-secondary)', fontSize: 'var(--fs-sm)', lineHeight: 'var(--lh-relaxed)' }}>
                  {c.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------- principles -- */}
      <section className="container-page section-y" style={{ paddingTop: 0 }}>
        <SectionHeading eyebrow="03 — How I work" title="Opinions I’ll defend in an interview." />

        <div className="mt-12 md:mt-16">
          {principles.map((p, i) => (
            <Reveal key={p.k} delay={i * 80}>
              <div className="rule-t grid gap-4 py-8 md:grid-cols-12 md:gap-8 md:py-10">
                <h3 className="md:col-span-4" style={{ fontSize: 'var(--fs-h4)' }}>
                  {p.k}
                </h3>
                <p className="md:col-span-7 md:col-start-6" style={{ color: 'var(--ink-secondary)', lineHeight: 'var(--lh-relaxed)' }}>
                  {p.v}
                </p>
              </div>
            </Reveal>
          ))}
          <div className="rule-t" />
        </div>
      </section>

      {/* ---------------------------------------------------------- contact -- */}
      <section className="container-page section-y" style={{ paddingTop: 0 }}>
        <Reveal>
          <div className="rule-t pt-12 md:pt-16">
            <p className="eyebrow">04 — Next</p>
            <h2 className="mt-6" style={{ fontSize: 'var(--fs-h1)', maxWidth: '16ch' }}>
              Hiring? Let’s talk about the work.
            </h2>
            <p className="lead mt-6" style={{ maxWidth: '46ch' }}>
              Happy to walk through any project in detail, including the parts that didn’t go to plan.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link to="/contact" className="btn btn-primary">
                Get in touch
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
