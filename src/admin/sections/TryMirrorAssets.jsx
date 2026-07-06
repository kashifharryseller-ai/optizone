import React, { useState } from 'react'
import { Panel, Field, Toggle, ImageField } from '../ui.jsx'
import { Icon } from '../../ds/index.js'
import { isTryMirrorCategory } from '../../lib/tryMirror.js'

// Try-Mirror / AR Assets — manage each product's virtual try-on: toggle it on
// and upload the transparent frame PNG the AR overlay uses. Saved with the
// global "Save changes" (edits the same product records the storefront reads).
// Only glasses & sunglasses are listed — the face overlay doesn't apply to
// contacts or other non-eyewear categories.
export default function TryMirrorAssets({ content, setContent }) {
  const allProducts = content.products || []
  const products = allProducts.filter((p) => isTryMirrorCategory(p.category))
  const [query, setQuery] = useState('')
  const setProduct = (id, patch) => setContent({ ...content, products: allProducts.map((p) => (p.id === id ? { ...p, ...patch } : p)) })

  const q = query.trim().toLowerCase()
  const shown = q ? products.filter((p) => `${p.brand} ${p.name}`.toLowerCase().includes(q)) : products
  const withAsset = products.filter((p) => p.tryMirror && p.tryMirrorImg).length
  const enabled = products.filter((p) => p.tryMirror).length

  const searchStyle = { height: 34, padding: '0 12px', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-body)', fontSize: 13.5, outline: 'none', minWidth: 220 }

  return (
    <Panel
      title="Try-Mirror / AR assets"
      desc={`Virtual try-on is enabled on ${enabled} of ${products.length} eyewear products (glasses & sunglasses); ${withAsset} have a frame PNG uploaded. Upload a front-facing, tightly-cropped transparent PNG for the best alignment.`}
      actions={<input aria-label="Search products" placeholder="Search products…" value={query} onChange={(e) => setQuery(e.target.value)} style={searchStyle} />}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {shown.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No products match “{query}”.</p> : shown.map((p) => (
          <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'center', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-sm)', padding: 14, background: 'var(--bg-page-alt)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
              <span style={{ width: 46, height: 34, borderRadius: 6, background: 'var(--pine-800)', border: '1px solid var(--border-hair)', overflow: 'hidden', flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {p.tryMirrorImg ? <img src={p.tryMirrorImg} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} /> : <Icon name="camera" size={15} color="var(--pine-300)" />}
              </span>
              <span style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.brand} {p.name}</div>
                <div style={{ fontSize: 12.5, color: p.tryMirror ? (p.tryMirrorImg ? 'var(--success)' : 'var(--amber-700)') : 'var(--text-faint)' }}>
                  {!p.tryMirror ? 'Try-Mirror off' : p.tryMirrorImg ? 'Ready · frame PNG uploaded' : 'On · using the generated frame (no PNG yet)'}
                </div>
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <Field label="Try-Mirror"><Toggle checked={!!p.tryMirror} onChange={(v) => setProduct(p.id, { tryMirror: v })} label={p.tryMirror ? 'On' : 'Off'} /></Field>
              <ImageField label="Frame PNG" value={p.tryMirrorImg || ''} onChange={(v) => setProduct(p.id, { tryMirrorImg: v })} />
            </div>
          </div>
        ))}
      </div>
    </Panel>
  )
}
