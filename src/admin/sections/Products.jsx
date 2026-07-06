import React, { useEffect, useState } from 'react'
import { Panel, Row, Field, Text, Num, SelectField, Toggle, Bilingual, ImageField, ListEditor, StringList, Btn, Pager } from '../ui.jsx'
import { GlassesMark } from '../../ds/index.js'

const BADGE_VARIANTS = [
  { value: 'sale', label: 'Sale (amber)' },
  { value: 'new', label: 'New (pine)' },
  { value: 'bestseller', label: 'Bestseller' },
  { value: 'try', label: 'Try' },
]

// Which navbar page the product appears on.
const CATEGORIES = [
  { value: 'eyeglasses', label: 'Eyeglasses' },
  { value: 'sunglasses', label: 'Sunglasses' },
  { value: 'contacts', label: 'Contact Lenses' },
]

function ColorList({ colors = [], onChange }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
      {colors.map((c, i) => (
        <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <input type="color" aria-label={`Colour ${i + 1}`} value={c} onChange={(e) => onChange(colors.map((x, idx) => (idx === i ? e.target.value : x)))} style={{ width: 34, height: 34, border: '1px solid var(--border-hair)', borderRadius: 6, background: 'none', cursor: 'pointer' }} />
          <button type="button" aria-label={`Remove colour ${i + 1}`} onClick={() => onChange(colors.filter((_, idx) => idx !== i))} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-faint)', fontSize: 15 }}>×</button>
        </span>
      ))}
      <Btn variant="outline" size="sm" onClick={() => onChange([...colors, '#274A3B'])}>+ Colour</Btn>
    </div>
  )
}

const searchStyle = { height: 36, padding: '0 12px', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-body)', fontSize: 13.5, outline: 'none', minWidth: 220 }

