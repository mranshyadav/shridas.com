import type { ReactNode } from 'react';
import { Reveal } from './Reveal';

interface PageHeaderProps {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  /** Small right-aligned fact, e.g. "9 projects". */
  count?: string;
}

/**
 * The masthead every inner page opens with. Consistent vertical rhythm here is
 * most of what makes a multi-page site feel designed rather than assembled.
 */
export function PageHeader({ eyebrow, title, lead, count }: PageHeaderProps) {
  return (
    <header className="container-page" style={{ paddingTop: 'clamp(6rem, 15vh, 10rem)', paddingBottom: 'clamp(3rem, 7vw, 5rem)' }}>
      <Reveal>
        <div className="flex items-baseline justify-between gap-6">
          <p className="eyebrow">{eyebrow}</p>
          {count ? <p className="eyebrow">{count}</p> : null}
        </div>
      </Reveal>

      <Reveal delay={60}>
        <h1 className="mt-7" style={{ maxWidth: '17ch' }}>
          {title}
        </h1>
      </Reveal>

      {lead ? (
        <Reveal delay={120}>
          <p className="lead mt-8" style={{ maxWidth: '52ch' }}>
            {lead}
          </p>
        </Reveal>
      ) : null}
    </header>
  );
}
