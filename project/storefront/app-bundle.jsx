// OPTIZONE storefront — single-file bundle (concatenated from kit files, IIFE-wrapped)
(function __ozBoot(){
  if (!window.OPTIZONEDesignSystem_ded4a5 || !window.React || !customElements.get('image-slot')) { setTimeout(__ozBoot, 40); return; }
// OPTIZONE storefront — sample catalog data (no real product photos available).
window.OZ_DATA = {
  brands: ['Ray-Ban', 'Prada', 'Versace', 'Dolce & Gabbana', 'Tiffany & Co.', 'Persol'],
  nav: [
    { key: 'eyeglasses', label: 'Eyeglasses', he: 'משקפי ראיה' },
    { key: 'sunglasses', label: 'Sunglasses', he: 'משקפי שמש' },
    { key: 'contacts', label: 'Contact Lenses', he: 'עדשות מגע' },
    { key: 'brands', label: 'Brands', he: 'מותגים' },
    { key: 'stores', label: 'Stores', he: 'סניפים' },
    { key: 'book', label: 'Book an Exam', he: 'קביעת תור' },
  ],
  services: [
    { icon: 'eye', title: 'Eye Exams', he: 'בדיקות ראיה', desc: 'Comprehensive vision tests with our optometrists.', hedesc: 'בדיקות ראיה מקיפות אצל האופטומטריסטים שלנו.' },
    { icon: 'glasses', title: 'Prescription & Sun', he: 'משקפי ראיה ושמש', desc: 'Frames fitted to your face and prescription.', hedesc: 'מסגרות מותאמות לפנים ולמרשם שלך.' },
    { icon: 'circle-dot', title: 'Contact Lenses', he: 'עדשות מגע', desc: 'Soft, multifocal and specialty lenses.', hedesc: 'עדשות רכות, מולטיפוקל ועדשות מיוחדות.' },
    { icon: 'target', title: 'Myopia Control', he: 'שליטה בקוצר ראיה', desc: 'Slowing progression for children and teens.', hedesc: 'האטת התקדמות קוצר ראיה בילדים ובני נוער.' },
    { icon: 'layers', title: 'Multifocal Experts', he: 'מומחים למולטיפוקל', desc: 'Progressive lenses done right.', hedesc: 'עדשות פרוגרסיביות, בהתאמה מדויקת.' },
    { icon: 'shield-check', title: 'Keratoconus Care', he: 'טיפול בקרטוקונוס', desc: 'Specialty fitting for irregular corneas.', hedesc: 'התאמה מיוחדת לקרנית לא סדירה.' },
  ],
  products: [
    { id: 1, brand: 'Ray-Ban', name: 'Round Metal RB3447', amount: 390, original: 490, rating: 4.5, reviews: 128, badge: { variant: 'sale', label: 'Sale' }, tryMirror: true, colors: ['#22402F', '#3A342A', '#E08A2A'], shape: 'Round', material: 'Metal', gender: 'Unisex' },
    { id: 2, brand: 'Persol', name: 'PO3092 Havana', amount: 720, rating: 5, reviews: 64, badge: { variant: 'new', label: 'New' }, tryMirror: true, colors: ['#6B4423', '#1A1A17'], shape: 'Square', material: 'Acetate', gender: 'Men' },
    { id: 3, brand: 'Prada', name: 'PR 17WS Symbole', amount: 1290, rating: 4.5, reviews: 41, badge: { variant: 'bestseller', label: 'Bestseller' }, tryMirror: true, colors: ['#1A1A17', '#7E4310'], shape: 'Cat-eye', material: 'Acetate', gender: 'Women' },
    { id: 4, brand: 'Tiffany & Co.', name: 'TF2233B', amount: 980, rating: 4, reviews: 22, tryMirror: false, colors: ['#22402F', '#B4CEC0'], shape: 'Oval', material: 'Metal', gender: 'Women' },
    { id: 5, brand: 'Versace', name: 'VE4361 Medusa', amount: 860, original: 1050, rating: 4.5, reviews: 77, badge: { variant: 'sale', label: 'Sale' }, tryMirror: true, colors: ['#1A1A17', '#E08A2A'], shape: 'Square', material: 'Acetate', gender: 'Men' },
    { id: 6, brand: 'Dolce & Gabbana', name: 'DG4416 Print', amount: 690, rating: 4, reviews: 18, badge: { variant: 'new', label: 'New' }, tryMirror: true, colors: ['#6B4423', '#3A342A'], shape: 'Round', material: 'Acetate', gender: 'Women' },
  ],
  filters: {
    'Frame Shape': ['Round', 'Square', 'Cat-eye', 'Oval', 'Aviator'],
    'Material': ['Acetate', 'Metal', 'Titanium'],
    'Gender': ['Women', 'Men', 'Unisex', 'Kids'],
  },
  branches: ['Netanya · השלים 12', 'Tel Aviv · Dizengoff 210', 'Haifa · HaNassi 8'],
  bookingServices: ['Eye Exam', 'Frame Fitting', 'Contact-Lens Fitting', "Kids' Eye Test"],
  slots: ['09:00', '10:30', '12:00', '13:30', '15:00', '16:30', '18:00'],
  popularSearches: ['Ray-Ban', 'Blue-light glasses', 'Sunglasses', 'Progressive lenses', 'Titanium frames', 'Kids'],
  stores: [
    { name: 'Netanya', addr: 'השלים 12, נתניה', phone: '058-644-2303', hours: 'Sun–Thu 09:00–19:00 · Fri 09:00–14:00', services: ['Eye Exams', 'Try Mirror', 'Contact Lenses'], x: 34, y: 46 },
    { name: 'Tel Aviv', addr: 'Dizengoff 210, Tel Aviv', phone: '03-521-8890', hours: 'Sun–Thu 10:00–21:00 · Fri 10:00–15:00', services: ['Eye Exams', 'Frame Fitting', 'Multifocal'], x: 30, y: 58 },
    { name: 'Haifa', addr: 'HaNassi 8, Haifa', phone: '04-810-4471', hours: 'Sun–Thu 09:00–19:00 · Fri 09:00–13:30', services: ['Eye Exams', 'Keratoconus', 'Myopia Control'], x: 40, y: 30 },
  ],
  orders: [
    { id: 'OZ-24817', date: '18 Jun 2026', status: 'In lab', items: 'Ray-Ban Round Metal + 1.6 AR', total: 600 },
    { id: 'OZ-24603', date: '2 May 2026', status: 'Collected', items: 'Persol PO3092 Havana', total: 720 },
  ],
  prescriptions: [
    { name: 'Distance · Dr. Levi', date: '12 Mar 2026', od: '-2.25 / -0.50 × 180', os: '-2.00 / -0.75 × 165', pd: '63', expires: 'Mar 2028' },
  ],
  savedLooks: [
    { frame: 'Prada PR 17WS', color: '#1A1A17' },
    { frame: 'Versace VE4361', color: '#E08A2A' },
    { frame: 'Ray-Ban RB3447', color: '#22402F' },
  ],
};


window.OZ_I18N = {
  en: {
    announce: 'Free shipping over ₪400 · Complete your fitting in any branch',
    hero_eyebrow: 'New · 2026 Collection',
    hero_h1a: 'See the world', hero_h1b: 'in ', hero_h1c: 'style',
    hero_p: 'Handcrafted frames, expertly fitted. Try any pair on with Try Mirror before you buy — no card needed to reserve.',
    cta_shop: 'Shop Frames', cta_book: 'Book an Exam', trusted: 'Trusted since 2009',
    hero_slot: 'Drop your hero photo here',
    services_eyebrow: 'What we do', services_h2: 'Complete eye care, beautifully done',
    cat_eyebrow: 'Categories', cat_h2: 'Shop by category',
    cats: [
      { key: 'eyeglasses', label: 'Eyeglasses', slot: 'Drop eyeglasses photo' },
      { key: 'sunglasses', label: 'Sunglasses', slot: 'Drop sunglasses photo' },
      { key: 'contacts', label: 'Contact Lenses', slot: 'Drop contact-lens photo' },
    ],
    best_eyebrow: 'Bestsellers', best_h2: 'Frames of the season', viewall: 'View all',
    try_h2: 'Try them on from home',
    try_p: 'Live, on-device virtual try-on. Compare frames side by side, save your looks, and share to WhatsApp. Nothing is stored.',
    try_cta: 'Start Try Mirror',
  },
  he: {
    announce: 'משלוח חינם מעל ₪400 · השלמת התאמה בכל סניף',
    hero_eyebrow: 'חדש · קולקציית 2026',
    hero_h1a: 'לראות את העולם', hero_h1b: '', hero_h1c: 'בסטייל',
    hero_p: 'מסגרות בעבודת יד, מותאמות במומחיות. מדדו כל זוג עם Try Mirror לפני הקנייה — ללא צורך בכרטיס לשריון.',
    cta_shop: 'לקולקציית המסגרות', cta_book: 'קביעת תור לבדיקה', trusted: 'אמינים מאז 2009',
    hero_slot: 'גררו לכאן תמונת קאבר',
    services_eyebrow: 'מה אנחנו עושים', services_h2: 'כל שירותי העיניים, במקום אחד',
    cat_eyebrow: 'קטגוריות', cat_h2: 'קנייה לפי קטגוריה',
    cats: [
      { key: 'eyeglasses', label: 'משקפי ראיה', slot: 'גררו תמונה' },
      { key: 'sunglasses', label: 'משקפי שמש', slot: 'גררו תמונה' },
      { key: 'contacts', label: 'עדשות מגע', slot: 'גררו תמונה' },
    ],
    best_eyebrow: 'הנמכרים ביותר', best_h2: 'מסגרות העונה', viewall: 'לכל הקולקציה',
    try_h2: 'מודדים מהבית',
    try_p: 'מדידה וירטואלית חיה, במכשיר שלכם. השוו מסגרות זו לצד זו, שמרו לוקים ושתפו בוואטסאפ. שום דבר לא נשמר.',
    try_cta: 'נסו עכשיו',
  },
};

// ===== anim.jsx =====
(function(){
// OPTIZONE storefront — animation helpers (scroll reveal, staggering, scroll state).

// Reveal: fades + lifts children into view once, when scrolled near the viewport.
function Reveal({ children, delay = 0, as = 'div', style, ...rest }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { el.setAttribute('data-oz-in', ''); io.unobserve(el); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const Tag = as;
  return (
    <Tag ref={ref} data-oz-reveal="" style={{ transitionDelay: `${delay}ms`, ...style }} {...rest}>
      {children}
    </Tag>
  );
}

// useScrolled: true once the window has scrolled past `threshold` px.
function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);
  return scrolled;
}

// useCountUp: animate a number from 0 → target over `ms`.
function useCountUp(target, ms = 900) {
  const [val, setVal] = React.useState(0);
  React.useEffect(() => {
    let raf, start;
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / ms, 1);
      setVal(Math.round(target * ease(p)));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    // Safety: guarantee the final value even if rAF is throttled (background tab).
    const done = setTimeout(() => setVal(target), ms + 120);
    return () => { cancelAnimationFrame(raf); clearTimeout(done); };
  }, [target, ms]);
  return val;
}

Object.assign(window, { Reveal, useScrolled, useCountUp });

})();

