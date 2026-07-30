// MySQL store — production backend for Hostinger (mysql2, no native compile).
//
// Design: a professional HYBRID document + relational schema.
//   • The JSON `data` column on each row is the source of truth (flexible, never
//     loses a field as the app evolves).
//   • Alongside it, first-class INDEXED columns (status, total, customer_email,
//     user_id, timestamps…) are projected from the JSON so the database is fully
//     queryable/reportable at an agency level — you can run real SQL analytics,
//     index lookups and joins in phpMyAdmin/BI tools.
//   • Orders are additionally NORMALIZED into `oz_order_items` (one row per line)
//     for proper sales/product reporting.
//
// Safety: base writes (id, created_at, data) are unchanged and always run first,
// so an order/booking can never fail because of the projected columns; the
// structured projection runs best-effort right after. Schema migration for
// existing databases is defensive (checks information_schema; each step wrapped).
const mysql = require('mysql2/promise')
const config = require('../config')
const { defaultContent } = require('../seed-data')

let pool = null

// ── schema helpers ──────────────────────────────────────────────────────────
async function columnsOf(conn, table) {
  const [rows] = await conn.query(
    'SELECT COLUMN_NAME AS c FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?', [table],
  )
  return new Set(rows.map((r) => r.c))
}
async function addColumns(conn, table, cols) {
  const have = await columnsOf(conn, table)
  for (const [name, ddl] of Object.entries(cols)) {
    if (have.has(name)) continue
    try { await conn.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${name}\` ${ddl}`) }
    catch (e) { console.warn('[store] add column %s.%s skipped: %s', table, name, e.message) }
  }
}
async function ensureIndex(conn, table, name, cols) {
  try {
    const [rows] = await conn.query(
      'SELECT 1 FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND INDEX_NAME = ? LIMIT 1', [table, name],
    )
    if (rows.length) return
    await conn.query(`CREATE INDEX \`${name}\` ON \`${table}\` (${cols})`)
  } catch (e) { console.warn('[store] index %s.%s skipped: %s', table, name, e.message) }
}
async function ensureForeignKey(conn, table, name, ddl) {
  try {
    const [rows] = await conn.query(
      'SELECT 1 FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND CONSTRAINT_NAME = ? LIMIT 1', [table, name],
    )
    if (rows.length) return
    await conn.query(`ALTER TABLE \`${table}\` ADD CONSTRAINT \`${name}\` ${ddl}`)
  } catch (e) { console.warn('[store] fk %s skipped: %s', name, e.message) }
}

