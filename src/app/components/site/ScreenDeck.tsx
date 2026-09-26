import { useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';

import type { CaseStudyScreen } from '../../data/projects';
import { useEnhanced } from '../../hooks/useEnhanced';
import { Copy } from './Copy';
import { DeviceFrame } from './DeviceFrame';

/**
 * The case-study gallery: a reel you scroll through.
 *
 * The section pins to the viewport and the screens fan out in depth behind the
 * one you are looking at. Scrolling doesn't move the page past the gallery —
 * it moves you *through* it, one screen at a time, and releases the page again
 * at the end. Nothing is hijacked: the browser scrolls exactly as it always
 * does, and the position it lands on is the only input this component has.
 *
 * That single input is what keeps every control agreeing with every other one.
 * Arrows, the rail, the keyboard and dragging all do the same thing — scroll
 * the window — so there is no second notion of "which screen is showing" to
 * fall out of step with the first. Read the scroll, place the cards, done.
 *
 * Placement is continuous rather than snapped. A card's position comes from
 * its distance to a fractional progress value, so mid-scroll the whole fan is
 * genuinely mid-turn instead of easing between two fixed arrangements. Every
 * frame is written straight to the elements; React only re-renders when the
 * *nearest* screen changes, which is what the caption and the counter track.
 *
 * None of it is load-bearing. `useEnhanced` is false during the prerender and
 * the hydrating render, and the reel is switched off entirely for anyone who
 * asked for reduced motion — so the markup a crawler reads, the page a visitor
 * gets if the bundle never arrives, and the page a motion-sensitive visitor
 * gets is a plain grid of every screen with its caption underneath.
 */

/** How far back the fan keeps receding before a card stops moving at all. */
const DEPTH = 3;

/** Where a card starts fading out, and where it has gone. */
const FADE_FROM = 1.2;
const FADE_TO = 2.25;

/** Scroll distance per screen, and the ceiling on the whole pinned run. */
const STEP_VH = 0.52;
const STEP_MIN_VH = 0.3;
const RUN_MAX_VH = 3.4;

/** How far a drag travels per screen, and what still counts as a click. */
const DRAG_STEP = 190;
const DRAG_SLOP = 6;

/**
 * How far the camera slides toward the pointer, as a share of the stage.
 *
 * The lean moves the vanishing point rather than rotating the group. Rotating
 * a wrapper would need a second 3-D context nested inside the stage's, and
 * Chrome will not hit-test a card that is transformed in one of those — every
 * click passed straight through the screens to the empty stage behind them.
 * Moving the perspective origin does the same job with one element: the far
 * cards swing further than the near ones, which is what parallax is.
 */
const LEAN_X = 9;
const LEAN_Y = 6;
const LEAN_EASE = 0.09;

/**
 * How far the strip drifts across the frame from first screen to last, as a
 * share of the stage width.
 *
 * The reel has a beginning and an end rather than looping, so on screen one
 * there is nothing to the left of the card and on the last one nothing to the
 * right. Centring the active card regardless leaves half the frame empty at
 * both ends. Letting the whole strip travel — entering from the left, leaving
 * to the right — keeps weight on both sides throughout and says which way you
 * are going without a single arrow.
 */
const DRIFT = 11;

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Bends the scroll so the reel holds on a screen and then changes quickly.
 *
 * Read raw, progress is linear: every screen spends exactly as long half-
 * turned as it does face-on, and the halfway point — two cards at the same
 * depth, overlapping almost exactly — is a composition nobody would choose.
 * Smoothstepping the fractional part spends most of the scroll parked on a
 * screen and crosses between them in a fraction of it. A reel advancing frame
 * by frame, rather than a slow permanent dissolve.
 */
function advance(progress: number): number {
  const held = Math.floor(progress);
  const f = progress - held;
  return held + f * f * f * (f * (f * 6 - 15) + 10);
}

/**
 * Where a card sits, given its signed distance to the middle of the reel.
 *
 * The angle is clamped rather than multiplied by the distance: compounding it
 * puts an outer card past 90 degrees, facing away from the room. Depth is
 * carried by scale, angle and perspective instead of by opacity — most of
 * these screenshots are near-white UIs on a near-white page, so a card at half
 * opacity is a blank rectangle rather than a recessed one. What pushes the
 * outer cards back is the scrim inside them, which is paper-coloured.
 */
function place(distance: number) {
  const far = Math.abs(distance);
  const capped = Math.min(far, DEPTH);
  const turn = clamp(distance, -1, 1);

  return {
    transform: [
      `translateX(${distance * 58}%)`,
      `translateY(${capped * 1.4}%)`,
      `translateZ(${-capped * 250}px)`,
      `rotateY(${turn * 34}deg)`,
      `scale(${1 - capped * 0.085})`,
    ].join(' '),
    /* Solid to just past the first neighbour, then gone by the third. Three
       cards a side was a wall of overlapping rectangles that said nothing
       about the work; the fade is what keeps the fan legible. */
    opacity: clamp((FADE_TO - far) / (FADE_TO - FADE_FROM), 0, 1),
    dim: Math.min(0.7, far * 0.34),
    depth: 100 - Math.round(capped * 10),
  };
}

/** True when the visitor has asked for less movement. Kept live, not sampled. */
function useStillness(): boolean {
  const [still, setStill] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setStill(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  return still;
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
  const still = useStillness();
  const count = screens.length;

  /* The reel needs somewhere to travel. One screen has nowhere to go, and a
     visitor who asked for reduced motion has asked not to be taken there. */
  const reel = enhanced && !still && count > 1;

  const rootRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const slideRefs = useRef<Array<HTMLElement | null>>([]);
  const cursorRef = useRef<HTMLSpanElement | null>(null);
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  /** Scroll distance from one screen to the next, measured not assumed. */
  const stepRef = useRef(1);

  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const [inView, setInView] = useState(false);
  /* The hint retires the moment you prove you didn't need it. */
  const [hinted, setHinted] = useState(true);

  /* -- geometry ---------------------------------------------------------- */

  /**
   * The track is as tall as the pinned frame plus one step per screen after
   * the first, so the reel starts on screen one, ends on the last, and hands
   * the page back exactly as the last one finishes.
   *
   * The step shrinks on a long gallery. At a flat rate an eight-screen reel
   * would hold the page for four and a half viewports, which stops reading as
   * a gallery and starts reading as a page that won't let you leave.
   */
  useEffect(() => {
    if (!reel) return;

    const measure = () => {
      const track = trackRef.current;
      const pin = pinRef.current;
      if (!track || !pin) return;

      const vh = window.innerHeight;
      const step = Math.max(vh * STEP_MIN_VH, Math.min(vh * STEP_VH, (vh * RUN_MAX_VH) / (count - 1)));
      stepRef.current = step;
      track.style.height = `${pin.offsetHeight + step * (count - 1)}px`;
    };

    measure();
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('resize', measure);
      if (trackRef.current) trackRef.current.style.height = '';
    };
  }, [reel, count]);

  /* -- in view ----------------------------------------------------------- */

  /**
   * Armed before it is hidden, never the other way round.
   *
   * The entrance animation starts the cards at nothing and the observer is
   * what brings them back. Hiding them first and hoping means a browser
   * without IntersectionObserver — or a callback that never arrives — leaves
   * the gallery permanently blank. `data-armed` says an observer is actually
   * watching, and only then does the CSS dare hide anything.
   */
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const node = trackRef.current;
    if (!enhanced || !node || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0,
    });
    observer.observe(node);
    setArmed(true);

    /* Backstop: if the observer never reports for any reason — a throttled
       frame, a background tab, a browser quirk — show the gallery anyway. */
    const failsafe = window.setTimeout(() => setInView(true), 2000);

    return () => {
      observer.disconnect();
      window.clearTimeout(failsafe);
      setArmed(false);
    };
  }, [enhanced]);

  /* -- placing the cards --------------------------------------------------- */

  /** Pointer position over the stage, -1 to 1 on each axis. Written by hand. */
  const lean = useRef({ x: 0, y: 0 });
  /** Where the camera has actually got to, eased toward the pointer. */
  const eye = useRef({ x: 0, y: 0 });
  /** The screen the reel last told React about. */
  const nearest = useRef(-1);

  /**
   * One pass: read the scroll, place every card.
   *
   * Nothing here reads state, so it is safe to call from a frame loop or once
   * on its own — which is exactly what the two effects below do.
   */
  const paint = useCallback(
    (settle = false) => {
      const root = rootRef.current;
      const track = trackRef.current;
      const stage = stageRef.current;
      if (!root || !track || !stage) return;

      const scrolled = clamp(-track.getBoundingClientRect().top / stepRef.current, 0, count - 1);
      const progress = advance(scrolled);

      /* The rail reads this. One custom property beats writing a width on to
         an element every frame — the compositor already owns the fill. */
      root.style.setProperty('--reel-progress', String(progress / (count - 1)));

      /* Eased rather than tracked, so the camera settles instead of twitching
         with the pointer. `settle` jumps it straight there for the standing
         placement, where there is no next frame to ease on. */
      const wantX = lean.current.x * LEAN_X;
      const wantY = lean.current.y * LEAN_Y;
      eye.current.x += settle ? wantX - eye.current.x : (wantX - eye.current.x) * LEAN_EASE;
      eye.current.y += settle ? wantY - eye.current.y : (wantY - eye.current.y) * LEAN_EASE;
      stage.style.perspectiveOrigin = `${(50 + eye.current.x).toFixed(2)}% ${(46 + eye.current.y).toFixed(2)}%`;

      /* In pixels, not per cent: a card's own per cent is a share of its own
         width, and a phone card is half the width of a browser one. The drift
         has to move the whole strip by the same amount whatever is in it. */
      const drift = (progress / (count - 1) - 0.5) * 2 * DRIFT * 0.01 * stage.clientWidth;

      slideRefs.current.forEach((slide, i) => {
        if (!slide) return;
        const at = place(i - progress);
        slide.style.transform = `translateX(${drift.toFixed(2)}px) ${at.transform}`;
        slide.style.opacity = String(at.opacity);
        slide.style.zIndex = String(at.depth);
        slide.style.visibility = at.opacity <= 0.01 ? 'hidden' : 'visible';
        slide.style.setProperty('--dim', String(at.dim));
      });

      const next = Math.round(progress);
      if (next !== nearest.current) {
        nearest.current = next;
        setActive(next);
      }
    },
    [count],
  );

  /**
   * A standing placement, the moment the reel switches on.
   *
   * The frame loop only runs while the gallery is on screen, and the entrance
   * only plays once the observer has seen it. Without this, a reel that is
   * scrolled into view faster than either can react — or in a tab the browser
   * has stopped painting — would be a stack of cards on top of each other.
   */
  useEffect(() => {
    if (!reel) return;
    paint(true);
    return () => {
      slideRefs.current.forEach((slide) => {
        if (slide) slide.style.cssText = '';
      });
      if (stageRef.current) stageRef.current.style.perspectiveOrigin = '';
    };
  }, [reel, paint]);

  useEffect(() => {
    if (!reel || !inView) return;

    let frame = 0;
    const tick = () => {
      paint();
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reel, inView, paint]);

  /* -- driving it --------------------------------------------------------- */

  /** Scroll position at which screen `i` sits dead centre. */
  const anchor = useCallback((i: number) => {
    const track = trackRef.current;
    if (!track) return window.scrollY;
    return track.getBoundingClientRect().top + window.scrollY + i * stepRef.current;
  }, []);

  const goTo = useCallback(
    (i: number) => {
      setHinted(false);
      window.scrollTo({ top: anchor(clamp(i, 0, count - 1)), behavior: 'smooth' });
    },
    [anchor, count],
  );

  const drag = useRef({ active: false, held: false, startX: 0, startY: 0, from: 0, moved: 0, endedAt: 0 });

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!reel) return;
    drag.current = {
      ...drag.current,
      active: true,
      /* Not captured yet, deliberately. Capturing on pointerdown retargets the
         click that follows to the capturing element, and the click on the card
         never reaches the card — press-and-release over a screen did nothing
         at all. The capture is taken once a drag is genuinely under way. */
      held: false,
      startX: event.clientX,
      startY: event.clientY,
      from: window.scrollY,
      moved: 0,
    };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!reel) return;

    /* Where the pointer is in the stage, for the camera lean and the label. */
    const box = event.currentTarget.getBoundingClientRect();
    lean.current = {
      x: clamp(((event.clientX - box.left) / box.width - 0.5) * 2, -1, 1),
      y: clamp(((event.clientY - box.top) / box.height - 0.5) * 2, -1, 1),
    };

    const cursor = cursorRef.current;
    if (cursor) {
      cursor.style.transform = `translate3d(${event.clientX - box.left}px, ${event.clientY - box.top}px, 0)`;
      const over = slideRefs.current[active]?.getBoundingClientRect();
      const inside =
        !!over &&
        event.clientX > over.left &&
        event.clientX < over.right &&
        event.clientY > over.top &&
        event.clientY < over.bottom;
      cursor.dataset.mode = drag.current.active ? 'drag' : inside ? 'open' : 'idle';
    }

    if (!drag.current.active) return;

    const dx = event.clientX - drag.current.startX;
    const dy = event.clientY - drag.current.startY;
    drag.current.moved = Math.max(drag.current.moved, Math.abs(dx), Math.abs(dy));
    if (Math.abs(dx) < DRAG_SLOP) return;

    if (!drag.current.held) {
      drag.current.held = true;
      /* Throws if the pointer has already gone — a lifted finger, a synthetic
         event. The drag still works without the capture; losing it is not a
         reason to stop halfway through one. */
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        drag.current.held = false;
      }
    }
    if (!dragging) setDragging(true);
    setHinted(false);
    /* Pulling the reel leftward advances it, which is the page moving down. */
    window.scrollTo({ top: drag.current.from - (dx * stepRef.current) / DRAG_STEP });
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    drag.current.active = false;
    drag.current.endedAt = performance.now();
    setDragging(false);
    if (cursorRef.current) cursorRef.current.dataset.mode = 'idle';
    if (drag.current.held) {
      drag.current.held = false;
      try {
        event.currentTarget.releasePointerCapture(event.pointerId);
      } catch {
        /* Already released with the pointer itself. */
      }
    }
  };

  const onPointerLeave = () => {
    lean.current = { x: 0, y: 0 };
    if (cursorRef.current) cursorRef.current.dataset.mode = 'away';
  };

  /* -- overlay ------------------------------------------------------------ */

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
    const motionless = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!doc.startViewTransition || motionless) {
      update();
      return;
    }

    const transition = doc.startViewTransition(() => flushSync(update));

    /* A skipped transition rejects both of these — rapid clicks, or any hidden
       tab. The DOM update has already applied by then, so there is nothing to
       recover from; left unhandled it logs `InvalidStateError`. */
    transition?.ready?.catch(() => {});
    transition?.finished?.catch(() => {});
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open !== null && !dialog.open) dialog.showModal();
    if (open === null && dialog.open) dialog.close();
  }, [open]);

  /* showModal blocks interaction but not scrolling behind the overlay — and
     here the scroll behind the overlay is the reel itself. */
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
      goTo(active + delta);
    },
    [active, count, goTo, open, withTransition],
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

  const close = useCallback(() => setOpen(null), []);

  /**
   * Leaving the overlay leaves the reel on whatever you were last looking at.
   *
   * Done here rather than in `close` so it covers every way out — the button,
   * the backdrop, Escape — and, more to the point, so it happens after the
   * effect above has given the page its scrollbar back. Scrolling the window
   * while the body is still locked is a no-op, which is exactly what it was:
   * you closed the overlay on screen four and the reel was still on screen one.
   */
  const lastOpen = useRef<number | null>(null);

  useEffect(() => {
    if (open !== null) {
      lastOpen.current = open;
      return;
    }

    const last = lastOpen.current;
    lastOpen.current = null;
    if (last === null || !reel) return;

    const frame = requestAnimationFrame(() => window.scrollTo({ top: anchor(last) }));
    return () => cancelAnimationFrame(frame);
  }, [anchor, open, reel]);

  /* The pointer label has to be positioned before it can be shown, and there
     is nothing to position it with on a touch screen. */
  useEffect(() => {
    if (!reel) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    rootRef.current?.setAttribute('data-cursor', '');
  }, [reel]);

  if (count === 0) return null;

  const frameFor = (screen: CaseStudyScreen, eager = false) => (
    <DeviceFrame
      platform={screen.platform}
      src={screen.src}
      alt={screen.src ? `${projectTitle} — ${screen.platform} view` : ''}
      expects={`public/work/${projectId}/${screen.platform}.png`}
      eager={eager}
    />
  );

  const shown = open === null ? null : screens[open];
  const current = screens[active];

  return (
    <div
      className="reel"
      ref={rootRef}
      data-reel={reel || undefined}
      data-armed={armed || undefined}
      data-inview={inView || undefined}
      data-dragging={dragging || undefined}
    >
      <div className="reel__track" ref={trackRef}>
        <div className="reel__pin" ref={pinRef}>
          {/* The room the gallery hangs in: a wash that separates it from the
              essay above and below without a hard edge anywhere. */}
          <div className="reel__room" aria-hidden="true" />

          {/* The paper-coloured fade at both edges, drawn over the cards so
              the set reads as continuing past them rather than stopping. */}
          <div className="reel__edge" aria-hidden="true" />

          {/* The screen number, set enormous and left almost invisible behind
              the cards. It is the one thing on the page that says which frame
              you are on without you having to read anything. */}
          <span className="reel__ghost" key={active} aria-hidden="true">
            {pad(active + 1)}
          </span>

          <div className="reel__bar">
            <span className="eyebrow">{projectTitle} — the work</span>
            <span className="eyebrow reel__counter">
              <span className="num reel__counter-now">{pad(active + 1)}</span>
              <span className="reel__counter-of">/ {pad(count)}</span>
            </span>
          </div>

          <div
            className="reel__stage"
            ref={stageRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onPointerLeave={onPointerLeave}
            onKeyDown={(event) => {
              if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
              event.preventDefault();
              step(event.key === 'ArrowRight' ? 1 : -1);
            }}
            role="group"
            aria-roledescription="carousel"
            aria-label={`${projectTitle} screens`}
            tabIndex={reel ? 0 : -1}
          >
            <div className="reel__scene">
              {screens.map((screen, i) => {
                const isActive = i === active;

                return (
                  <figure
                    key={i}
                    className="reel__slide"
                    ref={(node) => {
                      slideRefs.current[i] = node;
                    }}
                    data-active={reel && isActive ? '' : undefined}
                    /* Cards deep in the fan stay in the document for crawlers
                       and for the fallback, but leave the tab order and the
                       a11y tree so a keyboard never lands on something nobody
                       can see. */
                    aria-hidden={reel && Math.abs(i - active) > 1 ? true : undefined}
                  >
                    {/* The entrance animates this inner element, not the card,
                        so the keyframes never fight the fan transform the card
                        is carrying. */}
                    <div
                      className="reel__lift"
                      style={reel ? { animationDelay: `${Math.min(i, 4) * 90}ms` } : undefined}
                    >
                      <button
                        type="button"
                        className="reel__frame"
                        tabIndex={reel && !isActive ? -1 : 0}
                        aria-label={
                          isActive
                            ? `Enlarge screen ${i + 1} of ${count}`
                            : `Show screen ${i + 1} of ${count}`
                        }
                        onClick={() => {
                          /* Letting go of a drag over a card produces a click,
                             and that one is not an ask to open anything. Only
                             that one though: it arrives in the same breath as
                             the pointerup. Judging it on distance alone also
                             swallowed the next keyboard press, which comes
                             with no pointer event to reset the distance. */
                          if (
                            drag.current.moved > DRAG_SLOP &&
                            performance.now() - drag.current.endedAt < 250
                          ) {
                            return;
                          }

                          if (!reel || isActive) withTransition(() => setOpen(i));
                          else goTo(i);
                        }}
                      >
                        {frameFor(screen, i === 0)}
                      </button>
                    </div>

                    {/* Fanned, one shared caption sits under the stage instead
                        — this would be a second copy of the same sentence. */}
                    <figcaption className="reel__caption-inline">
                      <span className="num">{pad(i + 1)}</span>
                      <span>
                        <Copy>{screen.caption}</Copy>
                      </span>
                    </figcaption>
                  </figure>
                );
              })}
            </div>

            <span className="reel__cursor" ref={cursorRef} data-mode="away" aria-hidden="true">
              <span className="reel__cursor-word" data-when="open">
                Open
              </span>
              <span className="reel__cursor-word" data-when="drag">
                Drag
              </span>
              <span className="reel__cursor-dot" data-when="idle" />
            </span>
          </div>

          <button
            type="button"
            className="reel__arrow reel__arrow--prev"
            onClick={() => step(-1)}
            disabled={active === 0}
            aria-label="Previous screen"
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            type="button"
            className="reel__arrow reel__arrow--next"
            onClick={() => step(1)}
            disabled={active === count - 1}
            aria-label="Next screen"
          >
            <span aria-hidden="true">→</span>
          </button>

          <div className="reel__hud">
            <p className="reel__caption" aria-live="polite">
              <span className="reel__caption-mask">
                <span className="reel__caption-line" key={`p-${active}`}>
                  <span className="reel__platform">{current.platform}</span>
                </span>
              </span>
              <span className="reel__caption-mask">
                <span className="reel__caption-line" key={`c-${active}`}>
                  <Copy>{current.caption}</Copy>
                </span>
              </span>
            </p>

            <div className="reel__rail" role="tablist" aria-label="Choose a screen">
              <span className="reel__rail-line" aria-hidden="true">
                <span className="reel__rail-fill" />
              </span>
              {screens.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  aria-label={`Screen ${i + 1}`}
                  className="reel__tick"
                  data-active={i === active ? '' : undefined}
                  data-seen={i < active ? '' : undefined}
                  onClick={() => goTo(i)}
                >
                  <span className="num">{pad(i + 1)}</span>
                </button>
              ))}
            </div>

            <p
              className="reel__hint eyebrow"
              data-shown={hinted && active === 0 ? '' : undefined}
              aria-hidden="true"
            >
              Scroll to advance · click to enlarge
            </p>
          </div>
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
            <div className="lightbox__stage">{frameFor(shown, true)}</div>

            <div className="lightbox__meta">
              <p className="eyebrow">
                {pad(open! + 1)} / {pad(count)} — {shown.platform}
              </p>
              <p className="lightbox__caption">
                <Copy>{shown.caption}</Copy>
              </p>

              <div className="lightbox__strip">
                {screens.map((screen, i) => (
                  <button
                    key={i}
                    type="button"
                    className="lightbox__thumb"
                    data-active={i === open ? '' : undefined}
                    aria-label={`Screen ${i + 1} of ${count}`}
                    onClick={() => withTransition(() => setOpen(i))}
                  >
                    {screen.src ? (
                      <img src={screen.src} alt="" loading="lazy" decoding="async" />
                    ) : (
                      <span className="num">{pad(i + 1)}</span>
                    )}
                  </button>
                ))}
              </div>
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
