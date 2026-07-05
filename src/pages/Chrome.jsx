import React, { useEffect, useRef, useState } from 'react'
import { Logo, Icon, IconButton } from '../ds/index.js'
import { useLang } from '../i18n/index.jsx'
import { useContent } from '../content/ContentProvider.jsx'
import { useAuth } from '../auth/AuthProvider.jsx'
import { useScrolled } from '../lib/anim.jsx'

// Each navbar item opens its own page: category pages for eyeglasses /
// sunglasses / contacts, a Brands index, Stores, and the booking CTA.


// VisionExpress-style account dropdown under the user icon.
function AccountMenu({ open, onClose, openAccount }) {
  const { user, logout } = useAuth()
  const m = useLang().t.account.menu
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose() }
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey) }
  }, [open, onClose])
  if (!open) return null

  const Item = ({ icon, label, onClick, tone }) => (
    <button onClick={() => { onClose(); onClick() }}
      style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '11px 18px', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'start', fontFamily: 'var(--font-body)', fontSize: 14, color: tone || 'var(--text-body)' }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--pine-50)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
      <Icon name={icon} size={17} color={tone || 'var(--pine-700)'} /> {label}
    </button>
  )

  return (
    <div ref={ref} style={{ position: 'absolute', top: 'calc(100% + 8px)', insetInlineEnd: 0, width: 250, background: 'var(--surface-card)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-hair)', overflow: 'hidden', zIndex: 80, animation: 'oz-slide-down var(--dur-base) var(--ease-out) both' }}>
      {user ? (
        <>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-hair)', background: 'var(--cream-100)' }}>
            <div style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--text-strong)' }}>{user.name}</div>
            <div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>{user.email}</div>
          </div>
          <div style={{ padding: '6px 0' }}>
            <Item icon="user" label={m.account} onClick={() => openAccount('orders')} />
            <Item icon="package" label={m.orders} onClick={() => openAccount('orders')} />
            <Item icon="calendar" label={m.appts} onClick={() => openAccount('appts')} />
            <Item icon="heart" label={m.wishlist} onClick={() => openAccount('wishlist')} />
            <Item icon="lock" label={m.settings} onClick={() => openAccount('settings')} />
          </div>
          <div style={{ borderTop: '1px solid var(--border-hair)', padding: '6px 0' }}>
            <Item icon="x" label={m.signout} onClick={logout} tone="var(--danger)" />
          </div>
        </>
      ) : (
        <div style={{ padding: '6px 0' }}>
          <Item icon="user" label={m.signin} onClick={() => openAccount('orders')} />
          <Item icon="user-plus" label={m.register} onClick={() => openAccount('orders')} />
        </div>
      )}
    </div>
  )
}

export function Header({ navActive, go, openCatalog, cartCount, onSearch, openAccount }) {
  const { t, toggle, L } = useLang()
  const { content, nav } = useContent()
  const { user } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const scrolled = useScrolled(4)
  const ann = content.announcement || {}
  const loggedIn = !!user
  const navGo = (key) => {
    if (key === 'eyeglasses' || key === 'sunglasses' || key === 'contacts') return openCatalog(key)
    if (key === 'brands') return go('brands')
    if (key === 'stores') return go('stores')
    if (key === 'book') return go('booking')
  }
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, boxShadow: scrolled ? 'var(--shadow-md)' : 'none', transition: 'box-shadow var(--dur-base) var(--ease-out)' }}>
      {ann.enabled !== false && (
        <div style={{ background: 'var(--pine-950)', color: 'var(--cream-200)', textAlign: 'center', fontSize: 12.5, letterSpacing: '0.06em', padding: '7px 16px', fontFamily: 'var(--font-body)' }}>
          {L(ann) || t.announce}
        </div>
      )}
      <div style={{ background: 'var(--pine-700)', borderBottom: '1px solid var(--border-on-dark)' }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 20px', height: 74, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ cursor: 'pointer' }} onClick={() => go('home')}>
            <Logo variant="horizontal" theme="dark" size={20} tagline={false} />
          </div>
          <nav className="oz-nav" style={{ marginInlineStart: 6 }}>
            {nav.map((n) => (
              <a
                key={n.key}
                onClick={() => navGo(n.key)}
                className={(navActive === n.key ? 'active ' : '') + (n.key === 'book' ? 'oz-nav-cta' : '')}
              >
                {L(n.label)}
              </a>
            ))}
          </nav>
          <div style={{ marginInlineStart: 'auto', display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton variant="ghost" onClick={onSearch} aria-label={t.aria.search} style={{ color: 'var(--cream-100)' }}><Icon name="search" color="var(--cream-100)" /></IconButton>
            <IconButton variant="ghost" onClick={() => openAccount('wishlist')} aria-label={t.aria.wishlist} style={{ color: 'var(--cream-100)' }}><Icon name="heart" color="var(--cream-100)" /></IconButton>
            <div style={{ position: 'relative' }}>
              <IconButton variant="ghost" onClick={() => setMenuOpen((o) => !o)} aria-label={t.aria.account} style={{ color: loggedIn ? 'var(--amber-500)' : 'var(--cream-100)' }}><Icon name="user" color={loggedIn ? 'var(--amber-500)' : 'var(--cream-100)'} /></IconButton>
              <AccountMenu open={menuOpen} onClose={() => setMenuOpen(false)} openAccount={openAccount} />
            </div>
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

export function Footer({ go, openCatalog }) {
  const { t, L } = useLang()
  const { content } = useContent()
  const s = content.settings || {}
  const c = s.contact || {}
  // Column links → their destinations (category pages, booking, stores…).
  const actions = [
    [() => openCatalog('eyeglasses'), () => openCatalog('sunglasses'), () => openCatalog('contacts'), () => openCatalog('all'), () => openCatalog('all')],
    [() => go('booking'), () => openCatalog('eyeglasses'), () => openCatalog('contacts'), () => go('stores'), () => go('booking')],
    [() => go('home'), () => go('stores'), () => go('home'), () => go('home'), () => go('stores')],
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
                <a key={i} onClick={() => actions[ci]?.[ii]?.()} style={{ fontSize: 14, color: 'var(--cream-200)', cursor: 'pointer' }}>{i}</a>
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
