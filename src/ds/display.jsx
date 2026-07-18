import React, { useState } from 'react'
import { motion } from 'motion/react'
import { Badge as _Badge } from './_badge.jsx'

export { Badge } from './_badge.jsx'

/** Card — white surface on cream, hairline border, soft warm shadow. */
export function Card({ variant = 'default', padding = 'md', hover = false, children, style, ...rest }) {
  const pads = { none: 0, sm: 16, md: 24, lg: 32 }[padding]
  const variants = {
    default: { background: 'var(--surface-card)', border: '1px solid var(--border-hair)', boxShadow: 'var(--shadow-sm)', color: 'var(--text-body)' },
    flat: { background: 'var(--surface-card)', border: '1px solid var(--border-hair)', boxShadow: 'none', color: 'var(--text-body)' },
    outline: { background: 'transparent', border: '1px solid var(--border-strong)', boxShadow: 'none', color: 'var(--text-body)' },
    dark: { background: 'var(--pine-700)', border: '1px solid var(--border-on-dark)', boxShadow: 'var(--shadow-dark)', color: 'var(--cream-100)' },
  }[variant]
  const [h, setH] = useState(false)
  return (
    <div
      onMouseEnter={() => hover && setH(true)}
      onMouseLeave={() => hover && setH(false)}
      style={{
        borderRadius: 'var(--radius-card)',
        padding: pads,
        transition: 'transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)',
        transform: h ? 'translateY(-3px)' : 'none',
        boxShadow: h ? 'var(--shadow-md)' : variants.boxShadow,
        ...variants,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  )
}

/** Price — shekel price with optional strikethrough original + discount. */
export function Price({ amount, original, currency = '₪', size = 'md', align = 'start', style, ...rest }) {
  const sizes = { sm: 16, md: 20, lg: 28 }[size]
  const fmt = (n) => `${currency}${Number(n).toLocaleString('he-IL')}`
  const off = original ? Math.round((1 - amount / original) * 100) : 0
  return (
    <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 10, justifyContent: align, ...style }} {...rest}>
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: sizes, color: original ? 'var(--amber-700)' : 'var(--text-strong)', letterSpacing: '0.01em' }}>
        {fmt(amount)}
      </span>
      {original && (
        <span style={{ fontSize: sizes * 0.66, color: 'var(--text-faint)', textDecoration: 'line-through' }}>{fmt(original)}</span>
      )}
      {original && (
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', color: 'var(--pine-950)', background: 'var(--amber-600)', padding: '2px 6px', borderRadius: 'var(--radius-xs)' }}>
          {'−'}{off}%
        </span>
      )}
    </div>
  )
}

function Star({ size, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ display: 'block' }}>
      <path d="M12 2.5l2.9 5.9 6.5.95-4.7 4.58 1.11 6.47L12 17.9l-5.81 3.06 1.11-6.47-4.7-4.58 6.5-.95z" />
    </svg>
  )
}

/** Rating — amber star rating with optional count. */
export function Rating({ value = 0, max = 5, count, size = 16, style, ...rest }) {
  const stars = []
  for (let i = 0; i < max; i++) {
    const fill = Math.max(0, Math.min(1, value - i))
    stars.push(
      <span key={i} style={{ position: 'relative', width: size, height: size, display: 'inline-block' }}>
        <Star size={size} color="var(--ink-200)" />
        <span style={{ position: 'absolute', insetInlineStart: 0, top: 0, width: `${fill * 100}%`, overflow: 'hidden' }}>
          <Star size={size} color="var(--amber-600)" />
        </span>
      </span>,
    )
  }
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, ...style }} {...rest}>
      <span style={{ display: 'inline-flex', gap: 2 }}>{stars}</span>
      {count != null && <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>({count})</span>}
    </span>
  )
}

/**
 * ProductCard — frame tile: image, brand eyebrow, name, price, rating, status
 * badge, Try-Mirror availability, colour swatches, quick-add and hover lift.
 */
