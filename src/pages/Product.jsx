import React, { useState } from 'react'
import { Button, IconButton, Icon, Tabs, Rating, Price, Dialog, Checkbox, Select, Badge, GlassesMark } from '../ds/index.js'
import { useLang } from '../i18n/index.jsx'
import { useContent } from '../content/ContentProvider.jsx'
import { useAuth } from '../auth/AuthProvider.jsx'
import { ImageSlot } from '../components/ImageSlot.jsx'

function MarkThumb({ active, onClick, tint }) {
  return (
    <button onClick={onClick} style={{ width: 64, height: 64, borderRadius: 'var(--radius-sm)', border: `1.5px solid ${active ? 'var(--pine-700)' : 'var(--border-hair)'}`, background: 'var(--cream-300)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
      <GlassesMark size={20} color={tint || 'var(--pine-500)'} />
    </button>
  )
}

function LensRow({ label, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '14px 0', borderBottom: '1px solid var(--border-hair)' }}>
      <span style={{ fontSize: 14, color: 'var(--text-body)' }}>{label}</span>
      {children}
    </div>
  )
}

export function Product({ product, go, addToCart, openAccount }) {
  const { t: root, A, lang } = useLang()
  const { content } = useContent()
  const { user, inWishlist, toggleWishlist } = useAuth()
  const t = root.product
  const p = product || (content.products || [])[0] || {}
  const wished = user ? inWishlist(p.id) : false
  const onHeart = () => { user ? toggleWishlist(p.id) : openAccount && openAccount('wishlist') }
  const [img, setImg] = useState(0)
  const [tab, setTab] = useState('desc')
  const [consent, setConsent] = useState(false)
  const [mirror, setMirror] = useState(false)
  const [lensOpen, setLensOpen] = useState(false)
  const [index, setIndex] = useState('1.6')
  const [ar, setAr] = useState(true)
  const [blue, setBlue] = useState(false)
  const [photo, setPhoto] = useState(false)

  const lensPrice = (index === '1.6' ? 120 : index === '1.67' ? 260 : index === '1.74' ? 420 : 0) + (ar ? 90 : 0) + (blue ? 70 : 0) + (photo ? 180 : 0)
  const total = p.amount + lensPrice
  const summaryParts = [`${t.index} ${index}`, ar && t.antiReflective, blue && t.blueLight, photo && t.photochromic].filter(Boolean)

  return (
    <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '28px 28px 72px' }}>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => go('catalog')}>{t.back}</span>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, marginTop: 20, alignItems: 'start' }}>
        {/* GALLERY */}
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[0, 1, 2, 3].map((i) => <MarkThumb key={i} active={img === i} onClick={() => setImg(i)} tint={p.colors[i % p.colors.length]} />)}
          </div>
          <div style={{ flex: 1, position: 'relative', aspectRatio: '1', background: 'var(--cream-300)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-hair)', overflow: 'hidden' }}>
            <ImageSlot src={p.image || undefined} placeholder={t.photoSlot} shape="rounded" radius={12} fit="cover" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
            {p.tryMirror && <span style={{ position: 'absolute', top: 16, insetInlineStart: 16, zIndex: 2, pointerEvents: 'none' }}><Badge variant="try">Try Mirror</Badge></span>}
            <IconButton variant="outline" round style={{ position: 'absolute', bottom: 16, insetInlineEnd: 16, background: 'var(--white)', zIndex: 2 }}><Icon name="maximize-2" size={16} /></IconButton>
          </div>
        </div>

        {/* INFO */}
        <div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-accent)' }}>{p.brand}</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 34, color: 'var(--text-strong)', margin: '8px 0 12px' }}>{p.name}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18, flexWrap: 'wrap' }}>
            <Rating value={p.rating} count={p.reviews} />
            <span style={{ color: 'var(--border-strong)' }}>·</span>
            <span style={{ fontSize: 13, color: 'var(--success)', fontWeight: 600 }}>{t.inStock}</span>
          </div>
          <Price amount={total} original={p.original ? p.original + lensPrice : undefined} size="lg" />
          <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--text-body)', margin: '18px 0 22px', maxWidth: 460 }}>{t.desc(p.shape, p.material)}</p>

          {/* colors */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>{t.color}</div>
            <div style={{ display: 'flex', gap: 10 }}>
              {p.colors.map((c, i) => (
                <button key={i} onClick={() => setImg(i)} style={{ width: 34, height: 34, borderRadius: 999, background: c, border: `2px solid ${img === i ? 'var(--amber-600)' : 'var(--border-hair)'}`, cursor: 'pointer', outline: img === i ? '2px solid var(--amber-100)' : 'none' }} />
              ))}
            </div>
          </div>

          {/* lens config summary */}
          <button onClick={() => setLensOpen(!lensOpen)} style={{ width: '100%', textAlign: 'start', border: '1px solid var(--border-hair)', background: 'var(--cream-100)', borderRadius: 'var(--radius-md)', padding: '14px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: '0.06em', color: 'var(--text-strong)', display: 'block', textTransform: 'uppercase' }}>{t.lensConfig}</span>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{t.lensSummary(summaryParts, lensPrice)}</span>
            </span>
            <Icon name={lensOpen ? 'chevron-up' : 'chevron-down'} size={18} />
          </button>
          {lensOpen && (
            <div style={{ border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-md)', padding: '4px 16px 16px', marginBottom: 18, background: 'var(--white)' }}>
              <LensRow label={t.lensIndex}><div style={{ width: 150 }}><Select value={index} onChange={(e) => setIndex(e.target.value)} size="sm" options={t.lensOpts} /></div></LensRow>
              <LensRow label={t.arRow}><Checkbox checked={ar} onChange={setAr} /></LensRow>
              <LensRow label={t.blueRow}><Checkbox checked={blue} onChange={setBlue} /></LensRow>
              <LensRow label={t.photoRow}><Checkbox checked={photo} onChange={setPhoto} /></LensRow>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, color: 'var(--text-muted)', fontSize: 12.5 }}>
                <Icon name="info" size={15} /> {t.lensNote}
              </div>
            </div>
          )}

          {/* actions */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <Button variant="primary" size="lg" block onClick={() => addToCart({ ...p, amount: total })} startIcon={<Icon name="shopping-bag" size={18} color="currentColor" />}>{t.addToCart(total)}</Button>
            {p.tryMirror && <Button variant="solid" size="lg" onClick={() => setConsent(true)} startIcon={<Icon name="camera" size={18} color="currentColor" />}>{t.tryMirror}</Button>}
            <IconButton variant="outline" size="lg" onClick={onHeart} aria-label="wishlist">
              <Icon name="heart" size={20} color={wished ? 'var(--danger)' : 'var(--pine-700)'} fill={wished ? 'var(--danger)' : 'none'} />
            </IconButton>
          </div>
          <div style={{ display: 'flex', gap: 22, marginTop: 18, fontSize: 13, color: 'var(--text-muted)', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}><Icon name="truck" size={16} /> {t.freeShip}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}><Icon name="store" size={16} /> {t.reserveFit}</span>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ marginTop: 56, maxWidth: 780 }}>
        <Tabs tabs={[{ value: 'desc', label: t.tabs.desc }, { value: 'specs', label: t.tabs.specs }, { value: 'reviews', label: t.tabs.reviews }]} value={tab} onChange={setTab} />
        <div style={{ padding: '24px 2px', fontSize: 15, lineHeight: 1.7, color: 'var(--text-body)' }}>
          {tab === 'desc' && <p style={{ margin: 0 }}>{t.descLong(p.name, p.shape, p.material)}</p>}
          {tab === 'specs' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 40px', maxWidth: 520 }}>
              {[[t.specLabels.brand, p.brand], [t.specLabels.shape, A(p.shape)], [t.specLabels.material, A(p.material)], [t.specLabels.gender, A(p.gender)], [t.specLabels.lensWidth, '50 mm'], [t.specLabels.bridge, '21 mm'], [t.specLabels.temple, '145 mm'], [t.specLabels.tryMirror, p.tryMirror ? t.yes : t.no]].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-hair)', paddingBottom: 8 }}>
                  <span style={{ color: 'var(--text-muted)' }}>{k}</span><span style={{ color: 'var(--text-strong)', fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
          )}
          {tab === 'reviews' && <p style={{ margin: 0, color: 'var(--text-muted)' }}>{t.reviewsLine(p.reviews, p.rating)}</p>}
        </div>
      </div>

      {/* CONSENT DIALOG */}
      <Dialog open={consent} onClose={() => setConsent(false)} eyebrow={t.consentEyebrow} title={t.consentTitle}
        footer={<>
          <Button variant="ghost" onClick={() => setConsent(false)}>{t.notNow}</Button>
          <Button variant="primary" onClick={() => { setConsent(false); setMirror(true) }}>{t.allowCamera}</Button>
        </>}>
        {t.consentBody}
      </Dialog>

      {/* TRY MIRROR MOCK */}
      {mirror && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'var(--pine-950)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', color: 'var(--cream-100)' }}>
            <span style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.14em', textTransform: 'uppercase', fontSize: 13, color: 'var(--amber-500)' }}>{t.mirrorLive}</span>
            <IconButton variant="ghost" onClick={() => setMirror(false)} style={{ color: 'var(--cream-100)' }}><Icon name="x" color="var(--cream-100)" /></IconButton>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <div style={{ width: 'min(70vh,520px)', aspectRatio: '3/4', borderRadius: 'var(--radius-lg)', background: 'linear-gradient(160deg,var(--pine-700),var(--pine-900))', border: '1px solid var(--border-on-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
              <Icon name="user" size={160} color="rgba(255,255,255,0.12)" />
              <div className="oz-scan-line" />
              <div style={{ position: 'absolute', top: '34%', animation: 'oz-float 4s var(--ease-in-out) infinite' }}><GlassesMark size={70} color={p.colors[img % p.colors.length]} /></div>
              <span style={{ position: 'absolute', bottom: 16, fontSize: 12, color: 'var(--pine-200)', letterSpacing: '0.06em' }}>{t.mirrorPreview}</span>
            </div>
          </div>
          <div style={{ padding: '18px 24px 28px', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 10 }}>
              {p.colors.map((c, i) => <button key={i} onClick={() => setImg(i)} style={{ width: 36, height: 36, borderRadius: 999, background: c, border: `2px solid ${img === i ? 'var(--amber-500)' : 'transparent'}`, cursor: 'pointer' }} />)}
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Button variant="outline" style={{ color: 'var(--cream-100)', borderColor: 'var(--cream-100)' }} startIcon={<Icon name="camera" size={18} color="currentColor" />}>{t.capture}</Button>
              <Button variant="primary" onClick={() => { addToCart({ ...p, amount: total }); setMirror(false) }} startIcon={<Icon name="shopping-bag" size={18} color="currentColor" />}>{t.mirrorAdd}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
