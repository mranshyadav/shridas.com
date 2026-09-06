import { Fragment, type ReactNode } from 'react';

/**
 * Renders copy that may still contain [bracketed placeholders].
 *
 * Bracketed segments are drawn with a dotted underline and a muted colour so
 * unwritten copy is obvious on the page rather than quietly shipping as if it
 * were real. Text with no brackets renders completely untouched.
 */

const PLACEHOLDER = /\[([^\]]+)\]/g;

export function hasPlaceholder(text: string): boolean {
  return /\[[^\]]+\]/.test(text);
}

export function Copy({ children }: { children: string }): ReactNode {
  if (!hasPlaceholder(children)) return children;

  const parts: ReactNode[] = [];
  let cursor = 0;
  let match: RegExpExecArray | null;

  PLACEHOLDER.lastIndex = 0;
  while ((match = PLACEHOLDER.exec(children)) !== null) {
    if (match.index > cursor) {
      parts.push(<Fragment key={cursor}>{children.slice(cursor, match.index)}</Fragment>);
    }
    parts.push(
      <span
        key={`p-${match.index}`}
        title="Placeholder — replace this with your real copy"
        style={{
          color: 'var(--ink-tertiary)',
          textDecoration: 'underline',
          textDecorationStyle: 'dotted',
          textDecorationColor: 'var(--signal-rule)',
          textUnderlineOffset: '0.25em',
        }}
      >
        {match[1]}
      </span>,
    );
    cursor = match.index + match[0].length;
  }

  if (cursor < children.length) {
    parts.push(<Fragment key={cursor}>{children.slice(cursor)}</Fragment>);
  }

  return <>{parts}</>;
}