// ===== Chrome.jsx =====
(function(){
// OPTIZONE storefront — shared header & footer chrome.
const { Logo, Icon, IconButton, Button, DiamondRule } = window.OPTIZONEDesignSystem_ded4a5;

function Header({ route, go, cartCount, onSearch, loggedIn, lang, onLang, showAnnouncement }) {
  const D = window.OZ_DATA;
  const t = window.OZ_I18N[lang === 'he' ? 'he' : 'en'];
  const scrolled = window.useScrolled(4);
  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });
  const navTo = (key) => key === 'eyeglasses' ? 'catalog' : key === 'book' ? 'booking' : key === 'stores' ? 'stores' : 'catalog';
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, boxShadow: scrolled ? 'var(--shadow-md)' : 'none', transition: 'box-shadow var(--dur-base) var(--ease-out)' }}>
      {/* announcement bar */}
      {showAnnouncement !== false && (
      <div style={{ background: 'var(--pine-950)', color: 'var(--cream-200)', textAlign: 'center', fontSize: 12.5, letterSpacing: '0.06em', padding: '7px 16px', fontFamily: 'var(--font-body)' }}>
        {t.announce}
      </div>
      )}
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
                  {lang === 'he' && n.he ? n.he : n.label}
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
            <span style={{ marginInlineStart: 10, fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: '0.08em', color: 'var(--cream-200)', border: '1px solid var(--border-on-dark)', borderRadius: 'var(--radius-pill)', padding: '5px 12px', cursor: 'pointer' }} onClick={onLang}>{lang === 'he' ? 'English' : 'עברית'}</span>
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

})();

