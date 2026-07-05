import React, { useState } from 'react'
import { GlassesMark, DiamondRule } from '../ds/index.js'
import { api, setToken } from '../api.js'
import { Field, Text, Btn } from './ui.jsx'

export default function Login({ onAuthed }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true); setErr('')
    try {
      const { token } = await api.login(username, password)
      setToken(token)
      onAuthed()
    } catch (e2) { setErr(e2.message) } finally { setBusy(false) }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--pine-800)', padding: 24 }}>
      <form onSubmit={submit} style={{ width: 400, maxWidth: '100%', background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', padding: '38px 34px' }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <GlassesMark size={44} color="var(--pine-700)" />
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 24, color: 'var(--text-strong)', margin: '12px 0 2px' }}>OPTIZONE Admin</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>Sign in to manage your storefront</p>
        </div>
        <div style={{ margin: '18px 0' }}><DiamondRule /></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Field label="Username"><Text value={username} onChange={setUsername} placeholder="admin" autoFocus /></Field>
          <Field label="Password"><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={{ width: '100%', height: 40, padding: '0 12px', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none' }} /></Field>
          {err && <div style={{ fontSize: 13, color: 'var(--danger)', background: '#F6E3DE', borderRadius: 'var(--radius-sm)', padding: '8px 12px' }}>{err}</div>}
          <Btn variant="accent" type="submit" onClick={submit} style={{ height: 44, justifyContent: 'center' }} disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</Btn>
        </div>
      </form>
    </div>
  )
}
