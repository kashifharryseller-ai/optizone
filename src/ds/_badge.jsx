import React from 'react'

/** Badge — small status pill (new / bestseller / sale / try-mirror). */
export function Badge({ variant = 'neutral', children, style, ...rest }) {
  const variants = {
    neutral: { background: 'var(--cream-300)', color: 'var(--ink-700)' },
    new: { background: 'var(--pine-700)', color: 'var(--cream-100)' },
    sale: { background: 'var(--amber-600)', color: 'var(--pine-950)' },
    bestseller: { background: 'var(--amber-100)', color: 'var(--amber-800)' },
    try: { background: 'var(--pine-50)', color: 'var(--pine-700)' },
    success: { background: '#E4F0E7', color: 'var(--success)' },
    danger: { background: '#F6E3DE', color: 'var(--danger)' },
  }[variant]
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6, height: 22, padding: '0 10px',
        fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 500, letterSpacing: '0.12em',
        textTransform: 'uppercase', borderRadius: 'var(--radius-xs)', whiteSpace: 'nowrap',
        ...variants, ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  )
}
