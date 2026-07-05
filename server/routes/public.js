// Public API — storefront reads content and submits orders / bookings.
const express = require('express')
const { customAlphabet } = require('nanoid')
const { store } = require('../store')
const { optionalUser } = require('../auth')
const config = require('../config')

const router = express.Router()
const num = customAlphabet('0123456789', 5)

// Storefront content (products, homepage copy, stores, settings, media, …).
// The Google Maps browser key is injected from env at response time (it is a
// referrer-restricted public key, not a secret, and is never stored in the DB).
router.get('/content', async (req, res, next) => {
  try {
    const content = await store().getContent()
    res.json({ ...content, settings: { ...(content.settings || {}), mapsKey: config.mapsKey || '' } })
  } catch (err) { next(err) }
})

// Tiny version stamp — the storefront polls this and refetches content when it
// changes, so admin edits appear on the live site automatically.
router.get('/content/version', async (req, res, next) => {
  try {
    const content = await store().getContent()
    res.json({ v: content.updatedAt || null })
  } catch (err) { next(err) }
})

// Create an order from checkout. If the shopper is signed in, the order is
// linked to their account (visible under My Orders and in the admin panel).
router.post('/orders', optionalUser, async (req, res, next) => {
  try {
    const b = req.body || {}
    const items = Array.isArray(b.items) ? b.items : []
    const order = {
      id: 'OZ-' + num(),
      createdAt: new Date().toISOString(),
      status: 'New',
      userId: req.userId || null,
      customer: {
        name: String(b.customer?.name || '').slice(0, 120),
        email: String(b.customer?.email || '').slice(0, 160),
        phone: String(b.customer?.phone || '').slice(0, 60),
        address: String(b.customer?.address || '').slice(0, 300),
        city: String(b.customer?.city || '').slice(0, 120),
        postal: String(b.customer?.postal || '').slice(0, 20),
        // Normalized/geocoded address from Places Autocomplete (when verified).
        geo: b.customer?.geo && typeof b.customer.geo === 'object' ? {
          formatted: String(b.customer.geo.formatted || '').slice(0, 300),
          placeId: String(b.customer.geo.placeId || '').slice(0, 200),
          lat: Number(b.customer.geo.lat) || 0,
          lng: Number(b.customer.geo.lng) || 0,
        } : null,
      },
      addressVerified: !!b.addressVerified,
      items: items.slice(0, 50).map((it) => ({
        id: it.id, name: String(it.name || '').slice(0, 160), brand: String(it.brand || '').slice(0, 80),
        amount: Number(it.amount) || 0, qty: Number(it.qty) || 1,
        // Try Mirror per-line custom frame size (e.g. "110%").
        customSize: it.customSize ? String(it.customSize).slice(0, 40) : null,
      })),
      subtotal: Number(b.subtotal) || 0,
      shipping: Number(b.shipping) || 0,
      total: Number(b.total) || 0,
      payment: String(b.payment || '').slice(0, 40),
      fulfilment: String(b.fulfilment || '').slice(0, 40),
    }
    await store().addOrder(order)
    res.status(201).json({ id: order.id })
  } catch (err) { next(err) }
})

// Create a booking / appointment (linked to the account when signed in).
router.post('/bookings', optionalUser, async (req, res, next) => {
  try {
    const b = req.body || {}
    const booking = {
      id: 'AP-' + num(),
      createdAt: new Date().toISOString(),
      status: 'New',
      userId: req.userId || null,
      service: String(b.service || '').slice(0, 120),
      branch: String(b.branch || '').slice(0, 120),
      day: String(b.day || '').slice(0, 40),
      slot: String(b.slot || '').slice(0, 20),
      name: String(b.name || '').slice(0, 120),
      phone: String(b.phone || '').slice(0, 60),
    }
    await store().addBooking(booking)
    res.status(201).json({ id: booking.id })
  } catch (err) { next(err) }
})

module.exports = router
