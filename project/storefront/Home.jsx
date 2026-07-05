// OPTIZONE storefront — Home page.
const { Button, Icon, DiamondRule, ProductCard, Card, GlassesMark } = window.OPTIZONEDesignSystem_ded4a5;

function ServiceTile({ s }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '22px 20px', background: 'var(--surface-card)', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-md)' }}>
      <span style={{ width: 44, height: 44, borderRadius: 'var(--radius-sm)', background: 'var(--pine-50)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={s.icon} size={22} color="var(--pine-700)" />
      </span>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, letterSpacing: '0.02em', color: 'var(--text-strong)' }}>{s.title}</div>
      <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>{s.desc}</div>
    </div>
  );
}

function Home({ go, addToCart }) {
  const D = window.OZ_DATA;
  const { Reveal } = window;
  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });
  const rise = (d) => ({ animation: 'oz-fade-up var(--dur-slow) var(--ease-out) both', animationDelay: `${d}ms` });
  return (
    <div>
      {/* HERO */}
      <section style={{ background: 'var(--pine-700)', color: 'var(--cream-100)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '84px 28px 92px', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 40, alignItems: 'center' }}>
          <div>
            <span style={{ ...rise(40), display: 'inline-block', fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--amber-500)' }}>New · 2026 Collection</span>
            <h1 style={{ ...rise(120), fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 60, lineHeight: 1.02, letterSpacing: '0.01em', color: 'var(--cream-100)', margin: '18px 0 0' }}>
              See the world<br />in <span style={{ color: 'var(--amber-500)' }}>style</span>.
            </h1>
            <p style={{ ...rise(220), fontSize: 18, lineHeight: 1.6, color: 'var(--pine-100)', maxWidth: 440, marginTop: 20 }}>
              Handcrafted frames, expertly fitted. Try any pair on with Try Mirror before you buy — no card needed to reserve.
            </p>
            <div style={{ ...rise(320), display: 'flex', gap: 14, marginTop: 30 }}>
              <Button variant="primary" size="lg" onClick={() => go('catalog')}>Shop Frames</Button>
              <Button variant="outline" size="lg" onClick={() => go('booking')} style={{ color: 'var(--cream-100)', borderColor: 'var(--cream-100)' }} startIcon={<Icon name="calendar" size={18} color="currentColor" />}>Book an Exam</Button>
            </div>
            <div style={{ ...rise(420), marginTop: 40, maxWidth: 320 }}>
              <DiamondRule label="Trusted since 2009" color="var(--amber-500)" />
            </div>
          </div>
          {/* hero visual — mark motif on darker panel */}
          <div style={{ ...rise(240), position: 'relative', aspectRatio: '4/3', borderRadius: 'var(--radius-lg)', background: 'linear-gradient(160deg,var(--pine-600),var(--pine-800))', border: '1px solid var(--border-on-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-dark)' }}>
            <div style={{ animation: 'oz-float 5s var(--ease-in-out) infinite' }}><GlassesMark size={120} color="var(--amber-500)" /></div>
            <span style={{ position: 'absolute', bottom: 18, insetInlineEnd: 18, display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(18,36,26,0.7)', color: 'var(--cream-100)', padding: '8px 14px', borderRadius: 999, fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', backdropFilter: 'blur(4px)' }}>
              <Icon name="camera" size={14} color="var(--amber-500)" /> Try Mirror ready
            </span>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '64px 28px 8px' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--amber-700)' }}>What we do</span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 32, color: 'var(--text-strong)', margin: '10px 0 0' }}>Complete eye care, beautifully done</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }}>
          {D.services.map((s, i) => <Reveal key={s.title} delay={i * 70}><ServiceTile s={s} /></Reveal>)}
        </div>
      </section>

      {/* FEATURED */}
      <section style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '56px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--amber-700)' }}>Bestsellers</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 32, color: 'var(--text-strong)', margin: '8px 0 0' }}>Frames of the season</h2>
          </div>
          <Button variant="link" onClick={() => go('catalog')} endIcon={<Icon name="arrow-right" size={16} color="currentColor" />}>View all</Button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
          {D.products.slice(0, 4).map((p, i) => (
            <Reveal key={p.id} delay={i * 80}>
              <ProductCard brand={p.brand} name={p.name} amount={p.amount} original={p.original}
                rating={p.rating} reviewCount={p.reviews} badge={p.badge} tryMirror={p.tryMirror} colors={p.colors}
                onQuickAdd={() => addToCart(p)} style={{ cursor: 'pointer' }} onClick={() => go('product', p)} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* TRY MIRROR BANNER */}
      <section style={{ maxWidth: 'var(--container-max)', margin: '0 auto 72px', padding: '0 28px' }}>
        <Reveal>
        <div style={{ background: 'var(--pine-800)', borderRadius: 'var(--radius-xl)', padding: '48px 52px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32, position: 'relative', overflow: 'hidden' }}>
          <div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--amber-500)' }}>Try Mirror</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 34, color: 'var(--cream-100)', margin: '12px 0 10px' }}>Try them on from home</h2>
            <p style={{ fontSize: 16, color: 'var(--pine-100)', maxWidth: 440, lineHeight: 1.6 }}>Live, on-device virtual try-on. Compare frames side by side, save your looks, and share to WhatsApp. Nothing is stored.</p>
            <div style={{ marginTop: 22 }}><Button variant="primary" size="lg" onClick={() => go('catalog')}>Start Try Mirror</Button></div>
          </div>
          <GlassesMark size={96} color="var(--amber-500)" style={{ flex: '0 0 auto', opacity: 0.9 }} />
        </div>
        </Reveal>
      </section>
    </div>
  );
}

Object.assign(window, { Home });
