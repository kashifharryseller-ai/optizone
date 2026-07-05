import React, { useState } from 'react'
import { Button, Input, Icon, Tabs, Badge, Card, DiamondRule, GlassesMark, Price, ProductCard } from '../ds/index.js'
import { useLang } from '../i18n/index.jsx'
import { useContent } from '../content/ContentProvider.jsx'
import { useCountUp } from '../lib/anim.jsx'

// Sample logged-in-customer data (a signed-in shopper's own history). This is
// demo content for the account view; real orders live in the admin panel.
const DEMO = {
  orders: [
    { id: 'OZ-24817', date: { en: '18 Jun 2026', he: '18 ביוני 2026' }, status: 'In lab', items: { en: 'Ray-Ban Round Metal + 1.6 AR', he: 'ריי-באן Round Metal + 1.6 AR' }, total: 600 },
    { id: 'OZ-24603', date: { en: '2 May 2026', he: '2 במאי 2026' }, status: 'Collected', items: { en: 'Persol PO3092 Havana', he: 'Persol PO3092 Havana' }, total: 720 },
  ],
  prescriptions: [
    { name: { en: 'Distance · Dr. Levi', he: 'למרחק · ד״ר לוי' }, date: { en: '12 Mar 2026', he: '12 במרץ 2026' }, od: '-2.25 / -0.50 × 180', os: '-2.00 / -0.75 × 165', pd: '63', expires: { en: 'Mar 2028', he: 'מרץ 2028' } },
  ],
  savedLooks: [
    { frame: 'Prada PR 17WS', color: '#1A1A17' },
    { frame: 'Versace VE4361', color: '#E08A2A' },
    { frame: 'Ray-Ban RB3447', color: '#22402F' },
  ],
}

function StatCard({ label, value, icon }) {
  const n = useCountUp(value)
  return (
    <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-md)', padding: '18px 20px' }}>
      <span style={{ display: 'inline-flex', width: 34, height: 34, borderRadius: 'var(--radius-sm)', background: 'var(--pine-50)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
        <Icon name={icon} size={18} color="var(--pine-700)" />
      </span>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 30, color: 'var(--text-strong)' }}>{n}</div>
      <div style={{ fontSize: 12.5, color: 'var(--text-muted)', letterSpacing: '0.02em' }}>{label}</div>
    </div>
  )
}

/** A brand-styled "Continue with Google" button. In production, wire it to the
 *  Google Identity SDK and verify the returned ID token on your backend. */
function GoogleButton({ onLogin, label }) {
  return (
    <button
      onClick={() => onLogin()}
      style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, height: 44, border: '1px solid var(--border-strong)', background: 'var(--white)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--text-strong)' }}
    >
      <span style={{ width: 18, height: 18, borderRadius: 999, border: '2px solid var(--pine-400)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--pine-700)' }}>G</span>
      {label}
    </button>
  )
}

