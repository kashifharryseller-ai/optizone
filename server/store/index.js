// Store selector — MySQL when configured & reachable, else JSON-file fallback.
const config = require('../config')

let active = null

// Seed the super-admin account on first boot. After that the credentials live
// in the database (managed from Admin → Security); env/defaults never override
// an existing account, so password changes survive restarts.
async function ensureAdminAccount(store) {
  const meta = await store.getMeta()
  if (meta.adminAccount && meta.adminAccount.email && meta.adminAccount.passwordHash) return
  const { hashPassword } = require('../auth')
  const passwordHash = config.admin.seedPasswordHash
    || (config.admin.seedPassword ? hashPassword(config.admin.seedPassword) : config.admin.defaultHash)
  await store.setMeta({ adminAccount: { email: config.admin.email, passwordHash, updatedAt: new Date().toISOString() } })
  console.log('[store] Seeded super-admin account (%s)', config.admin.email)
}

async function initStore() {
  if (config.useMysql) {
    try {
      const mysqlStore = require('./mysql')
      await mysqlStore.init()
      active = mysqlStore
      console.log('[store] Using MySQL (%s/%s)', config.db.host, config.db.database)
      await ensureAdminAccount(active)
      return active
    } catch (err) {
      console.error('[store] MySQL init failed — falling back to JSON file store:', err.message)
    }
  }
  const fileStore = require('./jsonfile')
  await fileStore.init()
  active = fileStore
  console.log('[store] Using JSON file store (%s)', config.paths.dataFile)
  await ensureAdminAccount(active)
  return active
}

function store() {
  if (!active) throw new Error('Store not initialised — call initStore() first')
  return active
}

module.exports = { initStore, store }
