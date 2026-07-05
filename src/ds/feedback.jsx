import React, { useEffect } from 'react'

/**
 * Dialog — centered modal on a pine scrim. Used for consent prompts (camera
 * try-on), confirmations, and quick views.
 */
export function Dialog({ open, onClose, title, eyebrow, children, footer, width = 480, style, ...rest }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && onClose) onClose() }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])
  if (!open) return null
  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'var(--overlay-scrim)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, animation: 'ozFade var(--dur-base) var(--ease-out)' }}
    >
      <style>{'@keyframes ozFade{from{opacity:0}to{opacity:1}}@keyframes ozRise{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}'}</style>
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        style={{ width, maxWidth: '100%', background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', animation: 'ozRise var(--dur-slow) var(--ease-out)', overflow: 'hidden', ...style }}
        {...rest}
      >
        <div style={{ padding: '28px 28px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {eyebrow && <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-accent)' }}>{eyebrow}</span>}
            {title && <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--text-strong)' }}>{title}</h3>}
          </div>
          <div style={{ fontSize: 15, color: 'var(--text-body)', lineHeight: 1.55 }}>{children}</div>
        </div>
        {footer && (
          <div style={{ padding: '16px 28px', borderTop: '1px solid var(--border-hair)', display: 'flex', justifyContent: 'flex-end', gap: 12, background: 'var(--cream-100)' }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

/** Toast — transient notice. Compose with your own state / timeout. */
export function Toast({ variant = 'default', icon, title, children, onClose, style, ...rest }) {
  const accents = { default: 'var(--pine-700)', success: 'var(--success)', danger: 'var(--danger)', accent: 'var(--amber-600)' }[variant]
  return (
    <div
      style={{ display: 'flex', alignItems: 'flex-start', gap: 12, minWidth: 280, maxWidth: 400, padding: '14px 16px', background: 'var(--surface-card)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', borderInlineStart: `3px solid ${accents}`, ...style }}
      {...rest}
    >
      {icon && <span style={{ color: accents, display: 'inline-flex', marginTop: 1 }}>{icon}</span>}
      <div style={{ flex: 1 }}>
        {title && <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14.5, color: 'var(--text-strong)' }}>{title}</div>}
        {children && <div style={{ fontSize: 13.5, color: 'var(--text-muted)', marginTop: title ? 2 : 0 }}>{children}</div>}
      </div>
      {onClose && (
        <button type="button" aria-label="dismiss" onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-faint)', padding: 0, display: 'inline-flex' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}
