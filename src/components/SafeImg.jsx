import React, { useState } from 'react';
import { Music2 } from 'lucide-react';

/**
 * Smart image component:
 * - Shows a gradient placeholder instantly
 * - Fades in the real image once loaded
 * - Falls back to the placeholder if the image errors
 *
 * Props:
 *   src        — image URL
 *   alt        — alt text
 *   className  — class on the outer wrapper div
 *   style      — extra style on the outer wrapper div
 *   imgStyle   — extra style on the <img> element
 *   iconSize   — size of the fallback music note icon
 */
export default function SafeImg({ src, alt = '', className, style, imgStyle, iconSize = 20 }) {
  const [loaded, setLoaded] = useState(false);
  const [error,  setError]  = useState(false);

  const showImg = !!src && !error;

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--bg-elevated)',
        ...style,
      }}
    >
      {/* Placeholder — always mounted, fades out once image loads */}
      <div
        aria-hidden
        style={{
          position:       'absolute',
          inset:          0,
          background:     'linear-gradient(135deg, var(--bg-elevated), var(--bg-card))',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          opacity:        loaded ? 0 : 1,
          transition:     'opacity 0.35s ease',
          pointerEvents:  'none',
        }}
      >
        <Music2 size={iconSize} color="var(--text-muted)" />
      </div>

      {showImg && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          style={{
            position:   'absolute',
            inset:      0,
            width:      '100%',
            height:     '100%',
            objectFit:  'cover',
            opacity:    loaded ? 1 : 0,
            transition: 'opacity 0.35s ease',
            display:    'block',
            ...imgStyle,
          }}
        />
      )}
    </div>
  );
}
