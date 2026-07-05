// Admin API — email+password (+ email OTP) login, forgot/reset, account
// management, and protected content/orders/bookings/customers/upload.
const express = require('express')
const path = require('path')
const fs = require('fs')
const crypto = require('crypto')
const multer = require('multer')
const { customAlphabet } = require('nanoid')
const config = require('../config')
const { store, storeInfo } = require('../store')
const { issueToken, requireAuth, hashPassword, verifyPassword } = require('../auth')
const { sendMail, mailEnabled, otpEmail } = require('../mailer')
const { isLimited, recordFailure, clearKey } = require('../limiter')

const router = express.Router()
const rid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 10)

// --- Super-admin auth helpers -------------------------------------------------
const otpOn = () => config.admin.otp !== 'off' && (config.admin.otp === 'force' || mailEnabled())
const sha = (s) => crypto.createHash('sha256').update(String(s)).digest('hex')
const maskEmail = (e) => e.replace(/^(.).*(@.*)$/, (m, a, b) => a + '•••' + b)

const getAdmin = async () => (await store().getMeta()).adminAccount || null

// --- Audit log ----------------------------------------------------------------
// Fire-and-forget trail of admin actions on data (views of PII, edits,
// deletions). Stored in meta.audit, newest first, capped so it can't grow
// unbounded. Never blocks or fails the underlying request.
const AUDIT_MAX = 300
function audit(req, action, target) {
  ;(async () => {
    try {
      const meta = await store().getMeta()
      const entry = { ts: new Date().toISOString(), actor: (req.admin && req.admin.sub) || 'admin', action, target: String(target || '').slice(0, 200) }
      await store().setMeta({ audit: [entry, ...(meta.audit || [])].slice(0, AUDIT_MAX) })
    } catch { /* audit must never break the request */ }
  })()
}

// One active challenge at a time (single owner); persisted in the store so it
// works across serverless instances.
async function createChallenge(purpose) {
  const code = String(crypto.randomInt(100000, 1000000))
  const challenge = {
    id: crypto.randomBytes(12).toString('hex'),
    codeHash: sha(code),
    purpose,
    expiresAt: Date.now() + config.admin.otpTtlMin * 60 * 1000,
    attempts: 0,
  }
  await store().setMeta({ adminOtp: challenge })
  return { challenge, code }
}

async function consumeChallenge(id, code, purpose) {
  const ch = (await store().getMeta()).adminOtp
  if (!ch || ch.id !== id || ch.purpose !== purpose) return { error: 'Code expired — please start again' }
  if (Date.now() > ch.expiresAt) return { error: 'Code expired — please start again' }
  if (ch.attempts >= 5) return { error: 'Too many wrong codes — please start again' }
  if (sha(String(code || '').trim()) !== ch.codeHash) {
    ch.attempts += 1
    await store().setMeta({ adminOtp: ch })
    return { error: 'Wrong code — check the email and try again' }
  }
  await store().setMeta({ adminOtp: null })
  return { ok: true }
}

async function emailChallenge(purpose, adminEmail) {
  const { challenge, code } = await createChallenge(purpose)
  const mail = otpEmail(code)
  let sent = false
  try { const r = await sendMail({ to: adminEmail, ...mail }); sent = !!r.sent } catch (e) { console.error('[mail] send failed:', e.message) }
  if (!sent) console.log('[admin] OTP code for %s (%s): %s', adminEmail, purpose, code)
  return { challenge: challenge.id, sent }
}

// Persistent lockout: 6 wrong owner passwords → 15-minute lockout (survives
// restarts and applies across instances).
const ADMIN_LOGIN_KEY = 'alogin'
const ADMIN_LOGIN_MAX = 6
const ADMIN_LOGIN_WINDOW = 15 * 60 * 1000

