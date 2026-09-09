import { useEffect, useLayoutEffect, useRef, useState, type ElementType, type ReactNode } from 'react';

/**
 * useLayoutEffect on the server is a no-op that React warns about on every
 * render — and this component renders dozens of times per prerendered page.
 * There is nothing to arm without a DOM, so fall back to useEffect there.
 */
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

interface RevealProps {
  children: ReactNode;
  /** Stagger within a group, in milliseconds. */
  delay?: number;
  as?: ElementType;
  className?: string;
}

/**
 * Fades and lifts its children into view the first time they cross the
 * viewport.
 *
 * Fail-safe by construction: the element renders VISIBLE and only becomes
 * hidden once we have successfully armed an IntersectionObserver that can
 * reveal it again. If JavaScript is slow, the observer is unavailable, the
 * effect throws, or the user prefers reduced motion, the content simply shows.
 *
 * The naive version of this — start at opacity 0, wait for an observer — turns
 * every scroll animation into a single point of failure for the page content
 * itself. On a portfolio that is not a risk worth taking for a fade.
 */
export function Reveal({ children, delay = 0, as: Tag = 'div', className = '' }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(false);

  /* Arm before paint so hiding is never visible as a flash. */
  useIsomorphicLayoutEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const node = ref.current;
    if (!node) return;

    /* Anything already on screen at mount stays visible — no point animating
       what the visitor is looking at. */
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight) return;

    setArmed(true);
  }, []);

  useEffect(() => {
    if (!armed) return;
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.01 },
    );

    observer.observe(node);

    /* Backstop: if the observer never fires for any reason — a background tab,
       a throttled frame, a browser quirk — show the content anyway. */
    const failsafe = window.setTimeout(() => setShown(true), 2000);

    return () => {
      observer.disconnect();
      window.clearTimeout(failsafe);
    };
  }, [armed]);

  const hidden = armed && !shown;

  return (
    <Tag
      ref={ref}
      className={`${armed ? 'reveal' : ''} ${hidden ? '' : 'is-in'} ${className}`.trim()}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
