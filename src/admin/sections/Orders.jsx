import React, { useEffect, useState } from 'react'
import { Panel, Btn, SelectField } from '../ui.jsx'
import { api } from '../../api.js'

const STATUSES = ['New', 'In lab', 'Shipped', 'Collected', 'Cancelled']

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  const load = () => { setLoading(true); api.orders().then(setOrders).catch((e) => setErr(e.message)).finally(() => setLoading(false)) }
  useEffect(load, [])

  const setStatus = (id, status) => { api.setOrderStatus(id, status).then(() => setOrders((os) => os.map((o) => (o.id === id ? { ...o, status } : o)))).catch((e) => setErr(e.message)) }
  const del = (id) => { if (!confirm('Delete this order?')) return; api.deleteOrder(id).then(() => setOrders((os) => os.filter((o) => o.id !== id))).catch((e) => setErr(e.message)) }

  return (
    <Panel title="Orders" desc="Orders placed through the storefront checkout." actions={<Btn variant="outline" size="sm" onClick={load}>Refresh</Btn>}>
      {err && <div style={{ color: 'var(--danger)', marginBottom: 12 }}>{err}</div>}
      {loading ? <p style={{ color: 'var(--text-muted)' }}>Loading…</p> : orders.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No orders yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {orders.map((o) => (
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
        </div>
      )}
    </Panel>
  )
}
