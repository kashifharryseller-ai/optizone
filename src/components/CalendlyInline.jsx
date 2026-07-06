import React, { useEffect, useRef, useState } from 'react'

const WIDGET_SRC = 'https://assets.calendly.com/assets/external/widget.js'

// Load the Calendly widget script once for the whole app (shared promise).
let scriptPromise = null
function loadCalendly() {
  if (typeof window !== 'undefined' && window.Calendly) return Promise.resolve(window.Calendly)
  if (scriptPromise) return scriptPromise
  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${WIDGET_SRC}"]`)
    const el = existing || document.createElement('script')
    el.addEventListener('load', () => resolve(window.Calendly))
    el.addEventListener('error', () => { scriptPromise = null; reject(new Error('calendly-load-failed')) })
    if (!existing) { el.src = WIDGET_SRC; el.async = true; document.body.appendChild(el) }
    if (window.Calendly) resolve(window.Calendly)
  })
  return scriptPromise
}

/**
 * CalendlyInline — Calendly inline scheduling widget, done the React/SPA way.
 *
 * The raw Calendly snippet only auto-initialises `.calendly-inline-widget`
 * elements present when widget.js first loads; in a client-routed SPA the
 * booking page mounts later, so we call Calendly.initInlineWidget() explicitly
 * once the script is ready. Colours travel in the data-url
 * (background_color / text_color), so the embed matches the pine brand.
 */
export function CalendlyInline({ url, height = 700, loadingLabel = 'Loading…' }) {
  const ref = useRef(null)
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'error'

  useEffect(() => {
    let alive = true
    const el = ref.current
    if (!el) return
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
      {/* Calendly injects its iframe into this element */}
      <div ref={ref} className="calendly-inline-widget" style={{ minWidth: 320, height }} aria-label="Appointment scheduler" />
    </div>
  )
}
