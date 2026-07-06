import React, { useRef, useState } from 'react'
import { Panel, Field, Toggle, Text, Btn } from '../ui.jsx'
import { Icon } from '../../ds/index.js'
import { isTryMirrorCategory, resolveTryonAsset } from '../../lib/tryMirror.js'
import { removeBackground } from '../../lib/bgRemove.js'
import { api } from '../../api.js'

const CHECKER = 'repeating-conic-gradient(#e9e9e9 0% 25%, #fff 0% 50%) 50% / 14px 14px'

// Per-colour frame image field with automatic background removal. The admin can
// drop in any product photo (with or without a background); we cut it out in the
// browser, preview it on a transparency checkerboard, let them tune the amount,
// and flag angled / busy-background shots — then upload the transparent PNG.
function FrameAssetField({ hex, value, onChange }) {
  const ref = useRef(null)
  const fileRef = useRef(null)        // original picked file (for re-tuning)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [tol, setTol] = useState(0.14)
  const [preview, setPreview] = useState(null) // { dataUrl, coverage, symmetry, plainBg }

  // First pass self-tunes the tolerance (anti-aliased edges need a tight step);
  // the slider then re-runs manually from wherever auto landed.
  const process = async (file, t) => {
    setBusy(true); setErr('')
    try {
      const r = await removeBackground(file, t == null ? { auto: true } : { tolerance: t })
      setPreview(r)
      if (t == null && r.usedTolerance) setTol(r.usedTolerance)
    } catch (e) { setErr(e.message || 'Could not process image') }
    finally { setBusy(false) }
  }
  const pick = (file) => { if (!file) return; fileRef.current = file; process(file, null) }
  const retune = (t) => { setTol(t); if (fileRef.current) process(fileRef.current, t) }

  const uploadBlob = async (blob, name) => {
    setBusy(true); setErr('')
    try { const { url } = await api.upload(new File([blob], name, { type: 'image/png' })); onChange(url); setPreview(null); fileRef.current = null }
    catch (e) { setErr(e.message || 'Upload failed') } finally { setBusy(false) }
  }
  const useCutout = async () => { const blob = await (await fetch(preview.dataUrl)).blob(); uploadBlob(blob, `frame-${hex.replace('#', '')}.png`) }
  const useOriginal = () => fileRef.current && uploadBlob(fileRef.current, fileRef.current.name || 'frame.png')

  const warn = preview && (
    preview.coverage < 0.015 ? 'Almost everything was removed — lower the amount.'
      : preview.coverage > 0.92 ? 'Very little was removed — is the background plain and light?'
        : !preview.plainBg ? 'Busy background detected — the cut-out may be rough; a plain backdrop works best.'
          : preview.symmetry < 0.72 ? 'This photo looks angled — a front-facing shot tries on more accurately.'
            : null
  )

  return (
    <Field label={`Frame image · ${hex}`}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {!preview && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 72, height: 54, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-hair)', overflow: 'hidden', flex: '0 0 auto', background: value ? CHECKER : 'var(--cream-300)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {value ? <img src={value} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <span style={{ fontSize: 10, color: 'var(--text-faint)' }}>none</span>}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input ref={ref} type="file" accept="image/*" onChange={(e) => pick(e.target.files && e.target.files[0])} style={{ display: 'none' }} />
              <Btn variant="outline" size="sm" onClick={() => ref.current && ref.current.click()} disabled={busy}>{busy ? 'Working…' : value ? 'Replace' : 'Upload photo'}</Btn>
              {value && <Btn variant="ghost" size="sm" onClick={() => onChange('')}>Clear</Btn>}
            </div>
          </div>
        )}
        {preview && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-sm)', padding: 10 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 120, height: 90, borderRadius: 6, border: '1px solid var(--border-hair)', background: CHECKER, flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={preview.dataUrl} alt="cut-out preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12, color: 'var(--text-muted)' }}>Background removal amount</label>
                <input type="range" min="0.04" max="0.4" step="0.01" value={tol} onChange={(e) => retune(Number(e.target.value))} disabled={busy} style={{ accentColor: 'var(--amber-500)' }} />
                {warn && <span style={{ fontSize: 12, color: 'var(--amber-700)', display: 'flex', gap: 6, alignItems: 'flex-start' }}><Icon name="info" size={13} color="currentColor" /> {warn}</span>}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Btn variant="primary" size="sm" onClick={useCutout} disabled={busy}>{busy ? 'Uploading…' : 'Use cut-out'}</Btn>
              <Btn variant="outline" size="sm" onClick={useOriginal} disabled={busy}>Use original (already transparent)</Btn>
              <Btn variant="ghost" size="sm" onClick={() => { setPreview(null); fileRef.current = null }} disabled={busy}>Cancel</Btn>
            </div>
          </div>
        )}
        {err && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{err}</span>}
      </div>
    </Field>
  )
}

