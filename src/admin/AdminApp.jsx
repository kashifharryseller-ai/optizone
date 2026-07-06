import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Icon } from '../ds/index.js'
import { api, getToken, setToken } from '../api.js'
import Login from './Login.jsx'
import { Btn } from './ui.jsx'
import { Sidebar } from './Sidebar.jsx'
import Dashboard from './sections/Dashboard.jsx'
import Products from './sections/Products.jsx'
import Homepage from './sections/Homepage.jsx'
import StoresSettings from './sections/StoresSettings.jsx'
import Orders from './sections/Orders.jsx'
import Customers from './sections/Customers.jsx'
import Security from './sections/Security.jsx'
import Bookings from './sections/Bookings.jsx'
import Reports from './sections/Reports.jsx'
import Discounts from './sections/Discounts.jsx'
import TryMirrorAssets from './sections/TryMirrorAssets.jsx'

// Navigation config — drives the reusable <Sidebar>. Each leaf maps to a
// section (a main-content view); groups hold sub-items.
const MENU = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', section: 'dashboard' },
  { id: 'products', label: 'Products / Frames', icon: 'glasses', children: [
    { id: 'products-all', label: 'All Products', section: 'products' },
    { id: 'products-cat', label: 'Categories', section: 'products' },
    { id: 'products-inv', label: 'Inventory', section: 'products' },
  ] },
  { id: 'orders', label: 'Orders', icon: 'package', section: 'orders', badgeKey: 'orders' },
  { id: 'customers', label: 'Customers', icon: 'user', section: 'customers' },
  { id: 'bookings', label: 'Appointments', icon: 'calendar', section: 'bookings' },
  { id: 'armirror', label: 'Try-Mirror / AR', icon: 'camera', section: 'armirror' },
  { id: 'content', label: 'Content & Homepage', icon: 'file-text', section: 'homepage' },
  { id: 'discounts', label: 'Discounts', icon: 'tag', section: 'discounts' },
  { id: 'reports', label: 'Reports', icon: 'bar-chart', section: 'reports' },
  { id: 'settings', label: 'Settings', icon: 'settings', children: [
    { id: 'settings-store', label: 'Store', section: 'stores' },
    { id: 'settings-branches', label: 'Branches', section: 'stores' },
    { id: 'settings-l10n', label: 'Localization · RTL', section: 'stores' },
    { id: 'settings-users', label: 'Users & Roles', section: 'security' },
  ] },
]
// Default nav id for a section reached without an explicit item (e.g. search).
const SECTION_DEFAULT_NAV = {
  dashboard: 'dashboard', products: 'products-all', orders: 'orders', customers: 'customers',
  bookings: 'bookings', armirror: 'armirror', homepage: 'content', discounts: 'discounts',
  reports: 'reports', stores: 'settings-store', security: 'settings-users',
}
function findNav(id) {
  for (const it of MENU) {
    if (it.id === id) return { label: it.label }
    for (const c of it.children || []) if (c.id === id) return { group: it.label, label: c.label }
  }
  return { label: 'Dashboard' }
}
const CONTENT_SECTIONS = new Set(['products', 'homepage', 'stores', 'discounts', 'armirror'])

// Small matchMedia hook for the mobile-drawer breakpoint.
function useMediaQuery(query) {
  const [match, setMatch] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setMatch(mq.matches)
    mq.addEventListener('change', on); on()
    return () => mq.removeEventListener('change', on)
  }, [query])
  return match
}