async function ensureSchema(conn) {
  // Content / meta — single JSON rows (+ updated_at for audit).
  await conn.query(`CREATE TABLE IF NOT EXISTS oz_content (
    id TINYINT PRIMARY KEY,
    data LONGTEXT NOT NULL,
    updated_at DATETIME NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`)
  await conn.query(`CREATE TABLE IF NOT EXISTS oz_meta (
    id TINYINT PRIMARY KEY,
    data LONGTEXT NOT NULL,
    updated_at DATETIME NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`)

  // Orders — document + projected, indexed columns.
  await conn.query(`CREATE TABLE IF NOT EXISTS oz_orders (
    id VARCHAR(40) PRIMARY KEY,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NULL,
    status VARCHAR(40) NULL,
    subtotal DECIMAL(10,2) NULL,
    shipping DECIMAL(10,2) NULL,
    total DECIMAL(10,2) NULL,
    payment VARCHAR(40) NULL,
    fulfilment VARCHAR(40) NULL,
    user_id VARCHAR(40) NULL,
    customer_email VARCHAR(190) NULL,
    customer_name VARCHAR(190) NULL,
    customer_phone VARCHAR(60) NULL,
    item_count INT NULL,
    data LONGTEXT NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`)

  // Normalized order line-items — one row per product per order.
  await conn.query(`CREATE TABLE IF NOT EXISTS oz_order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(40) NOT NULL,
    product_id VARCHAR(40) NULL,
    brand VARCHAR(120) NULL,
    name VARCHAR(190) NULL,
    qty INT NOT NULL DEFAULT 0,
    unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    line_total DECIMAL(10,2) NOT NULL DEFAULT 0,
    custom_size VARCHAR(20) NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`)

  // Bookings — document + projected columns.
  await conn.query(`CREATE TABLE IF NOT EXISTS oz_bookings (
    id VARCHAR(40) PRIMARY KEY,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NULL,
    status VARCHAR(40) NULL,
    service VARCHAR(120) NULL,
    branch VARCHAR(120) NULL,
    day VARCHAR(40) NULL,
    slot VARCHAR(20) NULL,
    user_id VARCHAR(40) NULL,
    name VARCHAR(190) NULL,
    phone VARCHAR(60) NULL,
    data LONGTEXT NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`)

  // Customer accounts — document + projected columns.
  await conn.query(`CREATE TABLE IF NOT EXISTS oz_users (
    id VARCHAR(40) PRIMARY KEY,
    email VARCHAR(190) NOT NULL UNIQUE,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NULL,
    name VARCHAR(190) NULL,
    phone VARCHAR(60) NULL,
    data LONGTEXT NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`)

  // ── Defensive migration for databases created before this schema ───────────
  await addColumns(conn, 'oz_content', { updated_at: 'DATETIME NULL' })
  await addColumns(conn, 'oz_meta', { updated_at: 'DATETIME NULL' })
  await addColumns(conn, 'oz_orders', {
    updated_at: 'DATETIME NULL', status: 'VARCHAR(40) NULL', subtotal: 'DECIMAL(10,2) NULL',
    shipping: 'DECIMAL(10,2) NULL', total: 'DECIMAL(10,2) NULL', payment: 'VARCHAR(40) NULL',
    fulfilment: 'VARCHAR(40) NULL', user_id: 'VARCHAR(40) NULL', customer_email: 'VARCHAR(190) NULL',
    customer_name: 'VARCHAR(190) NULL', customer_phone: 'VARCHAR(60) NULL', item_count: 'INT NULL',
  })
  await addColumns(conn, 'oz_bookings', {
    updated_at: 'DATETIME NULL', status: 'VARCHAR(40) NULL', service: 'VARCHAR(120) NULL',
    branch: 'VARCHAR(120) NULL', day: 'VARCHAR(40) NULL', slot: 'VARCHAR(20) NULL',
    user_id: 'VARCHAR(40) NULL', name: 'VARCHAR(190) NULL', phone: 'VARCHAR(60) NULL',
  })
  await addColumns(conn, 'oz_users', { updated_at: 'DATETIME NULL', name: 'VARCHAR(190) NULL', phone: 'VARCHAR(60) NULL' })

  // Indexes for reporting / lookups.
  await ensureIndex(conn, 'oz_orders', 'idx_orders_status', 'status')
  await ensureIndex(conn, 'oz_orders', 'idx_orders_email', 'customer_email')
  await ensureIndex(conn, 'oz_orders', 'idx_orders_user', 'user_id')
  await ensureIndex(conn, 'oz_orders', 'idx_orders_created', 'created_at')
  await ensureIndex(conn, 'oz_order_items', 'idx_items_order', 'order_id')
  await ensureIndex(conn, 'oz_order_items', 'idx_items_product', 'product_id')
  await ensureIndex(conn, 'oz_bookings', 'idx_bookings_status', 'status')
  await ensureIndex(conn, 'oz_bookings', 'idx_bookings_user', 'user_id')
  await ensureIndex(conn, 'oz_bookings', 'idx_bookings_created', 'created_at')
  await ensureIndex(conn, 'oz_users', 'idx_users_created', 'created_at')

  // Referential integrity (best-effort — the app also cascades in deleteOrder).
  await ensureForeignKey(conn, 'oz_order_items', 'fk_items_order',
    'FOREIGN KEY (order_id) REFERENCES oz_orders(id) ON DELETE CASCADE')

  const [rows] = await conn.query('SELECT id FROM oz_content WHERE id = 1')
  if (!rows.length) {
    await conn.query('INSERT INTO oz_content (id, data, updated_at) VALUES (1, ?, NOW())', [JSON.stringify(defaultContent())])
  }
}

// ── projection helpers (best-effort; never block the base write) ─────────────
const numOr = (v) => (Number.isFinite(Number(v)) ? Number(v) : null)

async function projectOrder(order) {
  try {
    const items = Array.isArray(order.items) ? order.items : []
    await pool.query(
      `UPDATE oz_orders SET updated_at = NOW(), status = ?, subtotal = ?, shipping = ?, total = ?, payment = ?, fulfilment = ?, user_id = ?, customer_email = ?, customer_name = ?, customer_phone = ?, item_count = ? WHERE id = ?`,
      [order.status || null, numOr(order.subtotal), numOr(order.shipping), numOr(order.total),
        order.payment || null, order.fulfilment || null, order.userId || null,
        (order.customer?.email || '').toLowerCase() || null, order.customer?.name || null,
        order.customer?.phone || null, items.reduce((s, it) => s + (Number(it.qty) || 0), 0), order.id],
    )
    await pool.query('DELETE FROM oz_order_items WHERE order_id = ?', [order.id])
    if (items.length) {
      const values = items.map((it) => [
        order.id, String(it.id ?? ''), it.brand || null, it.name || null,
        Number(it.qty) || 0, Number(it.amount) || 0, (Number(it.amount) || 0) * (Number(it.qty) || 0),
        it.customSize || null,
      ])
      await pool.query('INSERT INTO oz_order_items (order_id, product_id, brand, name, qty, unit_price, line_total, custom_size) VALUES ?', [values])
    }
  } catch (e) { console.warn('[store] order projection skipped: %s', e.message) }
}

