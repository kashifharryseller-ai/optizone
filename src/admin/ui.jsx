import React, { useRef, useState } from 'react'
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

export function Area({ value, onChange, dir, rows = 3, ...rest }) {
  return <textarea value={value ?? ''} dir={dir} rows={rows} onChange={(e) => onChange(e.target.value)} style={{ ...inputStyle, height: 'auto', padding: 12, resize: 'vertical', lineHeight: 1.5 }} {...rest} />
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

// Bilingual { en, he } text field.
export function Bilingual({ label, value = {}, onChange, area = false }) {
  const set = (lang, v) => onChange({ ...value, [lang]: v })
  const Ctrl = area ? Area : Text
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{label}</span>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <div style={{ position: 'relative' }}>
          <Ctrl value={value.en} onChange={(v) => set('en', v)} placeholder="English" />
          <Tag>EN</Tag>
        </div>
        <div style={{ position: 'relative' }}>
          <Ctrl value={value.he} onChange={(v) => set('he', v)} dir="rtl" placeholder="עברית" />
          <Tag>עב</Tag>
        </div>
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
export function ListEditor({ items, onChange, render, makeNew, addLabel = 'Add item', itemStyle, summary, confirmRemove, canReorder = true }) {
  const [openIdx, setOpenIdx] = useState(summary ? null : -1) // -1 = all open (no summary mode)
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
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: summary ? 8 : 12 }}>
      {items.map((it, i) => {
        const open = !summary || openIdx === i
        return (
          <div key={i} style={{ border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-sm)', padding: summary && !open ? '10px 14px' : 14, background: 'var(--bg-page-alt)', ...itemStyle }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {summary && (
                <div onClick={() => setOpenIdx(open ? null : i)} style={{ flex: 1, minWidth: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
                  {summary(it, i)}
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, marginInlineStart: 'auto', flex: '0 0 auto', marginBottom: open && !summary ? 8 : 0 }}>
                {summary && <Btn variant={open ? 'outline' : 'ghost'} size="sm" onClick={() => setOpenIdx(open ? null : i)}>{open ? 'Close' : 'Edit'}</Btn>}
                {canReorder && <Btn variant="ghost" size="sm" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">↑</Btn>}
                {canReorder && <Btn variant="ghost" size="sm" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Move down">↓</Btn>}
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
