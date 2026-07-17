import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Icon } from '../ds/index.js'
import { useLang } from '../i18n/index.jsx'

// Cinematic product-film carousel for the homepage. Each slide is a muted,
// looping video (no audio). Auto-advances, and can be driven manually with the
// arrows or the dots. Only the active slide plays (others pause) to save CPU;
// slides cross-fade. Captions are inline {en,he,ar} objects resolved via L(),
// so no i18n table changes are needed and RTL works automatically.
const SLIDES = [
  {
    src: '/site/showcase.mp4', poster: '/site/showcase-poster.jpg',
    eyebrow: { en: 'The Signature Edit', he: 'הקולקציה החתומה', ar: 'المجموعة المميّزة' },
    title: { en: 'Crafted to be seen', he: 'נועדו להיראות', ar: 'صُمّمت لتُرى' },
  },
  {
    src: '/site/showcase-2.mp4', poster: '/site/showcase-2-poster.jpg',
    eyebrow: { en: 'Timeless Icons', he: 'איקונים על-זמניים', ar: 'أيقونات خالدة' },
    title: { en: 'Rounded in character', he: 'עגול באופיו', ar: 'دائريّ الطابع' },
  },
  {
    src: '/site/showcase-3.mp4', poster: '/site/showcase-3-poster.jpg',
    eyebrow: { en: 'Bold & Black', he: 'נועז ושחור', ar: 'جريء وأسود' },
    title: { en: 'Made to stand out', he: 'נבנו לבלוט', ar: 'صُنعت لتتميّز' },
  },
  {
    src: '/site/showcase-4.mp4', poster: '/site/showcase-4-poster.jpg',
    eyebrow: { en: 'Heritage Tortoise', he: 'מסורת מנומרת', ar: 'أصالة نمشيّة' },
    title: { en: 'Detail in every curve', he: 'פרט בכל עקומה', ar: 'تفصيل في كلّ انحناءة' },
  },
]
const INTERVAL = 7000

export function VideoShowcase() {
  const { L, dir } = useLang()
  const n = SLIDES.length
  const [idx, setIdx] = useState(0)
  const [paused, setPaused] = useState(false)
  const videoRefs = useRef([])

  const go = useCallback((i) => setIdx(((i % n) + n) % n), [n])
  const rtl = dir === 'rtl'

  // Auto-advance (paused on hover/focus; disabled for reduced-motion users).
  useEffect(() => {
    if (paused) return undefined
    const reduce = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return undefined
    const t = setTimeout(() => go(idx + 1), INTERVAL)
    return () => clearTimeout(t)
  }, [idx, paused, go])

  // Play only the active slide; pause + rewind the rest.
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return
      if (i === idx) { try { v.currentTime = 0 } catch { /* not ready */ } v.play().catch(() => {}) }
      else v.pause()
    })
  }, [idx])

  const arrow = (side) => ({
    position: 'absolute', top: '50%', transform: 'translateY(-50%)',
    [side === 'start' ? 'insetInlineStart' : 'insetInlineEnd']: 'clamp(8px, 2vw, 20px)',
    width: 42, height: 42, borderRadius: 999, border: '1px solid rgba(255,255,255,0.25)',
    background: 'rgba(6,23,15,0.45)', color: 'var(--cream-100)', cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', zIndex: 3,
    backdropFilter: 'blur(4px)', transition: 'background var(--dur-fast) var(--ease-out)',
  })

  return (
    <section
      aria-roledescription="carousel" aria-label="Product films"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)}
      style={{ position: 'relative', background: 'var(--pine-950)', overflow: 'hidden' }}
    >
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', maxHeight: 600, overflow: 'hidden' }}>
        {SLIDES.map((s, i) => (
          <div
            key={s.src} aria-hidden={i !== idx}
            style={{ position: 'absolute', inset: 0, opacity: i === idx ? 1 : 0, transition: 'opacity 700ms var(--ease-out)', pointerEvents: i === idx ? 'auto' : 'none' }}
          >
            <video
              ref={(el) => { videoRefs.current[i] = el }}
              src={s.src} poster={s.poster}
              muted loop playsInline preload={i === 0 ? 'metadata' : 'none'}
              aria-label={L(s.title)}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(6,23,15,0.9) 0%, rgba(6,23,15,0.15) 55%, rgba(6,23,15,0) 100%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', insetInlineStart: 0, bottom: 0, display: 'flex', flexDirection: 'column', gap: 8, padding: 'clamp(20px, 5vw, 56px)', paddingBottom: 'clamp(44px, 7vw, 80px)', maxWidth: 560 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--amber-500)' }}>{L(s.eyebrow)}</span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 'clamp(26px, 4vw, 46px)', color: 'var(--cream-100)', margin: 0, lineHeight: 1.05 }}>{L(s.title)}</h2>
            </div>
          </div>
        ))}

        {/* Manual controls: previous / next */}
        <button type="button" onClick={() => go(idx - 1)} aria-label="Previous slide" style={arrow('start')}>
          <Icon name={rtl ? 'chevron-right' : 'chevron-left'} size={20} color="currentColor" />
        </button>
        <button type="button" onClick={() => go(idx + 1)} aria-label="Next slide" style={arrow('end')}>
          <Icon name={rtl ? 'chevron-left' : 'chevron-right'} size={20} color="currentColor" />
        </button>

        {/* Dot indicators */}
        <div style={{ position: 'absolute', insetInlineStart: 0, insetInlineEnd: 0, bottom: 14, display: 'flex', gap: 8, justifyContent: 'center', zIndex: 3 }}>
          {SLIDES.map((s, i) => (
            <button
              key={s.src} type="button" onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1}`} aria-current={i === idx}
              style={{ width: i === idx ? 26 : 8, height: 8, borderRadius: 999, border: 'none', cursor: 'pointer', padding: 0, background: i === idx ? 'var(--amber-500)' : 'rgba(255,255,255,0.5)', transition: 'all var(--dur-base) var(--ease-out)' }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
