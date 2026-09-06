import type { ReactNode } from 'react';

/**
 * Device frames, drawn entirely in CSS — no image assets, no external mockup
 * files, and they restyle themselves with the theme.
 *
 * The frame is only a frame. The value is the screenshot inside it, so until
 * one exists each frame renders a wireframe placeholder naming the exact file
 * it is waiting for. Drop that file in and the placeholder disappears.
 */

export type Platform = 'desktop' | 'tablet' | 'mobile';

interface ScreenProps {
  /** Path to the screenshot, e.g. /work/analytics/desktop.png. */
  src?: string;
  alt: string;
  /** Shown in the placeholder so you know what file to add. */
  expects: string;
  /** Placeholders get simpler at small sizes — the label would be unreadable. */
  compact?: boolean;
}

/** Wireframe shown in place of a missing screenshot. */
function ScreenPlaceholder({ expects, compact }: { expects: string; compact?: boolean }) {
  return (
    <div className="screen-placeholder" aria-hidden="true">
      <div className="screen-placeholder__wire">
        <span className="screen-placeholder__bar" style={{ width: '38%' }} />
        <span className="screen-placeholder__bar" style={{ width: '72%' }} />
        <span className="screen-placeholder__bar" style={{ width: '56%' }} />
        <span className="screen-placeholder__block" />
      </div>
      {!compact ? <span className="screen-placeholder__label">{expects}</span> : null}
    </div>
  );
}

function Screen({ src, alt, expects, compact }: ScreenProps) {
  if (!src) return <ScreenPlaceholder expects={expects} compact={compact} />;
  return <img src={src} alt={alt} loading="lazy" decoding="async" />;
}

/** Browser window: title bar, traffic lights, address pill, 16:10 viewport. */
export function BrowserFrame({ src, alt, expects, compact }: ScreenProps) {
  return (
    <div className="device device--browser">
      <div className="device__chrome" aria-hidden="true">
        <span className="device__dot" />
        <span className="device__dot" />
        <span className="device__dot" />
        <span className="device__omnibox" />
      </div>
      <div className="device__viewport" style={{ aspectRatio: '16 / 10' }}>
        <Screen src={src} alt={alt} expects={expects} compact={compact} />
      </div>
    </div>
  );
}

/** Tablet, portrait. Thin uniform bezel, softly rounded. */
export function TabletFrame({ src, alt, expects, compact }: ScreenProps) {
  return (
    <div className="device device--tablet">
      <div className="device__viewport" style={{ aspectRatio: '3 / 4' }}>
        <Screen src={src} alt={alt} expects={expects} compact={compact} />
      </div>
    </div>
  );
}

/** Phone, portrait, with a speaker pill. */
export function PhoneFrame({ src, alt, expects, compact }: ScreenProps) {
  return (
    <div className="device device--phone">
      <span className="device__notch" aria-hidden="true" />
      <div className="device__viewport" style={{ aspectRatio: '9 / 19' }}>
        <Screen src={src} alt={alt} expects={expects} compact={compact} />
      </div>
    </div>
  );
}

export function DeviceFrame({
  platform,
  ...props
}: ScreenProps & { platform: Platform }): ReactNode {
  if (platform === 'desktop') return <BrowserFrame {...props} />;
  if (platform === 'tablet') return <TabletFrame {...props} />;
  return <PhoneFrame {...props} />;
}
