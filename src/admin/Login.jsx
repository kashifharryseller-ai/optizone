import React, { useState } from 'react'
import { GlassesMark, DiamondRule } from '../ds/index.js'
import { api, setToken } from '../api.js'
import { Field, Text, Btn } from './ui.jsx'

const pwStyle = { width: '100%', height: 40, padding: '0 12px', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none' }
const codeStyle = { ...pwStyle, height: 52, fontSize: 26, letterSpacing: '10px', textAlign: 'center', fontFamily: 'var(--font-display)' }

export default function Login({ onAuthed }) {
  // steps: creds → otp | forgot → reset → done
  const [step, setStep] = useState('creds')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [challenge, setChallenge] = useState('')
  const [masked, setMasked] = useState('')
  const [sent, setSent] = useState(true)
  const [code, setCode] = useState('')
  const [newPw, setNewPw] = useState('')
  const [err, setErr] = useState('')
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)

  const run = (fn) => async (e) => {
    e && e.preventDefault()
    setBusy(true); setErr(''); setMsg('')
    try { await fn() } catch (e2) { setErr(e2.message) } finally { setBusy(false) }
  }

  const submitCreds = run(async () => {
    const r = await api.login(email, password)
    if (r.otp) {
      setChallenge(r.challenge); setMasked(r.email); setSent(r.sent !== false); setCode('')
      setStep('otp')
      if (r.sent === false) setMsg('Email is not configured — the code was printed in the server log.')
    } else {
      setToken(r.token); onAuthed()
    }
  })

  const submitOtp = run(async () => {
    const r = await api.adminOtp(challenge, code)
    setToken(r.token); onAuthed()
  })

  const submitForgot = run(async () => {
    const r = await api.adminForgot(email)
    setChallenge(r.challenge); setMasked(r.email); setSent(r.sent !== false); setCode(''); setNewPw('')
    setStep('reset')
    if (r.sent === false) setMsg('Email is not configured — the code was printed in the server log.')
  })

  const submitReset = run(async () => {
    await api.adminReset(challenge, code, newPw)
    setStep('creds'); setPassword('')
    setMsg('Password updated — sign in with your new password.')
  })

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative', overflow: 'hidden', background: 'linear-gradient(160deg, var(--pine-700) 0%, var(--pine-900) 55%, var(--pine-950) 100%)' }}>
      {/* brand aurora */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'radial-gradient(52% 46% at 20% 12%, rgba(35,163,98,0.5), transparent 60%), radial-gradient(46% 42% at 88% 90%, rgba(245,166,35,0.18), transparent 62%)', pointerEvents: 'none' }} />
      <form onSubmit={step === 'creds' ? submitCreds : step === 'otp' ? submitOtp : step === 'forgot' ? submitForgot : submitReset}
        className="oz-login-card"
        style={{ position: 'relative', width: 420, maxWidth: '100%', background: 'var(--surface-card)', borderRadius: 'var(--radius-xl)', boxShadow: '0 30px 70px -24px rgba(6,23,15,0.75)', border: '1px solid var(--border-hair)', overflow: 'hidden', padding: '40px 36px 36px' }}>
        {/* amber top accent */}
        <div aria-hidden style={{ position: 'absolute', top: 0, insetInlineStart: 0, insetInlineEnd: 0, height: 4, background: 'linear-gradient(90deg, var(--amber-600), var(--amber-400))' }} />
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: 'var(--radius-lg)', background: 'var(--pine-50)', border: '1px solid var(--pine-100)' }}>
            <GlassesMark size={38} color="var(--pine-700)" />
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 24, color: 'var(--text-strong)', margin: '12px 0 2px' }}>
            {step === 'creds' && 'OPTIZONE Admin'}
            {step === 'otp' && 'Check your email'}
            {step === 'forgot' && 'Reset password'}
            {step === 'reset' && 'Enter code & new password'}
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
            {step === 'creds' && 'Owner sign-in to manage your storefront'}
            {step === 'otp' && (sent ? `We emailed a 6-digit code to ${masked}` : `Code for ${masked} is in the server log`)}
            {step === 'forgot' && 'We will email a code to the owner address'}
            {step === 'reset' && (sent ? `Code sent to ${masked}` : `Code for ${masked} is in the server log`)}
          </p>
        </div>
        <div style={{ margin: '18px 0' }}><DiamondRule /></div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {step === 'creds' && (
            <>
              <Field label="Owner email"><Text value={email} onChange={setEmail} placeholder="info@optizone.co.il" autoFocus /></Field>
              <Field label="Password"><input className="oz-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={pwStyle} /></Field>
            </>
          )}

          {(step === 'otp' || step === 'reset') && (
            <Field label="6-digit code">
              <input className="oz-input" inputMode="numeric" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} placeholder="••••••" style={codeStyle} autoFocus />
            </Field>
          )}

          {step === 'forgot' && (
            <Field label="Owner email"><Text value={email} onChange={setEmail} placeholder="info@optizone.co.il" autoFocus /></Field>
          )}

          {step === 'reset' && (
            <Field label="New password" hint="At least 8 characters">
              <input className="oz-input" type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="••••••••" style={pwStyle} />
            </Field>
          )}

          {err && <div style={{ fontSize: 13, color: 'var(--danger)', background: '#F6E3DE', borderRadius: 'var(--radius-sm)', padding: '8px 12px' }}>{err}</div>}
          {msg && <div style={{ fontSize: 13, color: 'var(--success)', background: '#E4F0E7', borderRadius: 'var(--radius-sm)', padding: '8px 12px' }}>{msg}</div>}

          <Btn variant="accent" type="submit" onClick={(e) => e} style={{ height: 44, justifyContent: 'center' }} disabled={busy}>
            {busy ? 'Working…' : step === 'creds' ? 'Sign in' : step === 'otp' ? 'Verify code' : step === 'forgot' ? 'Send code' : 'Set new password'}
          </Btn>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5 }}>
            {step === 'creds' ? (
              <a onClick={() => { setStep('forgot'); setErr(''); setMsg('') }} style={{ cursor: 'pointer', color: 'var(--amber-700)' }}>Forgot password?</a>
            ) : (
              <a onClick={() => { setStep('creds'); setErr(''); setMsg('') }} style={{ cursor: 'pointer', color: 'var(--text-muted)' }}>← Back to sign in</a>
            )}
            {step === 'otp' && <a onClick={submitCreds} style={{ cursor: 'pointer', color: 'var(--amber-700)' }}>Resend code</a>}
          </div>
        </div>
      </form>
    </div>
  )
}
