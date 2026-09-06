import { Link } from 'react-router-dom';
import { process } from '../data/services';
import { PageHeader } from '../components/site/PageHeader';
import { Reveal } from '../components/site/Reveal';

/**
 * Process. Not linked from the main navigation — it lives at /process for
 * anyone sent the link directly, and duplicates the summary shown on Services.
 */
export function Process() {
  return (
    <>
      <PageHeader
        eyebrow="Process"
        title="How a project actually runs."
        lead="Four stages. You see work at the end of each one, and nothing moves forward until you have."
      />

      <section className="container-page pb-24 md:pb-32">
        {process.map((step, i) => (
          <Reveal key={step.n} delay={i * 70}>
            <div className="rule-t grid gap-6 py-10 md:grid-cols-12 md:gap-8 md:py-14">
              <p className="eyebrow md:col-span-2">{step.n}</p>
              <h2 className="md:col-span-4" style={{ fontSize: 'var(--fs-h3)' }}>
                {step.title}
              </h2>
              <p
                className="md:col-span-5 md:col-start-8"
                style={{ color: 'var(--ink-secondary)', lineHeight: 'var(--lh-relaxed)' }}
              >
                {step.body}
              </p>
            </div>
          </Reveal>
        ))}
        <div className="rule-t" />

        <Reveal>
          <div className="mt-16 flex flex-wrap items-center gap-6">
            <Link to="/services" className="btn btn-primary">
              See services
            </Link>
            <Link to="/contact" className="btn btn-ghost">
              Get in touch
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