function Login({ onLogin, t }) {
  const [mode, setMode] = useState('password')
  return (
    <div style={{ maxWidth: 440, margin: '60px auto 110px', padding: '0 28px' }}>
      <div className="oz-route" style={{ background: 'var(--surface-card)', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: '38px 34px' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <GlassesMark size={46} color="var(--pine-700)" />
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 26, color: 'var(--text-strong)', margin: '14px 0 4px' }}>{t.welcome}</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0 }}>{t.signinSub}</p>
        </div>
        <div style={{ display: 'flex', gap: 4, background: 'var(--surface-sunken)', borderRadius: 'var(--radius-pill)', padding: 4, marginBottom: 22 }}>
          {[['password', t.password], ['otp', t.sms]].map(([k, l]) => (
            <button key={k} onClick={() => setMode(k)} style={{ flex: 1, border: 'none', cursor: 'pointer', borderRadius: 'var(--radius-pill)', padding: '9px 0', fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', background: mode === k ? 'var(--pine-700)' : 'transparent', color: mode === k ? 'var(--cream-100)' : 'var(--text-muted)' }}>{l}</button>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input placeholder={mode === 'otp' ? t.phone : t.email} />
          {mode === 'password' && <Input type="password" placeholder={t.pw} />}
          <Button variant="primary" block size="lg" onClick={onLogin}>{mode === 'otp' ? t.sendCode : t.signin}</Button>
        </div>
        <div style={{ margin: '22px 0' }}><DiamondRule label={t.or} /></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <GoogleButton onLogin={() => onLogin()} label={t.google} />
          <Button variant="outline" block onClick={onLogin} startIcon={<Icon name="user-plus" size={17} color="currentColor" />}>{t.create}</Button>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-faint)', textAlign: 'center', marginTop: 18, lineHeight: 1.6 }}>{t.protected}</p>
      </div>
    </div>
  )
}

function Dashboard({ go, t, L, A }) {
  const { content } = useContent()
  const [tab, setTab] = useState('orders')
  const statusColor = (s) => (s === 'Collected' ? 'var(--success)' : s === 'Shipped' ? 'var(--info)' : 'var(--amber-700)')

  return (
    <div>
      <div style={{ background: 'var(--pine-700)', color: 'var(--cream-100)' }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '40px 28px', display: 'flex', alignItems: 'center', gap: 18 }}>
          <span style={{ width: 58, height: 58, borderRadius: 999, background: 'var(--pine-600)', border: '1px solid var(--border-on-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--amber-500)' }}>ML</span>
          <div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--amber-500)' }}>{t.myAccount}</span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 30, color: 'var(--cream-100)', margin: '4px 0 0' }}>{t.hello}</h1>
          </div>
        </div>
      </div>

      <div className="oz-route" style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '30px 28px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 30 }}>
          <StatCard label={t.stats.orders} value={2} icon="package" />
          <StatCard label={t.stats.rx} value={1} icon="file-text" />
          <StatCard label={t.stats.looks} value={3} icon="camera" />
          <StatCard label={t.stats.appts} value={1} icon="calendar" />
        </div>

        <Tabs tabs={[{ value: 'orders', label: t.tabs.orders }, { value: 'rx', label: t.tabs.rx }, { value: 'looks', label: t.tabs.looks }, { value: 'wishlist', label: t.tabs.wishlist }]} value={tab} onChange={setTab} />

        <div style={{ padding: '26px 0' }}>
          {tab === 'orders' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {DEMO.orders.map((o, i) => (
                <div key={o.id} style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '18px 20px', background: 'var(--surface-card)', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-md)', animation: 'oz-fade-up var(--dur-base) var(--ease-out) both', animationDelay: `${i * 70}ms`, flexWrap: 'wrap' }}>
                  <span style={{ width: 46, height: 46, borderRadius: 'var(--radius-sm)', background: 'var(--cream-300)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="package" size={20} color="var(--pine-700)" /></span>
                  <div style={{ flex: 1, minWidth: 160 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: '0.06em', color: 'var(--text-strong)' }}>{o.id}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: statusColor(o.status) }}>● {A(o.status)}</span>
                    </div>
                    <div style={{ fontSize: 13.5, color: 'var(--text-muted)', marginTop: 3 }}>{L(o.items)} · {L(o.date)}</div>
                  </div>
                  <Price amount={o.total} size="md" />
                  <Button variant="outline" size="sm">{t.track}</Button>
                </div>
              ))}
            </div>
          )}

          {tab === 'rx' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {DEMO.prescriptions.map((r) => (
                <div key={r.name.en} style={{ padding: '20px 22px', background: 'var(--surface-card)', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, gap: 10, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--text-strong)' }}>{L(r.name)}</span>
                    <Badge variant="new">{t.valid(L(r.expires))}</Badge>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, fontSize: 13.5 }}>
                    {[[t.od, r.od], [t.os, r.os], [t.pd, r.pd + ' mm']].map(([k, v]) => (
                      <div key={k} style={{ background: 'var(--surface-sunken)', borderRadius: 'var(--radius-sm)', padding: '10px 12px' }}>
                        <div style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{k}</div>
                        <div style={{ fontWeight: 600, color: 'var(--text-strong)', marginTop: 3, direction: 'ltr' }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
                    <Button variant="primary" size="sm" onClick={() => go('catalog')}>{t.useOnOrder}</Button>
                    <Button variant="ghost" size="sm">{t.downloadPdf}</Button>
                  </div>
                </div>
              ))}
              <button onClick={() => go('catalog')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '16px', border: '1.5px dashed var(--border-strong)', borderRadius: 'var(--radius-md)', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 14 }}><Icon name="plus" size={16} /> {t.addRx}</button>
            </div>
          )}

          {tab === 'looks' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }}>
              {DEMO.savedLooks.map((l, i) => (
                <div key={i} style={{ background: 'var(--surface-card)', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-md)', overflow: 'hidden', animation: 'oz-scale-in var(--dur-base) var(--ease-out) both', animationDelay: `${i * 80}ms` }}>
                  <div style={{ aspectRatio: '4/3', background: 'linear-gradient(160deg,var(--pine-600),var(--pine-800))', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <Icon name="user" size={72} color="rgba(255,255,255,0.14)" />
                    <span style={{ position: 'absolute', top: '38%' }}><GlassesMark size={44} color={l.color} /></span>
                  </div>
                  <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-strong)' }}>{l.frame}</span>
                    <Icon name="share-2" size={16} color="var(--text-muted)" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'wishlist' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
              {(content.products || []).slice(2, 5).map((p) => (
                <ProductCard key={p.id} brand={p.brand} name={p.name} amount={p.amount} original={p.original} rating={p.rating} reviewCount={p.reviews} badge={p.badge ? { variant: p.badge.variant, label: L(p.badge.label) } : undefined} tryMirror={p.tryMirror} colors={p.colors} style={{ cursor: 'pointer' }} onClick={() => go('product', p)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function Account({ loggedIn, onLogin, go }) {
  const { t: root, L, A } = useLang()
  const t = root.account
  return loggedIn ? <Dashboard go={go} t={t} L={L} A={A} /> : <Login onLogin={onLogin} t={t} />
}
