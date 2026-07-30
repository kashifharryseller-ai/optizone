import React from 'react'
import { useLang } from '../i18n/index.jsx'
import { BrandGrid } from '../components/BrandShowcase.jsx'

// Brands index — premium 3D-tilt gallery of the houses we carry. Each tile opens
// the catalog for that brand's primary category. Imagery is a cohesive studio
// set on the brand pine + amber palette.
export function Brands({ openCatalog }) {
  const { t: root } = useLang()
  const t = root.brands

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
        <BrandGrid openCatalog={openCatalog} />
      </div>
    </div>
  )
}
