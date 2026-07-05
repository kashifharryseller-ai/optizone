// MySQL store — production backend for Hostinger (mysql2, no native compile).
// Content lives as a single JSON row; orders/bookings are rows keyed by id.
const mysql = require('mysql2/promise')
const config = require('../config')
const { defaultContent } = require('../seed-data')

let pool = null

async function ensureSchema(conn) {
  await conn.query(`CREATE TABLE IF NOT EXISTS oz_content (
    id TINYINT PRIMARY KEY,
    data LONGTEXT NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`)
  await conn.query(`CREATE TABLE IF NOT EXISTS oz_orders (
    id VARCHAR(40) PRIMARY KEY,
    created_at DATETIME NOT NULL,
    data LONGTEXT NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`)
  await conn.query(`CREATE TABLE IF NOT EXISTS oz_bookings (
    id VARCHAR(40) PRIMARY KEY,
    created_at DATETIME NOT NULL,
    data LONGTEXT NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`)
  await conn.query(`CREATE TABLE IF NOT EXISTS oz_users (
    id VARCHAR(40) PRIMARY KEY,
    email VARCHAR(190) NOT NULL UNIQUE,
    created_at DATETIME NOT NULL,
    data LONGTEXT NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`)

  const [rows] = await conn.query('SELECT id FROM oz_content WHERE id = 1')
  if (!rows.length) {
    await conn.query('INSERT INTO oz_content (id, data) VALUES (1, ?)', [JSON.stringify(defaultContent())])
  }
}

module.exports = {
  kind: 'mysql',
  async init() {
    pool = mysql.createPool({
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
      waitForConnections: true,
      connectionLimit: 8,
      charset: 'utf8mb4',
      timezone: 'Z',
    })
    const conn = await pool.getConnection()
    try { await ensureSchema(conn) } finally { conn.release() }
  },

  async getContent() {
    const [rows] = await pool.query('SELECT data FROM oz_content WHERE id = 1')
    if (!rows.length) return defaultContent()
    try { return JSON.parse(rows[0].data) } catch (_) { return defaultContent() }
  },
  async setContent(content) {
    await pool.query('INSERT INTO oz_content (id, data) VALUES (1, ?) ON DUPLICATE KEY UPDATE data = VALUES(data)', [JSON.stringify(content)])
    return content
  },

  async listOrders() {
    const [rows] = await pool.query('SELECT data FROM oz_orders ORDER BY created_at DESC')
    return rows.map((r) => JSON.parse(r.data))
  },
  async addOrder(order) {
    await pool.query('INSERT INTO oz_orders (id, created_at, data) VALUES (?, ?, ?)', [order.id, new Date(order.createdAt), JSON.stringify(order)])
    return order
  },
  async updateOrder(id, patch) {
    const [rows] = await pool.query('SELECT data FROM oz_orders WHERE id = ?', [id])
    if (!rows.length) return null
    const o = { ...JSON.parse(rows[0].data), ...patch }
    await pool.query('UPDATE oz_orders SET data = ? WHERE id = ?', [JSON.stringify(o), id])
    return o
  },
  async deleteOrder(id) { await pool.query('DELETE FROM oz_orders WHERE id = ?', [id]) },

  async listBookings() {
    const [rows] = await pool.query('SELECT data FROM oz_bookings ORDER BY created_at DESC')
    return rows.map((r) => JSON.parse(r.data))
  },
  async addBooking(b) {
    await pool.query('INSERT INTO oz_bookings (id, created_at, data) VALUES (?, ?, ?)', [b.id, new Date(b.createdAt), JSON.stringify(b)])
    return b
  },
  async updateBooking(id, patch) {
    const [rows] = await pool.query('SELECT data FROM oz_bookings WHERE id = ?', [id])
    if (!rows.length) return null
    const bk = { ...JSON.parse(rows[0].data), ...patch }
    await pool.query('UPDATE oz_bookings SET data = ? WHERE id = ?', [JSON.stringify(bk), id])
    return bk
  },
  async deleteBooking(id) { await pool.query('DELETE FROM oz_bookings WHERE id = ?', [id]) },

  // --- Users (customer accounts) ---
  async listUsers() {
    const [rows] = await pool.query('SELECT data FROM oz_users ORDER BY created_at DESC')
    return rows.map((r) => JSON.parse(r.data))
  },
  async getUser(id) {
    const [rows] = await pool.query('SELECT data FROM oz_users WHERE id = ?', [id])
    return rows.length ? JSON.parse(rows[0].data) : null
  },
  async findUserByEmail(email) {
    const e = String(email || '').trim().toLowerCase()
    const [rows] = await pool.query('SELECT data FROM oz_users WHERE email = ?', [e])
    return rows.length ? JSON.parse(rows[0].data) : null
  },
  async addUser(user) {
    await pool.query('INSERT INTO oz_users (id, email, created_at, data) VALUES (?, ?, ?, ?)', [user.id, user.email, new Date(user.createdAt), JSON.stringify(user)])
    return user
  },
  async updateUser(id, patch) {
    const [rows] = await pool.query('SELECT data FROM oz_users WHERE id = ?', [id])
    if (!rows.length) return null
    const u = { ...JSON.parse(rows[0].data), ...patch }
    await pool.query('UPDATE oz_users SET data = ?, email = ? WHERE id = ?', [JSON.stringify(u), u.email, id])
    return u
  },
  async deleteUser(id) { await pool.query('DELETE FROM oz_users WHERE id = ?', [id]) },
}
