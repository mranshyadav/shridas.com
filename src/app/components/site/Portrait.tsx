import { useState } from 'react';
import bundledPortrait from '../../../assets/portrait.png';
import { site } from '../../data/site';

/**
 * Portrait, with two fallbacks.
 *
 *   1. /portrait.jpg from public/ — drop a file there and it wins, no code
 *      change needed. Use this to swap in a photo shot against a plain
 *      background, which suits the editorial layout better than the bundled
 *      one (that has a purple gradient circle baked into it, left over from
 *      the previous design).
 *   2. The bundled photo that shipped with the repo.
 *   3. A typographic monogram, if neither image loads.
 *
 * The old `src/assets/profile.png` was a 1×1 transparent pixel and rendered as
 * a solid colour block; it has been removed.
 */

type Stage = 'public' | 'bundled' | 'monogram';

export function Portrait() {
  const [stage, setStage] = useState<Stage>('public');

  if (stage === 'monogram') {
    const initials = site.name
      .split(' ')
      .map((part) => part[0])
      .join('');

    return (
      <div
        className="frame flex aspect-[4/5] flex-col items-center justify-center gap-5"
        style={{ backgroundColor: 'var(--paper-sunken)' }}
      >
        <span
          aria-hidden="true"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3rem, 8vw, 5rem)',
            fontWeight: 'var(--fw-medium)',
            letterSpacing: 'var(--tr-display)',
            lineHeight: 1,
          }}
        >
          {initials}
        </span>
        <span className="eyebrow">Add public/portrait.jpg</span>
      </div>
    );
  }

  return (
    <figure className="frame aspect-[4/5]" style={{ backgroundColor: 'var(--paper-sunken)' }}>
      <img
        src={stage === 'public' ? '/portrait.jpg' : bundledPortrait}
        alt={`Portrait of ${site.name}`}
        /* Grayscale, so the portrait sits in the same neutral register as the
           rest of the page rather than being the one thing on it in colour. */
        style={{ objectFit: 'contain', filter: 'grayscale(1)' }}
        onError={() => setStage(stage === 'public' ? 'bundled' : 'monogram')}
      />
    </figure>
  );
}
