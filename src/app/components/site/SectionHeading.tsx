import type { ReactNode } from 'react';
import { Reveal } from './Reveal';

interface SectionHeadingProps {
  /** Mono eyebrow, e.g. "01 — Selected work". */
  eyebrow: string;
  title: ReactNode;
  /** Optional supporting line under the title. */
  lead?: ReactNode;
  /** Right-hand slot, typically a link. */
  aside?: ReactNode;
}

/**
 * The section header used across the site: a hairline rule, a mono eyebrow in
 * the left column, and the title in the wide column. The rule and the eyebrow
 * are what make the layout read as a grid rather than a stack of blocks.
 */
export function SectionHeading({ eyebrow, title, lead, aside }: SectionHeadingProps) {
  return (
    <Reveal>
      <div className="rule-t pt-6 md:pt-8">
        <div className="grid gap-6 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-3">
            <p className="eyebrow">{eyebrow}</p>
          </div>

          <div className="md:col-span-9">
            <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
              <h2 style={{ maxWidth: '20ch' }}>{title}</h2>
              {aside ? <div className="shrink-0 pb-1">{aside}</div> : null}
            </div>
            {lead ? (
              <p className="lead mt-5" style={{ maxWidth: '52ch' }}>
                {lead}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </Reveal>
  );
}