// ===== Home.jsx =====
(function(){
// OPTIZONE storefront — Home page.
const { Button, Icon, DiamondRule, ProductCard, Card, GlassesMark } = window.OPTIZONEDesignSystem_ded4a5;

function ServiceTile({ s, he }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '22px 20px', background: 'var(--surface-card)', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-md)' }}>
      <span style={{ width: 44, height: 44, borderRadius: 'var(--radius-sm)', background: 'var(--pine-50)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={s.icon} size={22} color="var(--pine-700)" />
      </span>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, letterSpacing: '0.02em', color: 'var(--text-strong)' }}>{he && s.he ? s.he : s.title}</div>
      <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>{he && s.hedesc ? s.hedesc : s.desc}</div>
    </div>
  );
}

function Home({ go, addToCart, lang }) {
  const D = window.OZ_DATA;
  const { Reveal } = window;
  const t = window.OZ_I18N[lang === 'he' ? 'he' : 'en'];
  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });
  const rise = (d) => ({ animation: 'oz-fade-up var(--dur-slow) var(--ease-out) both', animationDelay: `${d}ms` });
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
            <p style={{ ...rise(220), fontSize: 18, lineHeight: 1.6, color: 'var(--pine-100)', maxWidth: 440, marginTop: 20 }}>
              {t.hero_p}
            </p>
            <div style={{ ...rise(320), display: 'flex', gap: 14, marginTop: 30 }}>
              <Button variant="primary" size="lg" onClick={() => go('catalog')}>{t.cta_shop}</Button>
              <Button variant="outline" size="lg" onClick={() => go('booking')} style={{ color: 'var(--cream-100)', borderColor: 'var(--cream-100)' }} startIcon={<Icon name="calendar" size={18} color="currentColor" />}>{t.cta_book}</Button>
            </div>
            <div style={{ ...rise(420), marginTop: 40, maxWidth: 320 }}>
              <DiamondRule label={t.trusted} color="var(--amber-500)" />
            </div>
          </div>
          {/* hero visual — mark motif on darker panel */}
          <div style={{ ...rise(240), position: 'relative', aspectRatio: '4/3', borderRadius: 'var(--radius-lg)', background: 'linear-gradient(160deg,var(--pine-600),var(--pine-800))', border: '1px solid var(--border-on-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-dark)' }}>
            <image-slot id="hero-photo" placeholder={t.hero_slot} shape="rounded" radius="14" fit="cover" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}></image-slot>
            <span style={{ position: 'absolute', bottom: 18, insetInlineEnd: 18, display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(18,36,26,0.7)', color: 'var(--cream-100)', padding: '8px 14px', borderRadius: 999, fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', backdropFilter: 'blur(4px)' }}>
              <Icon name="camera" size={14} color="var(--amber-500)" /> Try Mirror ready
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
          {D.services.map((s, i) => <Reveal key={s.title} delay={i * 70}><ServiceTile s={s} he={lang === 'he'} /></Reveal>)}
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
                <image-slot id={'cat-' + c.key} placeholder={c.slot} shape="rect" fit="cover" style={{ display: 'block', width: '100%', height: 210 }}></image-slot>
                <div onClick={() => go('catalog')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-strong)' }}>{c.label}</span>
                  <Icon name="arrow-right" size={16} color="var(--amber-700)" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '56px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--amber-700)' }}>{t.best_eyebrow}</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 32, color: 'var(--text-strong)', margin: '8px 0 0' }}>{t.best_h2}</h2>
          </div>
          <Button variant="link" onClick={() => go('catalog')} endIcon={<Icon name="arrow-right" size={16} color="currentColor" />}>{t.viewall}</Button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
          {D.products.slice(0, 4).map((p, i) => (
            <Reveal key={p.id} delay={i * 80}>
              <ProductCard brand={p.brand} name={p.name} amount={p.amount} original={p.original}
                rating={p.rating} reviewCount={p.reviews} badge={p.badge} tryMirror={p.tryMirror} colors={p.colors}
                onQuickAdd={() => addToCart(p)} style={{ cursor: 'pointer' }} onClick={() => go('product', p)} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* TRY MIRROR BANNER */}
      <section style={{ maxWidth: 'var(--container-max)', margin: '0 auto 72px', padding: '0 28px' }}>
        <Reveal>
        <div style={{ background: 'var(--pine-800)', borderRadius: 'var(--radius-xl)', padding: '48px 52px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32, position: 'relative', overflow: 'hidden' }}>
          <div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--amber-500)' }}>Try Mirror</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 34, color: 'var(--cream-100)', margin: '12px 0 10px' }}>{t.try_h2}</h2>
            <p style={{ fontSize: 16, color: 'var(--pine-100)', maxWidth: 440, lineHeight: 1.6 }}>{t.try_p}</p>
            <div style={{ marginTop: 22 }}><Button variant="primary" size="lg" onClick={() => go('catalog')}>{t.try_cta}</Button></div>
          </div>
          <GlassesMark size={96} color="var(--amber-500)" style={{ flex: '0 0 auto', opacity: 0.9 }} />
        </div>
        </Reveal>
      </section>
    </div>
  );
}

Object.assign(window, { Home });

})();

