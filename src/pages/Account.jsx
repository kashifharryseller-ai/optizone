import React, { useEffect, useState } from 'react'
import { Button, Input, Icon, Tabs, Card, DiamondRule, GlassesMark, Price, ProductCard } from '../ds/index.js'
import { useLang } from '../i18n/index.jsx'
import { useContent } from '../content/ContentProvider.jsx'
import { useAuth } from '../auth/AuthProvider.jsx'
import { api } from '../api.js'
import { useCountUp } from '../lib/anim.jsx'

function StatCard({ label, value, icon, text }) {
  const n = useCountUp(typeof value === 'number' ? value : 0)
  return (
    <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-md)', padding: '18px 20px' }}>
      <span style={{ display: 'inline-flex', width: 34, height: 34, borderRadius: 'var(--radius-sm)', background: 'var(--pine-50)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
        <Icon name={icon} size={18} color="var(--pine-700)" />
      </span>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 30, color: 'var(--text-strong)' }}>{text ?? n}</div>
      <div style={{ fontSize: 12.5, color: 'var(--text-muted)', letterSpacing: '0.02em' }}>{label}</div>
    </div>
  )
}

function ErrorNote({ children }) {
  if (!children) return null
  return <div style={{ fontSize: 13, color: 'var(--danger)', background: '#F6E3DE', borderRadius: 'var(--radius-sm)', padding: '9px 12px' }}>{children}</div>
}

// Official multi-colour Google "G" mark.
function GoogleG({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  )
}

