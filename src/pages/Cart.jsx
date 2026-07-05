import React from 'react'
import { Button, Icon, QuantityStepper, Price, Card, Input, GlassesMark } from '../ds/index.js'
import { useLang } from '../i18n/index.jsx'

export function Cart({ cart, setCart, go }) {
  const t = useLang().t.cart
  const subtotal = cart.reduce((s, i) => s + i.amount * i.qty, 0)
  const shipping = subtotal > 400 || subtotal === 0 ? 0 : 30
  const setQty = (idx, qty) => setCart(cart.map((c, i) => (i === idx ? { ...c, qty } : c)))
  const remove = (idx) => setCart(cart.filter((_, i) => i !== idx))

  if (cart.length === 0) {
    return (
      <div style={{ maxWidth: 560, margin: '80px auto 120px', textAlign: 'center', padding: '0 28px' }}>
        <GlassesMark size={64} color="var(--pine-300)" />
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 30, color: 'var(--text-strong)', margin: '20px 0 8px' }}>{t.emptyH1}</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: 22 }}>{t.emptyP}</p>
        <Button variant="primary" size="lg" onClick={() => go('catalog')}>{t.shop}</Button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '36px 28px 80px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 34, color: 'var(--text-strong)', margin: '0 0 24px' }}>{t.title}</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 36, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {cart.map((it, idx) => (
            <div key={idx} style={{ display: 'flex', gap: 18, padding: 16, background: 'var(--surface-card)', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-md)', alignItems: 'center' }}>
              <div style={{ width: 92, height: 92, borderRadius: 'var(--radius-sm)', background: 'var(--cream-300)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                <GlassesMark size={26} color={(it.colors && it.colors[0]) || 'var(--pine-500)'} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-accent)' }}>{it.brand}</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-strong)', margin: '3px 0 6px' }}>{it.name}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{t.lineNote}</div>
              </div>
              <QuantityStepper value={it.qty} onChange={(q) => setQty(idx, q)} size="sm" />
              <div style={{ width: 90, textAlign: 'end' }}><Price amount={it.amount * it.qty} /></div>
              <button onClick={() => remove(idx)} aria-label="remove" style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-faint)' }}><Icon name="trash-2" size={18} /></button>
            </div>
          ))}
        </div>

        <Card padding="lg" style={{ position: 'sticky', top: 96 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-strong)', marginBottom: 16 }}>{t.summary}</div>
          {[[t.subtotal, `₪${subtotal.toLocaleString('he-IL')}`], [t.shipping, shipping ? `₪${shipping}` : t.free]].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', fontSize: 14, color: 'var(--text-body)' }}><span>{k}</span><span>{v}</span></div>
          ))}
          <div style={{ display: 'flex', gap: 8, margin: '12px 0' }}>
            <Input placeholder={t.promo} containerStyle={{ flex: 1 }} size="sm" />
            <Button variant="outline" size="sm">{t.apply}</Button>
          </div>
          <div style={{ borderTop: '1px solid var(--border-hair)', margin: '8px 0 14px' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, letterSpacing: '0.06em', color: 'var(--text-strong)' }}>{t.total}</span>
            <Price amount={subtotal + shipping} size="lg" />
          </div>
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Button variant="primary" block size="lg" onClick={() => go('checkout')}>{t.checkout}</Button>
            <Button variant="ghost" block onClick={() => go('booking')}>{t.reserve}</Button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginTop: 14, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-faint)', fontFamily: 'var(--font-display)', flexWrap: 'wrap' }}>
            {t.pays.map((pm) => <span key={pm}>{pm}</span>)}
          </div>
        </Card>
      </div>
    </div>
  )
}
