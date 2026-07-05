import React, { useState } from 'react'
import { GlassesMark } from '../ds/index.js'
import { useLang } from '../i18n/index.jsx'
import { useContent } from '../content/ContentProvider.jsx'

// Brands index — one card per brand (editable in Admin → Products → Brands).
// Clicking a brand opens the catalog filtered to that brand across categories.
export function Brands({ openCatalog }) {
  const { t: root } = useLang()
  const t = root.brands
  const { content } = useContent()
  const products = content.products || []
  const brands = (content.brands || []).filter(Boolean)

  return (
    <div>
      <div style={{ background: 'var(--pine-700)', color: 'var(--cream-100)' }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '46px 28px' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--amber-500)' }}>{t.eyebrow}</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 40, color: 'var(--cream-100)', margin: '10px 0 6px' }}>{t.title}</h1>
          <p style={{ margin: 0, fontSize: 15, color: 'var(--pine-100)', maxWidth: 520 }}>{t.sub}</p>
        </div>
      </div>

      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '34px 28px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 20 }}>
          {brands.map((b, i) => {
            const count = products.filter((p) => p.brand === b).length
            return <BrandCard key={b} brand={b} count={count} countLabel={t.count(count)} delay={i * 60} onOpen={() => openCatalog('all', b)} />
          })}
        </div>
      </div>
    </div>
  )
}

function BrandCard({ brand, count, countLabel, delay, onOpen }) {
  const [h, setH] = useState(false)
  return (
    <button
      onClick={onOpen}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        textAlign: 'center', padding: '34px 20px 26px', background: 'var(--surface-card)',
        border: `1px solid ${h ? 'var(--pine-300)' : 'var(--border-hair)'}`, borderRadius: 'var(--radius-md)',
        cursor: 'pointer', boxShadow: h ? 'var(--shadow-md)' : 'var(--shadow-xs)',
        transform: h ? 'translateY(-4px)' : 'none',
        transition: 'transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out)',
        animation: 'oz-fade-up var(--dur-slow) var(--ease-out) both', animationDelay: `${delay}ms`,
      }}
    >
      <GlassesMark size={26} color={h ? 'var(--amber-600)' : 'var(--pine-400)'} />
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, letterSpacing: '0.06em', color: 'var(--text-strong)', margin: '14px 0 4px' }}>{brand}</div>
      <div style={{ fontSize: 13, color: count ? 'var(--text-muted)' : 'var(--text-faint)' }}>{countLabel}</div>
    </button>
  )
}
