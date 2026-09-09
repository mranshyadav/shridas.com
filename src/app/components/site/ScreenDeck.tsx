import { useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';

import type { CaseStudyScreen } from '../../data/projects';
import { useEnhanced } from '../../hooks/useEnhanced';
import { Copy } from './Copy';
import { DeviceFrame } from './DeviceFrame';

/**
 * The case-study gallery: screens fanned into depth, the middle one face-on.
 *
 * Everything is one transform per slide, driven by its distance from the
 * active index — slide further out, rotate further away, sit further back,
 * fade. Nothing animates on a timer and nothing is keyframed; changing the
 * active index changes every slide's target transform at once and CSS
 * interpolates the lot, which is why the fan stays coherent however fast it
 * is driven.
 *
 * The perspective lives on the stage rather than on each slide, so all of them
 * share one vanishing point. Give each slide its own and they each converge
 * separately, which reads as a row of individually skewed rectangles rather
 * than as depth.
 *
 * Clicking a side screen brings it to the middle; clicking the middle one
 * opens it full-bleed, because a dashboard at a third of the page is a
 * dashboard nobody can read.
 *
 * None of this is load-bearing. `useEnhanced` is false during the prerender
 * and the hydrating render, so the markup a crawler reads — and the page a
 * visitor gets if the bundle never arrives — is a plain grid of every screen
 * with its caption underneath.
 */

/** Slides past this distance are not worth compositing. */
const VISIBLE_DEPTH = 3;

/** How far a drag has to travel before it counts as one step. */
const DRAG_STEP = 110;
const DRAG_SLOP = 6;

/** Where a slide sits, given how far it is from the middle. */
function slideTransform(offset: number) {
  const distance = Math.abs(offset);

  const direction = Math.sign(offset);

  return {
    /*
     * A left-hand slide turns its far edge away from the viewer and a
     * right-hand one mirrors it, which is what makes the row read as a fan
     * opening toward you rather than a set of parallel cards.
     *
     * The angle is fixed per side rather than multiplied by the distance:
     * compounding it puts the third slide out past 90 degrees, where it is
     * facing away and shows its own back.
     */
    transform: [
      /* Percentages here resolve against the card's own width, so the overlap
         is a fixed fraction of a card at every viewport — just over half of
         each one stays behind its neighbour. */
      `translateX(${offset * 52}%)`,
      `translateZ(${-distance * 130}px)`,
      `rotateY(${direction * 34}deg)`,
      `scale(${1 - distance * 0.07})`,
    ].join(' '),
    /*
     * Barely any fade. Depth is carried by the scale, the angle and the
     * perspective; leaning on opacity as well erases the screens themselves —
     * most of these are near-white UIs on a near-white page, so a card at half
     * opacity is a blank rectangle rather than a recessed one.
     */
    opacity: distance > VISIBLE_DEPTH ? 0 : Math.max(0.55, 1 - distance * 0.13),
    zIndex: 50 - distance,
  };
}

export function ScreenDeck({
  screens,
  projectId,
  projectTitle,
}: {
  screens: CaseStudyScreen[];
  projectId: string;
  projectTitle: string;
}) {
  const enhanced = useEnhanced();

  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [active, setActive] = useState(0);
  /**
   * Transitions stay off for the first painted frame.
   *
   * The slides go from having no transform at all (the prerendered grid) to
   * their fanned positions the moment `enhanced` flips. With transitions live
   * from the start that is an animation out of a flat stack of every screen at
   * full opacity — a bad first frame, and a worse one in a background tab,
   * where the transition is frozen at exactly that pile until the tab is
   * looked at. Fanned instantly, animating only from the next frame on.
   */
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);

  const count = screens.length;
  const clamp = useCallback((i: number) => Math.min(count - 1, Math.max(0, i)), [count]);

  useEffect(() => {
    if (!enhanced) return;
    const frame = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(frame);
  }, [enhanced]);

  /* -- drag ------------------------------------------------------------- */

  const drag = useRef({ active: false, startX: 0, from: 0, moved: 0 });

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    drag.current = { active: true, startX: event.clientX, from: active, moved: 0 };
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    const dx = event.clientX - drag.current.startX;
    drag.current.moved = Math.max(drag.current.moved, Math.abs(dx));
    setActive(clamp(drag.current.from - Math.round(dx / DRAG_STEP)));
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    drag.current.active = false;
    setDragging(false);
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  /* -- overlay ----------------------------------------------------------- */

  /**
   * Runs a state change inside a view transition where the browser has one.
   * flushSync is required: the transition snapshots the DOM when the callback
   * returns, so React has to have committed by then.
   */
  const withTransition = useCallback((update: () => void) => {
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => {
        ready?: Promise<void>;
        finished?: Promise<void>;
      };
    };
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!doc.startViewTransition || still) {
      update();
      return;
    }

    const transition = doc.startViewTransition(() => flushSync(update));

    /*
     * A skipped transition rejects both of these, and an unhandled rejection
     * shows up in the console as `InvalidStateError: Transition was aborted`.
     * Skipping is normal and expected — it happens on rapid clicks, and any
     * time the tab is not visible — and the DOM update has already been
     * applied by then regardless. Nothing to recover from, so swallow it.
     */
    transition?.ready?.catch(() => {});
    transition?.finished?.catch(() => {});
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
      if (open !== null) {
        withTransition(() => setOpen((i) => (i === null ? i : (i + delta + count) % count)));
        return;
      }
      setActive((i) => clamp(i + delta));
    },
    [clamp, count, open, withTransition],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      event.preventDefault();
      step(event.key === 'ArrowRight' ? 1 : -1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, step]);

  /* Leaving the overlay leaves the deck on whatever you were last looking at. */
  const close = useCallback(() => {
    const last = open;
    setOpen(null);
    if (last !== null) setActive(last);
  }, [open]);

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
  const current = screens[active];

  return (
    <div
      className="deck"
      data-enhanced={enhanced || undefined}
      data-ready={ready || undefined}
      data-dragging={dragging || undefined}
    >
      <div
        className="deck__stage"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={(event) => {
          if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
          event.preventDefault();
          step(event.key === 'ArrowRight' ? 1 : -1);
        }}
        role="group"
        aria-roledescription="carousel"
        aria-label={`${projectTitle} screens`}
        tabIndex={enhanced ? 0 : -1}
      >
        {screens.map((screen, i) => {
          const offset = i - active;
          const isActive = i === active;
          const placement = enhanced ? slideTransform(offset) : undefined;

          return (
            <figure
              key={i}
              className="deck__slide"
              data-active={isActive || undefined}
              style={placement}
              /* Off-stage slides stay in the document for crawlers and for the
                 fallback, but are taken out of the tab order and the a11y tree
                 so a keyboard never lands on something it cannot see. */
              aria-hidden={enhanced && Math.abs(offset) > VISIBLE_DEPTH ? true : undefined}
            >
              <button
                type="button"
                className="deck__frame"
                tabIndex={enhanced && !isActive ? -1 : 0}
                aria-label={
                  isActive
                    ? `Enlarge screen ${i + 1} of ${count}`
                    : `Show screen ${i + 1} of ${count}`
                }
                onClick={() => {
                  if (drag.current.moved > DRAG_SLOP) return;
                  if (!enhanced || isActive) withTransition(() => setOpen(i));
                  else setActive(i);
                }}
              >
                {frameFor(screen)}
                {enhanced ? (
                  <span className="deck__expand" aria-hidden="true">
                    {isActive ? 'Expand' : ''}
                  </span>
                ) : null}
              </button>

              {/* In the fanned layout one shared caption sits under the stage
                  instead, so this would be a second copy of the same sentence. */}
              {!enhanced ? (
                <figcaption className="deck__caption">
                  <span className="num">{String(i + 1).padStart(2, '0')}</span>
                  <span>
                    <Copy>{screen.caption}</Copy>
                  </span>
                </figcaption>
              ) : null}
            </figure>
          );
        })}

        <button
          type="button"
          className="deck__arrow deck__arrow--prev"
          onClick={() => step(-1)}
          disabled={active === 0}
          aria-label="Previous screen"
        >
          ←
        </button>
        <button
          type="button"
          className="deck__arrow deck__arrow--next"
          onClick={() => step(1)}
          disabled={active === count - 1}
          aria-label="Next screen"
        >
          →
        </button>
      </div>

      {enhanced ? (
        <div className="deck__foot">
          <div className="deck__dots" role="tablist" aria-label="Choose a screen">
            {screens.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={`Screen ${i + 1}`}
                className="deck__dot"
                data-active={i === active || undefined}
                onClick={() => setActive(i)}
              />
            ))}
          </div>

          <p className="deck__now" aria-live="polite">
            <span className="num deck__index">{String(active + 1).padStart(2, '0')}</span>
            <span>
              <Copy>{current.caption}</Copy>
            </span>
          </p>
        </div>
      ) : null}

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
