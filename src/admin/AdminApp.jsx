import React, { useEffect, useMemo, useRef, useState } from 'react'
import { GlassesMark, Icon } from '../ds/index.js'
import { api, getToken, setToken } from '../api.js'
import Login from './Login.jsx'
import { Btn } from './ui.jsx'
import Dashboard from './sections/Dashboard.jsx'
import Products from './sections/Products.jsx'
import Homepage from './sections/Homepage.jsx'
import StoresSettings from './sections/StoresSettings.jsx'
import Orders from './sections/Orders.jsx'
import Customers from './sections/Customers.jsx'
import Security from './sections/Security.jsx'
import Bookings from './sections/Bookings.jsx'

// Lucide icons via the shared <Icon> set — unicode glyphs rendered as blank
// boxes on some systems/fonts.
const NAV = [
  { key: 'dashboard', label: 'Dashboard', icon: 'layers' },
  { key: 'products', label: 'Products', icon: 'glasses' },
  { key: 'homepage', label: 'Homepage & Content', icon: 'file-text' },
  { key: 'stores', label: 'Stores & Settings', icon: 'store' },
  { key: 'orders', label: 'Orders', icon: 'package' },
  { key: 'customers', label: 'Customers', icon: 'user' },
  { key: 'bookings', label: 'Appointments', icon: 'calendar' },
  { key: 'security', label: 'Security', icon: 'shield-check' },
]
const CONTENT_SECTIONS = new Set(['products', 'homepage', 'stores'])

