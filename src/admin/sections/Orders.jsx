import React, { useEffect, useState } from 'react'
import { Panel, Btn, SelectField, Pager, EmptyState } from '../ui.jsx'
import { Icon } from '../../ds/index.js'
import { api } from '../../api.js'

const STATUSES = ['New', 'In lab', 'Shipped', 'Collected', 'Cancelled']

const searchStyle = { height: 34, padding: '0 12px', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-body)', fontSize: 13.5, outline: 'none' }

export default function Orders({ initialQuery }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [query, setQuery] = useState(initialQuery || '')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(0)
  // Global-search deep link: adopt the query when it changes.
  useEffect(() => { if (initialQuery !== undefined) setQuery(initialQuery) }, [initialQuery])
  useEffect(() => { setPage(0) }, [query, statusFilter])

  const load = () => { setLoading(true); api.orders().then(setOrders).catch((e) => setErr(e.message)).finally(() => setLoading(false)) }
  useEffect(load, [])

  const setStatus = (id, status) => { api.setOrderStatus(id, status).then(() => setOrders((os) => os.map((o) => (o.id === id ? { ...o, status } : o)))).catch((e) => setErr(e.message)) }
  const del = (id) => { if (!confirm(`Delete order ${id}? This cannot be undone.`)) return; api.deleteOrder(id).then(() => setOrders((os) => os.filter((o) => o.id !== id))).catch((e) => setErr(e.message)) }

  const q = query.trim().toLowerCase()
  const shown = orders.filter((o) =>
    (statusFilter === 'all' || o.status === statusFilter) &&
    (!q || `${o.id} ${o.customer?.name || ''} ${o.customer?.email || ''} ${o.customer?.phone || ''}`.toLowerCase().includes(q)))
  const PAGE = 20
  const safePage = Math.min(page, Math.max(0, Math.ceil(shown.length / PAGE) - 1))
  const paged = shown.slice(safePage * PAGE, (safePage + 1) * PAGE)

  return (
    <Panel title="Orders" desc="Orders placed through the storefront checkout." actions={(
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <input aria-label="Search orders" placeholder="Search id / name / email…" value={query} onChange={(e) => setQuery(e.target.value)} style={{ ...searchStyle, minWidth: 190 }} />
        <select aria-label="Filter by status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={searchStyle}>
          <option value="all">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <Btn variant="outline" size="sm" onClick={load}>Refresh</Btn>
      </div>
    )}>
      {err && <div style={{ color: 'var(--danger)', marginBottom: 12 }}>{err}</div>}
      {loading ? <p style={{ color: 'var(--text-muted)' }}>Loading…</p> : orders.length === 0 ? (
        <EmptyState
          icon={<Icon name="package" size={34} color="var(--pine-300)" />}
          title="No orders yet"
          sub="Orders placed through the storefront checkout appear here in real time — you can update their status and follow up with the customer."
          cta="Open the storefront ↗" onCta={() => window.open('/', '_blank')}
        />
      ) : shown.length === 0 ? (
        <EmptyState icon={<Icon name="search" size={30} color="var(--pine-300)" />} title="No matching orders" sub="Try a different search term or status filter." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {paged.map((o) => (
            <div key={o.id} style={{ border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-sm)', padding: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                <div>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--text-strong)' }}>{o.id}</span>
                  <span style={{ fontSize: 12.5, color: 'var(--text-muted)', marginInlineStart: 10 }}>{new Date(o.createdAt).toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <div style={{ width: 150 }}><SelectField value={o.status} onChange={(v) => setStatus(o.id, v)} options={STATUSES} /></div>
                  <Btn variant="danger" size="sm" onClick={() => del(o.id)}>Delete</Btn>
                </div>
              </div>
              <div style={{ marginTop: 10, fontSize: 13.5, color: 'var(--text-body)' }}>
                <b>{o.customer?.name || '—'}</b> · {o.customer?.phone} · {o.customer?.email}
                {o.customer?.address ? <> · {o.customer.address}</> : null}
              </div>
              <div style={{ marginTop: 6, fontSize: 13, color: 'var(--text-muted)' }}>
                {(o.items || []).map((it, i) => <span key={i}>{it.qty}× {it.brand} {it.name}{i < o.items.length - 1 ? ' · ' : ''}</span>)}
              </div>
              <div style={{ marginTop: 8, display: 'flex', gap: 16, fontSize: 13 }}>
                <span style={{ color: 'var(--text-muted)' }}>Payment: {o.payment || '—'} · {o.fulfilment || '—'}</span>
                <span style={{ marginInlineStart: 'auto', fontFamily: 'var(--font-display)', color: 'var(--text-strong)' }}>Total ₪{Number(o.total || 0).toLocaleString('he-IL')}</span>
              </div>
            </div>
          ))}
          <Pager page={safePage} setPage={setPage} total={shown.length} pageSize={PAGE} />
        </div>
      )}
    </Panel>
  )
}
