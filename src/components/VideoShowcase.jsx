import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Icon } from '../ds/index.js'
import { useLang } from '../i18n/index.jsx'

// Cinematic product-film carousel used as the HERO visual. It fills its parent
// (the hero panel provides the frame: aspect-ratio, radius, border). Each slide
// is a muted, looping video (no audio) — it auto-advances and can be driven
// manually with the arrows or dots. Only the active slide plays (others pause);
// slides cross-fade. Captions are inline {en,he,ar} objects resolved via L(),
// so Hebrew/Arabic + RTL work with no i18n table changes. Colours follow the
// brand system (pine-950 scrim, amber accents, cream text).
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
const INTERVAL = 6000

export function VideoShowcase() {
  const { L, dir } = useLang()
  const n = SLIDES.length
  const [idx, setIdx] = useState(0)
  const [paused, setPaused] = useState(false)
  const videoRefs = useRef([])
  const go = useCallback((i) => setIdx(((i % n) + n) % n), [n])
  const rtl = dir === 'rtl'

  // Auto-advance (pauses on hover/focus; off for reduced-motion users).
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
    [side === 'start' ? 'insetInlineStart' : 'insetInlineEnd']: 10,
    width: 34, height: 34, borderRadius: 999, border: '1px solid rgba(251,248,241,0.3)',
    background: 'rgba(6,23,15,0.5)', color: 'var(--cream-100)', cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', zIndex: 3,
    backdropFilter: 'blur(4px)',
  })

  return (
    <div
      aria-roledescription="carousel" aria-label="Product films"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)}
      style={{ position: 'absolute', inset: 0 }}
    >
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
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(6,23,15,0.92) 0%, rgba(6,23,15,0.2) 55%, rgba(6,23,15,0) 100%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', insetInlineStart: 0, bottom: 0, display: 'flex', flexDirection: 'column', gap: 4, padding: '20px 22px 40px', maxWidth: '85%' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--amber-500)' }}>{L(s.eyebrow)}</span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 'clamp(18px, 2.4vw, 26px)', color: 'var(--cream-100)', lineHeight: 1.1 }}>{L(s.title)}</span>
          </div>
        </div>
      ))}

      <button type="button" onClick={() => go(idx - 1)} aria-label="Previous slide" style={arrow('start')}>
        <Icon name={rtl ? 'chevron-right' : 'chevron-left'} size={18} color="currentColor" />
      </button>
      <button type="button" onClick={() => go(idx + 1)} aria-label="Next slide" style={arrow('end')}>
        <Icon name={rtl ? 'chevron-left' : 'chevron-right'} size={18} color="currentColor" />
      </button>

      <div style={{ position: 'absolute', insetInlineStart: 0, insetInlineEnd: 0, bottom: 14, display: 'flex', gap: 7, justifyContent: 'center', zIndex: 3 }}>
        {SLIDES.map((s, i) => (
          <button
            key={s.src} type="button" onClick={() => go(i)}
            aria-label={`Go to slide ${i + 1}`} aria-current={i === idx}
            style={{ width: i === idx ? 22 : 7, height: 7, borderRadius: 999, border: 'none', cursor: 'pointer', padding: 0, background: i === idx ? 'var(--amber-500)' : 'rgba(251,248,241,0.55)', transition: 'all var(--dur-base) var(--ease-out)' }}
          />
        ))}
      </div>
    </div>
  )
}