// Try-Mirror / AR Assets — manage each product's virtual try-on: toggle it on
// and attach a per-colour 3D model (.glb/.gltf) and/or a transparent frame PNG
// (2D fallback). Saved with the global "Save changes". Only glasses & sunglasses
// are listed — the face overlay doesn't apply to contacts or other categories.
//
// Assets are stored as { "#hex": url } maps keyed by the product's colour dots.
// A legacy single-string tryMirrorImg is read as "applies to every colour" and
// migrated to a map the first time a colour asset is edited.
export default function TryMirrorAssets({ content, setContent }) {
  const allProducts = content.products || []
  const products = allProducts.filter((p) => isTryMirrorCategory(p.category))
  const [query, setQuery] = useState('')
  const setProduct = (id, patch) => setContent({ ...content, products: allProducts.map((p) => (p.id === id ? { ...p, ...patch } : p)) })

  // Read/write one colour's asset within a {hex:url} map. A legacy string
  // "applies to every colour", so expand it across all colours BEFORE applying
  // the edit — otherwise editing one colour would silently drop the others.
  const setColorAsset = (p, field, hex, url) => {
    const cur = p[field]
    const map = cur && typeof cur === 'object' ? { ...cur } : {}
    if (typeof cur === 'string' && cur) for (const c of (p.colors || [])) map[c] = cur
    if (url) map[hex] = url; else delete map[hex]
    setProduct(p.id, { [field]: Object.keys(map).length ? map : undefined })
  }
  const getColorAsset = (p, field, hex) => {
    const v = p[field]
    if (!v) return ''
    if (typeof v === 'string') return field === 'tryMirrorImg' ? v : '' // legacy PNG applies to all colours
    return v[hex] || ''
  }

  const q = query.trim().toLowerCase()
  const shown = q ? products.filter((p) => `${p.brand} ${p.name}`.toLowerCase().includes(q)) : products
  const has = (p) => { const cols = (p.colors && p.colors.length) ? p.colors : [undefined]; return cols.some((c) => { const a = resolveTryonAsset(p, c); return !!(a.model || a.png) }) }
  const withAsset = products.filter((p) => p.tryMirror && has(p)).length
  const enabled = products.filter((p) => p.tryMirror).length

  const searchStyle = { height: 34, padding: '0 12px', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-body)', fontSize: 13.5, outline: 'none', minWidth: 220 }

  return (
    <Panel
      title="Try-Mirror / AR assets"
      desc={`Virtual try-on is enabled on ${enabled} of ${products.length} eyewear products (glasses & sunglasses); ${withAsset} have an asset attached. Upload any front-facing frame photo — the background is removed automatically and the frame is tracked in 3D on the face. For full all-around rotation, add a 3D model (.glb/.gltf). Best results: a front-on shot on a plain, light background.`}
      actions={<input aria-label="Search products" placeholder="Search products…" value={query} onChange={(e) => setQuery(e.target.value)} style={searchStyle} />}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {shown.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No products match “{query}”.</p> : shown.map((p) => {
          const colors = p.colors || []
          return (
            <div key={p.id} style={{ display: 'flex', flexDirection: 'column', gap: 12, border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-sm)', padding: 14, background: 'var(--bg-page-alt)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                <span style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-strong)' }}>{p.brand} {p.name}</div>
                  <div style={{ fontSize: 12.5, color: p.tryMirror ? (has(p) ? 'var(--success)' : 'var(--amber-700)') : 'var(--text-faint)' }}>
                    {!p.tryMirror ? 'Try-Mirror off' : has(p) ? 'Ready · asset attached' : 'On · using the generated frame (no asset yet)'}
                  </div>
                </span>
                <Field label="Try-Mirror"><Toggle checked={!!p.tryMirror} onChange={(v) => setProduct(p.id, { tryMirror: v })} label={p.tryMirror ? 'On' : 'Off'} /></Field>
              </div>

              {p.tryMirror && (colors.length ? colors : ['#000000']).map((hex, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '30px 1fr 1fr', gap: 12, alignItems: 'center', paddingTop: 10, borderTop: '1px solid var(--border-hair)' }}>
                  <span title={hex} style={{ width: 24, height: 24, borderRadius: 999, background: hex, border: '1px solid var(--border-hair)' }} />
                  <Field label={`3D model URL · ${hex}`}><Text value={getColorAsset(p, 'tryMirrorModel', hex)} onChange={(v) => setColorAsset(p, 'tryMirrorModel', hex, v.trim())} placeholder="/tryon/models/frame-black.glb" /></Field>
                  <FrameAssetField hex={hex} value={getColorAsset(p, 'tryMirrorImg', hex)} onChange={(v) => setColorAsset(p, 'tryMirrorImg', hex, v)} />
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </Panel>
  )
}
