import React from 'react'
import { Button, Icon, DiamondRule, ProductCard, GlassesMark } from '../ds/index.js'
import { OZ_DATA } from '../data/catalog.js'
import { useLang } from '../i18n/index.jsx'
import { Reveal } from '../lib/anim.jsx'
import { ImageSlot } from '../components/ImageSlot.jsx'

function ServiceTile({ s, he }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '22px 20px', background: 'var(--surface-card)', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-md)' }}>
      <span style={{ width: 44, height: 44, borderRadius: 'var(--radius-sm)', background: 'var(--pine-50)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={s.icon} size={22} color="var(--pine-700)" />
      </span>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, letterSpacing: '0.02em', color: 'var(--text-strong)' }}>{he && s.he ? s.he : s.title}</div>
      <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>{he && s.hedesc ? s.hedesc : s.desc}</div>
    </div>
  )
}

export function Home({ go, addToCart }) {
  const { lang, L } = useLang()
  const t = useLang().t.home
  const rise = (d) => ({ animation: 'oz-fade-up var(--dur-slow) var(--ease-out) both', animationDelay: `${d}ms` })
  const he = lang === 'he'
  const badgeOf = (p) => (p.badge ? { variant: p.badge.variant, label: L(p.badge.label) } : undefined)
  const cardLabels = { tryMirrorLabel: 'Try Mirror', quickAddLabel: useLang().t.toast.added }

  return (
    <div>
      {/* HERO */}
      <section style={{ background: 'var(--pine-700)', color: 'var(--cream-100)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '84px 28px 92px', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 40, alignItems: 'center' }}>
          <div>
            <span style={{ ...rise(40), display: 'inline-block', fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--amber-500)' }}>{t.hero_eyebrow}</span>
            <h1 style={{ ...rise(120), fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 60, lineHeight: 1.02, letterSpacing: '0.01em', color: 'var(--cream-100)', margin: '18px 0 0' }}>
              {t.hero_h1a}<br />{t.hero_h1b}<span style={{ color: 'var(--amber-500)' }}>{t.hero_h1c}</span>.
            </h1>
            <p style={{ ...rise(220), fontSize: 18, lineHeight: 1.6, color: 'var(--pine-100)', maxWidth: 440, marginTop: 20 }}>{t.hero_p}</p>
            <div style={{ ...rise(320), display: 'flex', gap: 14, marginTop: 30, flexWrap: 'wrap' }}>
              <Button variant="primary" size="lg" onClick={() => go('catalog')}>{t.cta_shop}</Button>
              <Button variant="outline" size="lg" onClick={() => go('booking')} style={{ color: 'var(--cream-100)', borderColor: 'var(--cream-100)' }} startIcon={<Icon name="calendar" size={18} color="currentColor" />}>{t.cta_book}</Button>
            </div>
            <div style={{ ...rise(420), marginTop: 40, maxWidth: 320 }}>
              <DiamondRule label={t.trusted} color="var(--amber-500)" />
            </div>
          </div>
          {/* hero visual */}
          <div style={{ ...rise(240), position: 'relative', aspectRatio: '4/3', borderRadius: 'var(--radius-lg)', background: 'linear-gradient(160deg,var(--pine-600),var(--pine-800))', border: '1px solid var(--border-on-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-dark)', overflow: 'hidden' }}>
            <ImageSlot id="hero-photo" placeholder={t.hero_slot} shape="rounded" radius={14} fit="cover" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
            <span style={{ position: 'absolute', bottom: 18, insetInlineEnd: 18, display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(18,36,26,0.7)', color: 'var(--cream-100)', padding: '8px 14px', borderRadius: 999, fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', backdropFilter: 'blur(4px)', pointerEvents: 'none' }}>
              <Icon name="camera" size={14} color="var(--amber-500)" /> {t.tryReady}
            </span>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '64px 28px 8px' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--amber-700)' }}>{t.services_eyebrow}</span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 32, color: 'var(--text-strong)', margin: '10px 0 0' }}>{t.services_h2}</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }}>
          {OZ_DATA.services.map((s, i) => <Reveal key={s.title} delay={i * 70}><ServiceTile s={s} he={he} /></Reveal>)}
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '56px 28px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--amber-700)' }}>{t.cat_eyebrow}</span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 32, color: 'var(--text-strong)', margin: '10px 0 0' }}>{t.cat_h2}</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
          {t.cats.map((c, i) => (
            <Reveal key={c.key} delay={i * 80}>
              <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                <ImageSlot id={'cat-' + c.key} placeholder={c.slot} shape="rect" fit="cover" style={{ display: 'block', width: '100%', height: 210 }} />
                <div onClick={() => go('catalog')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-strong)' }}>{c.label}</span>
                  <Icon name="arrow-right" size={16} color="var(--amber-700)" style={{ transform: he ? 'scaleX(-1)' : 'none' }} />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '56px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
          <div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--amber-700)' }}>{t.best_eyebrow}</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 32, color: 'var(--text-strong)', margin: '8px 0 0' }}>{t.best_h2}</h2>
          </div>
          <Button variant="link" onClick={() => go('catalog')} endIcon={<Icon name="arrow-right" size={16} color="currentColor" style={{ transform: he ? 'scaleX(-1)' : 'none' }} />}>{t.viewall}</Button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
          {OZ_DATA.products.slice(0, 4).map((p, i) => (
            <Reveal key={p.id} delay={i * 80}>
              <ProductCard brand={p.brand} name={p.name} amount={p.amount} original={p.original}
                rating={p.rating} reviewCount={p.reviews} badge={badgeOf(p)} tryMirror={p.tryMirror} colors={p.colors}
                onQuickAdd={() => addToCart(p)} style={{ cursor: 'pointer' }} onClick={() => go('product', p)} {...cardLabels} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* TRY MIRROR BANNER */}
      <section style={{ maxWidth: 'var(--container-max)', margin: '0 auto 72px', padding: '0 28px' }}>
        <Reveal>
          <div style={{ background: 'var(--pine-800)', borderRadius: 'var(--radius-xl)', padding: '48px 52px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32, position: 'relative', overflow: 'hidden', flexWrap: 'wrap' }}>
            <div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--amber-500)' }}>{t.try_eyebrow}</span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 34, color: 'var(--cream-100)', margin: '12px 0 10px' }}>{t.try_h2}</h2>
              <p style={{ fontSize: 16, color: 'var(--pine-100)', maxWidth: 440, lineHeight: 1.6 }}>{t.try_p}</p>
              <div style={{ marginTop: 22 }}><Button variant="primary" size="lg" onClick={() => go('catalog')}>{t.try_cta}</Button></div>
            </div>
            <GlassesMark size={96} color="var(--amber-500)" style={{ flex: '0 0 auto', opacity: 0.9 }} />
          </div>
        </Reveal>
      </section>
    </div>
  )
}