// --- Login / Register / Forgot / Reset ---------------------------------------
function AuthCard({ t }) {
  const { login, register, resetSignIn, oauthError, clearOauthError } = useAuth()
  const [mode, setMode] = useState('login') // login | register | forgot | reset
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', code: '' })
  const [err, setErr] = useState('')
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const googleSignIn = () => { window.location.href = '/api/auth/google' }
  const rf = t.reset || {}
  const go = (m) => { setMode(m); setErr(''); setMsg('') }

  const submit = async (e) => {
    e && e.preventDefault()
    setBusy(true); setErr(''); setMsg('')
    try {
      if (mode === 'login') await login(form.email, form.password)
      else if (mode === 'register') await register(form)
      else if (mode === 'forgot') {
        await api.forgotPassword(form.email)
        setMode('reset'); setMsg(rf.sentNote)
      } else if (mode === 'reset') {
        const session = await api.resetPassword(form.email, form.code, form.password)
        resetSignIn(session) // signs in with the new password
      }
    } catch (e2) { setErr(e2.message) } finally { setBusy(false) }
  }

  const heading =
    mode === 'login' ? t.welcome : mode === 'register' ? t.registerTitle : mode === 'forgot' ? rf.forgotTitle : rf.resetTitle
  const sub =
    mode === 'login' ? t.signinSub : mode === 'register' ? t.registerSub : mode === 'forgot' ? rf.forgotSub : rf.resetSub

  return (
    <div style={{ maxWidth: 440, margin: '60px auto 110px', padding: '0 28px' }}>
      <form onSubmit={submit} className="oz-route" style={{ background: 'var(--surface-card)', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: '38px 34px' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <GlassesMark size={46} color="var(--pine-700)" />
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 26, color: 'var(--text-strong)', margin: '14px 0 4px' }}>{heading}</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0 }}>{sub}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {mode === 'register' && <Input placeholder={t.name} value={form.name} onChange={set('name')} autoComplete="name" />}
          {(mode === 'login' || mode === 'register' || mode === 'forgot') && (
            <Input type="email" placeholder={t.email} value={form.email} onChange={set('email')} autoComplete="email" />
          )}
          {mode === 'register' && <Input placeholder={t.phone} value={form.phone} onChange={set('phone')} autoComplete="tel" />}
          {mode === 'reset' && (
            <Input placeholder={rf.code} value={form.code} onChange={set('code')} inputMode="numeric" maxLength={6} style={{ letterSpacing: '0.4em', fontSize: 18 }} />
          )}
          {(mode === 'login' || mode === 'register' || mode === 'reset') && (
            <Input type="password" placeholder={mode === 'reset' ? rf.newPassword : t.password} value={form.password} onChange={set('password')}
              helper={mode === 'login' ? undefined : t.pwHint} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
          )}

          {/* Forgot-password link, on the login screen only */}
          {mode === 'login' && (
            <div style={{ textAlign: 'end', marginTop: -4 }}>
              <a onClick={() => go('forgot')} style={{ fontSize: 13, color: 'var(--amber-700)', cursor: 'pointer' }}>{rf.forgotLink}</a>
            </div>
          )}

          <ErrorNote>{err || (mode === 'login' ? oauthError : '')}</ErrorNote>
          {msg && <div style={{ fontSize: 13, color: 'var(--success)', background: '#E4F0E7', borderRadius: 'var(--radius-sm)', padding: '9px 12px' }}>{msg}</div>}

          <Button variant="primary" block size="lg" onClick={submit} disabled={busy}>
            {busy ? '…'
              : mode === 'login' ? t.signin
              : mode === 'register' ? t.signup
              : mode === 'forgot' ? rf.sendCode
              : rf.resetCta}
          </Button>
        </div>

        {(mode === 'login' || mode === 'register') && (
          <>
            <div style={{ margin: '22px 0' }}><DiamondRule label={t.or} /></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button type="button" onClick={() => { clearOauthError(); googleSignIn() }}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, height: 46, border: '1px solid var(--border-strong)', background: 'var(--white)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 14.5, fontWeight: 600, color: 'var(--text-strong)' }}>
                <GoogleG /> {t.google}
              </button>
              <Button variant="outline" block onClick={() => go(mode === 'login' ? 'register' : 'login')}
                startIcon={<Icon name={mode === 'login' ? 'user-plus' : 'user'} size={17} color="currentColor" />}>
                {mode === 'login' ? t.toRegister : t.toLogin}
              </Button>
            </div>
          </>
        )}

        {(mode === 'forgot' || mode === 'reset') && (
          <div style={{ textAlign: 'center', marginTop: 18 }}>
            <a onClick={() => go('login')} style={{ fontSize: 13, color: 'var(--text-muted)', cursor: 'pointer' }}>{rf.backToLogin}</a>
          </div>
        )}

        <p style={{ fontSize: 12, color: 'var(--text-faint)', textAlign: 'center', marginTop: 18, lineHeight: 1.6 }}>{t.protected}</p>
      </form>
    </div>
  )
}

