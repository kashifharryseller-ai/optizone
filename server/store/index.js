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

// Recursively fill in keys that exist in `defaults` but are missing from
// `target`. Never overwrites values the admin has set; arrays are treated as
// leaves (not merged). Returns true if anything was added.
function fillMissing(target, defaults) {
  let changed = false
  for (const k of Object.keys(defaults)) {
    if (target[k] === undefined) { target[k] = defaults[k]; changed = true }
    else if (
      defaults[k] && typeof defaults[k] === 'object' && !Array.isArray(defaults[k]) &&
      target[k] && typeof target[k] === 'object' && !Array.isArray(target[k])
    ) {
      if (fillMissing(target[k], defaults[k])) changed = true
    }
  }
  return changed
}

// Migrate an existing store to the current content shape so every admin panel
// connects to real data (e.g. category pages, product categories added later).
// Additive only — existing content/customizations are preserved.
async function migrateContent(store) {
  const { defaultContent, productDetails } = require('../seed-data')
  const content = await store.getContent()
  let changed = fillMissing(content, defaultContent())
  const details = productDetails()
  for (const p of content.products || []) {
    if (!p.category) { p.category = 'eyeglasses'; changed = true }
    if (p.image === undefined) { p.image = ''; changed = true }
    // Backfill per-product PDP content (description + specs) from the seed
    // catalog so every product has unique copy; admin edits are never touched.
    const d = details[p.id]
    if (d) {
      if (!p.desc) { p.desc = d.desc; changed = true }
      if (!p.specs) { p.specs = d.specs; changed = true }
    }
    if (p.images === undefined) { p.images = []; changed = true }
    if (p.tryMirrorImg === undefined) { p.tryMirrorImg = ''; changed = true }
  }
  if (changed) {
    content.updatedAt = new Date().toISOString()
    await store.setContent(content)
    console.log('[store] Content migrated to current shape.')
  }
}

async function initStore() {
  if (config.useMysql) {
    try {
      const mysqlStore = require('./mysql')
      await mysqlStore.init()
      active = mysqlStore
      console.log('[store] Using MySQL (%s/%s)', config.db.host, config.db.database)
      await ensureAdminAccount(active)
      await migrateContent(active)
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
  await migrateContent(active)
  return active
}

function store() {
  if (!active) throw new Error('Store not initialised — call initStore() first')
  return active
}

module.exports = { initStore, store }
