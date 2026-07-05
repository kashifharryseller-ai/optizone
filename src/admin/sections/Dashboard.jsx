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

// Deployment-health notice — shown when the server reports that data lives in
// ephemeral serverless storage (no MySQL) or that JWT_SECRET isn't configured.
function HealthNotice({ stats }) {
  if (!stats) return null
  const notes = []
  if (stats.store?.ephemeral) {
    notes.push(
      'Data is stored in TEMPORARY serverless storage: orders, customers and content edits reset on every redeploy or idle restart, and may differ between instances. ' +
      'Connect a MySQL database (set DB_HOST / DB_USER / DB_PASSWORD / DB_NAME env vars, e.g. a free MySQL from Railway/Aiven, or deploy on Hostinger with its bundled MySQL) to make everything permanent.',
    )
  }
  if (stats.security && stats.security.jwtFromEnv === false) {
    notes.push('JWT_SECRET is not set in the host environment — set a long random JWT_SECRET env var for secure, stable sign-in sessions.')
  }
  if (!notes.length) return null
  return (
    <div role="alert" style={{ background: 'var(--amber-50)', border: '1px solid var(--amber-600)', borderRadius: 'var(--radius-md)', padding: '14px 18px', display: 'flex', gap: 12 }}>
      <Icon name="info" size={19} color="var(--amber-700)" style={{ flex: '0 0 auto', marginTop: 2 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--amber-700)' }}>Deployment setup needed</div>
        {notes.map((n, i) => <div key={i} style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--text-body)' }}>{n}</div>)}
      </div>
    </div>
  )
}

export default function Dashboard({ go }) {
  const [stats, setStats] = useState(null)
  const [err, setErr] = useState('')
  useEffect(() => { api.stats().then(setStats).catch((e) => setErr(e.message)) }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <HealthNotice stats={stats} />
      <Panel title="Overview" desc="A snapshot of your store.">
        {err && <div style={{ color: 'var(--danger)' }}>{err}</div>}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 14 }}>
          <Stat icon="shopping-bag" label="Products" value={stats ? stats.products : '—'} />
          <Stat icon="package" label={`Orders (${stats ? stats.newOrders : 0} new)`} value={stats ? stats.orders : '—'} tone="var(--amber-50)" />
          <Stat icon="calendar" label={`Appointments (${stats ? stats.newBookings : 0} new)`} value={stats ? stats.bookings : '—'} tone="var(--amber-50)" />
          <Stat icon="user" label="Customers" value={stats ? stats.customers : '—'} />
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
          <Btn variant="outline" onClick={() => go('customers')}>View customers</Btn>
          <Btn variant="ghost" onClick={() => window.open('/', '_blank')}>Open storefront ↗</Btn>
        </div>
      </Panel>
    </div>
  )
}
