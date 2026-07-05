// Customer auth + account API — register, login, forgot/reset, profile, orders,
// appointments, wishlist. Passwords are bcrypt-hashed; sessions are JWTs.
const express = require('express')
const crypto = require('crypto')
const { customAlphabet } = require('nanoid')
const { store } = require('../store')
const { issueUserToken, requireUser, hashPassword, verifyPassword } = require('../auth')
const { isLimited, recordFailure, clearKey } = require('../limiter')
const { sendMail, mailEnabled, resetEmail } = require('../mailer')

const router = express.Router()
const uid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 12)

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const sha = (s) => crypto.createHash('sha256').update(String(s)).digest('hex')
const sanitize = (u) => u && ({
  id: u.id, name: u.name, email: u.email, phone: u.phone || '',
  createdAt: u.createdAt, active: u.active !== false, wishlist: u.wishlist || [],
})

// Persistent per-account login lockout (8 failures / 15 min) — survives restarts
// and applies across instances, so it can't be bypassed by rotating IPs.
const LOGIN_MAX = 8
const LOGIN_WINDOW = 15 * 60 * 1000
const loginKey = (email) => `clogin:${email}`

// --- Register ----------------------------------------------------------------
router.post('/auth/register', async (req, res, next) => {
  try {
    const b = req.body || {}
    const name = String(b.name || '').trim().slice(0, 120)
    const email = String(b.email || '').trim().toLowerCase().slice(0, 160)
    const phone = String(b.phone || '').trim().slice(0, 60)
    const password = String(b.password || '')
    if (!name) return res.status(400).json({ error: 'Please enter your name' })
    if (!EMAIL_RE.test(email)) return res.status(400).json({ error: 'Please enter a valid email address' })
    if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' })
    if (await store().findUserByEmail(email)) return res.status(409).json({ error: 'An account with this email already exists' })

    const user = {
      id: 'u_' + uid(),
      name, email, phone,
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString(),
      active: true,
      wishlist: [],
    }
    await store().addUser(user)
    res.status(201).json({ token: issueUserToken(user), user: sanitize(user) })
  } catch (err) { next(err) }
})

// --- Login ---------------------------------------------------------------------
router.post('/auth/login', async (req, res, next) => {
  try {
    const email = String((req.body || {}).email || '').trim().toLowerCase()
    const password = String((req.body || {}).password || '')
    const limited = await isLimited(loginKey(email), LOGIN_MAX)
    if (limited.limited) return res.status(429).json({ error: 'Too many attempts — try again in a few minutes' })
    const user = await store().findUserByEmail(email)
    if (!user || !verifyPassword(password, user.passwordHash)) {
      await recordFailure(loginKey(email), LOGIN_WINDOW)
      return res.status(401).json({ error: 'Wrong email or password' })
    }
    if (user.active === false) return res.status(403).json({ error: 'This account is disabled — contact the store' })
    await clearKey(loginKey(email))
    res.json({ token: issueUserToken(user), user: sanitize(user) })
  } catch (err) { next(err) }
})

// --- Forgot password: email a reset code -------------------------------------
// Always responds success (never reveals whether an email is registered).
router.post('/auth/forgot', async (req, res, next) => {
  try {
    const email = String((req.body || {}).email || '').trim().toLowerCase()
    if (EMAIL_RE.test(email)) {
      const user = await store().findUserByEmail(email)
      if (user && user.active !== false && user.passwordHash) {
        const code = String(crypto.randomInt(100000, 1000000))
        await store().updateUser(user.id, { resetCodeHash: sha(code), resetExpiresAt: Date.now() + 15 * 60 * 1000, resetAttempts: 0 })
        const mail = resetEmail(code)
        let sent = false
        try { const r = await sendMail({ to: email, ...mail }); sent = !!r.sent } catch (e) { console.error('[account] reset email failed:', e.message) }
        if (!sent) console.log('[account] password reset code for %s: %s', email, code)
      }
    }
    res.json({ ok: true, mail: mailEnabled() })
  } catch (err) { next(err) }
})