// --- Login (public) -----------------------------------------------------------
router.post('/login', async (req, res, next) => {
  try {
    const { username, email, password } = req.body || {}
    const limited = await isLimited(ADMIN_LOGIN_KEY, ADMIN_LOGIN_MAX)
    if (limited.limited) return res.status(429).json({ error: 'Too many attempts — try again in a few minutes' })
    const admin = await getAdmin()
    const em = String(email || username || '').trim().toLowerCase()
    if (!admin || em !== admin.email || !verifyPassword(password, admin.passwordHash)) {
      await recordFailure(ADMIN_LOGIN_KEY, ADMIN_LOGIN_WINDOW)
      return res.status(401).json({ error: 'Wrong email or password' })
    }
    await clearKey(ADMIN_LOGIN_KEY)
    if (otpOn()) {
      const { challenge, sent } = await emailChallenge('login', admin.email)
      return res.json({ otp: true, challenge, email: maskEmail(admin.email), sent })
    }
    res.json({ token: issueToken(admin.email), user: { username: admin.email, role: 'admin' } })
  } catch (err) { next(err) }
})

// Step 2: verify the emailed code.
router.post('/otp', async (req, res, next) => {
  try {
    const { challenge, code } = req.body || {}
    const result = await consumeChallenge(challenge, code, 'login')
    if (result.error) return res.status(401).json({ error: result.error })
    const admin = await getAdmin()
    res.json({ token: issueToken(admin.email), user: { username: admin.email, role: 'admin' } })
  } catch (err) { next(err) }
})

// Forgot password → email an OTP to the owner address.
router.post('/forgot', async (req, res, next) => {
  try {
    const admin = await getAdmin()
    const em = String((req.body || {}).email || '').trim().toLowerCase()
    if (!admin || em !== admin.email) return res.status(401).json({ error: 'That is not the owner email' })
    const { challenge, sent } = await emailChallenge('reset', admin.email)
    res.json({ challenge, email: maskEmail(admin.email), sent })
  } catch (err) { next(err) }
})

// Complete the reset with the emailed code + a new password.
router.post('/reset', async (req, res, next) => {
  try {
    const { challenge, code, password } = req.body || {}
    if (String(password || '').length < 8) return res.status(400).json({ error: 'New password must be at least 8 characters' })
    const result = await consumeChallenge(challenge, code, 'reset')
    if (result.error) return res.status(401).json({ error: result.error })
    const admin = await getAdmin()
    await store().setMeta({ adminAccount: { ...admin, passwordHash: hashPassword(password), updatedAt: new Date().toISOString() } })
    res.json({ ok: true })
  } catch (err) { next(err) }
})

// --- Everything below requires a valid admin token --------------------------
router.use(requireAuth)

router.get('/me', (req, res) => res.json({ user: { username: req.admin.sub, role: req.admin.role } }))

// Owner account (Admin → Security).
router.get('/account', async (req, res, next) => {
  try {
    const admin = await getAdmin()
    res.json({ email: admin?.email || '', otpEnabled: otpOn(), mailConfigured: mailEnabled(), updatedAt: admin?.updatedAt || null })
  } catch (err) { next(err) }
})

router.put('/account', async (req, res, next) => {
  try {
    const { currentPassword, email, newPassword } = req.body || {}
    const admin = await getAdmin()
    if (!admin || !verifyPassword(currentPassword, admin.passwordHash)) {
      return res.status(401).json({ error: 'Current password is incorrect' })
    }
    const next_ = { ...admin }
    if (email !== undefined) {
      const em = String(email).trim().toLowerCase()
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) return res.status(400).json({ error: 'Please enter a valid email address' })
      next_.email = em
    }
    if (newPassword !== undefined && newPassword !== '') {
      if (String(newPassword).length < 8) return res.status(400).json({ error: 'New password must be at least 8 characters' })
      next_.passwordHash = hashPassword(newPassword)
    }
    next_.updatedAt = new Date().toISOString()
    await store().setMeta({ adminAccount: next_ })
    res.json({ ok: true, email: next_.email })
  } catch (err) { next(err) }
})

