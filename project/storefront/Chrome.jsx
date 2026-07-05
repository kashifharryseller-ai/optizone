// OPTIZONE storefront — shared header & footer chrome.
const { Logo, Icon, IconButton, Button, DiamondRule } = window.OPTIZONEDesignSystem_ded4a5;

function Header({ route, go, cartCount, onSearch, loggedIn }) {
  const D = window.OZ_DATA;
  const scrolled = window.useScrolled(4);
  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });
  const navTo = (key) => key === 'eyeglasses' ? 'catalog' : key === 'book' ? 'booking' : key === 'stores' ? 'stores' : 'catalog';
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, boxShadow: scrolled ? 'var(--shadow-md)' : 'none', transition: 'box-shadow var(--dur-base) var(--ease-out)' }}>
      {/* announcement bar */}
      <div style={{ background: 'var(--pine-950)', color: 'var(--cream-200)', textAlign: 'center', fontSize: 12.5, letterSpacing: '0.06em', padding: '7px 16px', fontFamily: 'var(--font-body)' }}>
        Free shipping over ₪400 · Complete your fitting in any branch
      </div>
      <div style={{ background: 'var(--pine-700)', borderBottom: '1px solid var(--border-on-dark)' }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 28px', height: 74, display: 'flex', alignItems: 'center', gap: 28 }}>
          <div style={{ cursor: 'pointer' }} onClick={() => go('home')}>
            <Logo variant="horizontal" theme="dark" size={22} tagline={false} />
          </div>
          <nav style={{ display: 'flex', gap: 26, marginInlineStart: 12 }}>
            {D.nav.map((n) => {
              const active = route === navTo(n.key) || (n.key === 'eyeglasses' && route === 'catalog');
              return (
                <a key={n.key} onClick={() => go(navTo(n.key))}
                  style={{ cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', color: active ? 'var(--amber-500)' : 'var(--cream-100)', paddingBottom: 2, borderBottom: `2px solid ${active ? 'var(--amber-500)' : 'transparent'}` }}>
                  {n.label}
                </a>
              );
            })}
          </nav>
          <div style={{ marginInlineStart: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
            <IconButton variant="ghost" onClick={onSearch} style={{ color: 'var(--cream-100)' }}><Icon name="search" color="var(--cream-100)" /></IconButton>
            <IconButton variant="ghost" onClick={() => go('account')} style={{ color: 'var(--cream-100)' }}><Icon name="heart" color="var(--cream-100)" /></IconButton>
            <IconButton variant="ghost" onClick={() => go('account')} style={{ color: loggedIn ? 'var(--amber-500)' : 'var(--cream-100)' }}><Icon name="user" color={loggedIn ? 'var(--amber-500)' : 'var(--cream-100)'} /></IconButton>
            <div style={{ position: 'relative' }}>
              <IconButton variant="accent" round onClick={() => go('cart')}><Icon name="shopping-bag" /></IconButton>
              {cartCount > 0 && (
                <span style={{ position: 'absolute', top: -4, insetInlineEnd: -4, minWidth: 18, height: 18, padding: '0 5px', background: 'var(--pine-950)', color: 'var(--cream-100)', borderRadius: 999, fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--pine-700)' }}>{cartCount}</span>
              )}
            </div>
            <span style={{ marginInlineStart: 10, fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: '0.08em', color: 'var(--cream-200)', border: '1px solid var(--border-on-dark)', borderRadius: 'var(--radius-pill)', padding: '5px 12px', cursor: 'pointer' }}>עב / EN</span>
          </div>
        </div>
      </div>
    </header>
  );
}

function Footer({ go }) {
  const linkTo = { 'Eyeglasses': 'catalog', 'Sunglasses': 'catalog', 'Contact Lenses': 'catalog', 'Accessories': 'catalog', 'Book an Eye Exam': 'booking', 'Try Mirror': 'catalog', 'Store Locator': 'stores', 'Branches': 'stores' };
  const cols = [
    { h: 'Shop', items: ['Eyeglasses', 'Sunglasses', 'Contact Lenses', 'Accessories', 'Gift Cards'] },
    { h: 'Services', items: ['Book an Eye Exam', 'Try Mirror', 'Lens Guide', 'Store Locator', 'Prescription Help'] },
    { h: 'OPTIZONE', items: ['Our Story', 'Branches', 'Careers', 'Blog', 'Contact'] },
  ];
  return (
    <footer style={{ background: 'var(--pine-800)', color: 'var(--cream-200)', marginTop: 0 }}>
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '56px 28px 28px', display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 40 }}>
        <div>
          <Logo variant="wordmark" theme="dark" size={26} />
          <p style={{ marginTop: 18, fontSize: 14, lineHeight: 1.6, color: 'var(--pine-200)', maxWidth: 240 }}>
            Premium eyewear & eye care. Try any frame on before you buy.
          </p>
          <div style={{ marginTop: 16, fontSize: 13, color: 'var(--pine-200)', lineHeight: 1.8 }}>
            השלים 12, נתניה<br />058-644-2303 · www.optizone.co.il
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.h}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--amber-500)', marginBottom: 16 }}>{c.h}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {c.items.map((i) => <a key={i} onClick={() => linkTo[i] && go && go(linkTo[i])} style={{ fontSize: 14, color: 'var(--cream-200)', cursor: 'pointer' }}>{i}</a>)}
            </div>
          </div>
        ))}
      </div>
      <div style={{ borderTop: '1px solid var(--border-on-dark)' }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '18px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12.5, color: 'var(--pine-200)' }}>
          <span>© 2026 OPTIZONE · Vision &amp; Style</span>
          <span style={{ display: 'flex', gap: 18 }}>
            <span>Accessibility Statement (IS 5568)</span><span>Privacy</span><span>Terms</span>
          </span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { Header, Footer });