export default function AdminApp() {
  const [authed, setAuthed] = useState(null) // null = checking
  const [section, setSection] = useState('dashboard')
  const [content, setContentState] = useState(null)
  const [original, setOriginal] = useState(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null) // { kind: 'ok'|'err', text }
  const [owner, setOwner] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  // Global search → jump to a section with its list pre-filtered.
  const [sectionQuery, setSectionQuery] = useState({})
  const toastTimer = useRef(null)

  useEffect(() => { document.documentElement.dir = 'ltr'; document.documentElement.lang = 'en' }, [])

  useEffect(() => {
    if (!getToken()) { setAuthed(false); return }
    api.me().then((r) => { setAuthed(true); setOwner(r?.user?.username || '') }).catch(() => { setToken(null); setAuthed(false) })
  }, [])

  // Owner identity for the avatar menu — also after an interactive sign-in
  // (the mount-time fetch above only covers an already-saved session).
  useEffect(() => {
    if (authed === true && !owner) api.me().then((r) => setOwner(r?.user?.username || '')).catch(() => {})
  }, [authed, owner])

  // If any admin call 401s mid-session (expired/rotated token), drop straight
  // back to the login screen instead of leaving dead "Not authenticated" panels.
  useEffect(() => {
    const onExpired = () => { setToken(null); setAuthed(false); setContentState(null) }
    window.addEventListener('oz-admin-401', onExpired)
    return () => window.removeEventListener('oz-admin-401', onExpired)
  }, [])

  useEffect(() => {
    if (authed !== true) return
    api.getContent().then((c) => { setContentState(c); setOriginal(c) }).catch((e) => setMsg(e.message))
  }, [authed])

  const dirty = useMemo(() => content && original && JSON.stringify(content) !== JSON.stringify(original), [content, original])

  // Warn before closing/leaving the tab with unsaved content edits.
  useEffect(() => {
    if (!dirty) return
    const onBeforeUnload = (e) => { e.preventDefault(); e.returnValue = '' }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [dirty])

  // ── Autosave draft ─────────────────────────────────────────────────────────
  // Unsaved edits are snapshotted to localStorage (debounced) so a crash or
  // accidental close never loses work; on return, a banner offers to restore.
  const DRAFT_KEY = 'oz_content_draft'
  const [draftAt, setDraftAt] = useState(null)     // when the draft was last written
  const [restorable, setRestorable] = useState(null) // draft found on load
  useEffect(() => {
    if (!dirty || !content) return
    const t = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify({ ts: Date.now(), content }))
        setDraftAt(new Date())
      } catch { /* storage full/blocked */ }
    }, 1500)
    return () => clearTimeout(t)
  }, [content, dirty])
  // Offer restore once the server copy is loaded (draft must differ from it).
  useEffect(() => {
    if (!original || restorable !== null) return
    try {
      const raw = localStorage.getItem(DRAFT_KEY)
      if (!raw) { setRestorable(false); return }
      const draft = JSON.parse(raw)
      const differs = draft?.content && JSON.stringify(draft.content) !== JSON.stringify(original)
      setRestorable(differs ? draft : false)
    } catch { setRestorable(false) }
  }, [original, restorable])
  const restoreDraft = () => { if (restorable?.content) setContentState(restorable.content); setRestorable(false) }
  const discardDraft = () => { try { localStorage.removeItem(DRAFT_KEY) } catch { /* ignore */ } setRestorable(false); setDraftAt(null) }

  // Save = explicit state machine: idle → Saving… → transient success toast /
  // persistent error toast with the button re-enabled for retry.
  const save = async () => {
    setSaving(true); setToast(null); clearTimeout(toastTimer.current)
    try {
      const saved = await api.saveContent(content)
      setOriginal(saved); setContentState(saved)
      try { localStorage.removeItem('oz_content_draft') } catch { /* ignore */ }
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

  const openSection = (key, query) => {
    if (query !== undefined) setSectionQuery((s) => ({ ...s, [key]: query }))
    setSection(key)
  }

  if (authed === null) return <Center>Loading…</Center>
  if (!authed) return <Login onAuthed={() => setAuthed(true)} />

  const needsContent = CONTENT_SECTIONS.has(section)
  const ready = !needsContent || content

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-page)' }}>
      {/* Sidebar */}
      <aside style={{ width: 236, flex: '0 0 auto', background: 'var(--pine-800)', color: 'var(--cream-100)', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh' }}>
        <div style={{ padding: '22px 22px 18px', borderBottom: '1px solid var(--border-on-dark)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <GlassesMark size={22} color="var(--amber-500)" />
          <div style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.18em', fontSize: 15 }}><span>OPTI</span><span style={{ color: 'var(--amber-500)' }}>ZONE</span></div>
        </div>
        <nav style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
          {NAV.map((n) => (
            <button key={n.key} onClick={() => setSection(n.key)} aria-current={section === n.key ? 'page' : undefined} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-body)', fontSize: 14, background: section === n.key ? 'var(--pine-600)' : 'transparent', color: section === n.key ? 'var(--cream-100)' : 'var(--pine-200)' }}>
              <span style={{ width: 18, display: 'inline-flex', justifyContent: 'center' }}>
                <Icon name={n.icon} size={16} color={section === n.key ? 'var(--amber-500)' : 'currentColor'} />
              </span>
              {n.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: 14, borderTop: '1px solid var(--border-on-dark)', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Btn variant="ghost" size="sm" style={{ color: 'var(--pine-200)', justifyContent: 'flex-start' }} onClick={() => window.open('/', '_blank')}><Icon name="share-2" size={14} color="currentColor" /> View storefront</Btn>
          <Btn variant="ghost" size="sm" style={{ color: 'var(--pine-200)', justifyContent: 'flex-start' }} onClick={logout}><Icon name="x" size={14} color="currentColor" /> Sign out</Btn>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <header style={{ position: 'sticky', top: 0, zIndex: 20, background: 'var(--bg-page-alt)', borderBottom: '1px solid var(--border-hair)', padding: '12px 28px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div>
            {/* breadcrumb */}
            <nav aria-label="Breadcrumb" style={{ fontFamily: 'var(--font-display)', fontSize: 10.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: 2 }}>
              OPTIZONE Admin <span aria-hidden="true">/</span> <span style={{ color: 'var(--amber-700)' }}>{NAV.find((n) => n.key === section)?.label}</span>
            </nav>
            <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--text-strong)' }}>{NAV.find((n) => n.key === section)?.label}</h1>
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
            <AccountMenu owner={owner} open={menuOpen} setOpen={setMenuOpen} onLogout={logout} />
          </div>
        </header>

        {/* Local draft found (e.g. after a crash or accidental close) */}
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
              {section === 'dashboard' && <Dashboard go={setSection} />}
              {section === 'products' && <Products content={content} setContent={setContentState} initialQuery={sectionQuery.products} />}
              {section === 'homepage' && <Homepage content={content} setContent={setContentState} />}
              {section === 'stores' && <StoresSettings content={content} setContent={setContentState} />}
              {section === 'orders' && <Orders initialQuery={sectionQuery.orders} />}
              {section === 'customers' && <Customers initialQuery={sectionQuery.customers} />}
              {section === 'bookings' && <Bookings initialQuery={sectionQuery.bookings} />}
              {section === 'security' && <Security />}
            </>
          )}
        </div>
      </main>

      {/* transient save toast — success auto-hides, errors persist until retry */}
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

// Header avatar + account dropdown (owner email, storefront link, sign out).
function AccountMenu({ owner, open, setOpen, onLogout }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey) }
  }, [open, setOpen])
  const initial = (owner || 'A').trim()[0].toUpperCase()
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button type="button" aria-label="Account menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}
        style={{ width: 36, height: 36, borderRadius: 999, border: '1px solid var(--border-hair)', background: 'var(--pine-700)', color: 'var(--cream-100)', fontFamily: 'var(--font-display)', fontSize: 15, cursor: 'pointer' }}>
        {initial}
      </button>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 8px)', insetInlineEnd: 0, width: 240, background: 'var(--surface-card)', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', overflow: 'hidden', zIndex: 60 }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-hair)', background: 'var(--cream-100)' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Store owner</div>
            <div style={{ fontSize: 13.5, color: 'var(--text-strong)', overflowWrap: 'anywhere' }}>{owner || 'admin'}</div>
          </div>
          <button type="button" onClick={() => { setOpen(false); window.open('/', '_blank') }} style={menuItemStyle}>
            <Icon name="store" size={15} color="var(--pine-700)" /> View storefront
          </button>
          <button type="button" onClick={() => { setOpen(false); onLogout() }} style={{ ...menuItemStyle, color: 'var(--danger)' }}>
            <Icon name="x" size={15} color="var(--danger)" /> Sign out
          </button>
        </div>
      )}
    </div>
  )
}
const menuItemStyle = { display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '11px 16px', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-body)', fontSize: 13.5, color: 'var(--text-body)' }

// Global search across products, orders, customers and appointments. Content
// is searched locally; the rest is fetched once (then cached) on first use.
// Picking a result jumps to that section with its list pre-filtered.
function GlobalSearch({ content, openSection }) {
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const cache = useRef(null) // { orders, users, bookings }
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
              style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 14px', border: 'none', borderBottom: '1px solid var(--border-hair)', background: 'transparent', cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-body)', fontSize: 13.5, color: 'var(--text-body)' }}>
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
