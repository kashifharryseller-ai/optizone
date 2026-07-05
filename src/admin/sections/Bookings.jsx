import React, { useEffect, useState } from 'react'
import { Panel, Btn, SelectField } from '../ui.jsx'
import { api } from '../../api.js'

const STATUSES = ['New', 'Confirmed', 'Completed', 'Cancelled']

const searchStyle = { height: 34, padding: '0 12px', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-body)', fontSize: 13.5, outline: 'none' }

export default function Bookings() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const load = () => { setLoading(true); api.bookings().then(setRows).catch((e) => setErr(e.message)).finally(() => setLoading(false)) }
  useEffect(load, [])

  const setStatus = (id, status) => { api.setBookingStatus(id, status).then(() => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)))).catch((e) => setErr(e.message)) }
  const del = (id) => { if (!confirm(`Delete appointment ${id}? This cannot be undone.`)) return; api.deleteBooking(id).then(() => setRows((rs) => rs.filter((r) => r.id !== id))).catch((e) => setErr(e.message)) }

  const q = query.trim().toLowerCase()
  const shown = rows.filter((r) =>
    (statusFilter === 'all' || r.status === statusFilter) &&
    (!q || `${r.id} ${r.name || ''} ${r.phone || ''} ${r.service || ''} ${r.branch || ''}`.toLowerCase().includes(q)))

  return (
    <Panel title="Appointments" desc="Bookings requested through the site." actions={(
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <input aria-label="Search appointments" placeholder="Search name / phone / service…" value={query} onChange={(e) => setQuery(e.target.value)} style={{ ...searchStyle, minWidth: 190 }} />
        <select aria-label="Filter by status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={searchStyle}>
          <option value="all">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <Btn variant="outline" size="sm" onClick={load}>Refresh</Btn>
      </div>
    )}>
      {err && <div style={{ color: 'var(--danger)', marginBottom: 12 }}>{err}</div>}
      {loading ? <p style={{ color: 'var(--text-muted)' }}>Loading…</p> : rows.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No appointments yet.</p>
      ) : shown.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No appointments match the current search/filter.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {shown.map((r) => (
            <div key={r.id} style={{ border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-sm)', padding: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                <div>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--text-strong)' }}>{r.id}</span>
                  <span style={{ fontSize: 12.5, color: 'var(--text-muted)', marginInlineStart: 10 }}>{new Date(r.createdAt).toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <div style={{ width: 150 }}><SelectField value={r.status} onChange={(v) => setStatus(r.id, v)} options={STATUSES} /></div>
                  <Btn variant="danger" size="sm" onClick={() => del(r.id)}>Delete</Btn>
                </div>
              </div>
              <div style={{ marginTop: 10, fontSize: 13.5, color: 'var(--text-body)' }}>
                <b>{r.name || '—'}</b> · {r.phone || '—'}
              </div>
              <div style={{ marginTop: 6, fontSize: 13, color: 'var(--text-muted)' }}>{r.service} · {r.branch} · {r.day} {r.slot}</div>
            </div>
          ))}
        </div>
      )}
    </Panel>
  )
}
