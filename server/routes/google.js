// "Continue with Google" — OAuth 2.0 authorization-code flow.
// GET /api/auth/google           → redirects to Google's consent screen
// GET /api/auth/google/callback  → exchanges the code (uses the client SECRET,
//                                  server-side only), finds/creates the customer,
//                                  then redirects to /#gtoken=<jwt> for the SPA.
const express = require('express')
const crypto = require('crypto')
const { customAlphabet } = require('nanoid')
const config = require('../config')
const { store } = require('../store')
const { issueUserToken } = require('../auth')

const router = express.Router()
const uid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 12)

// Overridable for tests; defaults are Google's real endpoints.
const AUTH_URL = process.env.GOOGLE_AUTH_URL || 'https://accounts.google.com/o/oauth2/v2/auth'
const TOKEN_URL = process.env.GOOGLE_TOKEN_URL || 'https://oauth2.googleapis.com/token'

// Public origin of this deployment (works behind Vercel/Passenger proxies).
function origin(req) {
  if (process.env.PUBLIC_URL) return process.env.PUBLIC_URL.replace(/\/+$/, '')
  const proto = String(req.headers['x-forwarded-proto'] || req.protocol || 'https').split(',')[0].trim()
  const host = String(req.headers['x-forwarded-host'] || req.headers.host || '').split(',')[0].trim()
  return `${proto}://${host}`
}
const redirectUri = (req) => `${origin(req)}/api/auth/google/callback`

function getCookie(req, name) {
  for (const part of String(req.headers.cookie || '').split(';')) {
    const [k, ...v] = part.trim().split('=')
    if (k === name) return decodeURIComponent(v.join('='))
  }
  return null
}

const fail = (req, res, msg) => res.redirect(`${origin(req)}/#gerror=${encodeURIComponent(msg)}`)

router.get('/auth/google', (req, res) => {
  if (!config.google.clientId || !config.google.clientSecret) {
    return fail(req, res, 'Google sign-in is not configured on the server')
  }
  // CSRF protection: random state pinned in a short-lived HttpOnly cookie.
  const state = crypto.randomBytes(16).toString('hex')
  const secure = origin(req).startsWith('https') ? '; Secure' : ''
  res.setHeader('Set-Cookie', `oz_gs=${state}; Max-Age=600; Path=/; HttpOnly; SameSite=Lax${secure}`)
  const params = new URLSearchParams({
    client_id: config.google.clientId,
    redirect_uri: redirectUri(req),
    response_type: 'code',
    scope: 'openid email profile',
    state,
    prompt: 'select_account',
  })
  res.redirect(`${AUTH_URL}?${params}`)
})

router.get('/auth/google/callback', async (req, res) => {
  try {
    const { code, state, error } = req.query
    if (error) return fail(req, res, 'Google sign-in was cancelled')
    if (!code || !state || state !== getCookie(req, 'oz_gs')) {
      return fail(req, res, 'Sign-in session expired — please try again')
    }

    const body = new URLSearchParams({
      code: String(code),
      client_id: config.google.clientId,
      client_secret: config.google.clientSecret,
      redirect_uri: redirectUri(req),
      grant_type: 'authorization_code',
    })
    const resp = await fetch(TOKEN_URL, { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body })
    const tok = await resp.json().catch(() => ({}))
    if (!resp.ok || !tok.id_token) {
      console.error('[google] token exchange failed:', tok.error || resp.status)
      return fail(req, res, 'Google sign-in failed — please try again')
    }

    // The id_token comes straight from Google's token endpoint over TLS, so
    // decoding without signature verification is acceptable; still validate claims.
    const payload = JSON.parse(Buffer.from(String(tok.id_token).split('.')[1], 'base64url').toString('utf8'))
    const issOk = payload.iss === 'https://accounts.google.com' || payload.iss === 'accounts.google.com'
    if (!issOk || payload.aud !== config.google.clientId || (payload.exp && payload.exp * 1000 < Date.now())) {
      return fail(req, res, 'Google sign-in failed — invalid token')
    }
    const email = String(payload.email || '').toLowerCase()
    if (!email || payload.email_verified === false) return fail(req, res, 'Your Google email is not verified')

    // Find-or-create the customer; link Google to an existing email account.
    let user = await store().findUserByEmail(email)
    if (user) {
      if (user.active === false) return fail(req, res, 'This account is disabled — contact the store')
      if (!user.googleId) user = await store().updateUser(user.id, { googleId: payload.sub, provider: user.provider || 'google' })
    } else {
      user = {
        id: 'u_' + uid(),
        name: payload.name || email.split('@')[0],
        email,
        phone: '',
        provider: 'google',
        googleId: payload.sub,
        createdAt: new Date().toISOString(),
        active: true,
        wishlist: [],
      }
      await store().addUser(user)
    }

    res.setHeader('Set-Cookie', 'oz_gs=; Max-Age=0; Path=/')
    res.redirect(`${origin(req)}/#gtoken=${encodeURIComponent(issueUserToken(user))}`)
  } catch (err) {
    console.error('[google] callback error:', err.message)
    fail(req, res, 'Google sign-in failed — please try again')
  }
})

module.exports = router
