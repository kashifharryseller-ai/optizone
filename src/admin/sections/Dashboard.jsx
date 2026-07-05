import React, { useEffect, useState } from 'react'
import { Panel, Btn } from '../ui.jsx'
import { Icon } from '../../ds/index.js'
import { api } from '../../api.js'

function Stat({ icon, label, value, tone }) {
  return (
    <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-md)', padding: '18px 20px' }}>
      <span style={{ display: 'inline-flex', width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: tone || 'var(--pine-50)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
        <Icon name={icon} size={19} color="var(--pine-700)" />
      </span>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--text-strong)' }}>{value}</div>
      <div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>{label}</div>
    </div>
  )
}

export default function Dashboard({ go }) {
  const [stats, setStats] = useState(null)
  const [err, setErr] = useState('')
  useEffect(() => { api.stats().then(setStats).catch((e) => setErr(e.message)) }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Panel title="Overview" desc="A snapshot of your store.">
        {err && <div style={{ color: 'var(--danger)' }}>{err}</div>}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 14 }}>
          <Stat icon="shopping-bag" label="Products" value={stats ? stats.products : '—'} />
          <Stat icon="package" label={`Orders (${stats ? stats.newOrders : 0} new)`} value={stats ? stats.orders : '—'} tone="var(--amber-50)" />
          <Stat icon="calendar" label={`Appointments (${stats ? stats.newBookings : 0} new)`} value={stats ? stats.bookings : '—'} tone="var(--amber-50)" />
          <Stat icon="store" label="Branches" value={stats ? stats.stores : '—'} />
          <Stat icon="credit-card" label="Revenue" value={stats ? '₪' + Number(stats.revenue).toLocaleString('he-IL') : '—'} />
        </div>
      </Panel>

      <Panel title="Quick actions">
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Btn onClick={() => go('products')}>Manage products</Btn>
          <Btn variant="outline" onClick={() => go('homepage')}>Edit homepage</Btn>
          <Btn variant="outline" onClick={() => go('orders')}>View orders</Btn>
          <Btn variant="outline" onClick={() => go('bookings')}>View appointments</Btn>
          <Btn variant="ghost" onClick={() => window.open('/', '_blank')}>Open storefront ↗</Btn>
        </div>
      </Panel>
    </div>
  )
}
