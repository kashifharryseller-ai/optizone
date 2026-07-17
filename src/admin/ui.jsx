import React, { useEffect, useRef, useState } from 'react'
import { api } from '../api.js'

// --- Layout ----------------------------------------------------------------
export function Panel({ title, desc, actions, children, style }) {
  return (
    <section style={{ background: 'var(--surface-card)', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-md)', padding: 22, ...style }}>
      {(title || actions) && (
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
          <div>
            {title && <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--text-strong)' }}>{title}</h2>}
            {desc && <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>{desc}</p>}
          </div>
          {actions}
        </div>
      )}
      {children}
    </section>
  )
}

export function Row({ children, cols, gap = 12, style }) {
  return <div style={{ display: 'grid', gridTemplateColumns: cols || 'repeat(2,1fr)', gap, ...style }}>{children}</div>
}

// --- Buttons ----------------------------------------------------------------
export function Btn({ variant = 'primary', size = 'md', children, style, ...rest }) {
  const v = {
    primary: { background: 'var(--pine-700)', color: 'var(--cream-100)', border: '1px solid var(--pine-700)' },
    accent: { background: 'var(--amber-600)', color: 'var(--pine-950)', border: '1px solid var(--amber-600)' },
    outline: { background: 'var(--white)', color: 'var(--pine-700)', border: '1px solid var(--border-strong)' },
    ghost: { background: 'transparent', color: 'var(--text-muted)', border: '1px solid transparent' },
    danger: { background: 'var(--white)', color: 'var(--danger)', border: '1px solid #E7C3BA' },
  }[variant]
  const pad = size === 'sm' ? '6px 12px' : '9px 18px'
  const fs = size === 'sm' ? 12 : 13
  return (
    <button type="button" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: pad, borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: fs, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500, ...v, ...style }} {...rest}>
      {children}
    </button>
  )
}

// --- Fields -----------------------------------------------------------------
export function Field({ label, hint, children }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{label}</span>}
      {children}
      {hint && <span style={{ fontSize: 11.5, color: 'var(--text-faint)' }}>{hint}</span>}
    </label>
  )
}

const inputStyle = {
  width: '100%', height: 40, padding: '0 12px', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-sm)',
  background: 'var(--white)', fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-strong)', outline: 'none',
}

export function Text({ value, onChange, dir, ...rest }) {
  return <input value={value ?? ''} dir={dir} onChange={(e) => onChange(e.target.value)} style={inputStyle} {...rest} />
}

