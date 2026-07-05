// OPTIZONE storefront — Account: login + customer dashboard (FR-46/47).
const { Button, Input, Icon, Tabs, Badge, Card, DiamondRule, GlassesMark, Price } = window.OPTIZONEDesignSystem_ded4a5;

function StatCard({ label, value, icon }) {
  const n = window.useCountUp(value);
  return (
    <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-md)', padding: '18px 20px' }}>
      <span style={{ display: 'inline-flex', width: 34, height: 34, borderRadius: 'var(--radius-sm)', background: 'var(--pine-50)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
        <Icon name={icon} size={18} color="var(--pine-700)" />
      </span>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 30, color: 'var(--text-strong)' }}>{n}</div>
      <div style={{ fontSize: 12.5, color: 'var(--text-muted)', letterSpacing: '0.02em' }}>{label}</div>
    </div>
  );
}

function GoogleButton({ onLogin }) {
  const ref = React.useRef(null);
  const [rendered, setRendered] = React.useState(false);
  React.useEffect(() => {
    let tries = 0;
    const handle = (resp) => {
      // resp.credential is a Google ID token (JWT). In production, send it to your
      // backend to verify with the client SECRET — never trust it on the client alone.
      onLogin(resp);
    };
    const init = () => {
      const g = window.google;
      if (g && g.accounts && g.accounts.id && ref.current && window.OZ_GOOGLE_CLIENT_ID) {
        try {
          g.accounts.id.initialize({ client_id: window.OZ_GOOGLE_CLIENT_ID, callback: handle });
          g.accounts.id.renderButton(ref.current, { theme: 'outline', size: 'large', width: 340, text: 'continue_with', shape: 'rectangular', logo_alignment: 'center' });
          setRendered(true);
          return true;
        } catch (e) { /* origin not authorized in this sandbox */ }
      }
      return false;
    };
    if (init()) return;
    const t = setInterval(() => { tries++; if (init() || tries > 25) clearInterval(t); }, 200);
    return () => clearInterval(t);
  }, []);
  return (
    <div>
      <div ref={ref} style={{ display: 'flex', justifyContent: 'center', minHeight: rendered ? 44 : 0 }} />
      {!rendered && (
        <button onClick={() => onLogin(null)}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, height: 44, border: '1px solid var(--border-strong)', background: 'var(--white)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--text-strong)' }}>
          <span style={{ width: 18, height: 18, borderRadius: 999, border: '2px solid var(--pine-400)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--pine-700)' }}>G</span>
          Continue with Google
        </button>
      )}
    </div>
  );
}

