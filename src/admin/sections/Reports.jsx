import React, { useEffect, useState } from 'react'
import { Panel, Btn } from '../ui.jsx'
import { Icon } from '../../ds/index.js'
import { api } from '../../api.js'

// Turn rows of objects into a CSV blob and trigger a download.
function downloadCsv(filename, rows) {
  if (!rows.length) return
  const cols = Object.keys(rows[0])
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const csv = [cols.join(','), ...rows.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

function Kpi({ label, value }) {
  return (
    <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-md)', padding: '16px 18px' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--text-strong)' }}>{value}</div>
      <div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>{label}</div>
    </div>
  )
}

export default function Reports() {
  const [stats, setStats] = useState(null)
  const [err, setErr] = useState('')
  const load = () => { setErr(''); api.stats().then(setStats).catch((e) => setErr(e.message)) }
  useEffect(load, [])

  const exportOrders = async () => {
    const orders = await api.orders()
    downloadCsv('optizone-orders.csv', orders.map((o) => ({
      id: o.id, date: o.createdAt, status: o.status, customer: o.customer?.name, email: o.customer?.email,
      phone: o.customer?.phone, payment: o.payment, fulfilment: o.fulfilment, total: o.total,
      items: (o.items || []).map((it) => `${it.qty}x ${it.brand} ${it.name}`).join(' | '),
    })))
  }
  const exportCustomers = async () => {
    const users = await api.adminUsers()
    downloadCsv('optizone-customers.csv', users.map((u) => ({
      id: u.id, name: u.name, email: u.email, phone: u.phone, joined: u.createdAt,
      orders: u.orders, appointments: u.bookings, spent: u.spent, active: u.active !== false,
    })))
  }

  const money = (n) => '₪' + Number(n || 0).toLocaleString('he-IL')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Panel title="Reports" desc="Store performance at a glance, with CSV exports for your accountant or spreadsheet." actions={<Btn variant="outline" size="sm" onClick={load}>Refresh</Btn>}>
        {err ? <div role="alert" style={{ color: 'var(--danger)' }}>Couldn’t load — {err}. <Btn variant="outline" size="sm" onClick={load}>Retry</Btn></div> : !stats ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading…</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 14 }}>
            <Kpi label="Revenue" value={money(stats.revenue)} />
            <Kpi label="Orders" value={stats.orders} />
            <Kpi label="New orders" value={stats.newOrders} />
            <Kpi label="Customers" value={stats.customers} />
            <Kpi label="Appointments" value={stats.bookings} />
            <Kpi label="Products" value={stats.products} />
          </div>
        )}
      </Panel>

      <Panel title="Exports" desc="Download your data as CSV (opens in Excel / Google Sheets).">
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Btn variant="outline" onClick={exportOrders}><Icon name="package" size={14} color="currentColor" /> Export orders</Btn>
          <Btn variant="outline" onClick={exportCustomers}><Icon name="user" size={14} color="currentColor" /> Export customers</Btn>
        </div>
      </Panel>
    </div>
  )
}
