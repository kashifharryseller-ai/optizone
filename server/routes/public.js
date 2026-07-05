// Public API — storefront reads content and submits orders / bookings.
const express = require('express')
const { customAlphabet } = require('nanoid')
const { store } = require('../store')

const router = express.Router()
const num = customAlphabet('0123456789', 5)

// Storefront content (products, homepage copy, stores, settings, media, …).
router.get('/content', async (req, res, next) => {
  try {
    res.json(await store().getContent())
  } catch (err) { next(err) }
})

// Create an order from checkout.
router.post('/orders', async (req, res, next) => {
  try {
    const b = req.body || {}
    const items = Array.isArray(b.items) ? b.items : []
    const order = {
      id: 'OZ-' + num(),
      createdAt: new Date().toISOString(),
      status: 'New',
      customer: {
        name: String(b.customer?.name || '').slice(0, 120),
        email: String(b.customer?.email || '').slice(0, 160),
        phone: String(b.customer?.phone || '').slice(0, 60),
        address: String(b.customer?.address || '').slice(0, 300),
      },
      items: items.slice(0, 50).map((it) => ({
        id: it.id, name: String(it.name || '').slice(0, 160), brand: String(it.brand || '').slice(0, 80),
        amount: Number(it.amount) || 0, qty: Number(it.qty) || 1,
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

// Create a booking / appointment.
router.post('/bookings', async (req, res, next) => {
  try {
    const b = req.body || {}
    const booking = {
      id: 'AP-' + num(),
      createdAt: new Date().toISOString(),
      status: 'New',
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
