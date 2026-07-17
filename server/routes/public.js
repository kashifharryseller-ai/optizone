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
    res.json({
      ...content,
      // Soft-deleted (archived) products stay in the admin catalog but never
      // reach the storefront.
      products: (content.products || []).filter((p) => p.active !== false),
      settings: { ...(content.settings || {}), mapsKey: config.mapsKey || '' },
    })
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

// Create an order from checkout. Prices and totals are ALWAYS recomputed on the
// server from the catalog — the client's amounts/subtotal/total are never
// trusted. Orders are linked to an account only by the authenticated session
// (never by matching a checkout email, which anyone could type).
const qty = (n) => Math.min(20, Math.max(1, Math.round(Number(n) || 1)))

router.post('/orders', optionalUser, async (req, res, next) => {
  try {
    const b = req.body || {}
    const rawItems = (Array.isArray(b.items) ? b.items : []).slice(0, 50)
    if (!rawItems.length) return res.status(400).json({ error: 'Your cart is empty' })

    // Only accept products that exist in the live catalog and are active, and
    // always derive names/brands from the catalog — the client can't fabricate
    // products. The client amount may legitimately exceed the base price (lens
    // upgrades), so we floor each line at the catalog price rather than trusting
    // it; anything below base is bumped up to base. (Note: lens-option pricing is
    // still client-side, so a shopper could under-declare add-ons above base —
    // moving that table server-side is a tracked follow-up.)
    const content = await store().getContent()
    const catalog = new Map(
      (content.products || [])
        .filter((p) => p && p.active !== false)
        .map((p) => [String(p.id), p]),
    )

    const items = rawItems
      .filter((it) => it && typeof it === 'object' && !Array.isArray(it))
      .map((it) => {
        const prod = catalog.get(String(it.id))
        if (!prod) return null // unknown or inactive product → drop the line
        const base = Number(prod.amount) || 0
        const clientAmount = Number(it.amount)
        const amount = Number.isFinite(clientAmount) ? Math.max(base, clientAmount) : base
        return {
          id: prod.id,
          name: String(prod.name || '').slice(0, 160),
          brand: String(prod.brand || '').slice(0, 80),
          amount,
          qty: qty(it.qty),
          customSize: it.customSize ? String(it.customSize).slice(0, 40) : null,
        }
      })
      .filter((it) => it && it.amount > 0)

    if (!items.length) return res.status(400).json({ error: 'No valid items in cart' })

    const settings = content.settings || {}
    // Preserve valid zero values (free shipping / zero threshold); only fall back
    // to defaults when the configured value is missing or invalid.
    const rawThreshold = Number(settings.shippingThreshold)
    const rawFee = Number(settings.shippingFee)
    const threshold = Number.isFinite(rawThreshold) && rawThreshold >= 0 ? rawThreshold : 400
    const fee = Number.isFinite(rawFee) && rawFee >= 0 ? rawFee : 30
    const subtotal = items.reduce((s, it) => s + it.amount * it.qty, 0)
    const fulfilment = String(b.fulfilment || '').slice(0, 40)
    // Free over threshold or for in-branch pickup; the fee otherwise.
    const shipping = fulfilment === 'pickup' || subtotal > threshold ? 0 : fee
    const total = subtotal + shipping

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
      items,
      subtotal,
      shipping,
      total,
      payment: String(b.payment || '').slice(0, 40),
      fulfilment,
      branch: fulfilment === 'pickup' ? String(b.branch || '').slice(0, 120) : null,
    }
    await store().addOrder(order)
    res.status(201).json({ id: order.id, total: order.total })
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
