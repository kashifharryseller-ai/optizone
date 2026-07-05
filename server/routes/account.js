// Customer auth + account API — register, login, profile, orders, appointments,
// wishlist, settings. Passwords are bcrypt-hashed; sessions are JWTs (role: customer).
const express = require('express')
const { customAlphabet } = require('nanoid')
const { store } = require('../store')
const { issueUserToken, requireUser, hashPassword, verifyPassword } = require('../auth')

const router = express.Router()
const uid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 12)

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const sanitize = (u) => u && ({
  id: u.id, name: u.name, email: u.email, phone: u.phone || '',
  createdAt: u.createdAt, active: u.active !== false, wishlist: u.wishlist || [],
})

// Tiny in-memory login limiter: 8 failures per email → 10 min lockout.
const attempts = new Map()
function locked(email) {
  const a = attempts.get(email)
  return a && a.count >= 8 && Date.now() < a.until
}
function fail(email) {
  const a = attempts.get(email) || { count: 0, until: 0 }
  a.count += 1
  if (a.count >= 8) a.until = Date.now() + 10 * 60 * 1000
  attempts.set(email, a)
}
const clearFails = (email) => attempts.delete(email)

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
    if (locked(email)) return res.status(429).json({ error: 'Too many attempts — try again in a few minutes' })
    const user = await store().findUserByEmail(email)
    if (!user || !verifyPassword(password, user.passwordHash)) {
      fail(email)
      return res.status(401).json({ error: 'Wrong email or password' })
    }
    if (user.active === false) return res.status(403).json({ error: 'This account is disabled — contact the store' })
    clearFails(email)
    res.json({ token: issueUserToken(user), user: sanitize(user) })
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
    list.has(id) ? list.delete(id) : list.add(id)
    const user = await store().updateUser(req.userId, { wishlist: [...list] })
    res.json({ items: user.wishlist })
  } catch (err) { next(err) }
})

module.exports = router