// ===== Catalog.jsx =====
(function(){
// OPTIZONE storefront — Catalog / product listing.
const { ProductCard, Tag, Switch, Select, Button, Icon, DiamondRule } = window.OPTIZONEDesignSystem_ded4a5;

function Catalog({ go, addToCart }) {
  const D = window.OZ_DATA;
  const [selected, setSelected] = React.useState({});
  const [tryOnly, setTryOnly] = React.useState(false);
  const [sort, setSort] = React.useState('popular');
  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });

  const toggle = (group, val) => {
    setSelected((s) => {
      const cur = new Set(s[group] || []);
      cur.has(val) ? cur.delete(val) : cur.add(val);
      return { ...s, [group]: [...cur] };
    });
  };
  const activeVals = Object.values(selected).flat();
  let list = D.products.filter((p) => {
    if (tryOnly && !p.tryMirror) return false;
    for (const [g, vals] of Object.entries(selected)) {
      if (!vals.length) continue;
      const field = g === 'Frame Shape' ? p.shape : g === 'Material' ? p.material : p.gender;
      if (!vals.includes(field)) return false;
    }
    return true;
  });
  if (sort === 'price-asc') list = [...list].sort((a, b) => a.amount - b.amount);
  if (sort === 'price-desc') list = [...list].sort((a, b) => b.amount - a.amount);

  return (
    <div>
      {/* Page header band */}
      <div style={{ background: 'var(--cream-300)', borderBottom: '1px solid var(--border-soft)' }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '34px 28px' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Home / Eyeglasses</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 40, color: 'var(--text-strong)', margin: '10px 0 0' }}>Eyeglasses</h1>
        </div>
      </div>

      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '28px 28px 72px', display: 'grid', gridTemplateColumns: '250px 1fr', gap: 34, alignItems: 'start' }}>
        {/* FILTERS */}
        <aside style={{ position: 'sticky', top: 96, display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-strong)' }}>Filters</span>
            {activeVals.length > 0 && <a onClick={() => setSelected({})} style={{ fontSize: 13, color: 'var(--amber-700)', cursor: 'pointer' }}>Clear</a>}
          </div>
          <div style={{ padding: '12px 0', borderTop: '1px solid var(--border-hair)', borderBottom: '1px solid var(--border-hair)' }}>
            <Switch label="Try Mirror only" checked={tryOnly} onChange={setTryOnly} />
          </div>
          {Object.entries(D.filters).map(([group, vals]) => (
            <div key={group}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>{group}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {vals.map((v) => (
                  <Tag key={v} selected={(selected[group] || []).includes(v)} onClick={() => toggle(group, v)}>{v}</Tag>
                ))}
              </div>
            </div>
          ))}
        </aside>

        {/* GRID */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>{list.length} frames</span>
            <div style={{ width: 220 }}>
              <Select value={sort} onChange={(e) => setSort(e.target.value)} options={[{ value: 'popular', label: 'Sort: Popularity' }, { value: 'price-asc', label: 'Price: Low to High' }, { value: 'price-desc', label: 'Price: High to Low' }]} />
            </div>
          </div>
          {list.length === 0 ? (
            <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>No frames match these filters.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
              {list.map((p) => (
                <ProductCard key={p.id} brand={p.brand} name={p.name} amount={p.amount} original={p.original}
                  rating={p.rating} reviewCount={p.reviews} badge={p.badge} tryMirror={p.tryMirror} colors={p.colors}
                  onQuickAdd={() => addToCart(p)} style={{ cursor: 'pointer' }} onClick={() => go('product', p)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Catalog });

})();

// ===== Product.jsx =====
(function(){
// OPTIZONE storefront — Product detail page (PDP) with Try Mirror + lens configurator.
const { Button, IconButton, Icon, Tabs, Rating, Price, Dialog, Checkbox, Select, DiamondRule, Badge, GlassesMark } = window.OPTIZONEDesignSystem_ded4a5;

function MarkThumb({ active, onClick, tint }) {
  return (
    <button onClick={onClick} style={{ width: 64, height: 64, borderRadius: 'var(--radius-sm)', border: `1.5px solid ${active ? 'var(--pine-700)' : 'var(--border-hair)'}`, background: 'var(--cream-300)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
      <GlassesMark size={20} color={tint || 'var(--pine-500)'} />
    </button>
  );
}

function LensRow({ label, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '14px 0', borderBottom: '1px solid var(--border-hair)' }}>
      <span style={{ fontSize: 14, color: 'var(--text-body)' }}>{label}</span>
      {children}
    </div>
  );
}

function Product({ product, go, addToCart }) {
  const p = product || window.OZ_DATA.products[0];
  const [img, setImg] = React.useState(0);
  const [tab, setTab] = React.useState('desc');
  const [consent, setConsent] = React.useState(false);
  const [mirror, setMirror] = React.useState(false);
  const [lensOpen, setLensOpen] = React.useState(false);
  const [index, setIndex] = React.useState('1.6');
  const [ar, setAr] = React.useState(true);
  const [blue, setBlue] = React.useState(false);
  const [photo, setPhoto] = React.useState(false);
  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });

  const lensPrice = (index === '1.6' ? 120 : index === '1.67' ? 260 : index === '1.74' ? 420 : 0) + (ar ? 90 : 0) + (blue ? 70 : 0) + (photo ? 180 : 0);
  const total = p.amount + lensPrice;

  return (
    <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '28px 28px 72px' }}>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => go('catalog')}>← Back to Eyeglasses</span>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, marginTop: 20, alignItems: 'start' }}>
        {/* GALLERY */}
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[0, 1, 2, 3].map((i) => <MarkThumb key={i} active={img === i} onClick={() => setImg(i)} tint={p.colors[i % p.colors.length]} />)}
          </div>
          <div style={{ flex: 1, position: 'relative', aspectRatio: '1', background: 'var(--cream-300)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-hair)' }}>
            <image-slot id={'product-' + p.id + '-view-' + img} placeholder="Drop product photo" shape="rounded" radius="12" fit="cover" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}></image-slot>
            {p.tryMirror && <span style={{ position: 'absolute', top: 16, insetInlineStart: 16, zIndex: 2 }}><Badge variant="try">Try Mirror</Badge></span>}
            <IconButton variant="outline" round style={{ position: 'absolute', bottom: 16, insetInlineEnd: 16, background: 'var(--white)' }}><Icon name="maximize-2" size={16} /></IconButton>
          </div>
        </div>

        {/* INFO */}
        <div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-accent)' }}>{p.brand}</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 34, color: 'var(--text-strong)', margin: '8px 0 12px' }}>{p.name}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
            <Rating value={p.rating} count={p.reviews} />
            <span style={{ color: 'var(--border-strong)' }}>·</span>
            <span style={{ fontSize: 13, color: 'var(--success)', fontWeight: 600 }}>In stock · Netanya, Tel Aviv</span>
          </div>
          <Price amount={total} original={p.original ? p.original + lensPrice : undefined} size="lg" />
          <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--text-body)', margin: '18px 0 22px', maxWidth: 460 }}>
            A refined {p.shape.toLowerCase()} silhouette in premium {p.material.toLowerCase()}. Lightweight, precisely balanced, and ready for your prescription.
          </p>

          {/* colors */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>Color</div>
            <div style={{ display: 'flex', gap: 10 }}>
              {p.colors.map((c, i) => (
                <button key={i} onClick={() => setImg(i)} style={{ width: 34, height: 34, borderRadius: 999, background: c, border: `2px solid ${img === i ? 'var(--amber-600)' : 'var(--border-hair)'}`, cursor: 'pointer', outline: img === i ? '2px solid var(--amber-100)' : 'none' }} />
              ))}
            </div>
          </div>

          {/* lens config summary */}
          <button onClick={() => setLensOpen(!lensOpen)} style={{ width: '100%', textAlign: 'start', border: '1px solid var(--border-hair)', background: 'var(--cream-100)', borderRadius: 'var(--radius-md)', padding: '14px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: '0.06em', color: 'var(--text-strong)', display: 'block' }}>LENS CONFIGURATION</span>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Index {index}{ar ? ' · Anti-reflective' : ''}{blue ? ' · Blue-light' : ''}{photo ? ' · Photochromic' : ''} · +₪{lensPrice}</span>
            </span>
            <Icon name={lensOpen ? 'chevron-up' : 'chevron-down'} size={18} />
          </button>
          {lensOpen && (
            <div style={{ border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-md)', padding: '4px 16px 16px', marginBottom: 18, background: 'var(--white)' }}>
              <LensRow label="Lens index"><div style={{ width: 130 }}><Select value={index} onChange={(e) => setIndex(e.target.value)} size="sm" options={[{ value: '1.5', label: '1.5 · Standard' }, { value: '1.6', label: '1.6 · Thin +₪120' }, { value: '1.67', label: '1.67 +₪260' }, { value: '1.74', label: '1.74 +₪420' }]} /></div></LensRow>
              <LensRow label="Anti-reflective coating (+₪90)"><Checkbox checked={ar} onChange={setAr} /></LensRow>
              <LensRow label="Blue-light filter (+₪70)"><Checkbox checked={blue} onChange={setBlue} /></LensRow>
              <LensRow label="Photochromic (+₪180)"><Checkbox checked={photo} onChange={setPhoto} /></LensRow>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, color: 'var(--text-muted)', fontSize: 12.5 }}>
                <Icon name="info" size={15} /> Out-of-range prescriptions are fitted in-store, not blocked.
              </div>
            </div>
          )}

          {/* actions */}
          <div style={{ display: 'flex', gap: 12 }}>
            <Button variant="primary" size="lg" block onClick={() => addToCart({ ...p, amount: total })} startIcon={<Icon name="shopping-bag" size={18} color="currentColor" />}>Add to Cart · ₪{total}</Button>
            {p.tryMirror && <Button variant="solid" size="lg" onClick={() => setConsent(true)} startIcon={<Icon name="camera" size={18} color="currentColor" />}>Try Mirror</Button>}
          </div>
          <div style={{ display: 'flex', gap: 22, marginTop: 18, fontSize: 13, color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}><Icon name="truck" size={16} /> Free shipping over ₪400</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}><Icon name="store" size={16} /> Reserve & fit in-store</span>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ marginTop: 56, maxWidth: 780 }}>
        <Tabs tabs={[{ value: 'desc', label: 'Description' }, { value: 'specs', label: 'Specs' }, { value: 'reviews', label: 'Reviews' }]} value={tab} onChange={setTab} />
        <div style={{ padding: '24px 2px', fontSize: 15, lineHeight: 1.7, color: 'var(--text-body)' }}>
          {tab === 'desc' && <p style={{ margin: 0 }}>The {p.name} pairs a timeless {p.shape.toLowerCase()} shape with OPTIZONE's precision fitting. Hand-finished {p.material.toLowerCase()}, sprung hinges, and adjustable nose pads for all-day comfort. Compatible with single-vision, progressive, and blue-light lenses.</p>}
          {tab === 'specs' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 40px', maxWidth: 520 }}>
              {[['Brand', p.brand], ['Shape', p.shape], ['Material', p.material], ['Gender', p.gender], ['Lens width', '50 mm'], ['Bridge', '21 mm'], ['Temple', '145 mm'], ['Try Mirror', p.tryMirror ? 'Yes' : 'No']].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-hair)', paddingBottom: 8 }}>
                  <span style={{ color: 'var(--text-muted)' }}>{k}</span><span style={{ color: 'var(--text-strong)', fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
          )}
          {tab === 'reviews' && <p style={{ margin: 0, color: 'var(--text-muted)' }}>{p.reviews} verified reviews · {p.rating}/5 average. Reviews module (Phase 2) with moderation.</p>}
        </div>
      </div>

      {/* CONSENT DIALOG */}
      <Dialog open={consent} onClose={() => setConsent(false)} eyebrow="Try Mirror" title="Camera & try-on consent"
        footer={<>
          <Button variant="ghost" onClick={() => setConsent(false)}>Not now</Button>
          <Button variant="primary" onClick={() => { setConsent(false); setMirror(true); }}>Allow camera</Button>
        </>}>
        OPTIZONE's Try Mirror uses your camera on-device to place frames on your face in real time.
        No image or biometric data is stored (Privacy Protection Law, IS 5568). You can also upload a photo instead.
      </Dialog>

      {/* TRY MIRROR MOCK */}
      {mirror && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'var(--pine-950)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', color: 'var(--cream-100)' }}>
            <span style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.14em', textTransform: 'uppercase', fontSize: 13, color: 'var(--amber-500)' }}>Try Mirror · Live</span>
            <IconButton variant="ghost" onClick={() => setMirror(false)} style={{ color: 'var(--cream-100)' }}><Icon name="x" color="var(--cream-100)" /></IconButton>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <div style={{ width: 'min(70vh,520px)', aspectRatio: '3/4', borderRadius: 'var(--radius-lg)', background: 'linear-gradient(160deg,var(--pine-700),var(--pine-900))', border: '1px solid var(--border-on-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
              <Icon name="user" size={160} color="rgba(255,255,255,0.12)" />
              <div className="oz-scan-line" />
              <div style={{ position: 'absolute', top: '34%', animation: 'oz-float 4s var(--ease-in-out) infinite' }}><GlassesMark size={70} color={p.colors[img % p.colors.length]} /></div>
              <span style={{ position: 'absolute', bottom: 16, fontSize: 12, color: 'var(--pine-200)', letterSpacing: '0.06em' }}>Camera preview (mock)</span>
            </div>
          </div>
          <div style={{ padding: '18px 24px 28px', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 10 }}>
              {p.colors.map((c, i) => <button key={i} onClick={() => setImg(i)} style={{ width: 36, height: 36, borderRadius: 999, background: c, border: `2px solid ${img === i ? 'var(--amber-500)' : 'transparent'}`, cursor: 'pointer' }} />)}
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <Button variant="outline" style={{ color: 'var(--cream-100)', borderColor: 'var(--cream-100)' }} startIcon={<Icon name="camera" size={18} color="currentColor" />}>Capture look</Button>
              <Button variant="primary" onClick={() => { addToCart({ ...p, amount: total }); setMirror(false); }} startIcon={<Icon name="shopping-bag" size={18} color="currentColor" />}>Add to Cart</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { Product });

})();

