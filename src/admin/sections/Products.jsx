import React from 'react'
import { Panel, Row, Field, Text, Num, SelectField, Toggle, Bilingual, ImageField, ListEditor, Btn } from '../ui.jsx'

const BADGE_VARIANTS = [
  { value: 'sale', label: 'Sale (amber)' },
  { value: 'new', label: 'New (pine)' },
  { value: 'bestseller', label: 'Bestseller' },
  { value: 'try', label: 'Try' },
]

function ColorList({ colors = [], onChange }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
      {colors.map((c, i) => (
        <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <input type="color" value={c} onChange={(e) => onChange(colors.map((x, idx) => (idx === i ? e.target.value : x)))} style={{ width: 34, height: 34, border: '1px solid var(--border-hair)', borderRadius: 6, background: 'none', cursor: 'pointer' }} />
          <button type="button" onClick={() => onChange(colors.filter((_, idx) => idx !== i))} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-faint)', fontSize: 15 }}>×</button>
        </span>
      ))}
      <Btn variant="outline" size="sm" onClick={() => onChange([...colors, '#274A3B'])}>+ Colour</Btn>
    </div>
  )
}

export default function Products({ content, setContent }) {
  const products = content.products || []
  const filters = content.filters || {}
  const setProducts = (list) => setContent({ ...content, products: list })
  const nextId = () => (products.reduce((m, p) => Math.max(m, Number(p.id) || 0), 0) + 1)

  return (
    <Panel title="Products & catalog" desc="Add, edit, reorder or remove the frames shown across the storefront.">
      <ListEditor
        items={products}
        onChange={setProducts}
        addLabel="Add product"
        makeNew={() => ({ id: nextId(), brand: '', name: 'New frame', amount: 0, original: 0, rating: 5, reviews: 0, badge: null, tryMirror: true, colors: ['#274A3B'], shape: 'Round', material: 'Acetate', gender: 'Unisex', image: '' })}
        render={(p, set) => (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Row cols="1fr 1fr">
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
              <Field label="Shape"><SelectField value={p.shape} onChange={(v) => set({ ...p, shape: v })} options={filters['Frame Shape'] || []} /></Field>
              <Field label="Material"><SelectField value={p.material} onChange={(v) => set({ ...p, material: v })} options={filters.Material || []} /></Field>
              <Field label="Gender"><SelectField value={p.gender} onChange={(v) => set({ ...p, gender: v })} options={filters.Gender || []} /></Field>
            </Row>
            <Row cols="1fr 1fr">
              <Field label="Colours"><ColorList colors={p.colors || []} onChange={(v) => set({ ...p, colors: v })} /></Field>
              <div style={{ display: 'flex', gap: 20, alignItems: 'flex-end', paddingBottom: 8 }}>
                <Field label="Try Mirror"><Toggle checked={!!p.tryMirror} onChange={(v) => set({ ...p, tryMirror: v })} label={p.tryMirror ? 'On' : 'Off'} /></Field>
                <Field label="Badge"><Toggle checked={!!p.badge} onChange={(v) => set({ ...p, badge: v ? { variant: 'new', label: { en: 'New', he: 'חדש' } } : null })} label={p.badge ? 'Shown' : 'Hidden'} /></Field>
              </div>
            </Row>
            {p.badge && (
              <Row cols="200px 1fr">
                <Field label="Badge style"><SelectField value={p.badge.variant} onChange={(v) => set({ ...p, badge: { ...p.badge, variant: v } })} options={BADGE_VARIANTS} /></Field>
                <Bilingual label="Badge label" value={p.badge.label} onChange={(v) => set({ ...p, badge: { ...p.badge, label: v } })} />
              </Row>
            )}
            <ImageField label="Product photo" value={p.image} onChange={(v) => set({ ...p, image: v })} />
          </div>
        )}
      />
    </Panel>
  )
}
