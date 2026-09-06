import { Link } from 'react-router-dom';
import type { Project } from '../../data/projects';
import { Copy } from './Copy';

/**
 * Compact work index — hairline-separated rows, no imagery.
 *
 * Used on the home page, where the job is to let someone scan the whole body
 * of work in one screen and pick. The Work page does the opposite job and
 * shows each project full size in its device frames; keeping the two distinct
 * means the second page is worth visiting.
 */
export function WorkIndex({ projects }: { projects: Project[] }) {
  return (
    <div>
      {projects.map((project) => (
        <article key={project.id} className="index-row">
          <Link
            to={`/case-study/${project.id}`}
            className="relative block px-2 py-7 md:py-9"
            aria-label={`${project.title} — ${project.domain}`}
          >
            <span className="index-row__wash" aria-hidden="true" />

            <div className="relative grid grid-cols-12 items-baseline gap-x-4 gap-y-3 md:gap-x-8">
              <span className="eyebrow col-span-2 md:col-span-1">{project.index}</span>

              <h3 className="index-row__title col-span-10 md:col-span-4">{project.title}</h3>

              <p
                className="col-span-10 col-start-3 md:col-span-3 md:col-start-auto"
                style={{ fontSize: 'var(--fs-sm)', color: 'var(--ink-secondary)' }}
              >
                <Copy>{project.role}</Copy>
              </p>

              <p
                className="col-span-10 col-start-3 md:col-span-3 md:col-start-auto"
                style={{ fontSize: 'var(--fs-sm)', color: 'var(--ink-tertiary)' }}
              >
                {project.domain}
              </p>

              <span
                className="num col-span-2 text-right md:col-span-1"
                style={{ fontSize: 'var(--fs-mono)', color: 'var(--ink-tertiary)' }}
              >
                <Copy>{project.year}</Copy>
              </span>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}
