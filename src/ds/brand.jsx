import React from 'react'

/**
 * DiamondRule — OPTIZONE's signature divider: a hairline (or two hairlines
 * flanking a small rotated-square diamond). The brand's typographic full-stop.
 */
export function DiamondRule({ label, color = 'var(--amber-600)', diamond = true, width = '100%', style, ...rest }) {
  const line = <span style={{ flex: 1, height: 1, background: color, opacity: 0.8 }} />
  return (
    <div role="separator" style={{ display: 'flex', alignItems: 'center', gap: 12, width, color, ...style }} {...rest}>
      {line}
      {label ? (
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: '0.18em', textTransform: 'uppercase', color, whiteSpace: 'nowrap' }}>
          {label}
        </span>
      ) : diamond ? (
        <span style={{ width: 6, height: 6, background: color, transform: 'rotate(45deg)', flex: '0 0 auto' }} />
      ) : null}
      {line}
    </div>
  )
}

/**
 * OPTIZONE glasses mark — reconstructed round-eyeglasses line symbol.
 * Uses the passed color so it can be tinted (amber on pine, pine on cream, etc.).
 */
export function GlassesMark({ size = 40, color = 'currentColor', strokeWidth = 2.4, style, ...rest }) {
  return (
    <svg viewBox="0 0 120 46" width={size * (120 / 46)} height={size} fill="none" role="img" aria-label="OPTIZONE" style={style} {...rest}>
      <g stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinecap="round">
        <circle cx="40" cy="24" r="15" />
        <circle cx="80" cy="24" r="15" />
        <path d="M55 17 q5 -5 10 0" />
        <path d="M25.5 18 q-6 -2 -10.5 1" />
        <path d="M94.5 18 q6 -2 10.5 1" />
      </g>
    </svg>
  )
}

/**
 * OPTIZONE logo lockup. Renders mark + wordmark (OPTI + ZONE) and optional
 * tagline with the amber diamond rule. `theme` picks colors for pine or cream
 * backgrounds; `variant` chooses the composition.
 */
export function Logo({ variant = 'lockup', theme = 'dark', tagline = true, size = 44, style, ...rest }) {
  const optiColor = theme === 'dark' ? 'var(--white)' : 'var(--pine-800)'
  const zoneColor = 'var(--amber-600)'
  const taglineColor = theme === 'dark' ? 'var(--cream-100)' : 'var(--pine-700)'
  const markSize = size * 0.62

  const Wordmark = (
    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: size, lineHeight: 1, letterSpacing: '0.2em', display: 'flex', whiteSpace: 'nowrap', direction: 'ltr' }}>
      <span style={{ color: optiColor }}>OPTI</span>
      <span style={{ color: zoneColor }}>ZONE</span>
    </div>
  )

  const Tagline = tagline && (
    <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.18, color: 'var(--amber-600)', width: '100%', marginTop: size * 0.16 }}>
      <span style={{ flex: 1, height: 1, background: 'currentColor', opacity: 0.85 }} />
      <span style={{ fontFamily: 'var(--font-display)', fontSize: size * 0.3, letterSpacing: '0.34em', color: taglineColor, textTransform: 'uppercase', paddingInlineStart: '0.34em' }}>
        {'Vision & Style'}
      </span>
      <span style={{ flex: 1, height: 1, background: 'currentColor', opacity: 0.85 }} />
    </div>
  )

  if (variant === 'mark') {
    return <GlassesMark size={size} color={zoneColor} style={style} {...rest} />
  }
  if (variant === 'wordmark') {
    return (
      <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', direction: 'ltr', ...style }} {...rest}>
        {Wordmark}
        {Tagline}
      </div>
    )
  }
  if (variant === 'horizontal') {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.34, direction: 'ltr', ...style }} {...rest}>
        <GlassesMark size={markSize} color={zoneColor} />
        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          {Wordmark}
          {tagline && (
            <div style={{ fontFamily: 'var(--font-display)', fontSize: size * 0.26, letterSpacing: '0.28em', color: taglineColor, textTransform: 'uppercase', marginTop: size * 0.1, paddingInlineStart: '0.28em' }}>
              {'Vision & Style'}
            </div>
          )}
        </div>
      </div>
    )
  }
  // lockup (centered, stacked)
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', direction: 'ltr', ...style }} {...rest}>
      <GlassesMark size={markSize} color={zoneColor} style={{ marginBottom: size * 0.24 }} />
      {Wordmark}
      {Tagline}
    </div>
  )
}