router.get('/stats', async (req, res, next) => {
  try {
    const [content, orders, bookings, users] = await Promise.all([store().getContent(), store().listOrders(), store().listBookings(), store().listUsers()])
    const revenue = orders.reduce((s, o) => s + (Number(o.total) || 0), 0)
    res.json({
      products: (content.products || []).length,
      stores: (content.stores || []).length,
      orders: orders.length,
      bookings: bookings.length,
      customers: users.length,
      newOrders: orders.filter((o) => o.status === 'New').length,
      newBookings: bookings.filter((b) => b.status === 'New').length,
      revenue,
      // Deployment health — powers the dashboard warning banner and the
      // Security page's environment checklist.
      store: storeInfo(),
      security: { jwtFromEnv: config.jwtSecretFromEnv, mailConfigured: mailEnabled(), otpEnabled: otpOn() },
    })
  } catch (err) { next(err) }
})

// --- Customers ----------------------------------------------------------------
router.get('/users', async (req, res, next) => {
  try {
    const [users, orders, bookings] = await Promise.all([store().listUsers(), store().listOrders(), store().listBookings()])
    audit(req, 'customers.view', `count=${users.length}`) // PII access trail
    res.json(users.map((u) => ({
      id: u.id, name: u.name, email: u.email, phone: u.phone || '',
      createdAt: u.createdAt, active: u.active !== false,
      wishlistCount: (u.wishlist || []).length,
      orders: orders.filter((o) => o.userId === u.id).length,
      bookings: bookings.filter((b) => b.userId === u.id).length,
      spent: orders.filter((o) => o.userId === u.id).reduce((s, o) => s + (Number(o.total) || 0), 0),
    })))
  } catch (err) { next(err) }
})

router.patch('/users/:id', async (req, res, next) => {
  try {
    const patch = {}
    if (typeof (req.body || {}).active === 'boolean') patch.active = req.body.active
    const user = await store().updateUser(req.params.id, patch)
    if (!user) return res.status(404).json({ error: 'Customer not found' })
    audit(req, patch.active === false ? 'customer.disable' : 'customer.enable', user.email || user.id)
    res.json({ id: user.id, active: user.active !== false })
  } catch (err) { next(err) }
})

router.delete('/users/:id', async (req, res, next) => {
  try {
    await store().deleteUser(req.params.id)
    audit(req, 'customer.delete', req.params.id)
    res.json({ ok: true })
  } catch (err) { next(err) }
})

// Recent admin actions on data (PII views/edits/deletes) — newest first.
router.get('/audit', async (req, res, next) => {
  try { res.json((await store().getMeta()).audit || []) } catch (err) { next(err) }
})

// --- Content (single document holding products, homepage, stores, settings) --
router.get('/content', async (req, res, next) => {
  try { res.json(await store().getContent()) } catch (err) { next(err) }
})

// Strip HTML tags from a string (defence-in-depth against stored XSS — React
// escapes on render, this keeps markup out of the data layer entirely).
const stripTags = (s) => String(s).replace(/<[^>]*>/g, '').slice(0, 4000)
const cleanBilingual = (v) => (v && typeof v === 'object'
  ? { ...v, en: v.en != null ? stripTags(v.en) : v.en, he: v.he != null ? stripTags(v.he) : v.he }
  : typeof v === 'string' ? stripTags(v) : v)
const clamp = (n, lo, hi, dflt = 0) => { const x = Number(n); return Number.isFinite(x) ? Math.min(hi, Math.max(lo, x)) : dflt }

