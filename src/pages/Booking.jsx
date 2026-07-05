import React, { useState } from 'react'
import { Button, Icon, Tag, Input, DiamondRule, Card } from '../ds/index.js'
import { useLang } from '../i18n/index.jsx'
import { useContent } from '../content/ContentProvider.jsx'
import { useAuth } from '../auth/AuthProvider.jsx'
import { api } from '../api.js'

function Field({ label, children }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>{label}</div>
      {children}
    </div>
  )
}

export function Booking({ go }) {
  const { t: root, L, lang } = useLang()
  const { content } = useContent()
  const bookingServices = content.bookingServices || []
  const branches = content.stores || []
  const slots = content.slots || []
  const t = root.booking
  const [service, setService] = useState(0)
  const [branch, setBranch] = useState(0)
  const [slot, setSlot] = useState(slots[1] || slots[0] || '10:30')
  const { user } = useAuth()
  const [done, setDone] = useState(false)
  const [day, setDay] = useState(1)
  const [name, setName] = useState(user?.name || '')
  const [phone, setPhone] = useState(user?.phone || '')

  const bDisp = (b) => (b ? `OPTIZONE ${lang === 'he' ? b.he || b.name : b.name} · ${b.addr || ''}` : '')
  const branchLabel = (b) => `OPTIZONE ${b?.name || ''} · ${b?.addr || ''}`.trim()
  const confirm = () => {
    api.createBooking({
      service: (bookingServices[service] || {}).en || '',
      branch: branchLabel(branches[branch]),
      day: (root.booking.days || [])[day] || '',
      slot, name, phone,
    }).catch(() => { /* still show confirmation */ })
    setDone(true)
  }

  if (done) {
    return (
      <div style={{ maxWidth: 620, margin: '60px auto 100px', padding: '0 28px', textAlign: 'center' }}>
        <span style={{ width: 64, height: 64, borderRadius: 999, background: 'var(--pine-50)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
          <Icon name="check" size={30} color="var(--pine-700)" />
        </span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 34, color: 'var(--text-strong)', margin: '20px 0 8px' }}>{t.doneH1}</h1>
        <p style={{ fontSize: 16, color: 'var(--text-body)', lineHeight: 1.6 }}>{L(bookingServices[service])} · {bDisp(branches[branch])}<br />{t.days[day]} · {slot}</p>
        <div style={{ margin: '20px auto', maxWidth: 260 }}><DiamondRule /></div>
        <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>{t.doneNote}</p>
        <div style={{ marginTop: 26, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button variant="outline" onClick={() => setDone(false)}>{t.edit}</Button>
          <Button variant="primary" onClick={() => go('home')}>{t.backHome}</Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ background: 'var(--pine-700)', color: 'var(--cream-100)' }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '46px 28px' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--amber-500)' }}>{t.eyebrow}</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 40, color: 'var(--cream-100)', margin: '10px 0 0' }}>{t.h1}</h1>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '36px 28px 80px', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 40, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <Field label={t.s1}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {bookingServices.map((s, i) => <Tag key={s.en} selected={service === i} onClick={() => setService(i)}>{L(s)}</Tag>)}
            </div>
          </Field>
          <Field label={t.s2}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {branches.map((b, i) => (
                <button key={b.name} onClick={() => setBranch(i)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', textAlign: 'start', borderRadius: 'var(--radius-md)', border: `1.5px solid ${branch === i ? 'var(--pine-700)' : 'var(--border-hair)'}`, background: branch === i ? 'var(--pine-50)' : 'var(--white)', cursor: 'pointer' }}>
                  <Icon name="map-pin" size={18} color="var(--pine-700)" />
                  <span style={{ fontSize: 15, color: 'var(--text-strong)' }}>OPTIZONE {lang === 'he' ? b.he || b.name : b.name} · {b.addr}</span>
                </button>
              ))}
            </div>
          </Field>
          <Field label={t.s3}>
            <div style={{ display: 'flex', gap: 10 }}>
              {t.days.map((d, i) => (
                <button key={i} onClick={() => setDay(i)} style={{ flex: 1, padding: '12px 0', borderRadius: 'var(--radius-sm)', border: `1.5px solid ${day === i ? 'var(--amber-600)' : 'var(--border-hair)'}`, background: day === i ? 'var(--amber-50)' : 'var(--white)', cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: '0.04em', color: 'var(--text-strong)' }}>{d}</button>
              ))}
            </div>
          </Field>
          <Field label={t.s4}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
              {slots.map((s) => (
                <button key={s} onClick={() => setSlot(s)} style={{ padding: '12px 0', borderRadius: 'var(--radius-sm)', border: `1.5px solid ${slot === s ? 'var(--pine-700)' : 'var(--border-hair)'}`, background: slot === s ? 'var(--pine-700)' : 'var(--white)', color: slot === s ? 'var(--cream-100)' : 'var(--text-body)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600 }}>{s}</button>
              ))}
            </div>
          </Field>
        </div>

        {/* summary */}
        <Card padding="lg" style={{ position: 'sticky', top: 96 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-strong)', marginBottom: 16 }}>{t.summary}</div>
          {[[t.rowService, L(bookingServices[service])], [t.rowBranch, bDisp(branches[branch])], [t.rowDate, t.days[day]], [t.rowTime, slot]].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border-hair)' }}>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{k}</span>
              <span style={{ fontSize: 14, color: 'var(--text-strong)', fontWeight: 600, textAlign: 'end' }}>{v}</span>
            </div>
          ))}
          <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Input placeholder={t.fullName} value={name} onChange={(e) => setName(e.target.value)} />
            <Input placeholder={t.phone} value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div style={{ marginTop: 16 }}><Button variant="primary" block size="lg" onClick={confirm}>{t.confirm}</Button></div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 12, textAlign: 'center' }}>{t.noPay}</p>
        </Card>
      </div>
    </div>
  )
}
