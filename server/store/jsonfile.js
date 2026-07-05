// JSON-file store — zero-dependency fallback backend. Persists to server/data/db.json.
// Used when no MySQL is configured, and for local development/testing.
const fs = require('fs')
const fsp = require('fs/promises')
const path = require('path')
const config = require('../config')
const { defaultContent } = require('../seed-data')

let cache = null
let writing = Promise.resolve()

async function load() {
  try {
    const raw = await fsp.readFile(config.paths.dataFile, 'utf8')
    cache = JSON.parse(raw)
  } catch (_) {
    cache = { content: defaultContent(), orders: [], bookings: [] }
    await persist()
  }
  if (!cache.content) cache.content = defaultContent()
  if (!Array.isArray(cache.orders)) cache.orders = []
  if (!Array.isArray(cache.bookings)) cache.bookings = []
  return cache
}

async function persist() {
  // Serialize writes and write atomically (tmp + rename).
  writing = writing.then(async () => {
    await fsp.mkdir(config.paths.dataDir, { recursive: true })
    const tmp = config.paths.dataFile + '.tmp'
    await fsp.writeFile(tmp, JSON.stringify(cache, null, 2))
    await fsp.rename(tmp, config.paths.dataFile)
  })
  return writing
}

module.exports = {
  kind: 'jsonfile',
  async init() {
    await fsp.mkdir(config.paths.uploads, { recursive: true })
    await load()
  },
  async getContent() { return cache.content },
  async setContent(content) { cache.content = content; await persist(); return content },

  async listOrders() { return [...cache.orders].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)) },
  async addOrder(order) { cache.orders.push(order); await persist(); return order },
  async updateOrder(id, patch) {
    const o = cache.orders.find((x) => x.id === id)
    if (!o) return null
    Object.assign(o, patch); await persist(); return o
  },
  async deleteOrder(id) { cache.orders = cache.orders.filter((x) => x.id !== id); await persist() },

  async listBookings() { return [...cache.bookings].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)) },
  async addBooking(b) { cache.bookings.push(b); await persist(); return b },
  async updateBooking(id, patch) {
    const b = cache.bookings.find((x) => x.id === id)
    if (!b) return null
    Object.assign(b, patch); await persist(); return b
  },
  async deleteBooking(id) { cache.bookings = cache.bookings.filter((x) => x.id !== id); await persist() },
}