// ===== Booking.jsx =====
(function(){
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

})();

// ===== Cart.jsx =====
(function(){
// OPTIZONE storefront — Cart.
const { Button, Icon, QuantityStepper, Price, Card, DiamondRule, Input, GlassesMark } = window.OPTIZONEDesignSystem_ded4a5;

function Cart({ cart, setCart, go }) {
  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });
  const subtotal = cart.reduce((s, i) => s + i.amount * i.qty, 0);
  const shipping = subtotal > 400 || subtotal === 0 ? 0 : 30;
  const setQty = (idx, qty) => setCart(cart.map((c, i) => i === idx ? { ...c, qty } : c));
  const remove = (idx) => setCart(cart.filter((_, i) => i !== idx));

  if (cart.length === 0) {
    return (
      <div style={{ maxWidth: 560, margin: '80px auto 120px', textAlign: 'center', padding: '0 28px' }}>
        <GlassesMark size={64} color="var(--pine-300)" />
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 30, color: 'var(--text-strong)', margin: '20px 0 8px' }}>Your cart is empty</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: 22 }}>Find a frame you love — and try it on before you buy.</p>
        <Button variant="primary" size="lg" onClick={() => go('catalog')}>Shop Frames</Button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '36px 28px 80px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 34, color: 'var(--text-strong)', margin: '0 0 24px' }}>Your cart</h1>
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
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Frame + lens · configured</div>
              </div>
              <QuantityStepper value={it.qty} onChange={(q) => setQty(idx, q)} size="sm" />
              <div style={{ width: 90, textAlign: 'end' }}><Price amount={it.amount * it.qty} /></div>
              <button onClick={() => remove(idx)} aria-label="remove" style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-faint)' }}><Icon name="trash-2" size={18} /></button>
            </div>
          ))}
        </div>

        <Card padding="lg" style={{ position: 'sticky', top: 96 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-strong)', marginBottom: 16 }}>Summary</div>
          {[['Subtotal', `₪${subtotal.toLocaleString('he-IL')}`], ['Shipping', shipping ? `₪${shipping}` : 'Free']].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', fontSize: 14, color: 'var(--text-body)' }}><span>{k}</span><span>{v}</span></div>
          ))}
          <div style={{ display: 'flex', gap: 8, margin: '12px 0' }}>
            <Input placeholder="Promo code" containerStyle={{ flex: 1 }} size="sm" />
            <Button variant="outline" size="sm">Apply</Button>
          </div>
          <div style={{ borderTop: '1px solid var(--border-hair)', margin: '8px 0 14px' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, letterSpacing: '0.06em', color: 'var(--text-strong)' }}>TOTAL</span>
            <Price amount={subtotal + shipping} size="lg" />
          </div>
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Button variant="primary" block size="lg" onClick={() => go('checkout')}>Checkout</Button>
            <Button variant="ghost" block onClick={() => go('booking')}>Reserve & fit in-store</Button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginTop: 14, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-faint)', fontFamily: 'var(--font-display)' }}>
            <span>Visa</span><span>Mastercard</span><span>Bit</span><span>תשלומים</span>
          </div>
        </Card>
      </div>
    </div>
  );
}