function Login({ onLogin }) {
  const [mode, setMode] = React.useState('password'); // password | otp
  return (
    <div style={{ maxWidth: 440, margin: '60px auto 110px', padding: '0 28px' }}>
      <div className="oz-route" style={{ background: 'var(--surface-card)', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: '38px 34px' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <GlassesMark size={46} color="var(--pine-700)" />
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 26, color: 'var(--text-strong)', margin: '14px 0 4px' }}>Welcome back</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0 }}>Sign in to your OPTIZONE account</p>
        </div>
        <div style={{ display: 'flex', gap: 4, background: 'var(--surface-sunken)', borderRadius: 'var(--radius-pill)', padding: 4, marginBottom: 22 }}>
          {[['password', 'Password'], ['otp', 'SMS code']].map(([k, l]) => (
            <button key={k} onClick={() => setMode(k)} style={{ flex: 1, border: 'none', cursor: 'pointer', borderRadius: 'var(--radius-pill)', padding: '9px 0', fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', background: mode === k ? 'var(--pine-700)' : 'transparent', color: mode === k ? 'var(--cream-100)' : 'var(--text-muted)' }}>{l}</button>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input placeholder={mode === 'otp' ? 'Phone · 05X-XXX-XXXX' : 'Email address'} />
          {mode === 'password' && <Input type="password" placeholder="Password" />}
          <Button variant="primary" block size="lg" onClick={onLogin}>{mode === 'otp' ? 'Send code' : 'Sign in'}</Button>
        </div>
        <div style={{ margin: '22px 0' }}><DiamondRule label="or" /></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <GoogleButton onLogin={() => onLogin()} />
          <Button variant="outline" block onClick={onLogin} startIcon={<Icon name="user-plus" size={17} color="currentColor" />}>Create an account</Button>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-faint)', textAlign: 'center', marginTop: 18, lineHeight: 1.6 }}>Protected sign-in · rate-limited · IS 5568 accessible</p>
      </div>
    </div>
  );
}

function Dashboard({ go }) {
  const D = window.OZ_DATA;
  const [tab, setTab] = React.useState('orders');
  const statusColor = (s) => s === 'Collected' ? 'var(--success)' : s === 'Shipped' ? 'var(--info)' : 'var(--amber-700)';

  return (
    <div>
      <div style={{ background: 'var(--pine-700)', color: 'var(--cream-100)' }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '40px 28px', display: 'flex', alignItems: 'center', gap: 18 }}>
          <span style={{ width: 58, height: 58, borderRadius: 999, background: 'var(--pine-600)', border: '1px solid var(--border-on-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--amber-500)' }}>ML</span>
          <div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--amber-500)' }}>My account</span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 30, color: 'var(--cream-100)', margin: '4px 0 0' }}>Shalom, Maya</h1>
          </div>
        </div>
      </div>

      <div className="oz-route" style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '30px 28px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 30 }}>
          <StatCard label="Orders" value={2} icon="package" />
          <StatCard label="Prescriptions" value={1} icon="file-text" />
          <StatCard label="Saved looks" value={3} icon="camera" />
          <StatCard label="Appointments" value={1} icon="calendar" />
        </div>

        <Tabs tabs={[{ value: 'orders', label: 'Orders' }, { value: 'rx', label: 'Prescriptions' }, { value: 'looks', label: 'Saved Looks' }, { value: 'wishlist', label: 'Wishlist' }]} value={tab} onChange={setTab} />

        <div style={{ padding: '26px 0' }}>
          {tab === 'orders' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {D.orders.map((o, i) => (
                <div key={o.id} style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '18px 20px', background: 'var(--surface-card)', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-md)', animation: 'oz-fade-up var(--dur-base) var(--ease-out) both', animationDelay: `${i * 70}ms` }}>
                  <span style={{ width: 46, height: 46, borderRadius: 'var(--radius-sm)', background: 'var(--cream-300)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="package" size={20} color="var(--pine-700)" /></span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: '0.06em', color: 'var(--text-strong)' }}>{o.id}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: statusColor(o.status) }}>● {o.status}</span>
                    </div>
                    <div style={{ fontSize: 13.5, color: 'var(--text-muted)', marginTop: 3 }}>{o.items} · {o.date}</div>
                  </div>
                  <Price amount={o.total} size="md" />
                  <Button variant="outline" size="sm">Track</Button>
                </div>
              ))}
            </div>
          )}

          {tab === 'rx' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {D.prescriptions.map((r) => (
                <div key={r.name} style={{ padding: '20px 22px', background: 'var(--surface-card)', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--text-strong)' }}>{r.name}</span>
                    <Badge variant="new">Valid → {r.expires}</Badge>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, fontSize: 13.5 }}>
                    {[['OD (right)', r.od], ['OS (left)', r.os], ['PD', r.pd + ' mm']].map(([k, v]) => (
                      <div key={k} style={{ background: 'var(--surface-sunken)', borderRadius: 'var(--radius-sm)', padding: '10px 12px' }}>
                        <div style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{k}</div>
                        <div style={{ fontWeight: 600, color: 'var(--text-strong)', marginTop: 3 }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                    <Button variant="primary" size="sm" onClick={() => go('catalog')}>Use on new order</Button>
                    <Button variant="ghost" size="sm">Download PDF</Button>
                  </div>
                </div>
              ))}
              <button onClick={() => go('catalog')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '16px', border: '1.5px dashed var(--border-strong)', borderRadius: 'var(--radius-md)', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 14 }}><Icon name="plus" size={16} /> Add a prescription (upload or manual)</button>
            </div>
          )}

          {tab === 'looks' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }}>
              {D.savedLooks.map((l, i) => (
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
              {D.products.slice(2, 5).map((p) => (
                <ProductCardWish key={p.id} p={p} go={go} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductCardWish({ p, go }) {
  const { ProductCard } = window.OPTIZONEDesignSystem_ded4a5;
  return <ProductCard brand={p.brand} name={p.name} amount={p.amount} original={p.original} rating={p.rating} reviewCount={p.reviews} badge={p.badge} tryMirror={p.tryMirror} colors={p.colors} style={{ cursor: 'pointer' }} onClick={() => go('product', p)} />;
}

function Account({ loggedIn, onLogin, go }) {
  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });
  return loggedIn ? <Dashboard go={go} /> : <Login onLogin={onLogin} />;
}

Object.assign(window, { Account });
