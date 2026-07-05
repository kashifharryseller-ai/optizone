import React, { useState } from 'react'
import { Button, Icon } from '../ds/index.js'
import { useLang } from '../i18n/index.jsx'
import { useContent } from '../content/ContentProvider.jsx'

export function StoreLocator({ go }) {
  const { t: root, L, A, lang } = useLang()
  const { content } = useContent()
  const stores = content.stores || []
  const t = root.stores
  const [active, setActive] = useState(0)
  const s = stores[active] || stores[0] || {}
  const storeName = (st) => (lang === 'he' ? st.he : st.name)

  return (
    <div>
      <div style={{ background: 'var(--pine-700)', color: 'var(--cream-100)' }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '46px 28px' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--amber-500)' }}>{t.eyebrow}</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 40, color: 'var(--cream-100)', margin: '10px 0 0' }}>{t.h1}</h1>
        </div>
      </div>

      <div className="oz-sidebar" style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '30px 28px 80px', display: 'grid', gridTemplateColumns: '360px 1fr', gap: 30, alignItems: 'start' }}>
        {/* list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {stores.map((st, i) => (
            <button key={st.name} onClick={() => setActive(i)}
              style={{ textAlign: 'start', padding: '18px 20px', borderRadius: 'var(--radius-md)', border: `1.5px solid ${active === i ? 'var(--pine-700)' : 'var(--border-hair)'}`, background: active === i ? 'var(--pine-50)' : 'var(--surface-card)', cursor: 'pointer', transition: 'all var(--dur-fast) var(--ease-out)', boxShadow: active === i ? 'var(--shadow-sm)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <Icon name="map-pin" size={18} color="var(--pine-700)" />
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--text-strong)' }}>OPTIZONE {storeName(st)}</span>
              </div>
              <div style={{ fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.6 }}>{st.addr}<br />{L(st.hours)}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
                {st.services.map((sv) => <span key={sv} style={{ fontSize: 11, letterSpacing: '0.04em', color: 'var(--pine-700)', background: 'var(--pine-100)', borderRadius: 'var(--radius-pill)', padding: '3px 10px' }}>{A(sv)}</span>)}
              </div>
            </button>
          ))}
        </div>

        {/* map + detail */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ position: 'relative', aspectRatio: '16/10', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-hair)', background: 'linear-gradient(160deg,var(--pine-100),var(--cream-300))' }}>
            <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.5 }}>
              <defs><pattern id="ozgrid" width="44" height="44" patternUnits="userSpaceOnUse"><path d="M44 0H0V44" fill="none" stroke="var(--pine-300)" strokeWidth="1" /></pattern></defs>
              <rect width="100%" height="100%" fill="url(#ozgrid)" />
              <path d="M20 60 Q120 40 180 120 T360 200 Q440 240 520 210" fill="none" stroke="var(--amber-400)" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
            </svg>
            {stores.map((st, i) => (
              <button key={st.name} onClick={() => setActive(i)} style={{ position: 'absolute', left: `${st.x}%`, top: `${st.y}%`, transform: 'translate(-50%,-100%)', border: 'none', background: 'transparent', cursor: 'pointer', padding: 0 }}>
                {active === i && <span style={{ position: 'absolute', left: '50%', top: '80%', transform: 'translate(-50%,-50%)', width: 30, height: 30, borderRadius: 999, background: 'var(--amber-500)', opacity: 0.5, animation: 'oz-ring 1.6s var(--ease-out) infinite' }} />}
                <span style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Icon name="map-pin" size={active === i ? 40 : 30} color={active === i ? 'var(--amber-600)' : 'var(--pine-700)'} fill={active === i ? 'var(--amber-500)' : 'none'} />
                </span>
              </button>
            ))}
          </div>

          {/* active branch detail */}
          <div key={active} className="oz-route" style={{ background: 'var(--surface-card)', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-lg)', padding: '26px 28px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
              <div>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-accent)' }}>{t.branch}</span>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 26, color: 'var(--text-strong)', margin: '6px 0 12px' }}>OPTIZONE {storeName(s)}</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14, color: 'var(--text-body)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 9 }}><Icon name="map-pin" size={16} color="var(--pine-700)" /> {s.addr}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 9 }}><Icon name="clock" size={16} color="var(--pine-700)" /> {L(s.hours)}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 9 }}><Icon name="phone" size={16} color="var(--pine-700)" /> <span style={{ direction: 'ltr' }}>{s.phone}</span></span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 180 }}>
                <Button variant="primary" onClick={() => go('booking')} startIcon={<Icon name="calendar" size={17} color="currentColor" />}>{t.bookHere}</Button>
                <Button variant="outline" startIcon={<Icon name="navigation" size={17} color="currentColor" />}>{t.directions}</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
