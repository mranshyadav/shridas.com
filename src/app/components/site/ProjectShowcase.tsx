import type { Project } from '../../data/projects';
import { BrowserFrame, PhoneFrame, TabletFrame, type Platform } from './DeviceFrame';

/**
 * Composes a project's screenshots into a device arrangement.
 *
 * Which devices appear is driven by `project.platforms`, not by a template.
 * A phone-only product gets a phone; a SaaS that genuinely ships across
 * breakpoints gets all three, overlapped, so the responsiveness is the point
 * the composition is making rather than decoration every project repeats.
 */

const LABEL: Record<Platform, string> = {
  desktop: 'Desktop',
  tablet: 'Tablet',
  mobile: 'Mobile',
};

/** Largest first — the biggest device present becomes the primary frame. */
const ORDER: Platform[] = ['desktop', 'tablet', 'mobile'];

export function ProjectShowcase({ project, priority = false }: { project: Project; priority?: boolean }) {
  const present = ORDER.filter((p) => project.platforms.includes(p));
  if (present.length === 0) return null;

  const [primary, ...secondary] = present;
  const overlap = secondary.length > 0;

  const frameFor = (platform: Platform, compact: boolean) => {
    const src = project.screens[platform];
    const expects = `public/work/${project.id}/${platform}.png`;
    const alt = src ? `${project.title} — ${LABEL[platform].toLowerCase()} view` : '';
    const props = { src, alt, expects, compact };

    if (platform === 'desktop') return <BrowserFrame {...props} />;
    if (platform === 'tablet') return <TabletFrame {...props} />;
    return <PhoneFrame {...props} />;
  };

  return (
    <figure className="showcase" data-overlap={overlap || undefined} data-primary={primary}>
      <div className="showcase__primary">{frameFor(primary, false)}</div>

      {overlap ? (
        <div className="showcase__secondary">
          {secondary.map((platform) => (
            <div key={platform} className={`showcase__aside showcase__aside--${platform}`}>
              {frameFor(platform, true)}
            </div>
          ))}
        </div>
      ) : null}

      {/* Naming the breakpoints makes the responsiveness explicit rather than
          leaving a viewer to infer it from the shapes. The trailing claim is
          tied to the actual device count — it must never say "all three" on a
          project that only ships two. */}
      <figcaption className="showcase__caption eyebrow">
        {present.map((p) => LABEL[p]).join(' · ')}
        {priority && present.length === 3 ? ' — responsive across all three' : ''}
      </figcaption>
    </figure>
  );
}