async function projectBooking(b) {
  try {
    await pool.query(
      `UPDATE oz_bookings SET updated_at = NOW(), status = ?, service = ?, branch = ?, day = ?, slot = ?, user_id = ?, name = ?, phone = ? WHERE id = ?`,
      [b.status || null, b.service || null, b.branch || null, b.day || null, b.slot || null,
        b.userId || null, b.name || null, b.phone || null, b.id],
    )
  } catch (e) { console.warn('[store] booking projection skipped: %s', e.message) }
}

async function projectUser(u) {
  try {
    await pool.query('UPDATE oz_users SET updated_at = NOW(), name = ?, phone = ? WHERE id = ?',
      [u.name || null, u.phone || null, u.id])
  } catch (e) { console.warn('[store] user projection skipped: %s', e.message) }
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
    await pool.query('INSERT INTO oz_content (id, data, updated_at) VALUES (1, ?, NOW()) ON DUPLICATE KEY UPDATE data = VALUES(data), updated_at = NOW()', [JSON.stringify(content)])
    return content
  },

  async listOrders() {
    const [rows] = await pool.query('SELECT data FROM oz_orders ORDER BY created_at DESC')
    return rows.map((r) => JSON.parse(r.data))
  },
  async addOrder(order) {
    await pool.query('INSERT INTO oz_orders (id, created_at, data) VALUES (?, ?, ?)', [order.id, new Date(order.createdAt), JSON.stringify(order)])
    await projectOrder(order)
    return order
  },
  async updateOrder(id, patch) {
    const [rows] = await pool.query('SELECT data FROM oz_orders WHERE id = ?', [id])
    if (!rows.length) return null
    const o = { ...JSON.parse(rows[0].data), ...patch }
    await pool.query('UPDATE oz_orders SET data = ? WHERE id = ?', [JSON.stringify(o), id])
    await projectOrder(o)
    return o
  },
  async deleteOrder(id) {
    await pool.query('DELETE FROM oz_order_items WHERE order_id = ?', [id])
    await pool.query('DELETE FROM oz_orders WHERE id = ?', [id])
  },

  async listBookings() {
    const [rows] = await pool.query('SELECT data FROM oz_bookings ORDER BY created_at DESC')
    return rows.map((r) => JSON.parse(r.data))
  },
  async addBooking(b) {
    await pool.query('INSERT INTO oz_bookings (id, created_at, data) VALUES (?, ?, ?)', [b.id, new Date(b.createdAt), JSON.stringify(b)])
    await projectBooking(b)
    return b
  },
  async updateBooking(id, patch) {
    const [rows] = await pool.query('SELECT data FROM oz_bookings WHERE id = ?', [id])
    if (!rows.length) return null
    const bk = { ...JSON.parse(rows[0].data), ...patch }
    await pool.query('UPDATE oz_bookings SET data = ? WHERE id = ?', [JSON.stringify(bk), id])
    await projectBooking(bk)
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
    await projectUser(user)
    return user
  },
  async updateUser(id, patch) {
    const [rows] = await pool.query('SELECT data FROM oz_users WHERE id = ?', [id])
    if (!rows.length) return null
    const u = { ...JSON.parse(rows[0].data), ...patch }
    await pool.query('UPDATE oz_users SET data = ?, email = ? WHERE id = ?', [JSON.stringify(u), u.email, id])
    await projectUser(u)
    return u
  },
  async deleteUser(id) { await pool.query('DELETE FROM oz_users WHERE id = ?', [id]) },

  // --- Meta (admin account, OTP challenges, translation cache) ---
  async getMeta() {
    const [rows] = await pool.query('SELECT data FROM oz_meta WHERE id = 1')
    if (!rows.length) return {}
    try { return JSON.parse(rows[0].data) } catch (_) { return {} }
  },
  async setMeta(patch) {
    const cur = await this.getMeta()
    const next = { ...cur, ...patch }
    await pool.query('INSERT INTO oz_meta (id, data, updated_at) VALUES (1, ?, NOW()) ON DUPLICATE KEY UPDATE data = VALUES(data), updated_at = NOW()', [JSON.stringify(next)])
    return next
  },
}
