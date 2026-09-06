import { useState } from 'react';
import { site } from '../data/site';
import { PageHeader } from '../components/site/PageHeader';
import { Reveal } from '../components/site/Reveal';
import { ArrowLink } from '../components/site/ArrowLink';

/**
 * Contact.
 *
 * There is no backend on this site, so the form composes a message and hands
 * it to the visitor's mail client. That is stated on the button rather than
 * hidden — a form that appears to send and doesn't is worse than no form.
 */

const channels = [
  { label: 'Email', value: site.email, href: `mailto:${site.email}`, note: 'Best for anything with detail' },
  { label: 'Phone', value: site.phone, href: `tel:${site.phoneHref}`, note: 'Weekdays, 10:00–19:00 IST' },
  {
    label: 'LinkedIn',
    value: site.socials[0].handle,
    href: site.socials[0].url,
    note: 'Fine for a first hello',
  },
];

export function Contact() {
  const [form, setForm] = useState({ name: '', company: '', role: '', message: '' });

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const subject = form.role
      ? `${form.role}${form.company ? ` at ${form.company}` : ''}`
      : `Hello from ${form.name || 'your site'}`;

    const body = [
      form.name ? `From: ${form.name}` : null,
      form.company ? `Company: ${form.company}` : null,
      form.role ? `Role: ${form.role}` : null,
      '',
      form.message,
    ]
      .filter((line) => line !== null)
      .join('\n');

    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Tell me about the role."
        lead="I read everything. If there’s a job description, send it — it makes the first conversation much more useful for both of us."
      />

      <section className="container-page pb-24 md:pb-32">
        <div className="grid gap-16 md:grid-cols-12 md:gap-8">
          {/* ------------------------------------------------------ channels -- */}
          <div className="md:col-span-5">
            <Reveal>
              {site.availability.open ? (
                <p
                  className="mb-10 flex items-center gap-2.5"
                  style={{ fontSize: 'var(--fs-sm)', color: 'var(--ink-secondary)' }}
                >
                  <span className="live-dot" aria-hidden="true" />
                  {site.availability.label}
                </p>
              ) : null}

              <div>
                {channels.map((c) => (
                  <div key={c.label} className="rule-t py-6">
                    <p className="eyebrow">{c.label}</p>
                    <a
                      href={c.href}
                      target={c.href.startsWith('http') ? '_blank' : undefined}
                      rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="link mt-3 inline-block"
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'var(--fs-h4)',
                        fontWeight: 'var(--fw-medium)',
                        letterSpacing: 'var(--tr-heading)',
                      }}
                    >
                      {c.value}
                    </a>
                    <p className="mt-2" style={{ fontSize: 'var(--fs-sm)', color: 'var(--ink-tertiary)' }}>
                      {c.note}
                    </p>
                  </div>
                ))}
                <div className="rule-t" />
              </div>

              <dl className="meta-list mt-10">
                <div className="meta-row">
                  <dt>Based in</dt>
                  <dd>{site.location}</dd>
                </div>
                <div className="meta-row">
                  <dt>Timezone</dt>
                  <dd>{site.timezone}</dd>
                </div>
                <div className="meta-row">
                  <dt>Reply time</dt>
                  <dd>Usually within two working days</dd>
                </div>
              </dl>

              <p className="mt-8">
                <ArrowLink href={site.resumeUrl} size="sm">
                  Download résumé
                </ArrowLink>
              </p>
            </Reveal>
          </div>

          {/* ---------------------------------------------------------- form -- */}
          <div className="md:col-span-6 md:col-start-7">
            <Reveal delay={100}>
              <form onSubmit={handleSubmit} className="rule-t pt-8">
                <p className="eyebrow">Or write here</p>

                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                  <div className="field">
                    <label htmlFor="name">Your name</label>
                    <input id="name" name="name" value={form.name} onChange={set('name')} autoComplete="name" required />
                  </div>

                  <div className="field">
                    <label htmlFor="company">Company</label>
                    <input id="company" name="company" value={form.company} onChange={set('company')} autoComplete="organization" />
                  </div>
                </div>

                <div className="field mt-6">
                  <label htmlFor="role">Role you’re hiring for</label>
                  <input id="role" name="role" value={form.role} onChange={set('role')} placeholder="e.g. Senior Product Designer" />
                </div>

                <div className="field mt-6">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={form.message}
                    onChange={set('message')}
                    placeholder="The team, the product, and what you need from a designer."
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary mt-8 w-full sm:w-auto">
                  Open in my email app
                </button>

                <p className="mt-4" style={{ fontSize: 'var(--fs-xs)', color: 'var(--ink-tertiary)' }}>
                  This site has no server. Submitting composes the message in your own email client — nothing
                  is sent or stored from here.
                </p>
              </form>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
