import React, { useState, useEffect } from 'react'
import { Button, Input, Select, Icon, DiamondRule, Price, GlassesMark } from '../ds/index.js'
import { useLang } from '../i18n/index.jsx'
import { useContent } from '../content/ContentProvider.jsx'
import { useAuth } from '../auth/AuthProvider.jsx'
import { AddressAutocomplete } from '../components/AddressAutocomplete.jsx'
import { api } from '../api.js'

function Step({ n, label, active, done }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: active || done ? 1 : 0.5 }}>
      <span style={{ width: 30, height: 30, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 13, background: done ? 'var(--success)' : active ? 'var(--pine-700)' : 'var(--surface-sunken)', color: done || active ? 'var(--cream-100)' : 'var(--text-muted)', transition: 'all var(--dur-base) var(--ease-out)' }}>
        {done ? <Icon name="check" size={15} color="currentColor" /> : n}
      </span>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: 12.5, letterSpacing: '0.06em', textTransform: 'uppercase', color: active ? 'var(--text-strong)' : 'var(--text-muted)' }}>{label}</span>
    </div>
  )
}

// disabled + badge: renders a greyed, non-selectable option (e.g. the card
// method with a "Coming Soon" tag) — visible in the list but never active.
function PayOption({ id, sel, onSel, icon, title, sub, disabled = false, badge }) {
  const active = !disabled && sel === id
  return (
    <button
      onClick={() => !disabled && onSel(id)}
      disabled={disabled}
      aria-disabled={disabled}
      style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%', textAlign: 'start', padding: '14px 16px', borderRadius: 'var(--radius-md)', border: `1.5px solid ${active ? 'var(--pine-700)' : 'var(--border-hair)'}`, background: active ? 'var(--pine-50)' : 'var(--white)', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.55 : 1, transition: 'all var(--dur-fast) var(--ease-out)' }}
    >
      <span style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: 'var(--surface-sunken)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}><Icon name={icon} size={20} color="var(--pine-700)" /></span>
      <span style={{ flex: 1 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 600, color: 'var(--text-strong)' }}>
          {title}
          {badge && <span style={{ fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--pine-950)', background: 'var(--amber-500)', borderRadius: 'var(--radius-pill)', padding: '3px 9px' }}>{badge}</span>}
        </span>
        <span style={{ display: 'block', fontSize: 13, color: 'var(--text-muted)' }}>{sub}</span>
      </span>
      <span style={{ width: 20, height: 20, borderRadius: 999, border: `2px solid ${active ? 'var(--pine-700)' : 'var(--border-strong)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {active && <span style={{ width: 10, height: 10, borderRadius: 999, background: 'var(--pine-700)' }} />}
      </span>
    </button>
  )
}

function SectionTitle({ children }) {
  return <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-strong)' }}>{children}</div>
}

export function Checkout({ cart, subtotal, go, onComplete }) {
  const { t: root, L, lang } = useLang()
  const { content } = useContent()
  const settings = content.settings || {}
  const branches = content.stores || []
  const threshold = settings.shippingThreshold ?? 400
  const fee = settings.shippingFee ?? 30
  const t = root.checkout
  const locale = lang === 'he' ? 'he-IL' : 'en-IL'
  const { user } = useAuth()
  const [step, setStep] = useState(0)
  // Cash on Delivery is the only active method (card is "Coming Soon").
  const [pay, setPay] = useState('cod')
  const [ship, setShip] = useState('delivery')
  // Google Places verification state for the shipping address.
  const [addrResolved, setAddrResolved] = useState(null)   // normalized geocoded address
  const [addrMode, setAddrMode] = useState('loading')      // 'ready' | 'fallback' | 'loading'
  const [addrErr, setAddrErr] = useState('')
  const [orderId, setOrderId] = useState('')               // real id returned by the server
  const [placing, setPlacing] = useState(false)            // order submit in-flight
  const [orderErr, setOrderErr] = useState('')             // server/network failure message
  const [contactErr, setContactErr] = useState('')         // contact-step validation
  const [pickupBranch, setPickupBranch] = useState('')     // chosen collection branch
  // Prefill contact details from the signed-in customer's profile.
  const [contact, setContact] = useState(() => {
    const parts = (user?.name || '').split(/\s+/)
    return {
      firstName: parts[0] || '',
      lastName: parts.slice(1).join(' ') || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: '',
      apt: '',
      city: '',
      postal: '',
    }
  })
  useEffect(() => { window.scrollTo({ top: 0 }) }, [step])
  const shipping = ship === 'pickup' || subtotal > threshold ? 0 : fee
  const total = subtotal + shipping

  // On selection, auto-populate street / city / postal from the geocoded place.
  const onAddrResolved = (addr) => {
    setAddrResolved(addr)
    if (addr) {
      setAddrErr('')
      setContact((c) => ({
        ...c,
        address: addr.street || addr.formatted || c.address,
        city: addr.city || c.city,
        postal: addr.postal || c.postal,
      }))
    }
  }

  // Gate "Continue to payment": with Places active a verified pick is required;
  // in fallback mode (no key / script blocked) a non-empty address is required.
  const toPayment = () => {
    if (ship === 'delivery') {
      if (addrMode === 'ready' && !addrResolved) { setAddrErr(t.addrError); return }
      if (!contact.address.trim()) { setAddrErr(t.addrManualError); return }
    }
    setAddrErr('')
    setStep(2)
  }

  // Basic contact validation before leaving the first step.
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const toShipping = () => {
    const okName = `${contact.firstName} ${contact.lastName}`.trim().length > 1
    const okEmail = EMAIL_RE.test(contact.email.trim())
    const okPhone = contact.phone.replace(/\D/g, '').length >= 7
    if (!okName || !okEmail || !okPhone) { setContactErr(t.contactError); return }
    setContactErr('')
    setStep(1)
  }

  const placeOrder = async () => {
    if (placing) return                 // guard against double-submit
    setPlacing(true)
    setOrderErr('')
    const street = contact.apt ? `${contact.address}, ${contact.apt}` : contact.address
    try {
      // Only advance to the confirmation screen once the server accepts the
      // order — and show the REAL order id it returns.
      const r = await api.createOrder({
        customer: {
          name: `${contact.firstName} ${contact.lastName}`.trim(),
          email: contact.email, phone: contact.phone,
          address: street, city: contact.city, postal: contact.postal,
          geo: addrResolved ? { formatted: addrResolved.formatted, placeId: addrResolved.placeId, lat: addrResolved.lat, lng: addrResolved.lng } : undefined,
        },
        addressVerified: !!addrResolved,
        branch: ship === 'pickup' ? pickupBranch : undefined,
        items: cart.map((it) => ({ id: it.id, name: it.name, brand: it.brand, amount: it.amount, qty: it.qty, customSize: it.customSize || undefined })),
        subtotal, shipping, total, payment: pay, fulfilment: ship,
      })
      setOrderId(r?.id || '')
      setStep(3)
    } catch (e) {
      setOrderErr(e?.message || t.orderError)
    } finally {
      setPlacing(false)
    }
  }

  if (step === 3) {
    return (
      <div className="oz-route" style={{ maxWidth: 560, margin: '64px auto 110px', padding: '0 28px', textAlign: 'center' }}>
        <span style={{ position: 'relative', width: 76, height: 76, borderRadius: 999, background: 'var(--pine-50)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
          <span style={{ position: 'absolute', inset: 0, borderRadius: 999, border: '2px solid var(--pine-400)', animation: 'oz-ring 1.6s var(--ease-out) infinite' }} />
          <Icon name="check" size={36} color="var(--pine-700)" />
        </span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 32, color: 'var(--text-strong)', margin: '22px 0 6px' }}>{t.confirmedH1}</h1>
        <p style={{ fontSize: 16, color: 'var(--text-body)', lineHeight: 1.6 }}>{t.confirmedP(total.toLocaleString(locale), orderId)}<br />{t.confirmedNote}</p>
        <div style={{ margin: '22px auto', maxWidth: 280 }}><DiamondRule label={t.thankYou} /></div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 8, flexWrap: 'wrap' }}>
          <Button variant="outline" onClick={() => go('account')}>{t.trackOrder}</Button>
          <Button variant="primary" onClick={() => { onComplete(); go('home') }}>{t.continueShopping}</Button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '32px 28px 80px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 32, color: 'var(--text-strong)', margin: '0 0 22px' }}>{t.title}</h1>
      <div style={{ display: 'flex', gap: 28, marginBottom: 30, flexWrap: 'wrap' }}>
        {t.steps.map((s, i) => <Step key={s} n={i + 1} label={s} active={step === i} done={step > i} />)}
      </div>

      <div className="oz-sidebar" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 36, alignItems: 'start' }}>
        <div key={step} className="oz-route" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {step === 0 && (
            <>
              <SectionTitle>{t.contactTitle}</SectionTitle>
              <div className="oz-g2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Input placeholder={t.firstName} value={contact.firstName} onChange={(e) => setContact({ ...contact, firstName: e.target.value })} />
                <Input placeholder={t.lastName} value={contact.lastName} onChange={(e) => setContact({ ...contact, lastName: e.target.value })} />
              </div>
              <Input placeholder={t.email} type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
              <Input placeholder={t.phone} value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} />
              {contactErr && <div role="alert" style={{ fontSize: 13, color: 'var(--danger)' }}>{contactErr}</div>}
              <Button variant="primary" size="lg" onClick={toShipping} endIcon={<Icon name="arrow-right" size={18} color="currentColor" />}>{t.toShipping}</Button>
            </>
          )}

          {step === 1 && (
            <>
              <SectionTitle>{t.deliveryTitle}</SectionTitle>
              <PayOption id="delivery" sel={ship} onSel={setShip} icon="truck" title={t.homeDelivery} sub={subtotal > threshold ? t.homeFree : t.homePaid} />
              <PayOption id="pickup" sel={ship} onSel={setShip} icon="store" title={t.pickup} sub={t.pickupSub} />
              {ship === 'delivery' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 4 }}>
                  <SectionTitle>{t.addrTitle}</SectionTitle>
                  <div className="oz-split21" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14 }}>
                    {/* Live Google Places suggestions; falls back to a plain input
                        when no Maps key is configured or the script can't load. */}
                    <AddressAutocomplete
                      mapsKey={settings.mapsKey || ''}
                      lang={lang}
                      value={contact.address}
                      onChange={(v) => setContact((c) => ({ ...c, address: v }))}
                      onResolved={onAddrResolved}
                      onStatus={setAddrMode}
                      resolved={!!addrResolved}
                      placeholder={addrMode === 'ready' ? t.addrSearch : t.street}
                      verifiedLabel={t.addrVerifiedMsg}
                    />
                    <Input placeholder={t.apt} value={contact.apt} onChange={(e) => setContact({ ...contact, apt: e.target.value })} />
                  </div>
                  <div className="oz-split21" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14 }}>
                    <Input placeholder={t.city} value={contact.city} onChange={(e) => setContact({ ...contact, city: e.target.value })} />
                    <Input placeholder={t.postal} value={contact.postal} onChange={(e) => setContact({ ...contact, postal: e.target.value })} />
                  </div>
                  {addrErr && (
                    <span role="alert" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13, color: 'var(--danger)' }}>
                      <Icon name="info" size={15} color="var(--danger)" /> {addrErr}
                    </span>
                  )}
                </div>
              )}
              {ship === 'pickup' && (
                <div style={{ marginTop: 4 }}>
                  <Select
                    value={pickupBranch}
                    onChange={(e) => setPickupBranch(e.target.value)}
                    options={[{ value: '', label: t.selectBranch }, ...branches.map((b) => ({ value: b.name, label: 'OPTIZONE ' + L({ en: b.name, he: b.he }) }))]}
                  />
                </div>
              )}
              <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
                <Button variant="ghost" onClick={() => setStep(0)}>{t.back}</Button>
                <Button variant="primary" size="lg" block onClick={toPayment} endIcon={<Icon name="arrow-right" size={18} color="currentColor" />}>{t.toPayment}</Button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <SectionTitle>{t.payTitle}</SectionTitle>
              {/* Exactly two methods: Cash on Delivery (active, default) and
                  Card (visible but disabled — "Coming Soon", no card fields). */}
              <PayOption id="cod" sel={pay} onSel={setPay} icon="package" title={t.cod} sub={t.codSub} />
              <PayOption id="card" sel={pay} onSel={setPay} icon="credit-card" title={t.card} sub={t.cardSoonNote} disabled badge={t.comingSoon} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: 'var(--text-muted)', marginTop: 4 }}>
                <Icon name="lock" size={14} /> {t.secure}
              </div>
              {orderErr && (
                <span role="alert" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13, color: 'var(--danger)' }}>
                  <Icon name="info" size={15} color="var(--danger)" /> {orderErr}
                </span>
              )}
              <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
                <Button variant="ghost" onClick={() => setStep(1)} disabled={placing}>{t.back}</Button>
                <Button variant="primary" size="lg" block onClick={placeOrder} disabled={placing} startIcon={<Icon name="check" size={17} color="currentColor" />}>{placing ? t.placing : t.placeOrder(total.toLocaleString(locale))}</Button>
              </div>
            </>
          )}
        </div>

        {/* summary */}
        <div style={{ position: 'sticky', top: 96, background: 'var(--surface-card)', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-lg)', padding: 22, boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-strong)', marginBottom: 16 }}>{t.summary}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 14 }}>
            {cart.map((it, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <span style={{ width: 44, height: 44, borderRadius: 'var(--radius-sm)', background: 'var(--cream-300)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto', overflow: 'hidden' }}>
                  {it.image
                    ? <img src={it.image} alt={it.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    : <GlassesMark size={18} color={(it.colors && it.colors[0]) || 'var(--pine-500)'} />}
                </span>
                <span style={{ flex: 1, fontSize: 13.5 }}>
                  <b style={{ color: 'var(--text-strong)' }}>{it.name}</b><br />
                  <span style={{ color: 'var(--text-muted)' }}>{t.qty(it.qty)}</span>
                  {it.customSize && <><br /><span style={{ color: 'var(--text-accent)', fontSize: 12.5 }}>{root.cart.customSize(it.customSize)}</span></>}
                </span>
                <span style={{ fontSize: 13.5, fontWeight: 600 }}>₪{(it.amount * it.qty).toLocaleString(locale)}</span>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid var(--border-hair)', paddingTop: 12 }}>
            {[[t.subtotal, `₪${subtotal.toLocaleString(locale)}`], [t.shipping, shipping ? `₪${shipping}` : t.free]].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 14, color: 'var(--text-body)' }}><span>{k}</span><span>{v}</span></div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid var(--border-hair)', marginTop: 8, paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, letterSpacing: '0.06em', color: 'var(--text-strong)' }}>{t.total}</span>
            <Price amount={total} size="lg" />
          </div>
        </div>
      </div>
    </div>
  )
}