Object.assign(window, { Cart });

})();

// ===== Search.jsx =====
(function(){
// OPTIZONE storefront — search overlay with live suggestions (FR-5).
const { Icon, Badge, Price } = window.OPTIZONEDesignSystem_ded4a5;

function Search({ open, onClose, go }) {
  const D = window.OZ_DATA;
  const [q, setQ] = React.useState('');
  const inputRef = React.useRef(null);
  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });
  React.useEffect(() => {
    if (open) { setQ(''); setTimeout(() => inputRef.current && inputRef.current.focus(), 60); }
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (!open) return null;
  const ql = q.trim().toLowerCase();
  const results = ql
    ? D.products.filter((p) => (p.name + ' ' + p.brand + ' ' + p.shape + ' ' + p.material).toLowerCase().includes(ql))
    : [];

  const pick = (p) => { onClose(); go('product', p); };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', flexDirection: 'column' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'var(--overlay-scrim)', animation: 'oz-fade var(--dur-base) var(--ease-out) both', backdropFilter: 'blur(3px)' }} />
      <div style={{ position: 'relative', background: 'var(--bg-page-alt)', boxShadow: 'var(--shadow-lg)', animation: 'oz-slide-down var(--dur-base) var(--ease-out) both' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '26px 28px 30px' }}>
          {/* input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, borderBottom: '2px solid var(--pine-700)', paddingBottom: 14 }}>
            <Icon name="search" size={24} color="var(--pine-700)" />
            <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search frames, brands, lenses…"
              style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font-body)', fontSize: 22, color: 'var(--text-strong)' }} />
            <button onClick={onClose} aria-label="Close" style={{ border: '1px solid var(--border-strong)', background: 'transparent', borderRadius: 'var(--radius-sm)', padding: '4px 9px', cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.1em', color: 'var(--text-muted)' }}>ESC</button>
          </div>

          {/* body */}
          {!ql && (
            <div style={{ marginTop: 24 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 14 }}>Popular searches</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {D.popularSearches.map((s) => (
                  <button key={s} onClick={() => setQ(s)} style={{ border: '1px solid var(--border-hair)', background: 'var(--surface-card)', borderRadius: 'var(--radius-pill)', padding: '8px 16px', cursor: 'pointer', fontSize: 13.5, color: 'var(--text-body)' }}>{s}</button>
                ))}
              </div>
            </div>
          )}

          {ql && (
            <div style={{ marginTop: 20, maxHeight: '52vh', overflowY: 'auto' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>
                {results.length} {results.length === 1 ? 'result' : 'results'}
              </div>
              {results.length === 0 ? (
                <div style={{ padding: '24px 0', color: 'var(--text-muted)', fontSize: 15 }}>No frames match “{q}”. Try a brand or shape.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {results.map((p, i) => (
                    <button key={p.id} onClick={() => pick(p)}
                      style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 8px', border: 'none', borderBottom: '1px solid var(--border-hair)', background: 'transparent', cursor: 'pointer', textAlign: 'start', animation: `oz-fade-up var(--dur-base) var(--ease-out) both`, animationDelay: `${i * 40}ms` }}>
                      <span style={{ width: 52, height: 52, borderRadius: 'var(--radius-sm)', background: 'var(--cream-300)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                        <svg viewBox="0 0 120 46" width="34" fill="none"><g stroke={p.colors[0]} strokeWidth="3" strokeLinecap="round"><circle cx="40" cy="24" r="15" /><circle cx="80" cy="24" r="15" /><path d="M55 17 q5 -5 10 0" /></g></svg>
                      </span>
                      <span style={{ flex: 1 }}>
                        <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: 10.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-accent)' }}>{p.brand}</span>
                        <span style={{ display: 'block', fontSize: 15, fontWeight: 600, color: 'var(--text-strong)' }}>{p.name}</span>
                      </span>
                      {p.tryMirror && <Badge variant="try">Try Mirror</Badge>}
                      <Price amount={p.amount} original={p.original} size="sm" />
                      <Icon name="arrow-right" size={16} color="var(--text-muted)" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Search });

})();

// ===== Account.jsx =====
(function(){
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

})();

// ===== Checkout.jsx =====
(function(){
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

})();

// ===== StoreLocator.jsx =====
(function(){
// OPTIZONE storefront — store locator with map + branch details (FR-54).
const { Button, Icon, Badge, DiamondRule } = window.OPTIZONEDesignSystem_ded4a5;

function StoreLocator({ go }) {
  const D = window.OZ_DATA;
  const [active, setActive] = React.useState(0);
  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });
  const s = D.stores[active];

  return (
    <div>
      <div style={{ background: 'var(--pine-700)', color: 'var(--cream-100)' }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '46px 28px' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--amber-500)' }}>Find us</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 40, color: 'var(--cream-100)', margin: '10px 0 0' }}>Our branches</h1>
        </div>
      </div>

      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '30px 28px 80px', display: 'grid', gridTemplateColumns: '360px 1fr', gap: 30, alignItems: 'start' }}>
        {/* list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {D.stores.map((st, i) => (
            <button key={st.name} onClick={() => setActive(i)}
              style={{ textAlign: 'start', padding: '18px 20px', borderRadius: 'var(--radius-md)', border: `1.5px solid ${active === i ? 'var(--pine-700)' : 'var(--border-hair)'}`, background: active === i ? 'var(--pine-50)' : 'var(--surface-card)', cursor: 'pointer', transition: 'all var(--dur-fast) var(--ease-out)', boxShadow: active === i ? 'var(--shadow-sm)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <Icon name="map-pin" size={18} color="var(--pine-700)" />
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--text-strong)' }}>OPTIZONE {st.name}</span>
              </div>
              <div style={{ fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.6 }}>{st.addr}<br />{st.hours}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
                {st.services.map((sv) => <span key={sv} style={{ fontSize: 11, letterSpacing: '0.04em', color: 'var(--pine-700)', background: 'var(--pine-100)', borderRadius: 'var(--radius-pill)', padding: '3px 10px' }}>{sv}</span>)}
              </div>
            </button>
          ))}
        </div>

        {/* map + detail */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ position: 'relative', aspectRatio: '16/10', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-hair)', background: 'linear-gradient(160deg,var(--pine-100),var(--cream-300))' }}>
            {/* faux map grid */}
            <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.5 }}>
              <defs><pattern id="ozgrid" width="44" height="44" patternUnits="userSpaceOnUse"><path d="M44 0H0V44" fill="none" stroke="var(--pine-300)" strokeWidth="1" /></pattern></defs>
              <rect width="100%" height="100%" fill="url(#ozgrid)" />
              <path d="M20 60 Q120 40 180 120 T360 200 Q440 240 520 210" fill="none" stroke="var(--amber-400)" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
            </svg>
            {D.stores.map((st, i) => (
              <button key={st.name} onClick={() => setActive(i)} style={{ position: 'absolute', left: `${st.x}%`, top: `${st.y}%`, transform: 'translate(-50%,-100%)', border: 'none', background: 'transparent', cursor: 'pointer', padding: 0 }}>
                {active === i && <span style={{ position: 'absolute', left: '50%', top: '80%', transform: 'translate(-50%,-50%)', width: 30, height: 30, borderRadius: 999, background: 'var(--amber-500)', opacity: 0.5, animation: 'oz-ring 1.6s var(--ease-out) infinite' }} />}
                <span style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Icon name="map-pin" size={active === i ? 40 : 30} color={active === i ? 'var(--amber-600)' : 'var(--pine-700)'} fill={active === i ? 'var(--amber-500)' : 'none'} />
                </span>
              </button>
            ))}
          </div>

          {/* active branch detail */}
          <div key={active} className="oz-route" style={{ background: 'var(--surface-card)', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-lg)', padding: '26px 28px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
              <div>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-accent)' }}>Branch</span>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 26, color: 'var(--text-strong)', margin: '6px 0 12px' }}>OPTIZONE {s.name}</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14, color: 'var(--text-body)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 9 }}><Icon name="map-pin" size={16} color="var(--pine-700)" /> {s.addr}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 9 }}><Icon name="clock" size={16} color="var(--pine-700)" /> {s.hours}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 9 }}><Icon name="phone" size={16} color="var(--pine-700)" /> {s.phone}</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 180 }}>
                <Button variant="primary" onClick={() => go('booking')} startIcon={<Icon name="calendar" size={17} color="currentColor" />}>Book at this branch</Button>
                <Button variant="outline" startIcon={<Icon name="navigation" size={17} color="currentColor" />}>Get directions</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { StoreLocator });

})();

