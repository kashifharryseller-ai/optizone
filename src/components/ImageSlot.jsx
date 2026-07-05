import React, { useState, useEffect, useRef, useCallback } from 'react'

/**
 * ImageSlot — user-fillable image placeholder.
 *
 * A faithful React re-implementation of the prototype's <image-slot>. In the
 * design tool the slot persisted via a host bridge; here it persists the
 * dropped/selected image client-side in localStorage (keyed by `id`) so the
 * user's own photos survive reloads. Drag an image file on, or click to browse.
 * Swap these out for real product/lifestyle photography when available.
 */
const KEY = (id) => `oz-img:${id}`

function readStored(id) {
  try { return localStorage.getItem(KEY(id)) || '' } catch { return '' }
}

export function ImageSlot({ id, placeholder = 'Drop a photo here', shape = 'rect', radius = 0, fit = 'cover', style }) {
  const [src, setSrc] = useState('')
  const [over, setOver] = useState(false)
  const [hover, setHover] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => { setSrc(readStored(id)) }, [id])

  const store = useCallback((dataUrl) => {
    setSrc(dataUrl)
    try {
      if (dataUrl) localStorage.setItem(KEY(id), dataUrl)
      else localStorage.removeItem(KEY(id))
    } catch { /* quota / disabled storage — keep in-memory only */ }
  }, [id])

  const handleFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => store(String(reader.result))
    reader.readAsDataURL(file)
  }, [store])

  const onDrop = (e) => {
    e.preventDefault(); setOver(false)
    const file = e.dataTransfer.files && e.dataTransfer.files[0]
    handleFile(file)
  }

  const borderRadius = shape === 'rounded' ? `${radius || 12}px` : shape === 'circle' ? '999px' : radius ? `${radius}px` : 0

  const base = {
    position: 'relative', display: 'block', overflow: 'hidden', borderRadius,
    background: src ? 'transparent' : 'var(--pine-800)',
    cursor: 'pointer', ...style,
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={placeholder}
      onClick={() => inputRef.current && inputRef.current.click()}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputRef.current?.click() } }}
      onDragOver={(e) => { e.preventDefault(); setOver(true) }}
      onDragLeave={() => setOver(false)}
      onDrop={onDrop}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={base}
    >
      <input ref={inputRef} type="file" accept="image/*" onChange={(e) => handleFile(e.target.files && e.target.files[0])} style={{ display: 'none' }} />
      {src ? (
        <>
          <img src={src} alt={placeholder} style={{ width: '100%', height: '100%', objectFit: fit, display: 'block' }} />
          {hover && (
            <button
              type="button"
              aria-label="Remove photo"
              onClick={(e) => { e.stopPropagation(); store('') }}
              style={{ position: 'absolute', top: 8, insetInlineEnd: 8, width: 28, height: 28, borderRadius: 999, border: 'none', cursor: 'pointer', background: 'rgba(15,34,26,0.72)', color: 'var(--cream-100)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
          )}
        </>
      ) : (
        <div
          style={{
            position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10,
            padding: 16, textAlign: 'center',
            border: `1.5px dashed ${over ? 'var(--amber-500)' : 'rgba(255,255,255,0.28)'}`,
            background: over ? 'rgba(224,138,42,0.10)' : 'transparent',
            transition: 'background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)',
            borderRadius,
          }}
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--amber-500)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.5-3.5a2 2 0 0 0-2.8 0L5 21" />
          </svg>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 11.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--cream-200)', lineHeight: 1.5, maxWidth: 200 }}>
            {placeholder}
          </span>
        </div>
      )}
    </div>
  )
}
