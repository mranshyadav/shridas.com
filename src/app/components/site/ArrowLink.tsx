import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

interface ArrowLinkProps {
  to?: string;
  href?: string;
  children: ReactNode;
  /** Renders at body size by default; `sm` for footers and dense rows. */
  size?: 'sm' | 'md';
}

/**
 * Text link with an arrow that steps forward on hover. Used for every
 * "keep going" affordance so the gesture is consistent site-wide.
 */
export function ArrowLink({ to, href, children, size = 'md' }: ArrowLinkProps) {
  const inner = (
    <span className="group inline-flex items-center gap-2">
      <span className="link">{children}</span>
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        aria-hidden="true"
        className="transition-transform duration-300 ease-out group-hover:translate-x-1"
        style={{ transitionTimingFunction: 'var(--ease-out)' }}
      >
        <path d="M1 7h11M7.5 2.5 12 7l-4.5 4.5" stroke="currentColor" strokeWidth="1.25" />
      </svg>
    </span>
  );

  const style = {
    fontSize: size === 'sm' ? 'var(--fs-sm)' : 'var(--fs-body)',
    fontWeight: 'var(--fw-medium)' as const,
  };

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" style={style}>
        {inner}
      </a>
    );
  }

  return (
    <Link to={to ?? '/'} style={style}>
      {inner}
    </Link>
  );
}
