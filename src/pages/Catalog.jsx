import React, { useState } from 'react'
import { ProductCard, Tag, Switch, Select } from '../ds/index.js'
import { useLang } from '../i18n/index.jsx'
import { useContent } from '../content/ContentProvider.jsx'

export function Catalog({ go, addToCart }) {
  const { t: root, A, L } = useLang()
  const t = root.catalog
  const { content } = useContent()
  const products = content.products || []
  const filters = content.filters || {}
  const [selected, setSelected] = useState({})
  const [tryOnly, setTryOnly] = useState(false)
  const [sort, setSort] = useState('popular')

  const toggle = (group, val) => {
    setSelected((s) => {
      const cur = new Set(s[group] || [])
      cur.has(val) ? cur.delete(val) : cur.add(val)
      return { ...s, [group]: [...cur] }
    })
  }
  const activeVals = Object.values(selected).flat()
  let list = products.filter((p) => {
    if (tryOnly && !p.tryMirror) return false
    for (const [g, vals] of Object.entries(selected)) {
      if (!vals.length) continue
      const field = g === 'Frame Shape' ? p.shape : g === 'Material' ? p.material : p.gender
      if (!vals.includes(field)) return false
    }
    return true
  })
  if (sort === 'price-asc') list = [...list].sort((a, b) => a.amount - b.amount)
  if (sort === 'price-desc') list = [...list].sort((a, b) => b.amount - a.amount)

  const badgeOf = (p) => (p.badge ? { variant: p.badge.variant, label: L(p.badge.label) } : undefined)
  const cardLabels = { tryMirrorLabel: 'Try Mirror', quickAddLabel: root.toast.added }

  return (
    <div>
      {/* Page header band */}
      <div style={{ background: 'var(--cream-300)', borderBottom: '1px solid var(--border-soft)' }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '34px 28px' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{t.crumb}</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 40, color: 'var(--text-strong)', margin: '10px 0 0' }}>{t.title}</h1>
        </div>
      </div>

      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '28px 28px 72px', display: 'grid', gridTemplateColumns: '250px 1fr', gap: 34, alignItems: 'start' }}>
        {/* FILTERS */}
        <aside style={{ position: 'sticky', top: 96, display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-strong)' }}>{t.filters}</span>
            {activeVals.length > 0 && <a onClick={() => setSelected({})} style={{ fontSize: 13, color: 'var(--amber-700)', cursor: 'pointer' }}>{t.clear}</a>}
          </div>
          <div style={{ padding: '12px 0', borderTop: '1px solid var(--border-hair)', borderBottom: '1px solid var(--border-hair)' }}>
            <Switch label={t.tryOnly} checked={tryOnly} onChange={setTryOnly} />
          </div>
          {Object.entries(filters).map(([group, vals]) => (
            <div key={group}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>{A(group)}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {vals.map((v) => (
                  <Tag key={v} selected={(selected[group] || []).includes(v)} onClick={() => toggle(group, v)}>{A(v)}</Tag>
                ))}
              </div>
            </div>
          ))}
        </aside>

        {/* GRID */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, gap: 16 }}>
            <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>{t.count(list.length)}</span>
            <div style={{ width: 220 }}>
              <Select value={sort} onChange={(e) => setSort(e.target.value)} options={[{ value: 'popular', label: t.sort.popular }, { value: 'price-asc', label: t.sort.asc }, { value: 'price-desc', label: t.sort.desc }]} />
            </div>
          </div>
          {list.length === 0 ? (
            <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>{t.empty}</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
              {list.map((p) => (
                <ProductCard key={p.id} image={p.image || undefined} brand={p.brand} name={p.name} amount={p.amount} original={p.original || undefined}
                  rating={p.rating} reviewCount={p.reviews} badge={badgeOf(p)} tryMirror={p.tryMirror} colors={p.colors}
                  onQuickAdd={() => addToCart(p)} style={{ cursor: 'pointer' }} onClick={() => go('product', p)} {...cardLabels} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