export default function Products({ content, setContent, initialQuery }) {
  const products = content.products || []
  const filters = content.filters || {}
  const setProducts = (list) => setContent({ ...content, products: list })
  const nextId = () => (products.reduce((m, p) => Math.max(m, Number(p.id) || 0), 0) + 1)

  // Search + category filter keep large catalogs navigable. While a filter is
  // active, edits from the (filtered) list are reconciled back into the FULL
  // catalog by product id, and reordering is disabled to avoid ambiguity.
  const [query, setQuery] = useState(initialQuery || '')
  const [cat, setCat] = useState('all')
  const [page, setPage] = useState(0)
  useEffect(() => { if (initialQuery !== undefined) setQuery(initialQuery) }, [initialQuery])
  useEffect(() => { setPage(0) }, [query, cat]) // filters reset to page 1
  const filtering = query.trim() !== '' || cat !== 'all'
  const q = query.trim().toLowerCase()
  const visible = filtering
    ? products.filter((p) =>
        (cat === 'all' || (p.category || 'eyeglasses') === cat) &&
        (!q || `${p.brand} ${p.name}`.toLowerCase().includes(q)))
    : products
  // Pagination on top of the filter; reorder only makes sense when the list
  // shows the whole catalog on one page.
  const PAGE = 25
  const pages = Math.max(1, Math.ceil(visible.length / PAGE))
  const safePage = Math.min(page, pages - 1)
  const paged = visible.slice(safePage * PAGE, (safePage + 1) * PAGE)
  const wholeList = !filtering && pages === 1
  const onListChange = (nextVisible) => {
    if (wholeList) return setProducts(nextVisible)
    const shownIds = new Set(paged.map((p) => p.id))
    const nextById = new Map(nextVisible.map((p) => [p.id, p]))
    const merged = products
      .filter((p) => !(shownIds.has(p.id) && !nextById.has(p.id))) // removed while filtered
      .map((p) => nextById.get(p.id) || p)                          // edited while filtered
    const known = new Set(products.map((p) => p.id))
    let added = false
    for (const p of nextVisible) if (!known.has(p.id)) { merged.push(p); added = true }
    setProducts(merged)
    if (added) { setQuery(''); setCat('all') } // reveal the newly added product
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
    <Panel
      title="Products & catalog"
      desc="Every product belongs to a category — that decides which navbar page (Eyeglasses / Sunglasses / Contact Lenses) it appears on. Archived products stay here but are hidden from the storefront."
      actions={(
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <input aria-label="Search products" placeholder={`Search ${products.length} products…`} value={query} onChange={(e) => setQuery(e.target.value)} style={searchStyle} />
          <select aria-label="Filter by category" value={cat} onChange={(e) => setCat(e.target.value)} style={{ ...searchStyle, minWidth: 0 }}>
            <option value="all">All categories</option>
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
      )}
    >
      <ListEditor
        items={paged}
        onChange={onListChange}
        canReorder={wholeList}
        addLabel="Add product"
        confirmRemove={(p) => `PERMANENTLY remove "${p.brand ? p.brand + ' ' : ''}${p.name}" from the catalog? To hide it from the store while keeping its history, use the Archive toggle instead.`}
        summary={(p) => (
          <>
            <span style={{ width: 44, height: 34, borderRadius: 6, background: 'var(--cream-300)', border: '1px solid var(--border-hair)', overflow: 'hidden', flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {p.image
                ? <img src={p.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                : <GlassesMark size={16} color="var(--pine-300)" />}
            </span>
            <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              <b style={{ color: 'var(--text-strong)', fontSize: 14 }}>{p.brand ? `${p.brand} · ` : ''}{p.name}</b>
              <span style={{ color: 'var(--text-muted)', fontSize: 12.5 }}>
                {'  ·  ₪' + Number(p.amount || 0).toLocaleString('he-IL')}
                {'  ·  ' + (CATEGORIES.find((c) => c.value === (p.category || 'eyeglasses'))?.label || p.category)}
              </span>
            </span>
            {p.active === false && (
              <span style={{ flex: '0 0 auto', fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', background: 'var(--amber-500)', color: 'var(--pine-950)', borderRadius: 999, padding: '3px 9px' }}>Archived</span>
            )}
          </>
        )}
        makeNew={() => ({ id: nextId(), category: 'eyeglasses', brand: '', name: 'New frame', amount: 0, original: 0, rating: 5, reviews: 0, badge: null, tryMirror: true, colors: ['#274A3B'], shape: 'Round', material: 'Acetate', gender: 'Unisex', image: '', images: [], tryMirrorImg: '', desc: { en: '', he: '' }, specs: { lensWidth: '', bridge: '', temple: '', weight: '', lensOpts: { en: '', he: '' } } })}
        render={(p, set) => (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Row cols="220px 1fr 1fr">
              <Field label="Category (page)"><SelectField value={p.category || 'eyeglasses'} onChange={(v) => set({ ...p, category: v })} options={CATEGORIES} /></Field>
              <Field label="Brand"><Text value={p.brand} onChange={(v) => set({ ...p, brand: v })} /></Field>
              <Field label="Model name"><Text value={p.name} onChange={(v) => set({ ...p, name: v })} /></Field>
            </Row>
            <Row cols="repeat(4,1fr)">
              <Field label="Price ₪"><Num value={p.amount} onChange={(v) => set({ ...p, amount: v })} /></Field>
              <Field label="Was ₪ (0 = none)"><Num value={p.original} onChange={(v) => set({ ...p, original: v })} /></Field>
              <Field label="Rating (0–5)"><Num value={p.rating} onChange={(v) => set({ ...p, rating: v })} step="0.1" /></Field>
              <Field label="Reviews"><Num value={p.reviews} onChange={(v) => set({ ...p, reviews: v })} /></Field>
            </Row>
            <Row cols="repeat(3,1fr)">
              <Field label="Shape / type"><SelectField value={p.shape} onChange={(v) => set({ ...p, shape: v })} options={[...new Set([...(filters['Frame Shape'] || []), 'Daily', 'Bi-weekly', 'Monthly', p.shape].filter(Boolean))]} /></Field>
              <Field label="Material"><SelectField value={p.material} onChange={(v) => set({ ...p, material: v })} options={[...new Set([...(filters.Material || []), 'Silicone Hydrogel', 'Water Gradient', p.material].filter(Boolean))]} /></Field>
              <Field label="Gender"><SelectField value={p.gender} onChange={(v) => set({ ...p, gender: v })} options={[...new Set([...(filters.Gender || []), p.gender].filter(Boolean))]} /></Field>
            </Row>
            <Row cols="1fr 1fr">
              <Field label="Colours"><ColorList colors={p.colors || []} onChange={(v) => set({ ...p, colors: v })} /></Field>
              <div style={{ display: 'flex', gap: 20, alignItems: 'flex-end', paddingBottom: 8 }}>
                <Field label="Try Mirror"><Toggle checked={!!p.tryMirror} onChange={(v) => set({ ...p, tryMirror: v })} label={p.tryMirror ? 'On' : 'Off'} /></Field>
                <Field label="Badge"><Toggle checked={!!p.badge} onChange={(v) => set({ ...p, badge: v ? { variant: 'new', label: { en: 'New', he: 'חדש' } } : null })} label={p.badge ? 'Shown' : 'Hidden'} /></Field>
                {/* Soft delete: archived products keep their data/history but
                    are hidden from the storefront (server filters them out). */}
                <Field label="In store"><Toggle checked={p.active !== false} onChange={(v) => set({ ...p, active: v })} label={p.active !== false ? 'Visible' : 'Archived'} /></Field>
              </div>
            </Row>
            {p.badge && (
              <Row cols="200px 1fr">
                <Field label="Badge style"><SelectField value={p.badge.variant} onChange={(v) => set({ ...p, badge: { ...p.badge, variant: v } })} options={BADGE_VARIANTS} /></Field>
                <Bilingual label="Badge label" value={p.badge.label} onChange={(v) => set({ ...p, badge: { ...p.badge, label: v } })} />
              </Row>
            )}
            <ImageField label="Product photo" value={p.image} onChange={(v) => set({ ...p, image: v })} />
            {/* Up to 3 extra gallery angles shown as PDP thumbnails. */}
            <Row cols="repeat(3,1fr)">
              {[0, 1, 2].map((i) => (
                <ImageField
                  key={i}
                  label={`Extra photo ${i + 1}`}
                  value={(p.images || [])[i] || ''}
                  onChange={(v) => {
                    const images = [...(p.images || [])]
                    images[i] = v
                    set({ ...p, images: images.filter(Boolean) })
                  }}
                />
              ))}
            </Row>
            <ImageField label="Try-on frame PNG (transparent — overlaid on the face in Try Mirror)" value={p.tryMirrorImg || ''} onChange={(v) => set({ ...p, tryMirrorImg: v })} />
            <Bilingual label="Description (PDP · rich text, blank line = new paragraph)" area value={p.desc || { en: '', he: '' }} onChange={(v) => set({ ...p, desc: v })} />
            <Row cols="repeat(4,1fr)">
              <Field label="Lens width"><Text value={(p.specs || {}).lensWidth || ''} onChange={(v) => set({ ...p, specs: { ...(p.specs || {}), lensWidth: v } })} /></Field>
              <Field label="Bridge"><Text value={(p.specs || {}).bridge || ''} onChange={(v) => set({ ...p, specs: { ...(p.specs || {}), bridge: v } })} /></Field>
              <Field label="Temple length"><Text value={(p.specs || {}).temple || ''} onChange={(v) => set({ ...p, specs: { ...(p.specs || {}), temple: v } })} /></Field>
              <Field label="Weight"><Text value={(p.specs || {}).weight || ''} onChange={(v) => set({ ...p, specs: { ...(p.specs || {}), weight: v } })} /></Field>
            </Row>
            <Bilingual label="Lens options (specs table)" value={(p.specs || {}).lensOpts || { en: '', he: '' }} onChange={(v) => set({ ...p, specs: { ...(p.specs || {}), lensOpts: v } })} />
          </div>
        )}
      />
      <Pager page={safePage} setPage={setPage} total={visible.length} pageSize={PAGE} />
    </Panel>

    <Panel title="Brands" desc="Shown on the Brands page; customers can browse all products of a brand.">
      <StringList items={content.brands || []} onChange={(v) => setContent({ ...content, brands: v })} placeholder="Brand name" />
    </Panel>
    </div>
  )
}
