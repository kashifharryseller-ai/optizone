import React, { useState, useRef, useEffect } from 'react'
import { Icon, Badge, Price } from '../ds/index.js'
import { useLang } from '../i18n/index.jsx'
import { useContent } from '../content/ContentProvider.jsx'
import { canTryMirror } from '../lib/tryMirror.js'

export function Search({ open, onClose, go }) {
  const { t: root, L } = useLang()
  const { content } = useContent()
  const t = root.search
  const [q, setQ] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) { setQ(''); setTimeout(() => inputRef.current && inputRef.current.focus(), 60) }
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  if (!open) return null
  const ql = q.trim().toLowerCase()
  const results = ql
    ? (content.products || []).filter((p) => (p.name + ' ' + p.brand + ' ' + p.shape + ' ' + p.material).toLowerCase().includes(ql))
    : []

  const pick = (p) => { onClose(); go('product', p) }

  return (
    <div role="dialog" aria-modal="true" aria-label={t.placeholder} style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', flexDirection: 'column' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'var(--overlay-scrim)', animation: 'oz-fade var(--dur-base) var(--ease-out) both', backdropFilter: 'blur(3px)' }} />
      <div style={{ position: 'relative', background: 'var(--bg-page-alt)', boxShadow: 'var(--shadow-lg)', animation: 'oz-slide-down var(--dur-base) var(--ease-out) both' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '26px 28px 30px' }}>
          {/* input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, borderBottom: '2px solid var(--pine-700)', paddingBottom: 14 }}>
            <Icon name="search" size={24} color="var(--pine-700)" />
            <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.placeholder}
              style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font-body)', fontSize: 22, color: 'var(--text-strong)' }} />
            <button onClick={onClose} aria-label="Close" style={{ border: '1px solid var(--border-strong)', background: 'transparent', borderRadius: 'var(--radius-sm)', padding: '4px 9px', cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.1em', color: 'var(--text-muted)' }}>ESC</button>
          </div>

          {/* body */}
          {!ql && (
            <div style={{ marginTop: 24 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 14 }}>{t.popular}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {(content.popularSearches || []).map((s) => (
                  <button key={s.en} onClick={() => setQ(L(s))} style={{ border: '1px solid var(--border-hair)', background: 'var(--surface-card)', borderRadius: 'var(--radius-pill)', padding: '8px 16px', cursor: 'pointer', fontSize: 13.5, color: 'var(--text-body)' }}>{L(s)}</button>
                ))}
              </div>
            </div>
          )}

          {ql && (
            <div style={{ marginTop: 20, maxHeight: '52vh', overflowY: 'auto' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>{t.results(results.length)}</div>
              {results.length === 0 ? (
                <div style={{ padding: '24px 0', color: 'var(--text-muted)', fontSize: 15 }}>{t.none(q)}</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {results.map((p, i) => (
                    <button key={p.id} onClick={() => pick(p)}
                      style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 8px', border: 'none', borderBottom: '1px solid var(--border-hair)', background: 'transparent', cursor: 'pointer', textAlign: 'start', animation: 'oz-fade-up var(--dur-base) var(--ease-out) both', animationDelay: `${i * 40}ms` }}>
                      <span style={{ width: 52, height: 52, borderRadius: 'var(--radius-sm)', background: 'var(--cream-300)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                        <svg viewBox="0 0 120 46" width="34" fill="none"><g stroke={(p.colors && p.colors[0]) || 'var(--pine-500)'} strokeWidth="3" strokeLinecap="round"><circle cx="40" cy="24" r="15" /><circle cx="80" cy="24" r="15" /><path d="M55 17 q5 -5 10 0" /></g></svg>
                      </span>
                      <span style={{ flex: 1 }}>
                        <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: 10.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-accent)' }}>{p.brand}</span>
                        <span style={{ display: 'block', fontSize: 15, fontWeight: 600, color: 'var(--text-strong)' }}>{p.name}</span>
                      </span>
                      {canTryMirror(p) && <Badge variant="try">Try Mirror</Badge>}
                      <Price amount={p.amount} original={p.original} size="sm" />
                      <Icon name="arrow-right" size={16} color="var(--text-muted)" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
