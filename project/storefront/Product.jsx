// OPTIZONE storefront — Product detail page (PDP) with Try Mirror + lens configurator.
const { Button, IconButton, Icon, Tabs, Rating, Price, Dialog, Checkbox, Select, DiamondRule, Badge, GlassesMark } = window.OPTIZONEDesignSystem_ded4a5;

function MarkThumb({ active, onClick, tint }) {
  return (
    <button onClick={onClick} style={{ width: 64, height: 64, borderRadius: 'var(--radius-sm)', border: `1.5px solid ${active ? 'var(--pine-700)' : 'var(--border-hair)'}`, background: 'var(--cream-300)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
      <GlassesMark size={20} color={tint || 'var(--pine-500)'} />
    </button>
  );
}

function LensRow({ label, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '14px 0', borderBottom: '1px solid var(--border-hair)' }}>
      <span style={{ fontSize: 14, color: 'var(--text-body)' }}>{label}</span>
      {children}
    </div>
  );
}

function Product({ product, go, addToCart }) {
  const p = product || window.OZ_DATA.products[0];
  const [img, setImg] = React.useState(0);
  const [tab, setTab] = React.useState('desc');
  const [consent, setConsent] = React.useState(false);
  const [mirror, setMirror] = React.useState(false);
  const [lensOpen, setLensOpen] = React.useState(false);
  const [index, setIndex] = React.useState('1.6');
  const [ar, setAr] = React.useState(true);
  const [blue, setBlue] = React.useState(false);
  const [photo, setPhoto] = React.useState(false);
  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });

  const lensPrice = (index === '1.6' ? 120 : index === '1.67' ? 260 : index === '1.74' ? 420 : 0) + (ar ? 90 : 0) + (blue ? 70 : 0) + (photo ? 180 : 0);
  const total = p.amount + lensPrice;

  return (
    <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '28px 28px 72px' }}>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => go('catalog')}>← Back to Eyeglasses</span>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, marginTop: 20, alignItems: 'start' }}>
        {/* GALLERY */}
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[0, 1, 2, 3].map((i) => <MarkThumb key={i} active={img === i} onClick={() => setImg(i)} tint={p.colors[i % p.colors.length]} />)}
          </div>
          <div style={{ flex: 1, position: 'relative', aspectRatio: '1', background: 'var(--cream-300)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-hair)' }}>
            <GlassesMark size={130} color={p.colors[img % p.colors.length]} />
            {p.tryMirror && <span style={{ position: 'absolute', top: 16, insetInlineStart: 16 }}><Badge variant="try">Try Mirror</Badge></span>}
            <IconButton variant="outline" round style={{ position: 'absolute', bottom: 16, insetInlineEnd: 16, background: 'var(--white)' }}><Icon name="maximize-2" size={16} /></IconButton>
          </div>
        </div>

        {/* INFO */}
        <div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-accent)' }}>{p.brand}</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 34, color: 'var(--text-strong)', margin: '8px 0 12px' }}>{p.name}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
            <Rating value={p.rating} count={p.reviews} />
            <span style={{ color: 'var(--border-strong)' }}>·</span>
            <span style={{ fontSize: 13, color: 'var(--success)', fontWeight: 600 }}>In stock · Netanya, Tel Aviv</span>
          </div>
          <Price amount={total} original={p.original ? p.original + lensPrice : undefined} size="lg" />
          <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--text-body)', margin: '18px 0 22px', maxWidth: 460 }}>
            A refined {p.shape.toLowerCase()} silhouette in premium {p.material.toLowerCase()}. Lightweight, precisely balanced, and ready for your prescription.
          </p>

          {/* colors */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>Color</div>
            <div style={{ display: 'flex', gap: 10 }}>
              {p.colors.map((c, i) => (
                <button key={i} onClick={() => setImg(i)} style={{ width: 34, height: 34, borderRadius: 999, background: c, border: `2px solid ${img === i ? 'var(--amber-600)' : 'var(--border-hair)'}`, cursor: 'pointer', outline: img === i ? '2px solid var(--amber-100)' : 'none' }} />
              ))}
            </div>
          </div>

          {/* lens config summary */}
          <button onClick={() => setLensOpen(!lensOpen)} style={{ width: '100%', textAlign: 'start', border: '1px solid var(--border-hair)', background: 'var(--cream-100)', borderRadius: 'var(--radius-md)', padding: '14px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: '0.06em', color: 'var(--text-strong)', display: 'block' }}>LENS CONFIGURATION</span>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Index {index}{ar ? ' · Anti-reflective' : ''}{blue ? ' · Blue-light' : ''}{photo ? ' · Photochromic' : ''} · +₪{lensPrice}</span>
            </span>
            <Icon name={lensOpen ? 'chevron-up' : 'chevron-down'} size={18} />
          </button>
          {lensOpen && (
            <div style={{ border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-md)', padding: '4px 16px 16px', marginBottom: 18, background: 'var(--white)' }}>
              <LensRow label="Lens index"><div style={{ width: 130 }}><Select value={index} onChange={(e) => setIndex(e.target.value)} size="sm" options={[{ value: '1.5', label: '1.5 · Standard' }, { value: '1.6', label: '1.6 · Thin +₪120' }, { value: '1.67', label: '1.67 +₪260' }, { value: '1.74', label: '1.74 +₪420' }]} /></div></LensRow>
              <LensRow label="Anti-reflective coating (+₪90)"><Checkbox checked={ar} onChange={setAr} /></LensRow>
              <LensRow label="Blue-light filter (+₪70)"><Checkbox checked={blue} onChange={setBlue} /></LensRow>
              <LensRow label="Photochromic (+₪180)"><Checkbox checked={photo} onChange={setPhoto} /></LensRow>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, color: 'var(--text-muted)', fontSize: 12.5 }}>
                <Icon name="info" size={15} /> Out-of-range prescriptions are fitted in-store, not blocked.
              </div>
            </div>
          )}

          {/* actions */}
          <div style={{ display: 'flex', gap: 12 }}>
            <Button variant="primary" size="lg" block onClick={() => addToCart({ ...p, amount: total })} startIcon={<Icon name="shopping-bag" size={18} color="currentColor" />}>Add to Cart · ₪{total}</Button>
            {p.tryMirror && <Button variant="solid" size="lg" onClick={() => setConsent(true)} startIcon={<Icon name="camera" size={18} color="currentColor" />}>Try Mirror</Button>}
          </div>
          <div style={{ display: 'flex', gap: 22, marginTop: 18, fontSize: 13, color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}><Icon name="truck" size={16} /> Free shipping over ₪400</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}><Icon name="store" size={16} /> Reserve & fit in-store</span>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ marginTop: 56, maxWidth: 780 }}>
        <Tabs tabs={[{ value: 'desc', label: 'Description' }, { value: 'specs', label: 'Specs' }, { value: 'reviews', label: 'Reviews' }]} value={tab} onChange={setTab} />
        <div style={{ padding: '24px 2px', fontSize: 15, lineHeight: 1.7, color: 'var(--text-body)' }}>
          {tab === 'desc' && <p style={{ margin: 0 }}>The {p.name} pairs a timeless {p.shape.toLowerCase()} shape with OPTIZONE's precision fitting. Hand-finished {p.material.toLowerCase()}, sprung hinges, and adjustable nose pads for all-day comfort. Compatible with single-vision, progressive, and blue-light lenses.</p>}
          {tab === 'specs' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 40px', maxWidth: 520 }}>
              {[['Brand', p.brand], ['Shape', p.shape], ['Material', p.material], ['Gender', p.gender], ['Lens width', '50 mm'], ['Bridge', '21 mm'], ['Temple', '145 mm'], ['Try Mirror', p.tryMirror ? 'Yes' : 'No']].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-hair)', paddingBottom: 8 }}>
                  <span style={{ color: 'var(--text-muted)' }}>{k}</span><span style={{ color: 'var(--text-strong)', fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
          )}
          {tab === 'reviews' && <p style={{ margin: 0, color: 'var(--text-muted)' }}>{p.reviews} verified reviews · {p.rating}/5 average. Reviews module (Phase 2) with moderation.</p>}
        </div>
      </div>

      {/* CONSENT DIALOG */}
      <Dialog open={consent} onClose={() => setConsent(false)} eyebrow="Try Mirror" title="Camera & try-on consent"
        footer={<>
          <Button variant="ghost" onClick={() => setConsent(false)}>Not now</Button>
          <Button variant="primary" onClick={() => { setConsent(false); setMirror(true); }}>Allow camera</Button>
        </>}>
        OPTIZONE's Try Mirror uses your camera on-device to place frames on your face in real time.
        No image or biometric data is stored (Privacy Protection Law, IS 5568). You can also upload a photo instead.
      </Dialog>

      {/* TRY MIRROR MOCK */}
      {mirror && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'var(--pine-950)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', color: 'var(--cream-100)' }}>
            <span style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.14em', textTransform: 'uppercase', fontSize: 13, color: 'var(--amber-500)' }}>Try Mirror · Live</span>
            <IconButton variant="ghost" onClick={() => setMirror(false)} style={{ color: 'var(--cream-100)' }}><Icon name="x" color="var(--cream-100)" /></IconButton>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <div style={{ width: 'min(70vh,520px)', aspectRatio: '3/4', borderRadius: 'var(--radius-lg)', background: 'linear-gradient(160deg,var(--pine-700),var(--pine-900))', border: '1px solid var(--border-on-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
              <Icon name="user" size={160} color="rgba(255,255,255,0.12)" />
              <div className="oz-scan-line" />
              <div style={{ position: 'absolute', top: '34%', animation: 'oz-float 4s var(--ease-in-out) infinite' }}><GlassesMark size={70} color={p.colors[img % p.colors.length]} /></div>
              <span style={{ position: 'absolute', bottom: 16, fontSize: 12, color: 'var(--pine-200)', letterSpacing: '0.06em' }}>Camera preview (mock)</span>
            </div>
          </div>
          <div style={{ padding: '18px 24px 28px', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 10 }}>
              {p.colors.map((c, i) => <button key={i} onClick={() => setImg(i)} style={{ width: 36, height: 36, borderRadius: 999, background: c, border: `2px solid ${img === i ? 'var(--amber-500)' : 'transparent'}`, cursor: 'pointer' }} />)}
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <Button variant="outline" style={{ color: 'var(--cream-100)', borderColor: 'var(--cream-100)' }} startIcon={<Icon name="camera" size={18} color="currentColor" />}>Capture look</Button>
              <Button variant="primary" onClick={() => { addToCart({ ...p, amount: total }); setMirror(false); }} startIcon={<Icon name="shopping-bag" size={18} color="currentColor" />}>Add to Cart</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { Product });
