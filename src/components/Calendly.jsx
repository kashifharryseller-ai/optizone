import React, { useEffect, useRef, useState } from 'react'

const WIDGET_JS = 'https://assets.calendly.com/assets/external/widget.js'
const WIDGET_CSS = 'https://assets.calendly.com/assets/external/widget.css'

// Calendly's stylesheet is required for the badge + popup chrome.
function ensureCss() {
  if (typeof document === 'undefined' || document.querySelector(`link[href="${WIDGET_CSS}"]`)) return
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = WIDGET_CSS
  document.head.appendChild(link)
}

// Load widget.js once for the whole app (shared promise) + its stylesheet.
let scriptPromise = null
function loadCalendly() {
  if (typeof window !== 'undefined' && window.Calendly) { ensureCss(); return Promise.resolve(window.Calendly) }
  ensureCss()
  if (scriptPromise) return scriptPromise
  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${WIDGET_JS}"]`)
    const el = existing || document.createElement('script')
    el.addEventListener('load', () => resolve(window.Calendly))
    el.addEventListener('error', () => { scriptPromise = null; reject(new Error('calendly-load-failed')) })
    if (!existing) { el.src = WIDGET_JS; el.async = true; document.body.appendChild(el) }
    if (window.Calendly) resolve(window.Calendly)
  })
  return scriptPromise
}

// Open the Calendly popup modal for a URL (in-page CTA buttons). Falls back to
// a new tab if the widget script can't load.
export function openCalendlyPopup(url) {
  loadCalendly()
    .then((C) => { if (C && C.showPopupWidget) C.showPopupWidget(url); else window.open(url, '_blank', 'noopener') })
    .catch(() => window.open(url, '_blank', 'noopener'))
}

/**
 * CalendlyBadge — the floating "Schedule time with me" badge
 * (Calendly.initBadgeWidget). Done the React/SPA way: the raw snippet's
 * window.onload never fires on a client-routed page, so we init once the
 * script is ready and tear the badge down on unmount so it doesn't leak
 * onto other routes.
 */
export function CalendlyBadge({ url, text = 'Schedule time with me', color = '#0069ff', textColor = '#ffffff', branding = true }) {
  useEffect(() => {
    let cancelled = false
    loadCalendly()
      .then((C) => { if (!cancelled && C && C.initBadgeWidget) C.initBadgeWidget({ url, text, color, textColor, branding }) })
      .catch(() => { /* badge simply won't show; the in-page CTA still works */ })
    return () => {
      cancelled = true
      try { window.Calendly && window.Calendly.destroyBadgeWidget && window.Calendly.destroyBadgeWidget() } catch { /* ignore */ }
      document.querySelectorAll('.calendly-badge-widget, .calendly-overlay').forEach((el) => el.remove())
    }
  }, [url, text, color, textColor, branding])
  return null
}

/**
 * CalendlyInline — inline scheduling embed (kept for reuse). Calls
 * Calendly.initInlineWidget() explicitly since the auto-init only runs for
 * elements present when widget.js first loads.
 */
export function CalendlyInline({ url, height = 700, loadingLabel = 'Loading…' }) {
  const ref = useRef(null)
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'error'

  useEffect(() => {
    let alive = true
    if (!ref.current) return
    setStatus('loading')
    loadCalendly()
      .then((Calendly) => {
        if (!alive || !ref.current) return
        ref.current.innerHTML = '' // guard against a double init on remount
        Calendly.initInlineWidget({ url, parentElement: ref.current })
        setStatus('ready')
      })
      .catch(() => { if (alive) setStatus('error') })
    return () => { alive = false }
  }, [url])

  return (
    <div style={{ position: 'relative', minHeight: height }}>
      {status !== 'ready' && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cream-200)', fontSize: 14 }}>
          {status === 'error'
            ? <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--amber-500)', textDecoration: 'underline' }}>Open the scheduler ↗</a>
            : loadingLabel}
        </div>
      )}
      <div ref={ref} className="calendly-inline-widget" style={{ minWidth: 320, height }} aria-label="Appointment scheduler" />
    </div>
  )
}
