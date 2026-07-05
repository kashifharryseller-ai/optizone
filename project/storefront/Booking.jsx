// OPTIZONE storefront — Appointment booking.
const { Button, Icon, Tag, Select, Input, DiamondRule, Card } = window.OPTIZONEDesignSystem_ded4a5;

function Field({ label, children }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>{label}</div>
      {children}
    </div>
  );
}

function Booking({ go }) {
  const D = window.OZ_DATA;
  const [service, setService] = React.useState(D.bookingServices[0]);
  const [branch, setBranch] = React.useState(D.branches[0]);
  const [slot, setSlot] = React.useState('10:30');
  const [done, setDone] = React.useState(false);
  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });

  const days = ['Sun 6', 'Mon 7', 'Tue 8', 'Wed 9', 'Thu 10'];
  const [day, setDay] = React.useState('Mon 7');

  if (done) {
    return (
      <div style={{ maxWidth: 620, margin: '60px auto 100px', padding: '0 28px', textAlign: 'center' }}>
        <span style={{ width: 64, height: 64, borderRadius: 999, background: 'var(--pine-50)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
          <Icon name="check" size={30} color="var(--pine-700)" />
        </span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 34, color: 'var(--text-strong)', margin: '20px 0 8px' }}>You're booked</h1>
        <p style={{ fontSize: 16, color: 'var(--text-body)', lineHeight: 1.6 }}>{service} · {branch}<br />{day} · {slot}</p>
        <div style={{ margin: '20px auto', maxWidth: 260 }}><DiamondRule /></div>
        <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>A confirmation and reminders will be sent via WhatsApp & email. Reschedule anytime from the link.</p>
        <div style={{ marginTop: 26, display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Button variant="outline" onClick={() => setDone(false)}>Edit booking</Button>
          <Button variant="primary" onClick={() => go('home')}>Back to home</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ background: 'var(--pine-700)', color: 'var(--cream-100)' }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '46px 28px' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--amber-500)' }}>Book an appointment</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 40, color: 'var(--cream-100)', margin: '10px 0 0' }}>Eye care, on your schedule</h1>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '36px 28px 80px', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 40, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <Field label="1 · Service">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {D.bookingServices.map((s) => <Tag key={s} selected={service === s} onClick={() => setService(s)}>{s}</Tag>)}
            </div>
          </Field>
          <Field label="2 · Branch">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {D.branches.map((b) => (
                <button key={b} onClick={() => setBranch(b)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', textAlign: 'start', borderRadius: 'var(--radius-md)', border: `1.5px solid ${branch === b ? 'var(--pine-700)' : 'var(--border-hair)'}`, background: branch === b ? 'var(--pine-50)' : 'var(--white)', cursor: 'pointer' }}>
                  <Icon name="map-pin" size={18} color="var(--pine-700)" />
                  <span style={{ fontSize: 15, color: 'var(--text-strong)' }}>{b}</span>
                </button>
              ))}
            </div>
          </Field>
          <Field label="3 · Date">
            <div style={{ display: 'flex', gap: 10 }}>
              {days.map((d) => (
                <button key={d} onClick={() => setDay(d)} style={{ flex: 1, padding: '12px 0', borderRadius: 'var(--radius-sm)', border: `1.5px solid ${day === d ? 'var(--amber-600)' : 'var(--border-hair)'}`, background: day === d ? 'var(--amber-50)' : 'var(--white)', cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: '0.04em', color: 'var(--text-strong)' }}>{d}</button>
              ))}
            </div>
          </Field>
          <Field label="4 · Time">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
              {D.slots.map((t) => (
                <button key={t} onClick={() => setSlot(t)} style={{ padding: '12px 0', borderRadius: 'var(--radius-sm)', border: `1.5px solid ${slot === t ? 'var(--pine-700)' : 'var(--border-hair)'}`, background: slot === t ? 'var(--pine-700)' : 'var(--white)', color: slot === t ? 'var(--cream-100)' : 'var(--text-body)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600 }}>{t}</button>
              ))}
            </div>
          </Field>
        </div>

        {/* summary */}
        <Card padding="lg" style={{ position: 'sticky', top: 96 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-strong)', marginBottom: 16 }}>Your appointment</div>
          {[['Service', service], ['Branch', branch], ['Date', day], ['Time', slot]].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border-hair)' }}>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{k}</span>
              <span style={{ fontSize: 14, color: 'var(--text-strong)', fontWeight: 600, textAlign: 'end' }}>{v}</span>
            </div>
          ))}
          <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Input placeholder="Full name" />
            <Input placeholder="Phone · 05X-XXX-XXXX" />
          </div>
          <div style={{ marginTop: 16 }}><Button variant="primary" block size="lg" onClick={() => setDone(true)}>Confirm booking</Button></div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 12, textAlign: 'center' }}>No payment needed. Free reschedule & cancellation.</p>
        </Card>
      </div>
    </div>
  );
}

Object.assign(window, { Booking });
