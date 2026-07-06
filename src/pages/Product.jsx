import React, { useState } from 'react'
import { Button, IconButton, Icon, Tabs, Rating, Price, Dialog, Checkbox, Select, Badge, GlassesMark } from '../ds/index.js'
import { useLang } from '../i18n/index.jsx'
import { useContent } from '../content/ContentProvider.jsx'
import { useAuth } from '../auth/AuthProvider.jsx'
import { ImageSlot } from '../components/ImageSlot.jsx'
import { TryMirror } from '../components/TryMirror.jsx'
import { canTryMirror } from '../lib/tryMirror.js'

// Thumbnail: real product photo when the admin uploaded one, mark fallback.
function MarkThumb({ active, onClick, tint, src }) {
  return (
    <button onClick={onClick} style={{ width: 64, height: 64, borderRadius: 'var(--radius-sm)', border: `1.5px solid ${active ? 'var(--pine-700)' : 'var(--border-hair)'}`, background: 'var(--cream-300)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, overflow: 'hidden' }}>
      {src
        ? <img src={src} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        : <GlassesMark size={20} color={tint || 'var(--pine-500)'} />}
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

export function Product({ product, go, openCatalog, addToCart, openAccount }) {
  const { t: root, A, L, lang } = useLang()
  const { content, nav } = useContent()
  const { user, inWishlist, toggleWishlist } = useAuth()
  const t = root.product
  const p = product || (content.products || [])[0] || {}
  const wished = user ? inWishlist(p.id) : false
  const cat = p.category || 'eyeglasses'
  const catLabel = L((content.categoryPages || {})[cat]?.title) || L((nav.find((n) => n.key === cat) || {}).label) || ''
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
  // Try Mirror is offered only for glasses & sunglasses (never contacts).
  const showMirror = canTryMirror(p)

  const lensPrice = (index === '1.6' ? 120 : index === '1.67' ? 260 : index === '1.74' ? 420 : 0) + (ar ? 90 : 0) + (blue ? 70 : 0) + (photo ? 180 : 0)
  const total = p.amount + lensPrice
  const summaryParts = [`${t.index} ${index}`, ar && t.antiReflective, blue && t.blueLight, photo && t.photochromic].filter(Boolean)

  // Gallery images from the admin portal (main photo + extra angles).
  const gallery = [p.image, ...(p.images || [])].filter(Boolean)
  const mainSrc = gallery.length ? gallery[Math.min(img, gallery.length - 1)] : undefined
  // Per-product content from the admin portal (with graceful fallbacks).
  const richDesc = L(p.desc)
  const sp = p.specs || {}

  return (
    <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '28px 28px 72px' }}>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => openCatalog(p.category || 'eyeglasses')}>{t.backTo(catLabel)}</span>

      <div className="oz-g2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, marginTop: 20, alignItems: 'start' }}>
        {/* GALLERY */}
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {(gallery.length ? gallery.slice(0, 4) : [0, 1, 2, 3]).map((g, i) => (
              <MarkThumb key={i} active={img === i} onClick={() => setImg(i)} src={gallery.length ? g : undefined} tint={p.colors[i % (p.colors.length || 1)]} />
            ))}
          </div>
          <div style={{ flex: 1, position: 'relative', aspectRatio: '1', background: 'var(--cream-300)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-hair)', overflow: 'hidden' }}>
            <ImageSlot src={mainSrc} alt={`${p.brand} ${p.name}`} placeholder={t.photoSlot} shape="rounded" radius={12} fit="cover" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
            {showMirror && <span style={{ position: 'absolute', top: 16, insetInlineStart: 16, zIndex: 2, pointerEvents: 'none' }}><Badge variant="try">Try Mirror</Badge></span>}
            {/* Try Mirror entry point right on the product image */}
            {showMirror && (
              <span style={{ position: 'absolute', bottom: 16, insetInlineStart: 16, zIndex: 2 }}>
                <Button variant="solid" size="sm" onClick={() => setConsent(true)} startIcon={<Icon name="camera" size={15} color="currentColor" />}>{t.tryMirror}</Button>
              </span>
            )}
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
          <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--text-body)', margin: '18px 0 22px', maxWidth: 460 }}>
            {richDesc ? `${richDesc.split(/(?<=\.)\s+/)[0]}` : t.desc(p.shape, p.material)}
          </p>

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
            {showMirror && <Button variant="solid" size="lg" onClick={() => setConsent(true)} startIcon={<Icon name="camera" size={18} color="currentColor" />}>{t.tryMirror}</Button>}
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
          {/* Rich per-product description from the admin portal (paragraphs
              split on newlines); generic copy only as a last-resort fallback. */}
          {tab === 'desc' && (
            richDesc
              ? richDesc.split(/\n+/).map((para, i) => <p key={i} style={{ margin: i ? '14px 0 0' : 0 }}>{para}</p>)
              : <p style={{ margin: 0 }}>{t.descLong(p.name, p.shape, p.material)}</p>
          )}
          {/* Structured specs table — values come from the product's admin
              record (p.specs); rows with no data are simply omitted. */}
          {tab === 'specs' && (
            <div className="oz-g2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 40px', maxWidth: 620 }}>
              {[
                [t.specLabels.brand, p.brand],
                [t.specLabels.shape, A(p.shape)],
                [t.specLabels.material, A(p.material)],
                [t.specLabels.gender, A(p.gender)],
                [t.specLabels.lensWidth, sp.lensWidth],
                [t.specLabels.bridge, sp.bridge],
                [t.specLabels.temple, sp.temple],
                [t.specLabels.weight, sp.weight],
                [t.specLabels.colorOpts, (p.colors || []).length ? String(p.colors.length) : ''],
                [t.specLabels.lensOpts, L(sp.lensOpts)],
                [t.specLabels.tryMirror, showMirror ? t.yes : t.no],
              ].filter(([, v]) => v).map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 14, borderBottom: '1px solid var(--border-hair)', paddingBottom: 8 }}>
                  <span style={{ color: 'var(--text-muted)', flex: '0 0 auto' }}>{k}</span><span style={{ color: 'var(--text-strong)', fontWeight: 600, textAlign: 'end' }}>{v}</span>
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

      {/* TRY MIRROR — real client-side try-on (MediaPipe Face Landmarker).
          The chosen frame size travels with the cart line as customSize. */}
      <TryMirror
        open={mirror}
        onClose={() => setMirror(false)}
        product={p}
        catalog={(content.products || []).filter(canTryMirror)}
        strings={t}
        onAddToCart={(customSize, chosen) => {
          const prod = chosen || p
          // The opened product keeps its lens-option total; a carousel-picked
          // frame is added at its own base price.
          addToCart({ ...prod, amount: prod.id === p.id ? total : prod.amount }, { customSize })
        }}
      />
    </div>
  )
}