// Server-side validation for product records — the UI validates too, but the
// API must not trust the client (types/ranges per the catalog contract).
function validateProducts(products) {
  if (!Array.isArray(products)) return { error: 'products must be an array' }
  for (const p of products) {
    if (!p || typeof p !== 'object') return { error: 'Invalid product entry' }
    p.name = stripTags(p.name || '').slice(0, 160)
    p.brand = stripTags(p.brand || '').slice(0, 80)
    p.amount = clamp(p.amount, 0, 10_000_000)               // price ≥ 0
    p.original = clamp(p.original, 0, 10_000_000)
    p.rating = clamp(p.rating, 0, 5, 5)                     // rating 0–5
    p.reviews = Math.round(clamp(p.reviews, 0, 10_000_000)) // integer ≥ 0
    if (p.desc) p.desc = cleanBilingual(p.desc)
    if (p.specs && typeof p.specs === 'object') {
      for (const k of ['lensWidth', 'bridge', 'temple', 'weight']) if (p.specs[k] != null) p.specs[k] = stripTags(p.specs[k]).slice(0, 80)
      if (p.specs.lensOpts) p.specs.lensOpts = cleanBilingual(p.specs.lensOpts)
    }
  }
  return { ok: true }
}

router.put('/content', async (req, res, next) => {
  try {
    const content = req.body
    if (!content || typeof content !== 'object' || Array.isArray(content)) {
      return res.status(400).json({ error: 'Invalid content payload' })
    }
    if (content.products) {
      const v = validateProducts(content.products)
      if (v.error) return res.status(400).json({ error: v.error })
    }
    // Version stamp — the storefront polls this to refresh itself instantly.
    content.updatedAt = new Date().toISOString()
    const saved = await store().setContent(content)
    audit(req, 'content.save', `products=${(content.products || []).length}`)
    res.json(saved)
  } catch (err) { next(err) }
})

// --- Orders -----------------------------------------------------------------
router.get('/orders', async (req, res, next) => {
  try { res.json(await store().listOrders()) } catch (err) { next(err) }
})
router.patch('/orders/:id', async (req, res, next) => {
  try {
    const patch = {}
    if (req.body && typeof req.body.status === 'string') patch.status = req.body.status.slice(0, 40)
    const updated = await store().updateOrder(req.params.id, patch)
    if (!updated) return res.status(404).json({ error: 'Order not found' })
    res.json(updated)
  } catch (err) { next(err) }
})
router.delete('/orders/:id', async (req, res, next) => {
  try {
    await store().deleteOrder(req.params.id)
    audit(req, 'order.delete', req.params.id)
    res.json({ ok: true })
  } catch (err) { next(err) }
})

// --- Bookings ---------------------------------------------------------------
router.get('/bookings', async (req, res, next) => {
  try { res.json(await store().listBookings()) } catch (err) { next(err) }
})
router.patch('/bookings/:id', async (req, res, next) => {
  try {
    const patch = {}
    if (req.body && typeof req.body.status === 'string') patch.status = req.body.status.slice(0, 40)
    const updated = await store().updateBooking(req.params.id, patch)
    if (!updated) return res.status(404).json({ error: 'Booking not found' })
    res.json(updated)
  } catch (err) { next(err) }
})
router.delete('/bookings/:id', async (req, res, next) => {
  try {
    await store().deleteBooking(req.params.id)
    audit(req, 'appointment.delete', req.params.id)
    res.json({ ok: true })
  } catch (err) { next(err) }
})

// --- Image upload -----------------------------------------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => { fs.mkdirSync(config.paths.uploads, { recursive: true }); cb(null, config.paths.uploads) },
  filename: (req, file, cb) => {
    const ext = (path.extname(file.originalname) || '.jpg').toLowerCase().replace(/[^.a-z0-9]/g, '')
    cb(null, `${Date.now()}-${rid()}${ext}`)
  },
})
const upload = multer({
  storage,
  limits: { fileSize: config.maxUpload, files: 1 },
  // Only raster images — reject SVG (can carry scripts) and anything non-image.
  fileFilter: (req, file, cb) => cb(null, /^image\/(png|jpe?g|gif|webp|avif|bmp)$/i.test(file.mimetype)),
})

router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image file received' })
  res.status(201).json({ url: `/uploads/${req.file.filename}` })
})

module.exports = router