export default function AdminApp() {
  const [authed, setAuthed] = useState(null) // null = checking
  const [section, setSection] = useState('dashboard')
  const [activeNavId, setActiveNavId] = useState('dashboard')
  const [content, setContentState] = useState(null)
  const [original, setOriginal] = useState(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null) // { kind: 'ok'|'err', text }
  const [owner, setOwner] = useState('')
  const [stats, setStats] = useState(null)
  const [sectionQuery, setSectionQuery] = useState({})
  const toastTimer = useRef(null)

  // Sidebar UI state — collapse + direction persist; mobile drawer is transient.
  const mobile = useMediaQuery('(max-width: 900px)')
  const [collapsed, setCollapsed] = useState(() => { try { return localStorage.getItem('oz_admin_collapsed') === '1' } catch { return false } })
  const [dir, setDir] = useState(() => { try { return localStorage.getItem('oz_admin_dir') === 'rtl' ? 'rtl' : 'ltr' } catch { return 'ltr' } })
  const [mobileNav, setMobileNav] = useState(false)
  useEffect(() => { try { localStorage.setItem('oz_admin_collapsed', collapsed ? '1' : '0') } catch { /* ignore */ } }, [collapsed])
  useEffect(() => { document.documentElement.dir = dir; document.documentElement.lang = 'en'; try { localStorage.setItem('oz_admin_dir', dir) } catch { /* ignore */ } }, [dir])
  useEffect(() => () => { document.documentElement.dir = 'ltr' }, []) // restore on unmount

  useEffect(() => {
    if (!getToken()) { setAuthed(false); return }
    api.me().then((r) => { setAuthed(true); setOwner(r?.user?.username || '') }).catch(() => { setToken(null); setAuthed(false) })
  }, [])

  useEffect(() => {
    if (authed === true && !owner) api.me().then((r) => setOwner(r?.user?.username || '')).catch(() => {})
  }, [authed, owner])

  // Order-count badge in the sidebar.
  useEffect(() => { if (authed === true) api.stats().then(setStats).catch(() => {}) }, [authed])

  // Mid-session 401 → back to login.
  useEffect(() => {
    const onExpired = () => { setToken(null); setAuthed(false); setContentState(null) }
    window.addEventListener('oz-admin-401', onExpired)
    return () => window.removeEventListener('oz-admin-401', onExpired)
  }, [])

  useEffect(() => {
    if (authed !== true) return
    api.getContent().then((c) => { setContentState(c); setOriginal(c) }).catch((e) => setToast({ kind: 'err', text: `Couldn’t load content — ${e.message}` }))
  }, [authed])

  const dirty = useMemo(() => content && original && JSON.stringify(content) !== JSON.stringify(original), [content, original])

  useEffect(() => {
    if (!dirty) return
    const onBeforeUnload = (e) => { e.preventDefault(); e.returnValue = '' }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [dirty])

  // ── Autosave draft ──────────────────────────────────────────────────────────
  const DRAFT_KEY = 'oz_content_draft'
  const [draftAt, setDraftAt] = useState(null)
  const [restorable, setRestorable] = useState(null)
  useEffect(() => {
    if (!dirty || !content) return
    const t = setTimeout(() => {
      try { localStorage.setItem(DRAFT_KEY, JSON.stringify({ ts: Date.now(), content })); setDraftAt(new Date()) } catch { /* full/blocked */ }
    }, 1500)
    return () => clearTimeout(t)
  }, [content, dirty])
  useEffect(() => {
    if (!original || restorable !== null) return
    try {
      const raw = localStorage.getItem(DRAFT_KEY)
      if (!raw) { setRestorable(false); return }
      const draft = JSON.parse(raw)
      setRestorable(draft?.content && JSON.stringify(draft.content) !== JSON.stringify(original) ? draft : false)
    } catch { setRestorable(false) }
  }, [original, restorable])
  const restoreDraft = () => { if (restorable?.content) setContentState(restorable.content); setRestorable(false) }
  const discardDraft = () => { try { localStorage.removeItem(DRAFT_KEY) } catch { /* ignore */ } setRestorable(false); setDraftAt(null) }

  const save = async () => {
    setSaving(true); setToast(null); clearTimeout(toastTimer.current)
    try {
      const saved = await api.saveContent(content)
      setOriginal(saved); setContentState(saved)
      try { localStorage.removeItem(DRAFT_KEY) } catch { /* ignore */ }
      setDraftAt(null)
      setToast({ kind: 'ok', text: 'Changes saved' })
      toastTimer.current = setTimeout(() => setToast(null), 2600)
    } catch (e) {
      setToast({ kind: 'err', text: `Save failed — ${e.message}. Your edits are still here; try again.` })
    } finally { setSaving(false) }
  }

  const logout = () => {
    if (dirty && !window.confirm('You have unsaved changes that will be lost. Sign out anyway?')) return
    setToken(null); setAuthed(false); setContentState(null)
  }

  // Navigate to a section, optionally via a specific nav item + list query.
  const openSection = (nextSection, query, navId) => {
    if (query !== undefined) setSectionQuery((s) => ({ ...s, [nextSection]: query }))
    setSection(nextSection)
    setActiveNavId(navId || SECTION_DEFAULT_NAV[nextSection] || nextSection)
  }

  if (authed === null) return <Center>Loading…</Center>
  if (!authed) return <Login onAuthed={() => setAuthed(true)} />

  const needsContent = CONTENT_SECTIONS.has(section)
  const ready = !needsContent || content
  const cur = findNav(activeNavId)

  return (
    <div dir={dir} style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-page)' }}>
      <Sidebar
        menu={MENU}
        activeSection={section}
        activeId={activeNavId}
        badges={{ orders: stats?.newOrders || 0 }}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        mobile={mobile}
        mobileOpen={mobileNav}
        onCloseMobile={() => setMobileNav(false)}
        owner={owner || 'admin'}
        role="Store owner"
        dir={dir}
        onToggleDir={() => setDir((d) => (d === 'rtl' ? 'ltr' : 'rtl'))}
        onNavigate={(item) => openSection(item.section, item.query, item.id)}
        onProfile={() => openSection('security', undefined, 'settings-users')}
        onOpenStorefront={() => window.open('/', '_blank')}
        onLogout={logout}
      />

      <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <header style={{ position: 'sticky', top: 0, zIndex: 20, background: 'var(--bg-page-alt)', borderBottom: '1px solid var(--border-hair)', padding: '12px 28px', display: 'flex', alignItems: 'center', gap: 16 }}>
          {mobile && (
            <button type="button" aria-label="Open menu" onClick={() => setMobileNav(true)} style={{ border: '1px solid var(--border-hair)', background: 'var(--white)', borderRadius: 'var(--radius-sm)', width: 38, height: 38, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flex: '0 0 auto' }}>
              <Icon name="menu" size={18} color="var(--text-strong)" />
            </button>
          )}
          <div style={{ minWidth: 0 }}>
            <nav aria-label="Breadcrumb" style={{ fontFamily: 'var(--font-display)', fontSize: 10.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: 2 }}>
              OPTIZONE Admin <span aria-hidden="true">/</span> {cur.group && <><span>{cur.group}</span> <span aria-hidden="true">/</span> </>}<span style={{ color: 'var(--amber-700)' }}>{cur.label}</span>
            </nav>
            <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--text-strong)' }}>{cur.label}</h1>
          </div>
          <div style={{ marginInlineStart: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
            <GlobalSearch content={content} openSection={openSection} />
            {needsContent && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {dirty && (
                  <span role="status" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--amber-700)', fontFamily: 'var(--font-display)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--amber-600)' }} />
                    Unsaved changes{draftAt ? ` · draft ${draftAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}
                  </span>
                )}
                <Btn variant="accent" onClick={save} disabled={!dirty || saving}>{saving ? 'Saving…' : 'Save changes'}</Btn>
              </span>
            )}
          </div>
        </header>

        {restorable && restorable !== false && (
          <div role="alert" style={{ margin: '18px 28px 0', maxWidth: 1024, display: 'flex', alignItems: 'center', gap: 12, background: 'var(--amber-50)', border: '1px solid var(--amber-600)', borderRadius: 'var(--radius-md)', padding: '12px 16px', fontSize: 13.5, color: 'var(--text-body)' }}>
            <span>You have an unsaved local draft from {new Date(restorable.ts).toLocaleString()}. Restore it?</span>
            <span style={{ marginInlineStart: 'auto', display: 'flex', gap: 8 }}>
              <Btn variant="accent" size="sm" onClick={restoreDraft}>Restore draft</Btn>
              <Btn variant="ghost" size="sm" onClick={discardDraft}>Discard</Btn>
            </span>
          </div>
        )}

        <div style={{ padding: 28, maxWidth: 1080, width: '100%' }}>
          {!ready ? <Center>Loading content…</Center> : (
            <>
              {section === 'dashboard' && <Dashboard go={(s) => openSection(s)} />}
              {section === 'products' && <Products content={content} setContent={setContentState} initialQuery={sectionQuery.products} />}
              {section === 'homepage' && <Homepage content={content} setContent={setContentState} />}
              {section === 'stores' && <StoresSettings content={content} setContent={setContentState} />}
              {section === 'orders' && <Orders initialQuery={sectionQuery.orders} />}
              {section === 'customers' && <Customers initialQuery={sectionQuery.customers} />}
              {section === 'bookings' && <Bookings initialQuery={sectionQuery.bookings} />}
              {section === 'armirror' && <TryMirrorAssets content={content} setContent={setContentState} />}
              {section === 'discounts' && <Discounts content={content} setContent={setContentState} />}
              {section === 'reports' && <Reports />}
              {section === 'security' && <Security />}
            </>
          )}
        </div>
      </main>

      {toast && (
        <div role="status" style={{ position: 'fixed', bottom: 22, insetInlineEnd: 22, zIndex: 90, display: 'flex', alignItems: 'center', gap: 10, background: toast.kind === 'ok' ? 'var(--pine-700)' : '#8A2E21', color: 'var(--cream-100)', borderRadius: 'var(--radius-md)', padding: '12px 18px', boxShadow: 'var(--shadow-lg)', maxWidth: 420, fontSize: 13.5 }}>
          <Icon name={toast.kind === 'ok' ? 'check-circle' : 'info'} size={17} color={toast.kind === 'ok' ? 'var(--amber-500)' : 'var(--cream-100)'} />
          {toast.text}
          {toast.kind === 'err' && <Btn variant="ghost" size="sm" style={{ color: 'var(--cream-100)' }} onClick={save}>Retry</Btn>}
          <button type="button" aria-label="Dismiss" onClick={() => setToast(null)} style={{ border: 'none', background: 'transparent', color: 'var(--cream-200)', cursor: 'pointer', fontSize: 15, padding: 0 }}>×</button>
        </div>
      )}
    </div>
  )
}

// Global search across products, orders, customers and appointments.
function GlobalSearch({ content, openSection }) {
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const cache = useRef(null)
  const [remote, setRemote] = useState(null)
  const boxRef = useRef(null)

  useEffect(() => {
    const onDoc = (e) => { if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const ensureRemote = () => {
    if (cache.current) return
    cache.current = { orders: [], users: [], bookings: [] }
    Promise.allSettled([api.orders(), api.adminUsers(), api.bookings()]).then(([o, u, b]) => {
      cache.current = {
        orders: o.status === 'fulfilled' ? o.value : [],
        users: u.status === 'fulfilled' ? u.value : [],
        bookings: b.status === 'fulfilled' ? b.value : [],
      }
      setRemote(cache.current)
    })
  }

  const ql = q.trim().toLowerCase()
  const results = []
  if (ql.length >= 2) {
    for (const p of (content?.products || [])) {
      if (`${p.brand} ${p.name}`.toLowerCase().includes(ql)) results.push({ icon: 'glasses', label: `${p.brand} ${p.name}`, sub: 'Product', section: 'products', query: p.name })
    }
    const r = remote || cache.current
    for (const o of (r?.orders || [])) {
      if (`${o.id} ${o.customer?.name || ''} ${o.customer?.email || ''}`.toLowerCase().includes(ql)) results.push({ icon: 'package', label: `${o.id} · ${o.customer?.name || ''}`, sub: 'Order', section: 'orders', query: o.id })
    }
    for (const u of (r?.users || [])) {
      if (`${u.name} ${u.email}`.toLowerCase().includes(ql)) results.push({ icon: 'user', label: `${u.name} · ${u.email}`, sub: 'Customer', section: 'customers', query: u.email })
    }
    for (const b of (r?.bookings || [])) {
      if (`${b.id} ${b.name || ''} ${b.phone || ''}`.toLowerCase().includes(ql)) results.push({ icon: 'calendar', label: `${b.id} · ${b.name || ''}`, sub: 'Appointment', section: 'bookings', query: b.id })
    }
  }

  return (
    <div ref={boxRef} style={{ position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 36, padding: '0 12px', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-pill)', background: 'var(--white)' }}>
        <Icon name="search" size={15} color="var(--text-faint)" />
        <input
          aria-label="Search everything"
          placeholder="Search products, orders, customers…"
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); if (e.target.value.trim().length >= 2) ensureRemote() }}
          onFocus={() => q.trim().length >= 2 && setOpen(true)}
          style={{ border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font-body)', fontSize: 13.5, width: 220, color: 'var(--text-strong)' }}
        />
      </div>
      {open && ql.length >= 2 && (
        <div style={{ position: 'absolute', top: 'calc(100% + 6px)', insetInlineEnd: 0, width: 340, maxHeight: 320, overflowY: 'auto', background: 'var(--surface-card)', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', zIndex: 60 }}>
          {results.length === 0 ? (
            <div style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-muted)' }}>No matches for “{q}”.</div>
          ) : results.slice(0, 12).map((r, i) => (
            <button key={i} type="button" onClick={() => { setOpen(false); setQ(''); openSection(r.section, r.query) }}
              style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 14px', border: 'none', borderBottom: '1px solid var(--border-hair)', background: 'transparent', cursor: 'pointer', textAlign: 'start', fontFamily: 'var(--font-body)', fontSize: 13.5, color: 'var(--text-body)' }}>
              <Icon name={r.icon} size={15} color="var(--pine-700)" />
              <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.label}</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-faint)' }}>{r.sub}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function Center({ children }) {
  return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>{children}</div>
}
