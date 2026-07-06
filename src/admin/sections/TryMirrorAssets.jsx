import React, { useState } from 'react'
import { Panel, Field, Toggle, ImageField, Text } from '../ui.jsx'
import { Icon } from '../../ds/index.js'
import { isTryMirrorCategory, resolveTryonAsset } from '../../lib/tryMirror.js'

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

  // Read/write one colour's asset within a {hex:url} map (converting a legacy
  // string to a map on first write so the other colours are preserved).
  const asMap = (v) => (v && typeof v === 'object' ? { ...v } : {})
  const setColorAsset = (p, field, hex, url) => {
    const map = asMap(p[field])
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
  const has = (p) => { const a = resolveTryonAsset(p, (p.colors || [])[0]); return !!(a.model || a.png) }
  const withAsset = products.filter((p) => p.tryMirror && has(p)).length
  const enabled = products.filter((p) => p.tryMirror).length

  const searchStyle = { height: 34, padding: '0 12px', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-body)', fontSize: 13.5, outline: 'none', minWidth: 220 }

  return (
    <Panel
      title="Try-Mirror / AR assets"
      desc={`Virtual try-on is enabled on ${enabled} of ${products.length} eyewear products (glasses & sunglasses); ${withAsset} have an asset attached. Attach a 3D model (.glb/.gltf) for the best result, or a front-facing, tightly-cropped transparent PNG as a 2D fallback — per colour.`}
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
                  <ImageField label={`Frame PNG (2D) · ${hex}`} value={getColorAsset(p, 'tryMirrorImg', hex)} onChange={(v) => setColorAsset(p, 'tryMirrorImg', hex, v)} />
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </Panel>
  )
}
