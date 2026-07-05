import React, { useEffect, useRef, useState } from 'react'
import { Input, Icon } from '../ds/index.js'

/**
 * AddressAutocomplete — Google Places-backed street address input for checkout.
 *
 * - Live suggestions (Places AutocompleteService) as the user types, rendered
 *   in the project's own styling (RTL-aware — the list follows document dir).
 * - On selection the place is geocoded (Geocoding API) and onResolved() gets
 *   the normalized address: { street, city, postal, formatted, lat, lng, placeId }.
 * - Typing after a selection invalidates it (onResolved(null)) so checkout can
 *   require a re-verified address.
 * - Graceful degradation: with no mapsKey, or if the Maps script fails to load
 *   (offline, bad key, blocked), it behaves as a plain input and reports
 *   status 'fallback' so the caller can relax validation.
 *
 * The key is a referrer-restricted browser key delivered via content.settings
 * (never stored in the DB). If window.google.maps.places already exists (e.g.
 * injected by tests), it is used directly without loading the script.
 */

let mapsPromise = null
function loadMaps(key, lang) {
  if (window.google?.maps?.places) return Promise.resolve(window.google)
  if (mapsPromise) return mapsPromise
  mapsPromise = new Promise((resolve, reject) => {
    const cb = '__ozMapsReady'
    window[cb] = () => resolve(window.google)
    const s = document.createElement('script')
    s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&libraries=places&language=${lang}&region=IL&callback=${cb}`
    s.async = true
    s.onerror = () => { mapsPromise = null; reject(new Error('maps-load-failed')) }
    document.head.appendChild(s)
    setTimeout(() => reject(new Error('maps-load-timeout')), 12000)
  })
  return mapsPromise
}

function pickComponent(components, type) {
  const c = (components || []).find((x) => (x.types || []).includes(type))
  return c ? c.long_name : ''
}

export function AddressAutocomplete({ mapsKey, lang = 'en', value, onChange, onResolved, onStatus, placeholder, verifiedLabel, resolved }) {
  const [sugs, setSugs] = useState([])
  const [open, setOpen] = useState(false)
  const [ready, setReady] = useState(false)
  const svc = useRef(null)
  const geocoder = useRef(null)
  const debounce = useRef(null)
  const boxRef = useRef(null)

  useEffect(() => {
    let alive = true
    if (!mapsKey && !window.google?.maps?.places) { onStatus && onStatus('fallback'); return }
    loadMaps(mapsKey, lang)
      .then((g) => {
        if (!alive) return
        svc.current = new g.maps.places.AutocompleteService()
        geocoder.current = new g.maps.Geocoder()
        setReady(true)
        onStatus && onStatus('ready')
      })
      .catch(() => { if (alive) onStatus && onStatus('fallback') })
    return () => { alive = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapsKey, lang])

  // Close the list on outside click.
  useEffect(() => {
    const onDoc = (e) => { if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const query = (text) => {
    if (!ready || !svc.current || !text || text.length < 3) { setSugs([]); setOpen(false); return }
    svc.current.getPlacePredictions(
      { input: text, componentRestrictions: { country: 'il' }, types: ['address'] },
      (preds) => { setSugs(preds || []); setOpen(!!(preds && preds.length)) },
    )
  }

  const handleType = (text) => {
    onChange(text)
    onResolved && onResolved(null) // edits invalidate any previous verification
    clearTimeout(debounce.current)
    debounce.current = setTimeout(() => query(text), 250)
  }

  const pick = (pred) => {
    setOpen(false)
    setSugs([])
    onChange(pred.description)
    if (!geocoder.current) return
    geocoder.current.geocode({ placeId: pred.place_id }, (results, status) => {
      const r = status === 'OK' && results && results[0]
      if (!r) { onResolved && onResolved(null); return }
      const comps = r.address_components
      const streetNum = pickComponent(comps, 'street_number')
      const route = pickComponent(comps, 'route')
      const loc = r.geometry?.location
      const addr = {
        street: [route, streetNum].filter(Boolean).join(' '),
        city: pickComponent(comps, 'locality') || pickComponent(comps, 'administrative_area_level_2'),
        postal: pickComponent(comps, 'postal_code'),
        formatted: r.formatted_address,
        placeId: r.place_id,
        lat: loc ? (typeof loc.lat === 'function' ? loc.lat() : loc.lat) : 0,
        lng: loc ? (typeof loc.lng === 'function' ? loc.lng() : loc.lng) : 0,
      }
      onResolved && onResolved(addr)
    })
  }

  return (
    <div ref={boxRef} style={{ position: 'relative' }}>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => handleType(e.target.value)}
        autoComplete="off"
        endAdornment={resolved ? <Icon name="check-circle" size={17} color="var(--success)" /> : undefined}
      />
      {resolved && verifiedLabel && (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--success)', marginTop: 6 }}>
          <Icon name="check" size={13} color="var(--success)" /> {verifiedLabel}
        </span>
      )}
      {open && sugs.length > 0 && (
        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', insetInlineStart: 0, insetInlineEnd: 0, zIndex: 60, background: 'var(--surface-card)', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', overflow: 'hidden' }}>
          {sugs.slice(0, 5).map((p) => (
            <button
              key={p.place_id}
              type="button"
              onClick={() => pick(p)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '11px 14px', border: 'none', borderBottom: '1px solid var(--border-hair)', background: 'transparent', cursor: 'pointer', textAlign: 'start', fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-body)' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--pine-50)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <Icon name="map-pin" size={15} color="var(--pine-700)" />
              <span style={{ flex: 1 }}>{p.description}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
