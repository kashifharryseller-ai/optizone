import React, { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { Icon } from '../ds/index.js'
import { useLang } from '../i18n/index.jsx'
import { BRAND_TILES, BRAND_COPY } from '../data/brands.js'

// Tile3D — a single brand card with pointer-driven 3D tilt (rotateX/rotateY via
// springs), a floating product image that lifts on hover, an amber depth-glow
// and a glass caption bar. Colours are strictly brand tokens (pine scrim, amber
// accent, cream text) — no palette change. Keyboard/reduced-motion safe: the
// tilt is pointer-only; focus + click still work with no motion.
function Tile3D({ tile, label, onOpen, kindLabel }) {
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 160, damping: 16, mass: 0.4 })
  const sry = useSpring(ry, { stiffness: 160, damping: 16, mass: 0.4 })
  const [hover, setHover] = useState(false)

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    ry.set(px * 14)
    rx.set(-py * 14)
  }
  const reset = () => { rx.set(0); ry.set(0); setHover(false) }

  return (
    <motion.button
      type="button"
      onMouseMove={onMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={reset}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      onClick={onOpen}
      aria-label={`${label} — ${kindLabel}`}
      style={{
        position: 'relative', display: 'block', padding: 0, cursor: 'pointer',
        border: '1px solid var(--border-on-dark)', borderRadius: 'var(--radius-lg)',
        background: 'linear-gradient(160deg, var(--pine-800), var(--pine-950))',
        overflow: 'hidden', transformStyle: 'preserve-3d', transformPerspective: 1000,
        rotateX: srx, rotateY: sry,
        boxShadow: hover ? '0 26px 60px -22px rgba(6,23,15,0.75)' : 'var(--shadow-dark)',
        transition: 'box-shadow var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out)',
        borderColor: hover ? 'var(--amber-500)' : 'var(--border-on-dark)',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {/* Product image — floats forward (translateZ) and scales on hover */}
      <div style={{ position: 'relative', aspectRatio: '4 / 3', overflow: 'hidden' }}>
        <motion.img
          src={tile.img} alt={label} loading="lazy" decoding="async"
          animate={{ scale: hover ? 1.08 : 1, z: hover ? 40 : 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transformStyle: 'preserve-3d' }}
        />
        {/* amber depth glow that blooms on hover */}
        <motion.div
          aria-hidden
          animate={{ opacity: hover ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 90% at 50% 8%, rgba(255,185,61,0.22), transparent 60%)', pointerEvents: 'none' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(6,23,15,0.82) 0%, rgba(6,23,15,0.08) 46%, transparent 70%)', pointerEvents: 'none' }} />
      </div>

      {/* Caption bar */}
      <div style={{ position: 'absolute', insetInlineStart: 0, insetInlineEnd: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '14px 16px 16px', textAlign: 'start' }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 18, letterSpacing: '0.02em', color: 'var(--cream-100)', lineHeight: 1.15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--amber-500)', marginTop: 3 }}>{kindLabel}</div>
        </div>
        <motion.span
          aria-hidden
          animate={{ x: hover ? 4 : 0, backgroundColor: hover ? 'var(--amber-600)' : 'rgba(251,248,241,0.12)' }}
          style={{ flex: '0 0 auto', width: 34, height: 34, borderRadius: 999, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Icon name="arrow-right" size={16} color={hover ? 'var(--pine-950)' : 'var(--cream-100)'} />
        </motion.span>
      </div>
    </motion.button>
  )
}

// Homepage strip — a horizontal scroll-snap carousel of brand tiles with
// arrow controls (manual) and native touch/drag scroll. RTL-aware.
export function BrandCarousel({ openCatalog }) {
  const { L, dir } = useLang()
  const rtl = dir === 'rtl'
  const trackRef = useRef(null)
  const kindLabel = (k) => L(k === 'contacts' ? BRAND_COPY.contacts : BRAND_COPY.eyewear)

  const scrollByCard = (nextDir) => {
    const el = trackRef.current
    if (!el) return
    const card = el.querySelector('[data-brand-card]')
    const step = card ? card.getBoundingClientRect().width + 18 : 260
    el.scrollBy({ left: (rtl ? -1 : 1) * nextDir * step, behavior: 'smooth' })
  }

  const arrow = (side) => ({
    width: 42, height: 42, borderRadius: 999, flex: '0 0 auto', cursor: 'pointer',
    border: '1px solid var(--border-hair)', background: 'var(--surface-card)',
    color: 'var(--pine-700)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: 'var(--shadow-xs)',
  })

  return (
    <section style={{ background: 'var(--pine-950)', position: 'relative', overflow: 'hidden' }}>
      {/* soft brand aurora backdrop */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'radial-gradient(60% 55% at 18% 0%, rgba(21,122,70,0.55), transparent 60%), radial-gradient(50% 50% at 92% 100%, rgba(245,166,35,0.16), transparent 62%)', pointerEvents: 'none' }} />
      <div style={{ position: 'relative', maxWidth: 'var(--container-max)', margin: '0 auto', padding: '68px 28px 76px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 26 }}>
          <div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--amber-500)' }}>{L(BRAND_COPY.eyebrow)}</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 34, color: 'var(--cream-100)', margin: '10px 0 8px' }}>{L(BRAND_COPY.title)}</h2>
            <p style={{ margin: 0, fontSize: 15, color: 'var(--pine-100)', maxWidth: 480, lineHeight: 1.6 }}>{L(BRAND_COPY.sub)}</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" aria-label="Previous" onClick={() => scrollByCard(-1)} style={arrow()}>
              <Icon name={rtl ? 'chevron-right' : 'chevron-left'} size={20} color="currentColor" />
            </button>
            <button type="button" aria-label="Next" onClick={() => scrollByCard(1)} style={arrow()}>
              <Icon name={rtl ? 'chevron-left' : 'chevron-right'} size={20} color="currentColor" />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="oz-brand-track"
          style={{ display: 'grid', gridAutoFlow: 'column', gridAutoColumns: 'minmax(230px, 1fr)', gap: 18, overflowX: 'auto', scrollSnapType: 'x mandatory', paddingBottom: 6, scrollbarWidth: 'none' }}
        >
          {BRAND_TILES.map((tile) => (
            <div key={tile.name} data-brand-card style={{ scrollSnapAlign: 'start' }}>
              <Tile3D tile={tile} label={tile.name} kindLabel={kindLabel(tile.kind)} onOpen={() => openCatalog('all', tile.name)} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Brands page — full responsive grid of the same 3D tiles.
export function BrandGrid({ openCatalog }) {
  const { L } = useLang()
  const kindLabel = (k) => L(k === 'contacts' ? BRAND_COPY.contacts : BRAND_COPY.eyewear)
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
      {BRAND_TILES.map((tile) => (
        <Tile3D key={tile.name} tile={tile} label={tile.name} kindLabel={kindLabel(tile.kind)} onOpen={() => openCatalog('all', tile.name)} />
      ))}
    </div>
  )
}
