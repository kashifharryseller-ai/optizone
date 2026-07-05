import React, { useEffect, useState } from 'react'
import { Panel, Btn, Toggle } from '../ui.jsx'
import { api } from '../../api.js'

export default function Customers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [q, setQ] = useState('')

  const load = () => { setLoading(true); api.adminUsers().then(setUsers).catch((e) => setErr(e.message)).finally(() => setLoading(false)) }
  useEffect(load, [])

  const setActive = (id, active) => {
    api.setUserActive(id, active)
      .then(() => setUsers((us) => us.map((u) => (u.id === id ? { ...u, active } : u))))
      .catch((e) => setErr(e.message))
  }
  const del = (id) => {
    if (!confirm('Delete this customer account? Their orders stay in Orders.')) return
    api.deleteUser(id).then(() => setUsers((us) => us.filter((u) => u.id !== id))).catch((e) => setErr(e.message))
  }

  const ql = q.trim().toLowerCase()
  const list = ql ? users.filter((u) => (u.name + ' ' + u.email + ' ' + u.phone).toLowerCase().includes(ql)) : users

  const cell = { padding: '10px 12px', fontSize: 13.5, color: 'var(--text-body)', borderBottom: '1px solid var(--border-hair)', verticalAlign: 'middle' }
  const head = { ...cell, fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', borderBottom: '2px solid var(--border-hair)' }

  return (
    <Panel
      title="Customers"
      desc="Everyone registered on the website. Disable an account to block sign-in without deleting history."
      actions={
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name / email / phone"
            style={{ height: 36, padding: '0 12px', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-body)', fontSize: 13, outline: 'none', width: 220 }} />
          <Btn variant="outline" size="sm" onClick={load}>Refresh</Btn>
        </div>
      }
    >
      {err && <div style={{ color: 'var(--danger)', marginBottom: 12 }}>{err}</div>}
      {loading ? <p style={{ color: 'var(--text-muted)' }}>Loading…</p> : list.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>{users.length === 0 ? 'No customers yet — accounts created on the website appear here.' : 'No matches.'}</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ ...head, textAlign: 'start' }}>Customer</th>
                <th style={{ ...head, textAlign: 'start' }}>Phone</th>
                <th style={{ ...head, textAlign: 'center' }}>Orders</th>
                <th style={{ ...head, textAlign: 'center' }}>Appts</th>
                <th style={{ ...head, textAlign: 'end' }}>Spent</th>
                <th style={{ ...head, textAlign: 'start' }}>Joined</th>
                <th style={{ ...head, textAlign: 'center' }}>Active</th>
                <th style={head}></th>
              </tr>
            </thead>
            <tbody>
              {list.map((u) => (
                <tr key={u.id} style={{ opacity: u.active ? 1 : 0.55 }}>
                  <td style={cell}>
                    <div style={{ fontWeight: 700, color: 'var(--text-strong)' }}>{u.name}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>{u.email}</div>
                  </td>
                  <td style={cell}>{u.phone || '—'}</td>
                  <td style={{ ...cell, textAlign: 'center' }}>{u.orders}</td>
                  <td style={{ ...cell, textAlign: 'center' }}>{u.bookings}</td>
                  <td style={{ ...cell, textAlign: 'end', fontWeight: 600, color: 'var(--text-strong)' }}>₪{Number(u.spent).toLocaleString('he-IL')}</td>
                  <td style={cell}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td style={{ ...cell, textAlign: 'center' }}><Toggle checked={u.active} onChange={(v) => setActive(u.id, v)} /></td>
                  <td style={{ ...cell, textAlign: 'end' }}><Btn variant="danger" size="sm" onClick={() => del(u.id)}>Delete</Btn></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  )
}
