import React from 'react'

/**
 * ImageSlot — displays a managed image (uploaded via the admin panel) or a
 * branded placeholder when none is set. Photos are managed in Admin → Media /
 * per product, and delivered through the site content (content.media[id] or a
 * product's image URL).
 */
export function ImageSlot({ src, placeholder = '', shape = 'rect', radius = 0, fit = 'cover', style }) {
  const borderRadius = shape === 'rounded' ? `${radius || 12}px` : shape === 'circle' ? '999px' : radius ? `${radius}px` : 0

  if (src) {
    return (
      <div style={{ overflow: 'hidden', borderRadius, ...style }}>
        <img src={src} alt={placeholder || ''} style={{ width: '100%', height: '100%', objectFit: fit, display: 'block' }} />
      </div>
    )
  }

  return (
    <div
      aria-label={placeholder}
      style={{
        position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 10, padding: 16, textAlign: 'center', borderRadius, background: 'var(--pine-800)',
        border: '1.5px dashed rgba(255,255,255,0.24)', ...style,
      }}
    >
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--amber-500)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.5-3.5a2 2 0 0 0-2.8 0L5 21" />
      </svg>
      {placeholder && (
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 11.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--cream-200)', lineHeight: 1.5, maxWidth: 200 }}>
          {placeholder}
        </span>
      )}
    </div>
  )
}
