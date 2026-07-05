import React, { useEffect, useMemo, useState } from 'react'
import { GlassesMark } from '../ds/index.js'
import { api, getToken, setToken } from '../api.js'
import Login from './Login.jsx'
import { Btn } from './ui.jsx'
import Dashboard from './sections/Dashboard.jsx'
import Products from './sections/Products.jsx'
import Homepage from './sections/Homepage.jsx'
import StoresSettings from './sections/StoresSettings.jsx'
import Orders from './sections/Orders.jsx'
import Bookings from './sections/Bookings.jsx'

const NAV = [
  { key: 'dashboard', label: 'Dashboard', icon: '▦' },
  { key: 'products', label: 'Products', icon: '◈' },
  { key: 'homepage', label: 'Homepage & Content', icon: '❖' },
  { key: 'stores', label: 'Stores & Settings', icon: '⚑' },
  { key: 'orders', label: 'Orders', icon: '⛁' },
  { key: 'bookings', label: 'Appointments', icon: '◷' },
]
const CONTENT_SECTIONS = new Set(['products', 'homepage', 'stores'])

export default function AdminApp() {
  const [authed, setAuthed] = useState(null) // null = checking
  const [section, setSection] = useState('dashboard')
  const [content, setContentState] = useState(null)
  const [original, setOriginal] = useState(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => { document.documentElement.dir = 'ltr'; document.documentElement.lang = 'en' }, [])

  useEffect(() => {
    if (!getToken()) { setAuthed(false); return }
    api.me().then(() => setAuthed(true)).catch(() => { setToken(null); setAuthed(false) })
  }, [])

  useEffect(() => {
    if (authed !== true) return
    api.getContent().then((c) => { setContentState(c); setOriginal(c) }).catch((e) => setMsg(e.message))
  }, [authed])

  const dirty = useMemo(() => content && original && JSON.stringify(content) !== JSON.stringify(original), [content, original])

  const save = async () => {
    setSaving(true); setMsg('')
    try { const saved = await api.saveContent(content); setOriginal(saved); setContentState(saved); setMsg('Saved') ; setTimeout(() => setMsg(''), 2500) }
    catch (e) { setMsg(e.message) } finally { setSaving(false) }
  }

  const logout = () => { setToken(null); setAuthed(false); setContentState(null) }

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
            <button key={n.key} onClick={() => setSection(n.key)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-body)', fontSize: 14, background: section === n.key ? 'var(--pine-600)' : 'transparent', color: section === n.key ? 'var(--cream-100)' : 'var(--pine-200)' }}>
              <span style={{ width: 18, textAlign: 'center', color: section === n.key ? 'var(--amber-500)' : 'inherit' }}>{n.icon}</span>{n.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: 14, borderTop: '1px solid var(--border-on-dark)', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Btn variant="ghost" size="sm" style={{ color: 'var(--pine-200)', justifyContent: 'flex-start' }} onClick={() => window.open('/', '_blank')}>↗ View storefront</Btn>
          <Btn variant="ghost" size="sm" style={{ color: 'var(--pine-200)', justifyContent: 'flex-start' }} onClick={logout}>⏻ Sign out</Btn>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <header style={{ position: 'sticky', top: 0, zIndex: 20, background: 'var(--bg-page-alt)', borderBottom: '1px solid var(--border-hair)', padding: '16px 28px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--text-strong)' }}>{NAV.find((n) => n.key === section)?.label}</h1>
          <div style={{ marginInlineStart: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
            {msg && <span style={{ fontSize: 13, color: msg === 'Saved' ? 'var(--success)' : 'var(--danger)' }}>{msg}</span>}
            {needsContent && <Btn variant="accent" onClick={save} disabled={!dirty || saving}>{saving ? 'Saving…' : dirty ? 'Save changes' : 'Saved'}</Btn>}
          </div>
        </header>

        <div style={{ padding: 28, maxWidth: 1080, width: '100%' }}>
          {!ready ? <Center>Loading content…</Center> : (
            <>
              {section === 'dashboard' && <Dashboard go={setSection} />}
              {section === 'products' && <Products content={content} setContent={setContentState} />}
              {section === 'homepage' && <Homepage content={content} setContent={setContentState} />}
              {section === 'stores' && <StoresSettings content={content} setContent={setContentState} />}
              {section === 'orders' && <Orders />}
              {section === 'bookings' && <Bookings />}
            </>
          )}
        </div>
      </main>
    </div>
  )
}

function Center({ children }) {
  return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>{children}</div>
}
