// OPTIZONE storefront — checkout: contact → shipping → payment → confirmation (FR-31/32/33/36-39).
const { Button, Input, Select, Icon, DiamondRule, Price, GlassesMark } = window.OPTIZONEDesignSystem_ded4a5;

function Step({ n, label, active, done }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: active || done ? 1 : 0.5 }}>
      <span style={{ width: 30, height: 30, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 13, background: done ? 'var(--success)' : active ? 'var(--pine-700)' : 'var(--surface-sunken)', color: done || active ? 'var(--cream-100)' : 'var(--text-muted)', transition: 'all var(--dur-base) var(--ease-out)' }}>
        {done ? <Icon name="check" size={15} color="currentColor" /> : n}
      </span>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: 12.5, letterSpacing: '0.06em', textTransform: 'uppercase', color: active ? 'var(--text-strong)' : 'var(--text-muted)' }}>{label}</span>
    </div>
  );
}

function PayOption({ id, sel, onSel, icon, title, sub }) {
  const active = sel === id;
  return (
    <button onClick={() => onSel(id)} style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%', textAlign: 'start', padding: '14px 16px', borderRadius: 'var(--radius-md)', border: `1.5px solid ${active ? 'var(--pine-700)' : 'var(--border-hair)'}`, background: active ? 'var(--pine-50)' : 'var(--white)', cursor: 'pointer', transition: 'all var(--dur-fast) var(--ease-out)' }}>
      <span style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: 'var(--surface-sunken)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}><Icon name={icon} size={20} color="var(--pine-700)" /></span>
      <span style={{ flex: 1 }}>
        <span style={{ display: 'block', fontSize: 15, fontWeight: 600, color: 'var(--text-strong)' }}>{title}</span>
        <span style={{ display: 'block', fontSize: 13, color: 'var(--text-muted)' }}>{sub}</span>
      </span>
      <span style={{ width: 20, height: 20, borderRadius: 999, border: `2px solid ${active ? 'var(--pine-700)' : 'var(--border-strong)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {active && <span style={{ width: 10, height: 10, borderRadius: 999, background: 'var(--pine-700)' }} />}
      </span>
    </button>
  );
}

function Checkout({ cart, subtotal, go, onComplete }) {
  const [step, setStep] = React.useState(0); // 0 contact, 1 shipping, 2 payment, 3 done
  const [pay, setPay] = React.useState('card');
  const [ship, setShip] = React.useState('delivery');
  React.useEffect(() => { window.lucide && window.lucide.createIcons(); window.scrollTo({ top: 0 }); }, [step]);
  const shipping = ship === 'pickup' || subtotal > 400 ? 0 : 30;
  const total = subtotal + shipping;

  if (step === 3) {
    return (
      <div className="oz-route" style={{ maxWidth: 560, margin: '64px auto 110px', padding: '0 28px', textAlign: 'center' }}>
        <span style={{ position: 'relative', width: 76, height: 76, borderRadius: 999, background: 'var(--pine-50)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
          <span style={{ position: 'absolute', inset: 0, borderRadius: 999, border: '2px solid var(--pine-400)', animation: 'oz-ring 1.6s var(--ease-out) infinite' }} />
          <Icon name="check" size={36} color="var(--pine-700)" />
        </span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 32, color: 'var(--text-strong)', margin: '22px 0 6px' }}>Order confirmed</h1>
        <p style={{ fontSize: 16, color: 'var(--text-body)', lineHeight: 1.6 }}>Order <b>#OZ-24902</b> · ₪{total.toLocaleString('he-IL')}<br />A tax invoice (חשבונית מס) and tracking link are on the way via email & WhatsApp.</p>
        <div style={{ margin: '22px auto', maxWidth: 280 }}><DiamondRule label="Thank you" /></div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 8 }}>
          <Button variant="outline" onClick={() => go('account')}>Track order</Button>
          <Button variant="primary" onClick={() => { onComplete(); go('home'); }}>Continue shopping</Button>
        </div>
      </div>
    );
  }

  const steps = ['Contact', 'Shipping', 'Payment'];

  return (
    <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '32px 28px 80px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 32, color: 'var(--text-strong)', margin: '0 0 22px' }}>Checkout</h1>
      <div style={{ display: 'flex', gap: 28, marginBottom: 30, flexWrap: 'wrap' }}>
        {steps.map((s, i) => <Step key={s} n={i + 1} label={s} active={step === i} done={step > i} />)}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 36, alignItems: 'start' }}>
        <div key={step} className="oz-route" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {step === 0 && (
            <React.Fragment>
              <SectionTitle>Contact details</SectionTitle>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Input placeholder="First name" defaultValue="Maya" />
                <Input placeholder="Last name" defaultValue="Levi" />
              </div>
              <Input placeholder="Email" defaultValue="maya@example.co.il" />
              <Input placeholder="Phone · 05X-XXX-XXXX" defaultValue="058-644-2303" />
              <Button variant="primary" size="lg" onClick={() => setStep(1)} endIcon={<Icon name="arrow-right" size={18} color="currentColor" />}>Continue to shipping</Button>
            </React.Fragment>
          )}

          {step === 1 && (
            <React.Fragment>
              <SectionTitle>Delivery method</SectionTitle>
              <PayOption id="delivery" sel={ship} onSel={setShip} icon="truck" title="Home delivery" sub={subtotal > 400 ? 'Free · 2–4 business days' : '₪30 · 2–4 business days'} />
              <PayOption id="pickup" sel={ship} onSel={setShip} icon="store" title="Collect in branch" sub="Free · ready in 1–2 days" />
              {ship === 'delivery' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 4 }}>
                  <SectionTitle>Shipping address</SectionTitle>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14 }}>
                    <Input placeholder="Street & number" defaultValue="השלים 12" />
                    <Input placeholder="Apt / entrance" />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14 }}>
                    <Input placeholder="City" defaultValue="נתניה" />
                    <Input placeholder="Postal code" defaultValue="4237512" />
                  </div>
                </div>
              )}
              {ship === 'pickup' && (
                <div style={{ marginTop: 4 }}>
                  <Select options={window.OZ_DATA.branches.map((b) => ({ value: b, label: b }))} />
                </div>
              )}
              <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
                <Button variant="ghost" onClick={() => setStep(0)}>Back</Button>
                <Button variant="primary" size="lg" block onClick={() => setStep(2)} endIcon={<Icon name="arrow-right" size={18} color="currentColor" />}>Continue to payment</Button>
              </div>
            </React.Fragment>
          )}

          {step === 2 && (
            <React.Fragment>
              <SectionTitle>Payment method</SectionTitle>
              <PayOption id="card" sel={pay} onSel={setPay} icon="credit-card" title="Credit / debit card" sub="Visa · Mastercard · secured gateway" />
              <PayOption id="bit" sel={pay} onSel={setPay} icon="smartphone" title="Bit" sub="Pay from your phone" />
              <PayOption id="installments" sel={pay} onSel={setPay} icon="layers" title="תשלומים · Installments" sub="Split into up to 12 payments" />
              {pay === 'card' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 4 }}>
                  <Input placeholder="Card number" defaultValue="4580 •••• •••• 1234" />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <Input placeholder="MM / YY" defaultValue="09 / 28" />
                    <Input placeholder="CVV" defaultValue="•••" />
                  </div>
                </div>
              )}
              {pay === 'installments' && (
                <div style={{ marginTop: 4 }}>
                  <Select options={[3, 6, 12].map((n) => ({ value: String(n), label: `${n} payments · ₪${Math.round(total / n)}/mo` }))} />
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: 'var(--text-muted)', marginTop: 4 }}>
                <Icon name="lock" size={14} /> No card data touches our servers · PCI-DSS via gateway
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
                <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                <Button variant="primary" size="lg" block onClick={() => setStep(3)} startIcon={<Icon name="lock" size={17} color="currentColor" />}>Pay ₪{total.toLocaleString('he-IL')}</Button>
              </div>
            </React.Fragment>
          )}
        </div>

        {/* summary */}
        <div style={{ position: 'sticky', top: 96, background: 'var(--surface-card)', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-lg)', padding: 22, boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-strong)', marginBottom: 16 }}>Order summary</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 14 }}>
            {cart.map((it, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <span style={{ width: 44, height: 44, borderRadius: 'var(--radius-sm)', background: 'var(--cream-300)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}><GlassesMark size={18} color={(it.colors && it.colors[0]) || 'var(--pine-500)'} /></span>
                <span style={{ flex: 1, fontSize: 13.5 }}><b style={{ color: 'var(--text-strong)' }}>{it.name}</b><br /><span style={{ color: 'var(--text-muted)' }}>Qty {it.qty}</span></span>
                <span style={{ fontSize: 13.5, fontWeight: 600 }}>₪{(it.amount * it.qty).toLocaleString('he-IL')}</span>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid var(--border-hair)', paddingTop: 12 }}>
            {[['Subtotal', `₪${subtotal.toLocaleString('he-IL')}`], ['Shipping', shipping ? `₪${shipping}` : 'Free']].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 14, color: 'var(--text-body)' }}><span>{k}</span><span>{v}</span></div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid var(--border-hair)', marginTop: 8, paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, letterSpacing: '0.06em', color: 'var(--text-strong)' }}>TOTAL</span>
            <Price amount={total} size="lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ children }) {
  return <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-strong)' }}>{children}</div>;
}

Object.assign(window, { Checkout });
