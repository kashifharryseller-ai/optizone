import React from 'react'
import { Logo, Icon, IconButton } from '../ds/index.js'
import { useLang } from '../i18n/index.jsx'
import { useContent } from '../content/ContentProvider.jsx'
import { useScrolled } from '../lib/anim.jsx'

const navTo = (key) => (key === 'eyeglasses' ? 'catalog' : key === 'book' ? 'booking' : key === 'stores' ? 'stores' : 'catalog')

export function Header({ route, go, cartCount, onSearch, loggedIn }) {
  const { lang, t, toggle, L } = useLang()
  const { content, nav } = useContent()
  const scrolled = useScrolled(4)
  const ann = content.announcement || {}
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, boxShadow: scrolled ? 'var(--shadow-md)' : 'none', transition: 'box-shadow var(--dur-base) var(--ease-out)' }}>
      {ann.enabled !== false && (
        <div style={{ background: 'var(--pine-950)', color: 'var(--cream-200)', textAlign: 'center', fontSize: 12.5, letterSpacing: '0.06em', padding: '7px 16px', fontFamily: 'var(--font-body)' }}>
          {L(ann) || t.announce}
        </div>
      )}
      <div style={{ background: 'var(--pine-700)', borderBottom: '1px solid var(--border-on-dark)' }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 28px', height: 74, display: 'flex', alignItems: 'center', gap: 28 }}>
          <div style={{ cursor: 'pointer' }} onClick={() => go('home')}>
            <Logo variant="horizontal" theme="dark" size={22} tagline={false} />
          </div>
          <nav style={{ display: 'flex', gap: 26, marginInlineStart: 12, flexWrap: 'wrap' }}>
            {nav.map((n) => {
              const active = route === navTo(n.key) || (n.key === 'eyeglasses' && route === 'catalog')
              return (
                <a
                  key={n.key}
                  onClick={() => go(navTo(n.key))}
                  style={{ cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', color: active ? 'var(--amber-500)' : 'var(--cream-100)', paddingBottom: 2, borderBottom: `2px solid ${active ? 'var(--amber-500)' : 'transparent'}` }}
                >
                  {L(n.label)}
                </a>
              )
            })}
          </nav>
          <div style={{ marginInlineStart: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
            <IconButton variant="ghost" onClick={onSearch} aria-label={t.aria.search} style={{ color: 'var(--cream-100)' }}><Icon name="search" color="var(--cream-100)" /></IconButton>
            <IconButton variant="ghost" onClick={() => go('account')} aria-label={t.aria.wishlist} style={{ color: 'var(--cream-100)' }}><Icon name="heart" color="var(--cream-100)" /></IconButton>
            <IconButton variant="ghost" onClick={() => go('account')} aria-label={t.aria.account} style={{ color: loggedIn ? 'var(--amber-500)' : 'var(--cream-100)' }}><Icon name="user" color={loggedIn ? 'var(--amber-500)' : 'var(--cream-100)'} /></IconButton>
            <div style={{ position: 'relative' }}>
              <IconButton variant="accent" round onClick={() => go('cart')} aria-label={t.aria.cart}><Icon name="shopping-bag" /></IconButton>
              {cartCount > 0 && (
                <span style={{ position: 'absolute', top: -4, insetInlineEnd: -4, minWidth: 18, height: 18, padding: '0 5px', background: 'var(--pine-950)', color: 'var(--cream-100)', borderRadius: 999, fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--pine-700)' }}>{cartCount}</span>
              )}
            </div>
            <span
              onClick={toggle}
              style={{ marginInlineStart: 10, fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: '0.08em', color: 'var(--cream-200)', border: '1px solid var(--border-on-dark)', borderRadius: 'var(--radius-pill)', padding: '5px 12px', cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              {t.langLabel}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}

export function Footer({ go }) {
  const { t, L } = useLang()
  const { content } = useContent()
  const s = content.settings || {}
  const c = s.contact || {}
  const routes = [
    ['catalog', 'catalog', 'catalog', 'catalog', 'catalog'],
    ['booking', 'catalog', 'catalog', 'stores', 'catalog'],
    ['home', 'stores', 'home', 'home', 'stores'],
  ]
  return (
    <footer style={{ background: 'var(--pine-800)', color: 'var(--cream-200)', marginTop: 0 }}>
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '56px 28px 28px', display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 40 }}>
        <div>
          <Logo variant="wordmark" theme="dark" size={26} />
          <p style={{ marginTop: 18, fontSize: 14, lineHeight: 1.6, color: 'var(--pine-200)', maxWidth: 240 }}>{L(s.footerBlurb) || t.footer.blurb}</p>
          <div style={{ marginTop: 16, fontSize: 13, color: 'var(--pine-200)', lineHeight: 1.8 }}>
            {L({ en: c.addressEn, he: c.addressHe }) || t.footer.address}<br />{c.phone || '058-644-2303'} · {c.site || 'www.optizone.co.il'}
          </div>
        </div>
        {t.footer.cols.map((col, ci) => (
          <div key={col.h}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--amber-500)', marginBottom: 16 }}>{col.h}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {col.items.map((i, ii) => (
                <a key={i} onClick={() => go && go(routes[ci][ii])} style={{ fontSize: 14, color: 'var(--cream-200)', cursor: 'pointer' }}>{i}</a>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ borderTop: '1px solid var(--border-on-dark)' }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '18px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12.5, color: 'var(--pine-200)', flexWrap: 'wrap', gap: 12 }}>
          <span>{t.footer.copyright}</span>
          <span style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
            {t.footer.legal.map((l) => <span key={l}>{l}</span>)}
          </span>
        </div>
      </div>
    </footer>
  )
}