// ===== app.jsx =====
(function(){
// OPTIZONE storefront — app router.
const { Toast, Icon } = window.OPTIZONEDesignSystem_ded4a5;

function App(props) {
  const [route, setRoute] = React.useState('home');
  const [product, setProduct] = React.useState(null);
  const [cart, setCart] = React.useState([]);
  const [toast, setToast] = React.useState(null);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [lang, setLang] = React.useState(props.defaultLang === 'he' ? 'he' : 'en');
  React.useEffect(() => {
    document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const go = (r, p) => {
    if (p) setProduct(p);
    setRoute(r);
    window.scrollTo({ top: 0 });
  };
  const addToCart = (p) => {
    setCart((c) => {
      const found = c.find((i) => i.id === p.id);
      if (found) return c.map((i) => i.id === p.id ? { ...i, qty: i.qty + 1 } : i);
      return [...c, { ...p, qty: 1 }];
    });
    setToast({ name: p.name, brand: p.brand });
    clearTimeout(window.__ozT);
    window.__ozT = setTimeout(() => setToast(null), 2600);
  };
  const subtotal = cart.reduce((s, i) => s + i.amount * i.qty, 0);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header route={route} go={go} cartCount={cart.reduce((s, i) => s + i.qty, 0)} onSearch={() => setSearchOpen(true)} loggedIn={loggedIn} lang={lang} onLang={() => setLang((l) => l === 'en' ? 'he' : 'en')} showAnnouncement={props.showAnnouncement} />
      <main style={{ flex: 1 }}>
        <div key={route} className="oz-route">
          {route === 'home' && <Home go={go} addToCart={addToCart} lang={lang} />}
          {route === 'catalog' && <Catalog go={go} addToCart={addToCart} />}
          {route === 'product' && <Product product={product} go={go} addToCart={addToCart} />}
          {route === 'booking' && <Booking go={go} />}
          {route === 'cart' && <Cart cart={cart} setCart={setCart} go={go} />}
          {route === 'stores' && <StoreLocator go={go} />}
          {route === 'account' && <Account loggedIn={loggedIn} onLogin={() => setLoggedIn(true)} go={go} />}
          {route === 'checkout' && <Checkout cart={cart} subtotal={subtotal} go={go} onComplete={() => setCart([])} />}
        </div>
      </main>
      <Footer go={go} />

      <Search open={searchOpen} onClose={() => setSearchOpen(false)} go={go} />

      {toast && (
        <div style={{ position: 'fixed', bottom: 24, insetInlineEnd: 24, zIndex: 2000, animation: 'oz-slide-in-end var(--dur-base) var(--ease-out) both' }}>
          <Toast variant="success" title="Added to cart" icon={<Icon name="check-circle" size={18} />} onClose={() => setToast(null)}>
            {toast.brand} · {toast.name}
          </Toast>
        </div>
      )}
    </div>
  );
}

window.OZApp = App;

})();

})();