export function ProductCard({ image, brand, name, amount, original, rating, reviewCount, badge, tryMirror = false, colors = [], onQuickAdd, tryMirrorLabel = 'Try Mirror', quickAddLabel = 'Add to cart', style, ...rest }) {
  const [h, setH] = useState(false)
  const [imgFailed, setImgFailed] = useState(false) // BUG 2: broken photo URL → SVG fallback
  return (
    <motion.div
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      style={{
        display: 'flex', flexDirection: 'column', background: 'var(--surface-card)',
        border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-card)', overflow: 'hidden',
        boxShadow: h ? 'var(--shadow-md)' : 'var(--shadow-xs)',
        transition: 'box-shadow var(--dur-base) var(--ease-out)',
        ...style,
      }}
      {...rest}
    >
      <div style={{ position: 'relative', aspectRatio: '4 / 3', background: 'var(--cream-300)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {image && !imgFailed ? (
          // BUG 2: real product photo when available — object-cover, lazy-loaded,
          // async-decoded, descriptive alt; falls back to the SVG on load error.
          <img
            src={image}
            alt={[brand, name].filter(Boolean).join(' ')}
            loading="lazy"
            decoding="async"
            onError={() => setImgFailed(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: h ? 'scale(1.06)' : 'scale(1)', transition: 'transform 600ms var(--ease-out)' }}
          />
        ) : (
          <svg viewBox="0 0 120 46" width="46%" fill="none" style={{ opacity: 0.35 }}>
            <g stroke="var(--pine-500)" strokeWidth="2.4" strokeLinecap="round">
              <circle cx="40" cy="24" r="15" />
              <circle cx="80" cy="24" r="15" />
              <path d="M55 17 q5 -5 10 0" />
              <path d="M25.5 18 q-6 -2 -10.5 1" />
              <path d="M94.5 18 q6 -2 10.5 1" />
            </g>
          </svg>
        )}
        <div style={{ position: 'absolute', top: 12, insetInlineStart: 12, display: 'flex', gap: 6 }}>
          {badge && <_Badge variant={badge.variant}>{badge.label}</_Badge>}
        </div>
        {tryMirror && (
          <div style={{ position: 'absolute', bottom: 12, insetInlineEnd: 12 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 26, padding: '0 10px', background: 'rgba(18,36,26,0.82)', color: 'var(--cream-100)', borderRadius: 999, fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', backdropFilter: 'blur(4px)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--amber-500)" strokeWidth="2" strokeLinecap="round">
                <circle cx="7" cy="13" r="3.5" />
                <circle cx="17" cy="13" r="3.5" />
                <path d="M10.5 12.5c.7-.7 2.3-.7 3 0" />
              </svg>
              {tryMirrorLabel}
            </span>
          </div>
        )}
      </div>
      <div style={{ padding: '16px 18px 18px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        {brand && <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-accent)' }}>{brand}</span>}
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 600, color: 'var(--text-strong)', lineHeight: 1.3 }}>{name}</span>
        {rating != null && <Rating value={rating} count={reviewCount} size={14} />}
        {colors.length > 0 && (
          <div style={{ display: 'flex', gap: 6, marginTop: 2 }}>
            {colors.map((c, i) => (
              <span key={i} style={{ width: 16, height: 16, borderRadius: 999, background: c, border: '1px solid var(--border-hair)' }} />
            ))}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 8 }}>
          <Price amount={amount} original={original} size="md" />
          {onQuickAdd && (
            <motion.button
              type="button"
              onClick={(e) => { e.stopPropagation(); onQuickAdd(e) }}
              aria-label={quickAddLabel}
              whileTap={{ scale: 0.88 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              style={{
                width: 40, height: 40, borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer',
                background: h ? 'var(--amber-600)' : 'var(--pine-700)', color: h ? 'var(--pine-950)' : 'var(--cream-100)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background var(--dur-fast) var(--ease-out)',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

/** Tag — filter chip / attribute pill, optionally selectable and removable. */
export function Tag({ selected = false, onClick, onRemove, children, style, ...rest }) {
  const [h, setH] = useState(false)
  return (
    <span
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8, height: 34, padding: '0 14px',
        fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500, borderRadius: 'var(--radius-pill)',
        border: `1px solid ${selected ? 'var(--pine-700)' : 'var(--border-hair)'}`,
        background: selected ? 'var(--pine-700)' : h ? 'var(--pine-50)' : 'var(--white)',
        color: selected ? 'var(--cream-100)' : 'var(--text-body)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all var(--dur-fast) var(--ease-out)',
        ...style,
      }}
      {...rest}
    >
      {children}
      {onRemove && (
        <button type="button" aria-label="remove" onClick={(e) => { e.stopPropagation(); onRemove() }} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, display: 'inline-flex', color: 'inherit', opacity: 0.7 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  )
}