// --- Reset password with the emailed code ------------------------------------
router.post('/auth/reset', async (req, res, next) => {
  try {
    const email = String((req.body || {}).email || '').trim().toLowerCase()
    const code = String((req.body || {}).code || '').trim()
    const password = String((req.body || {}).password || '')
    if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' })
    const user = await store().findUserByEmail(email)
    if (!user || !user.resetCodeHash || !user.resetExpiresAt || Date.now() > user.resetExpiresAt) {
      return res.status(400).json({ error: 'This code has expired — request a new one' })
    }
    if ((user.resetAttempts || 0) >= 5) return res.status(429).json({ error: 'Too many wrong codes — request a new one' })
    if (sha(code) !== user.resetCodeHash) {
      await store().updateUser(user.id, { resetAttempts: (user.resetAttempts || 0) + 1 })
      return res.status(401).json({ error: 'Wrong code — check the email and try again' })
    }
    const updated = await store().updateUser(user.id, { passwordHash: hashPassword(password), resetCodeHash: null, resetExpiresAt: null, resetAttempts: 0 })
    await clearKey(loginKey(email))
    // Sign them straight in — they proved ownership of the inbox.
    res.json({ token: issueUserToken(updated), user: sanitize(updated) })
  } catch (err) { next(err) }
})

// --- Account (signed-in) --------------------------------------------------------
router.use('/account', requireUser)

// Load the user once for all /account routes; reject deleted/disabled accounts.
router.use('/account', async (req, res, next) => {
  try {
    const user = await store().getUser(req.userId)
    if (!user || user.active === false) return res.status(401).json({ error: 'Account unavailable — please sign in again' })
    req.user = user
    next()
  } catch (err) { next(err) }
})

router.get('/account/me', (req, res) => res.json({ user: sanitize(req.user) }))

router.put('/account/profile', async (req, res, next) => {
  try {
    const b = req.body || {}
    const patch = {}
    if (typeof b.name === 'string' && b.name.trim()) patch.name = b.name.trim().slice(0, 120)
    if (typeof b.phone === 'string') patch.phone = b.phone.trim().slice(0, 60)
    const user = await store().updateUser(req.userId, patch)
    res.json({ user: sanitize(user) })
  } catch (err) { next(err) }
})

router.put('/account/password', async (req, res, next) => {
  try {
    const { current, next: nextPw } = req.body || {}
    if (!verifyPassword(current, req.user.passwordHash)) return res.status(401).json({ error: 'Current password is incorrect' })
    if (String(nextPw || '').length < 6) return res.status(400).json({ error: 'New password must be at least 6 characters' })
    await store().updateUser(req.userId, { passwordHash: hashPassword(nextPw) })
    res.json({ ok: true })
  } catch (err) { next(err) }
})

router.get('/account/orders', async (req, res, next) => {
  try {
    const all = await store().listOrders()
    res.json(all.filter((o) => o.userId === req.userId))
  } catch (err) { next(err) }
})

router.get('/account/bookings', async (req, res, next) => {
  try {
    const all = await store().listBookings()
    res.json(all.filter((b) => b.userId === req.userId))
  } catch (err) { next(err) }
})

router.get('/account/wishlist', (req, res) => res.json({ items: req.user.wishlist || [] }))

router.post('/account/wishlist/toggle', async (req, res, next) => {
  try {
    const id = Number((req.body || {}).productId)
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'productId required' })
    const list = new Set(req.user.wishlist || [])
    if (list.has(id)) list.delete(id)
    else if (list.size < 500) list.add(id) // cap to prevent unbounded growth
    const user = await store().updateUser(req.userId, { wishlist: [...list] })
    res.json({ items: user.wishlist })
  } catch (err) { next(err) }
})

module.exports = router