// Auto-growing textarea — grows with the content so nothing is ever truncated.
export function Area({ value, onChange, dir, rows = 2, ...rest }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight + 2}px`
  }, [value])
  return <textarea ref={ref} value={value ?? ''} dir={dir} rows={rows} onChange={(e) => onChange(e.target.value)} style={{ ...inputStyle, height: 'auto', padding: 12, resize: 'none', overflow: 'hidden', lineHeight: 1.5 }} {...rest} />
}

// Character counter under a constrained input; turns amber near the limit.
function Counter({ len, max }) {
  const warn = len >= max * 0.9
  return (
    <span aria-live="polite" style={{ position: 'absolute', bottom: -15, insetInlineEnd: 2, fontSize: 10.5, fontFamily: 'var(--font-display)', letterSpacing: '0.04em', color: len >= max ? 'var(--danger)' : warn ? 'var(--amber-700)' : 'var(--text-faint)' }}>
      {len}/{max}
    </span>
  )
}

export function Num({ value, onChange, ...rest }) {
  return <input type="number" value={value ?? 0} onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))} style={inputStyle} {...rest} />
}

export function SelectField({ value, onChange, options }) {
  return (
    <select value={value ?? ''} onChange={(e) => onChange(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
      {options.map((o) => (typeof o === 'string' ? <option key={o} value={o}>{o}</option> : <option key={o.value} value={o.value}>{o.label}</option>))}
    </select>
  )
}

export function Toggle({ checked, onChange, label }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
      <span style={{ width: 42, height: 24, borderRadius: 999, padding: 3, background: checked ? 'var(--amber-600)' : 'var(--ink-300)', transition: 'background var(--dur-base) var(--ease-out)' }}>
        <span style={{ display: 'block', width: 18, height: 18, borderRadius: 999, background: '#fff', transform: checked ? 'translateX(18px)' : 'none', transition: 'transform var(--dur-base) var(--ease-out)' }} />
      </span>
      {label && <span style={{ fontSize: 13, color: 'var(--text-body)' }}>{label}</span>}
    </button>
  )
}

// Content text field — English only.
// The owner types content in English; Hebrew and Arabic are generated
// automatically on save (server-side, cached). We keep the value a
// { en, he, ar } object (so existing translations are preserved on the object)
// but only expose the English input here. `max` adds maxLength + a live counter;
// `area` uses an auto-growing textarea.
export function Bilingual({ label, value = {}, onChange, area = false, max }) {
  const set = (v) => onChange({ ...value, en: max ? String(v).slice(0, max) : v })
  const Ctrl = area ? Area : Text
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          {label}
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, letterSpacing: 0, textTransform: 'none', color: 'var(--text-faint)', background: 'var(--cream-300)', borderRadius: 999, padding: '1px 8px' }}>auto → עברית · العربية</span>
        </span>
      )}
      <div style={{ position: 'relative', paddingBottom: max ? 12 : 0 }}>
        <Ctrl value={value.en} onChange={set} placeholder="English" aria-label={`${label || 'Text'} (English)`} maxLength={max} />
        <Tag>EN</Tag>
        {max != null && <Counter len={(value.en || '').length} max={max} />}
      </div>
    </div>
  )
}

function Tag({ children }) {
  return <span style={{ position: 'absolute', top: -8, insetInlineEnd: 8, fontSize: 9, letterSpacing: '0.1em', background: 'var(--cream-300)', color: 'var(--text-muted)', padding: '1px 6px', borderRadius: 999, fontFamily: 'var(--font-display)' }}>{children}</span>
}

// --- Image upload -----------------------------------------------------------
export function ImageField({ label, value, onChange }) {
  const ref = useRef(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const pick = async (file) => {
    if (!file) return
    setBusy(true); setErr('')
    try { const { url } = await api.upload(file); onChange(url) } catch (e) { setErr(e.message) } finally { setBusy(false) }
  }
  return (
    <Field label={label}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 72, height: 54, borderRadius: 'var(--radius-sm)', background: 'var(--cream-300)', border: '1px solid var(--border-hair)', overflow: 'hidden', flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {value ? <img src={value} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 10, color: 'var(--text-faint)' }}>none</span>}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input ref={ref} type="file" accept="image/*" onChange={(e) => pick(e.target.files && e.target.files[0])} style={{ display: 'none' }} />
          <Btn variant="outline" size="sm" onClick={() => ref.current && ref.current.click()} disabled={busy}>{busy ? 'Uploading…' : 'Upload'}</Btn>
          {value && <Btn variant="ghost" size="sm" onClick={() => onChange('')}>Clear</Btn>}
        </div>
      </div>
      {err && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{err}</span>}
    </Field>
  )
}

// --- Repeatable list --------------------------------------------------------
// Optional props:
//  - summary(item, i): renders a compact header row; when provided the item
//    body is COLLAPSED by default and expands via the header / Edit button —
//    keeps long catalogs (e.g. Products) scannable instead of a huge scroll.
//  - confirmRemove(item) | string: confirmation prompt before deleting a row.
export function ListEditor({ items, onChange, render, makeNew, addLabel = 'Add item', itemStyle, summary, confirmRemove, canReorder = true, dragReorder = false }) {
  const [openIdx, setOpenIdx] = useState(summary ? null : -1) // -1 = all open (no summary mode)
  const [dragIdx, setDragIdx] = useState(null)
  const [overIdx, setOverIdx] = useState(null)
  const update = (i, next) => onChange(items.map((it, idx) => (idx === i ? next : it)))
  const remove = (i, it) => {
    if (confirmRemove) {
      const msg = typeof confirmRemove === 'function' ? confirmRemove(it) : confirmRemove
      if (!window.confirm(msg)) return
    }
    if (openIdx === i) setOpenIdx(null)
    onChange(items.filter((_, idx) => idx !== i))
  }
  const move = (i, dir) => {
    const j = i + dir
    if (j < 0 || j >= items.length) return
    const copy = [...items]; const [x] = copy.splice(i, 1); copy.splice(j, 0, x); onChange(copy)
    if (openIdx === i) setOpenIdx(j)
    else if (openIdx === j) setOpenIdx(i)
  }
  const add = () => { onChange([...items, makeNew()]); if (summary) setOpenIdx(items.length) }
  // Drag-and-drop reorder (mouse) + arrow keys on the focused grip (keyboard).
  const dropOn = (target) => {
    if (dragIdx == null || target === dragIdx) { setDragIdx(null); setOverIdx(null); return }
    const copy = [...items]
    const [x] = copy.splice(dragIdx, 1)
    copy.splice(target, 0, x)
    onChange(copy)
    setDragIdx(null); setOverIdx(null)
  }
  const gripKeys = (e, i) => {
    if (e.key === 'ArrowUp') { e.preventDefault(); move(i, -1) }
    if (e.key === 'ArrowDown') { e.preventDefault(); move(i, 1) }
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: summary ? 8 : 12 }}>
      {items.map((it, i) => {
        const open = !summary || openIdx === i
        return (
          <div
            key={i}
            onDragOver={dragReorder ? (e) => { e.preventDefault(); setOverIdx(i) } : undefined}
            onDrop={dragReorder ? (e) => { e.preventDefault(); dropOn(i) } : undefined}
            style={{ border: `1px ${overIdx === i && dragIdx !== null && dragIdx !== i ? 'dashed var(--amber-600)' : 'solid var(--border-hair)'}`, borderRadius: 'var(--radius-sm)', padding: summary && !open ? '10px 14px' : 14, background: 'var(--bg-page-alt)', opacity: dragIdx === i ? 0.45 : 1, ...itemStyle }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {dragReorder && (
                <button
                  type="button"
                  draggable
                  aria-label={`Reorder item ${i + 1} of ${items.length} — drag, or press arrow keys`}
                  title="Drag to reorder (or focus and use ↑/↓)"
                  onDragStart={(e) => { setDragIdx(i); e.dataTransfer.effectAllowed = 'move' }}
                  onDragEnd={() => { setDragIdx(null); setOverIdx(null) }}
                  onKeyDown={(e) => gripKeys(e, i)}
                  style={{ flex: '0 0 auto', border: 'none', background: 'transparent', cursor: 'grab', color: 'var(--text-faint)', fontSize: 15, lineHeight: 1, padding: '4px 2px', letterSpacing: 1 }}
                >⋮⋮</button>
              )}
              {summary && (
                <div onClick={() => setOpenIdx(open ? null : i)} style={{ flex: 1, minWidth: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
                  {summary(it, i)}
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, marginInlineStart: 'auto', flex: '0 0 auto', marginBottom: open && !summary ? 8 : 0 }}>
                {summary && <Btn variant={open ? 'outline' : 'ghost'} size="sm" onClick={() => setOpenIdx(open ? null : i)}>{open ? 'Close' : 'Edit'}</Btn>}
                {canReorder && !dragReorder && <Btn variant="ghost" size="sm" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">↑</Btn>}
                {canReorder && !dragReorder && <Btn variant="ghost" size="sm" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Move down">↓</Btn>}
                <Btn variant="danger" size="sm" onClick={() => remove(i, it)} aria-label="Remove item">Remove</Btn>
              </div>
            </div>
            {open && <div style={{ marginTop: summary ? 12 : 0 }}>{render(it, (next) => update(i, next), i)}</div>}
          </div>
        )
      })}
      <div><Btn variant="accent" size="sm" onClick={add}>+ {addLabel}</Btn></div>
    </div>
  )
}

// --- Rich image upload (drag-drop · crop · alt text) --------------------------
// Fixed-aspect cropper: cover-fit image with drag-to-pan + zoom slider, then
// canvas-export at the target size as JPEG.
export function CropModal({ src, aspect = 4 / 3, targetW = 1200, onApply, onCancel }) {
  const frameW = 420
  const frameH = Math.round(frameW / aspect)
  const imgRef = useRef(null)
  const [nat, setNat] = useState(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const drag = useRef(null)
  const cover = nat ? Math.max(frameW / nat.w, frameH / nat.h) : 1
  const dispW = nat ? nat.w * cover * zoom : 0
  const dispH = nat ? nat.h * cover * zoom : 0
  const clampPan = (p) => ({ x: Math.min(0, Math.max(frameW - dispW, p.x)), y: Math.min(0, Math.max(frameH - dispH, p.y)) })
  useEffect(() => { setPan((p) => clampPan(p)) }, [zoom, nat]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const onMove = (e) => {
      if (!drag.current) return
      setPan(clampPan({ x: drag.current.px + (e.clientX - drag.current.mx), y: drag.current.py + (e.clientY - drag.current.my) }))
    }
    const onUp = () => { drag.current = null }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
  }, [dispW, dispH]) // eslint-disable-line react-hooks/exhaustive-deps

  const apply = () => {
    const img = imgRef.current
    if (!img || !nat) return
    const canvas = document.createElement('canvas')
    canvas.width = targetW
    canvas.height = Math.round(targetW / aspect)
    const k = targetW / frameW
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, pan.x * k, pan.y * k, dispW * k, dispH * k)
    canvas.toBlob((blob) => blob && onApply(blob), 'image/jpeg', 0.85)
  }

  return (
    <div role="dialog" aria-label="Crop image" style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(18,36,26,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'var(--surface-card)', borderRadius: 'var(--radius-md)', padding: 20, boxShadow: 'var(--shadow-lg)', maxWidth: '92vw' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-strong)', marginBottom: 12 }}>Crop image</div>
        <div
          onMouseDown={(e) => { drag.current = { mx: e.clientX, my: e.clientY, px: pan.x, py: pan.y }; e.preventDefault() }}
          style={{ position: 'relative', width: frameW, height: frameH, overflow: 'hidden', borderRadius: 8, background: '#111', cursor: 'grab', touchAction: 'none' }}
        >
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <img
            ref={imgRef}
            src={src}
            draggable={false}
            onLoad={(e) => setNat({ w: e.target.naturalWidth, h: e.target.naturalHeight })}
            style={{ position: 'absolute', left: pan.x, top: pan.y, width: dispW || '100%', height: dispH || 'auto', maxWidth: 'none', userSelect: 'none' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Zoom</span>
          <input type="range" min="1" max="3" step="0.02" value={zoom} onChange={(e) => setZoom(Number(e.target.value))} aria-label="Zoom" style={{ flex: 1, accentColor: 'var(--amber-600)' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
          <Btn variant="ghost" onClick={onCancel}>Cancel</Btn>
          <Btn variant="accent" onClick={apply}>Apply crop</Btn>
        </div>
      </div>
    </div>
  )
}

/**
 * UploadField — CMS-grade image slot: drag-and-drop or click to choose,
 * fixed-aspect cropper, thumbnail preview with replace/remove, recommended
 * dimensions + max-size hints, and optional bilingual alt text.
 */
export function UploadField({ label, value, onChange, aspect = 4 / 3, recommend = '1200 × 900 px', maxMB = 6, targetW = 1200, alt, onAlt }) {
  const fileRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [over, setOver] = useState(false)
  const [cropSrc, setCropSrc] = useState(null)

  const pick = (file) => {
    setErr('')
    if (!file) return
    if (!/^image\//.test(file.type)) { setErr('That file isn’t an image — choose a JPG, PNG or WebP.') ; return }
    if (file.size > maxMB * 1024 * 1024) { setErr(`Image is too large — max ${maxMB} MB.`); return }
    setCropSrc(URL.createObjectURL(file))
  }

  const applyCrop = async (blob) => {
    URL.revokeObjectURL(cropSrc)
    setCropSrc(null)
    setBusy(true); setErr('')
    try {
      const { url } = await api.upload(new File([blob], 'image.jpg', { type: 'image/jpeg' }))
      onChange(url)
    } catch (e) { setErr(e.message) } finally { setBusy(false) }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {label && <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{label}</span>}
      {value ? (
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ width: 180, aspectRatio: String(aspect), borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border-hair)', background: 'var(--cream-300)' }}>
            <img src={value} alt={alt?.en || ''} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Btn variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={busy}>{busy ? 'Uploading…' : 'Replace'}</Btn>
            <Btn variant="danger" size="sm" onClick={() => { if (window.confirm('Remove this image?')) onChange('') }}>Remove</Btn>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setOver(true) }}
          onDragLeave={() => setOver(false)}
          onDrop={(e) => { e.preventDefault(); setOver(false); pick(e.dataTransfer.files?.[0]) }}
          aria-label={`${label || 'Image'} — drop an image here or click to choose`}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, minHeight: 110, padding: 18, border: `2px dashed ${over ? 'var(--amber-600)' : 'var(--border-strong)'}`, borderRadius: 'var(--radius-sm)', background: over ? 'var(--amber-50)' : 'var(--white)', cursor: 'pointer', fontFamily: 'var(--font-body)', color: 'var(--text-muted)' }}
        >
          <span style={{ fontSize: 13.5 }}>{busy ? 'Uploading…' : 'Drop an image here, or click to choose'}</span>
          <span style={{ fontSize: 11.5, color: 'var(--text-faint)' }}>Recommended {recommend} · JPG/PNG/WebP · max {maxMB} MB · you can crop after choosing</span>
        </button>
      )}
      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => { pick(e.target.files?.[0]); e.target.value = '' }} />
      {err && <span role="alert" style={{ fontSize: 12.5, color: 'var(--danger)' }}>{err}</span>}
      {onAlt && <Bilingual label="Alt text (for accessibility & SEO)" value={alt || { en: '', he: '' }} onChange={onAlt} max={120} />}
      {cropSrc && <CropModal src={cropSrc} aspect={aspect} targetW={targetW} onApply={applyCrop} onCancel={() => { URL.revokeObjectURL(cropSrc); setCropSrc(null) }} />}
    </div>
  )
}

// --- Pagination ---------------------------------------------------------------
// Renders nothing while everything fits on one page.
export function Pager({ page, setPage, total, pageSize }) {
  const pages = Math.max(1, Math.ceil(total / pageSize))
  if (pages <= 1) return null
  const from = page * pageSize + 1
  const to = Math.min(total, (page + 1) * pageSize)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-end', marginTop: 14 }}>
      <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>{from}–{to} of {total}</span>
      <Btn variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 0} aria-label="Previous page">‹ Prev</Btn>
      <Btn variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page >= pages - 1} aria-label="Next page">Next ›</Btn>
    </div>
  )
}

// Richer empty state: icon, headline, guidance, optional call-to-action.
export function EmptyState({ icon, title, sub, cta, onCta }) {
  return (
    <div style={{ textAlign: 'center', padding: '36px 20px', color: 'var(--text-muted)' }}>
      {icon}
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--text-strong)', margin: '12px 0 4px' }}>{title}</div>
      <div style={{ fontSize: 13.5, maxWidth: 420, margin: '0 auto', lineHeight: 1.6 }}>{sub}</div>
      {cta && <div style={{ marginTop: 16 }}><Btn variant="outline" size="sm" onClick={onCta}>{cta}</Btn></div>}
    </div>
  )
}

// Simple string-list editor (chips as inputs).
export function StringList({ items = [], onChange, placeholder }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {items.map((v, i) => (
        <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <input value={v} onChange={(e) => onChange(items.map((x, idx) => (idx === i ? e.target.value : x)))} style={{ ...inputStyle, height: 32, width: 130 }} placeholder={placeholder} />
          <button type="button" aria-label={`Remove ${v || 'item'}`} onClick={() => onChange(items.filter((_, idx) => idx !== i))} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-faint)', fontSize: 16 }}>×</button>
        </span>
      ))}
      <Btn variant="outline" size="sm" onClick={() => onChange([...items, ''])}>+ Add</Btn>
    </div>
  )
}