// --- Dashboard ----------------------------------------------------------------
function Dashboard({ go, openCatalog, tab, setTab, t }) {
  const { user, logout, wishlist, toggleWishlist, updateProfile } = useAuth()
  const { content } = useContent()
  const { A, L, lang } = useLang()
  const [orders, setOrders] = useState(null)
  const [bookings, setBookings] = useState(null)

  useEffect(() => {
    let alive = true
    api.myOrders().then((o) => alive && setOrders(o)).catch(() => alive && setOrders([]))
    api.myBookings().then((b) => alive && setBookings(b)).catch(() => alive && setBookings([]))
    return () => { alive = false }
  }, [])

  const spent = (orders || []).reduce((s, o) => s + (Number(o.total) || 0), 0)
  const statusColor = (s) => (s === 'Collected' || s === 'Completed' || s === 'Confirmed' ? 'var(--success)' : s === 'Shipped' ? 'var(--info)' : s === 'Cancelled' ? 'var(--danger)' : 'var(--amber-700)')
  const initials = (user.name || '?').split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase()
  const wishProducts = (content.products || []).filter((p) => wishlist.includes(p.id))
  const fmtDate = (iso) => { try { return new Date(iso).toLocaleDateString(lang === 'he' ? 'he-IL' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) } catch { return '' } }

  // Settings state
  const [profile, setProfile] = useState({ name: user.name, phone: user.phone || '' })
  const [pMsg, setPMsg] = useState('')
  const [pw, setPw] = useState({ current: '', next: '' })
  const [pwMsg, setPwMsg] = useState('')
  const [pwErr, setPwErr] = useState('')

  const saveProfile = async () => {
    setPMsg('')
    try { await updateProfile(profile); setPMsg(t.saved); setTimeout(() => setPMsg(''), 2500) } catch (e) { setPMsg(e.message) }
  }
  const savePw = async () => {
    setPwErr(''); setPwMsg('')
    try { await api.changePassword(pw.current, pw.next); setPw({ current: '', next: '' }); setPwMsg(t.pwChanged); setTimeout(() => setPwMsg(''), 3000) } catch (e) { setPwErr(e.message) }
  }

  return (
    <div>
      <div style={{ background: 'var(--pine-700)', color: 'var(--cream-100)' }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '40px 28px', display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
          <span style={{ width: 58, height: 58, borderRadius: 999, background: 'var(--pine-600)', border: '1px solid var(--border-on-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--amber-500)' }}>{initials}</span>
          <div style={{ flex: 1, minWidth: 200 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--amber-500)' }}>{t.myAccount}</span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 30, color: 'var(--cream-100)', margin: '4px 0 0' }}>{t.hello(user.name.split(' ')[0])}</h1>
          </div>
          <Button variant="outline" size="sm" onClick={logout} style={{ color: 'var(--cream-100)', borderColor: 'var(--cream-100)' }}>{t.signout}</Button>
        </div>
      </div>

      <div className="oz-route" style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '30px 28px 80px' }}>
        <div className="oz-g4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 30 }}>
          <StatCard label={t.stats.orders} value={(orders || []).length} icon="package" />
          <StatCard label={t.stats.appts} value={(bookings || []).length} icon="calendar" />
          <StatCard label={t.stats.wishlist} value={wishlist.length} icon="heart" />
          <StatCard label={t.stats.spent} text={'₪' + spent.toLocaleString('he-IL')} icon="credit-card" />
        </div>

        <Tabs
          tabs={[{ value: 'orders', label: t.tabs.orders }, { value: 'appts', label: t.tabs.appts }, { value: 'wishlist', label: t.tabs.wishlist }, { value: 'settings', label: t.tabs.settings }]}
          value={tab} onChange={setTab}
        />

        <div style={{ padding: '26px 0' }}>
          {tab === 'orders' && (
            orders === null ? <p style={{ color: 'var(--text-muted)' }}>…</p> :
            orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                <p style={{ marginBottom: 18 }}>{t.emptyOrders}</p>
                <Button variant="primary" onClick={() => openCatalog('eyeglasses')}>{t.startShopping}</Button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {orders.map((o, i) => (
                  <div key={o.id} style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '18px 20px', background: 'var(--surface-card)', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-md)', animation: 'oz-fade-up var(--dur-base) var(--ease-out) both', animationDelay: `${i * 70}ms`, flexWrap: 'wrap' }}>
                    <span style={{ width: 46, height: 46, borderRadius: 'var(--radius-sm)', background: 'var(--cream-300)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="package" size={20} color="var(--pine-700)" /></span>
                    <div style={{ flex: 1, minWidth: 180 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: '0.06em', color: 'var(--text-strong)' }}>{o.id}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: statusColor(o.status) }}>● {A(o.status)}</span>
                      </div>
                      <div style={{ fontSize: 13.5, color: 'var(--text-muted)', marginTop: 3 }}>
                        {(o.items || []).map((it) => `${it.qty}× ${it.brand} ${it.name}`).join(' · ')} · {fmtDate(o.createdAt)}
                      </div>
                    </div>
                    <Price amount={o.total} size="md" />
                  </div>
                ))}
              </div>
            )
          )}

          {tab === 'appts' && (
            bookings === null ? <p style={{ color: 'var(--text-muted)' }}>…</p> :
            bookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                <p style={{ marginBottom: 18 }}>{t.emptyAppts}</p>
                <Button variant="primary" onClick={() => go('booking')}>{t.bookNow}</Button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {bookings.map((b, i) => (
                  <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '18px 20px', background: 'var(--surface-card)', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-md)', animation: 'oz-fade-up var(--dur-base) var(--ease-out) both', animationDelay: `${i * 70}ms`, flexWrap: 'wrap' }}>
                    <span style={{ width: 46, height: 46, borderRadius: 'var(--radius-sm)', background: 'var(--cream-300)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="calendar" size={20} color="var(--pine-700)" /></span>
                    <div style={{ flex: 1, minWidth: 180 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: '0.06em', color: 'var(--text-strong)' }}>{b.service}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: statusColor(b.status) }}>● {A(b.status)}</span>
                      </div>
                      <div style={{ fontSize: 13.5, color: 'var(--text-muted)', marginTop: 3 }}>{b.branch} · {b.day} {b.slot}</div>
                    </div>
                    <span style={{ fontSize: 12.5, color: 'var(--text-faint)' }}>{b.id}</span>
                  </div>
                ))}
              </div>
            )
          )}

          {tab === 'wishlist' && (
            wishProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                <p style={{ marginBottom: 18 }}>{t.emptyWishlist}</p>
                <Button variant="primary" onClick={() => openCatalog('eyeglasses')}>{t.browse}</Button>
              </div>
            ) : (
              <div className="oz-g3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
                {wishProducts.map((p) => (
                  <div key={p.id} style={{ position: 'relative' }}>
                    <ProductCard image={p.image || undefined} brand={p.brand} name={p.name} amount={p.amount} original={p.original || undefined}
                      rating={p.rating} reviewCount={p.reviews} badge={p.badge ? { variant: p.badge.variant, label: L(p.badge.label) } : undefined}
                      tryMirror={p.tryMirror} colors={p.colors} style={{ cursor: 'pointer' }} onClick={() => go('product', p)} />
                    <button onClick={() => toggleWishlist(p.id)} aria-label="remove from wishlist"
                      style={{ position: 'absolute', top: 10, insetInlineEnd: 10, width: 34, height: 34, borderRadius: 999, border: 'none', cursor: 'pointer', background: 'var(--white)', boxShadow: 'var(--shadow-sm)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name="heart" size={17} color="var(--danger)" fill="var(--danger)" />
                    </button>
                  </div>
                ))}
              </div>
            )
          )}

          {tab === 'settings' && (
            <div className="oz-g2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start', maxWidth: 900 }}>
              <Card padding="lg">
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-strong)', marginBottom: 16 }}>{t.profile}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <Input label={t.name} value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                  <Input label={t.email} value={user.email} disabled style={{ color: 'var(--text-faint)' }} />
                  <Input label={t.phone} value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
                  {pMsg && <span style={{ fontSize: 13, color: pMsg === t.saved ? 'var(--success)' : 'var(--danger)' }}>{pMsg}</span>}
                  <Button variant="primary" onClick={saveProfile}>{t.save}</Button>
                </div>
              </Card>
              <Card padding="lg">
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-strong)', marginBottom: 16 }}>{t.changePw}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <Input type="password" label={t.currentPw} value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} autoComplete="current-password" />
                  <Input type="password" label={t.newPw} value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} helper={t.pwHint} autoComplete="new-password" />
                  <ErrorNote>{pwErr}</ErrorNote>
                  {pwMsg && <span style={{ fontSize: 13, color: 'var(--success)' }}>{pwMsg}</span>}
                  <Button variant="solid" onClick={savePw}>{t.update}</Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function Account({ go, openCatalog, tab, setTab }) {
  const { t: root } = useLang()
  const { user, checking } = useAuth()
  const t = root.account
  if (checking) return <div style={{ padding: '80px 0', textAlign: 'center', color: 'var(--text-muted)' }}>…</div>
  return user ? <Dashboard go={go} openCatalog={openCatalog} tab={tab} setTab={setTab} t={t} /> : <AuthCard t={t} />
}
