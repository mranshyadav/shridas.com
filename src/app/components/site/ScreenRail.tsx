import { useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';

import type { CaseStudyScreen } from '../../data/projects';
import { useEnhanced } from '../../hooks/useEnhanced';
import { Copy } from './Copy';
import { DeviceFrame } from './DeviceFrame';

/**
 * The case-study gallery: a filmstrip you can throw sideways, and open.
 *
 * Two decisions shape this.
 *
 * It is built on a real scroll container, not a transform-driven carousel with
 * its own state. That means a trackpad swipe, a touch drag, shift+wheel, and
 * tabbing between frames all work before any of the code below runs — the
 * pointer-drag, the arrows and the counter are conveniences layered over
 * behaviour the browser already had. Prerendered, or if the bundle fails, the
 * markup falls back to the plain grid it was before.
 *
 * And the frames are small on purpose. A rail of postage stamps would be worse
 * than the grid it replaces, so every frame opens: click one and it goes
 * full-bleed with its caption, arrow keys move through the set, Escape leaves.
 * The rail is for scanning, the overlay is for looking.
 */

/** Movement past this many pixels is a drag, so the click is not a click. */
const DRAG_SLOP = 6;

export function ScreenRail({
  screens,
  projectId,
  projectTitle,
}: {
  screens: CaseStudyScreen[];
  projectId: string;
  projectTitle: string;
}) {
  const enhanced = useEnhanced();

  const trackRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLElement | null>>([]);
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const [current, setCurrent] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);

  const count = screens.length;

  /* -- which frame is at the middle of the rail -------------------------- */

  useEffect(() => {
    const track = trackRef.current;
    if (!enhanced || !track || typeof IntersectionObserver === 'undefined') return;

    /* A zero-width band down the centre of the rail: exactly one frame can be
       crossing it, so the counter never flickers between two neighbours. */
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = itemRefs.current.indexOf(entry.target as HTMLElement);
          if (index >= 0) setCurrent(index);
        }
      },
      { root: track, rootMargin: '0px -50% 0px -50%', threshold: 0 },
    );

    itemRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [enhanced, count]);

  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current;
    const item = itemRefs.current[index];
    if (!track || !item) return;
    track.scrollTo({
      left: item.offsetLeft - (track.clientWidth - item.clientWidth) / 2,
      behavior: 'smooth',
    });
  }, []);

  /* -- drag to throw the rail ------------------------------------------- */

  const drag = useRef({ active: false, startX: 0, startLeft: 0, moved: 0 });

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    /* Touch already does this natively, and better — with momentum. */
    if (event.pointerType === 'touch') return;
    const track = trackRef.current;
    if (!track) return;

    drag.current = { active: true, startX: event.clientX, startLeft: track.scrollLeft, moved: 0 };
    setDragging(true);
    track.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!drag.current.active || !track) return;

    const dx = event.clientX - drag.current.startX;
    drag.current.moved = Math.max(drag.current.moved, Math.abs(dx));
    track.scrollLeft = drag.current.startLeft - dx;
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    drag.current.active = false;
    setDragging(false);
    trackRef.current?.releasePointerCapture(event.pointerId);
  };

  /* -- the overlay ------------------------------------------------------- */

  /**
   * Runs a state change inside a view transition where the browser has one, so
   * the frame morphs into the overlay and from one screen to the next instead
   * of cutting. flushSync is required: the transition snapshots the DOM when
   * the callback returns, so React has to have committed by then.
   */
  const withTransition = useCallback((update: () => void) => {
    const doc = document as Document & { startViewTransition?: (cb: () => void) => void };
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!doc.startViewTransition || still) {
      update();
      return;
    }
    doc.startViewTransition(() => flushSync(update));
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open !== null && !dialog.open) dialog.showModal();
    if (open === null && dialog.open) dialog.close();
  }, [open]);

  /* showModal blocks interaction but not scrolling behind the overlay. */
  useEffect(() => {
    if (open === null) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const step = useCallback(
    (delta: number) => {
      withTransition(() => setOpen((i) => (i === null ? i : (i + delta + count) % count)));
    },
    [count, withTransition],
  );

  useEffect(() => {
    if (open === null) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        step(1);
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        step(-1);
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, step]);

  /* Leaving the overlay puts the rail on whatever you were last looking at,
     rather than wherever you happened to open it from. */
  const close = useCallback(() => {
    const last = open;
    setOpen(null);
    if (last !== null) scrollToIndex(last);
  }, [open, scrollToIndex]);

  if (count === 0) return null;

  const frameFor = (screen: CaseStudyScreen) => (
    <DeviceFrame
      platform={screen.platform}
      src={screen.src}
      alt={screen.src ? `${projectTitle} — ${screen.platform} view` : ''}
      expects={`public/work/${projectId}/${screen.platform}.png`}
    />
  );

  const shown = open === null ? null : screens[open];

  return (
    <div className="rail" data-enhanced={enhanced || undefined} data-dragging={dragging || undefined}>
      <div
        className="rail__track"
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {screens.map((screen, i) => (
          <figure
            key={i}
            className="rail__item"
            data-platform={screen.platform}
            data-current={i === current || undefined}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
          >
            <button
              type="button"
              className="rail__frame"
              aria-label={`Enlarge screen ${i + 1} of ${count}`}
              onClick={() => {
                if (drag.current.moved > DRAG_SLOP) return;
                withTransition(() => setOpen(i));
              }}
            >
              {frameFor(screen)}
              <span className="rail__expand" aria-hidden="true">
                Expand
              </span>
            </button>

            <figcaption className="rail__caption">
              <span className="num rail__num">{String(i + 1).padStart(2, '0')}</span>
              <span>
                <Copy>{screen.caption}</Copy>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="rail__bar" aria-hidden="true">
        <p className="eyebrow rail__count">
          {String(current + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
        </p>

        <div className="rail__progress">
          <span style={{ transform: `scaleX(${(current + 1) / count})` }} />
        </div>

        <div className="rail__nav">
          <button
            type="button"
            onClick={() => scrollToIndex(Math.max(0, current - 1))}
            disabled={current === 0}
            tabIndex={-1}
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => scrollToIndex(Math.min(count - 1, current + 1))}
            disabled={current === count - 1}
            tabIndex={-1}
          >
            →
          </button>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        className="lightbox"
        onClose={() => setOpen(null)}
        onClick={(event) => {
          if (event.target === dialogRef.current) close();
        }}
      >
        {shown ? (
          <div className="lightbox__inner">
            <div className="lightbox__stage">{frameFor(shown)}</div>

            <div className="lightbox__meta">
              <p className="eyebrow">
                {String(open! + 1).padStart(2, '0')} / {String(count).padStart(2, '0')} —{' '}
                {shown.platform}
              </p>
              <p className="lightbox__caption">
                <Copy>{shown.caption}</Copy>
              </p>
            </div>

            <button type="button" className="lightbox__close" onClick={close}>
              Close
            </button>
            <button
              type="button"
              className="lightbox__step lightbox__step--prev"
              onClick={() => step(-1)}
              aria-label="Previous screen"
            >
              ←
            </button>
            <button
              type="button"
              className="lightbox__step lightbox__step--next"
              onClick={() => step(1)}
              aria-label="Next screen"
            >
              →
            </button>
          </div>
        ) : null}
      </dialog>
    </div>
  );
}
