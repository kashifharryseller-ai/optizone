// Admin API — login (public) + protected content/orders/bookings/upload.
const express = require('express')
const path = require('path')
const fs = require('fs')
const multer = require('multer')
const { customAlphabet } = require('nanoid')
const config = require('../config')
const { store } = require('../store')
const { checkCredentials, issueToken, requireAuth } = require('../auth')

const router = express.Router()
const rid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 10)

// --- Login (public) ---------------------------------------------------------
router.post('/login', (req, res) => {
  const { username, password } = req.body || {}
  if (!checkCredentials(username, password)) {
    return res.status(401).json({ error: 'Invalid username or password' })
  }
  res.json({ token: issueToken(username), user: { username, role: 'admin' } })
})

// --- Everything below requires a valid admin token --------------------------
router.use(requireAuth)

router.get('/me', (req, res) => res.json({ user: { username: req.admin.sub, role: req.admin.role } }))

router.get('/stats', async (req, res, next) => {
  try {
    const [content, orders, bookings] = await Promise.all([store().getContent(), store().listOrders(), store().listBookings()])
    const revenue = orders.reduce((s, o) => s + (Number(o.total) || 0), 0)
    res.json({
      products: (content.products || []).length,
      stores: (content.stores || []).length,
      orders: orders.length,
      bookings: bookings.length,
      newOrders: orders.filter((o) => o.status === 'New').length,
      newBookings: bookings.filter((b) => b.status === 'New').length,
      revenue,
    })
  } catch (err) { next(err) }
})

// --- Content (single document holding products, homepage, stores, settings) --
router.get('/content', async (req, res, next) => {
  try { res.json(await store().getContent()) } catch (err) { next(err) }
})

router.put('/content', async (req, res, next) => {
  try {
    const content = req.body
    if (!content || typeof content !== 'object' || Array.isArray(content)) {
      return res.status(400).json({ error: 'Invalid content payload' })
    }
    res.json(await store().setContent(content))
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
  try { await store().deleteOrder(req.params.id); res.json({ ok: true }) } catch (err) { next(err) }
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
  try { await store().deleteBooking(req.params.id); res.json({ ok: true }) } catch (err) { next(err) }
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
  limits: { fileSize: config.maxUpload },
  fileFilter: (req, file, cb) => cb(null, /^image\//.test(file.mimetype)),
})

router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image file received' })
  res.status(201).json({ url: `/uploads/${req.file.filename}` })
})

module.exports = router
