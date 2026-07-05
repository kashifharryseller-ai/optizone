import React, { useEffect, useState } from 'react'
import { Panel, Row, Field, Text, Btn } from '../ui.jsx'
import { api } from '../../api.js'

const pwStyle = { width: '100%', height: 40, padding: '0 12px', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none' }

// One ✓/✗ row of the production-readiness checklist.
function CheckRow({ ok, label, fix }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border-hair)' }}>
      <span style={{ width: 20, height: 20, borderRadius: 999, flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, background: ok ? 'var(--success)' : 'var(--amber-500)', color: ok ? 'var(--cream-100)' : 'var(--pine-950)' }}>{ok ? '✓' : '!'}</span>
      <div style={{ fontSize: 14, lineHeight: 1.55 }}>
        <b style={{ color: 'var(--text-strong)' }}>{label}</b>
        {!ok && fix && <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>{fix}</div>}
      </div>
    </div>
  )
}

// Production-readiness checklist — the same env-level items the dashboard
// warns about, in one place with exact fixes (DB, JWT_SECRET, email OTP).
function EnvChecklist() {
  const [stats, setStats] = useState(null)
  useEffect(() => { api.stats().then(setStats).catch(() => {}) }, [])
  if (!stats) return null
  const s = stats.security || {}
  const st = stats.store || {}
  return (
    <Panel title="Production readiness" desc="Environment configuration this panel can detect. All three should be green before taking real orders.">
      <div style={{ maxWidth: 640 }}>
        <CheckRow
          ok={st.driver === 'mysql'}
          label={st.driver === 'mysql' ? 'Persistent database connected (MySQL)' : 'Persistent database (MySQL)'}
          fix={st.ephemeral
            ? 'Data currently lives in TEMPORARY serverless storage and resets on redeploys. Set DB_HOST / DB_USER / DB_PASSWORD / DB_NAME env vars on your host.'
            : 'Using the local JSON-file store. Fine on a single server (Hostinger); set DB_* env vars to switch to MySQL.'}
        />
        <CheckRow
          ok={!!s.jwtFromEnv}
          label="JWT_SECRET configured"
          fix="Set a long random JWT_SECRET env var so sign-in sessions are cryptographically strong and stable."
        />
        <CheckRow
          ok={!!s.otpEnabled}
          label="Two-step verification (email OTP)"
          fix="Set GMAIL_USER + GMAIL_APP_PASSWORD env vars — OTP turns on automatically (details below)."
        />
      </div>
    </Panel>
  )
}

// Trail of recent admin actions on data (PII views, edits, deletions) —
// written server-side; read-only here.
function AuditLog() {
  const [rows, setRows] = useState(null)
  useEffect(() => { api.adminAudit().then(setRows).catch(() => setRows([])) }, [])
  return (
    <Panel title="Audit log" desc="Recent admin actions on store data — customer views, edits and deletions. Recorded automatically on the server.">
      {!rows ? <p style={{ color: 'var(--text-muted)' }}>Loading…</p> : rows.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No recorded actions yet.</p>
      ) : (
        <div style={{ maxHeight: 320, overflowY: 'auto', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-sm)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <tbody>
              {rows.slice(0, 100).map((r, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-hair)' }}>
                  <td style={{ padding: '8px 12px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{new Date(r.ts).toLocaleString()}</td>
                  <td style={{ padding: '8px 12px', fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: '0.04em', color: 'var(--text-strong)' }}>{r.action}</td>
                  <td style={{ padding: '8px 12px', color: 'var(--text-body)', overflowWrap: 'anywhere' }}>{r.target}</td>
                  <td style={{ padding: '8px 12px', color: 'var(--text-muted)' }}>{r.actor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  )
}

export default function Security() {
  const [account, setAccount] = useState(null)
  const [email, setEmail] = useState('')
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    api.adminAccount().then((a) => { setAccount(a); setEmail(a.email) }).catch((e) => setErr(e.message))
  }, [])

  const save = async () => {
    setErr(''); setMsg('')
    if (newPw && newPw !== confirmPw) { setErr('New password and confirmation do not match'); return }
    if (!currentPw) { setErr('Enter your current password to confirm changes'); return }
    setBusy(true)
    try {
      const payload = { currentPassword: currentPw }
      if (email !== account.email) payload.email = email
      if (newPw) payload.newPassword = newPw
      const r = await api.adminAccountUpdate(payload)
      setAccount({ ...account, email: r.email })
      setCurrentPw(''); setNewPw(''); setConfirmPw('')
      setMsg('Saved — use the new credentials next time you sign in.')
    } catch (e) { setErr(e.message) } finally { setBusy(false) }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <EnvChecklist />
      <Panel title="Owner account" desc="The email and password used to sign in to this admin panel. The email also receives your OTP sign-in codes.">
        {!account ? <p style={{ color: 'var(--text-muted)' }}>Loading…</p> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 560 }}>
            <Field label="Owner email"><Text value={email} onChange={setEmail} /></Field>
            <Row cols="1fr 1fr">
              <Field label="New password" hint="Leave blank to keep the current one (min 8 chars)">
                <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="••••••••" style={pwStyle} autoComplete="new-password" />
              </Field>
              <Field label="Confirm new password">
                <input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} placeholder="••••••••" style={pwStyle} autoComplete="new-password" />
              </Field>
            </Row>
            <Field label="Current password" hint="Required to confirm any change">
              <input type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} placeholder="••••••••" style={pwStyle} autoComplete="current-password" />
            </Field>
            {err && <div style={{ fontSize: 13, color: 'var(--danger)', background: '#F6E3DE', borderRadius: 'var(--radius-sm)', padding: '8px 12px' }}>{err}</div>}
            {msg && <div style={{ fontSize: 13, color: 'var(--success)', background: '#E4F0E7', borderRadius: 'var(--radius-sm)', padding: '8px 12px' }}>{msg}</div>}
            <div><Btn variant="accent" onClick={save} disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</Btn></div>
          </div>
        )}
      </Panel>

      <Panel title="Two-step verification (email OTP)" desc="When enabled, signing in also requires a 6-digit code emailed to the owner address.">
        {!account ? <p style={{ color: 'var(--text-muted)' }}>Loading…</p> : (
          <div style={{ fontSize: 14, color: 'var(--text-body)', lineHeight: 1.7 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ width: 10, height: 10, borderRadius: 999, background: account.otpEnabled ? 'var(--success)' : 'var(--warning)' }} />
              <b style={{ color: 'var(--text-strong)' }}>{account.otpEnabled ? 'OTP is ON' : 'OTP is OFF'}</b>
              <span style={{ color: 'var(--text-muted)' }}>· email sending {account.mailConfigured ? 'configured' : 'not configured'}</span>
            </div>
            {!account.mailConfigured && (
              <div style={{ background: 'var(--amber-50)', border: '1px solid var(--amber-200)', borderRadius: 'var(--radius-sm)', padding: '12px 14px', fontSize: 13.5 }}>
                To turn on email codes, add these environment variables on your host and restart:
                <pre style={{ margin: '8px 0 0', fontSize: 12.5, background: 'var(--cream-100)', padding: 10, borderRadius: 6, overflowX: 'auto' }}>{`GMAIL_USER=your@gmail.com\nGMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx`}</pre>
                <div style={{ marginTop: 8, color: 'var(--text-muted)' }}>
                  The app password comes from Google Account → Security → 2-Step Verification → App passwords.
                </div>
              </div>
            )}
          </div>
        )}
      </Panel>

      <AuditLog />
    </div>
  )
}
