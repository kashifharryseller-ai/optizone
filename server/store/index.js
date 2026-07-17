// Store selector — MySQL when configured & reachable, else JSON-file fallback.
const crypto = require('crypto')
const config = require('../config')

let active = null

// Seed the super-admin account on first boot. After that the credentials live
// in the database (managed from Admin → Security); env/defaults never override
// an existing account, so password changes survive restarts.
async function ensureAdminAccount(store) {
  const meta = await store.getMeta()
  if (meta.adminAccount && meta.adminAccount.email && meta.adminAccount.passwordHash) return
  const { hashPassword } = require('../auth')
  let passwordHash
  if (config.admin.seedPasswordHash) {
    passwordHash = config.admin.seedPasswordHash
  } else if (config.admin.seedPassword) {
    passwordHash = hashPassword(config.admin.seedPassword)
  } else {
    // No password configured — generate a strong random one. We NEVER crash the
    // app over this (on serverless a throw here takes the whole site down), and
    // we never print the plaintext to production logs (logs are often retained/
    // aggregated — a printed credential is a real leak).
    const tempPassword = crypto.randomBytes(12).toString('base64').replace(/[^A-Za-z0-9]/g, '').slice(0, 14)
    passwordHash = hashPassword(tempPassword)
    if (config.nodeEnv === 'production') {
      // Production: don't reveal the credential. Admin sign-in needs an explicit
      // ADMIN_PASSWORD (or a "Forgot password" email reset); the storefront/API
      // stay fully up regardless.
      console.warn('[store] No ADMIN_PASSWORD / ADMIN_PASSWORD_HASH set. Generated a random admin password (not logged). Set ADMIN_PASSWORD to enable admin sign-in, or use “Forgot password”. See .env.example.')
    } else {
      // Development: print it ONCE for local convenience.
      console.log('\n' + '='.repeat(72))
      console.log('[store] No ADMIN_PASSWORD / ADMIN_PASSWORD_HASH set (dev).')
      console.log('[store] Generated a one-time admin password for %s:', config.admin.email)
      console.log('[store]     %s', tempPassword)
      console.log('[store] Sign in at /admin and change it in Admin → Security.')
      console.log('='.repeat(72) + '\n')
    }
  }
  await store.setMeta({ adminAccount: { email: config.admin.email, passwordHash, updatedAt: new Date().toISOString() } })
  console.log('[store] Seeded super-admin account (%s)', config.admin.email)
}

// Load (or create + persist) the JWT signing secret when JWT_SECRET is not set
// in the environment. Persisting it in the store keeps sessions stable across
// restarts and across serverless instances that share the same database —
// without deriving the secret from public deployment identifiers.
async function ensureJwtSecret(store) {
  if (config.jwtSecretFromEnv) return
  const meta = await store.getMeta()
  if (meta.jwtSecret && typeof meta.jwtSecret === 'string' && meta.jwtSecret.length >= 32) {
    config.jwtSecret = meta.jwtSecret
    return
  }
  const secret = crypto.randomBytes(32).toString('hex')
  await store.setMeta({ jwtSecret: secret })
  config.jwtSecret = secret
  console.warn('[security] JWT_SECRET not set — generated and persisted a random secret. Set JWT_SECRET in your host env for full control over session lifetime.')
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

// Backfill Hebrew + Arabic translations for existing content, in the BACKGROUND
// so it never blocks boot or the first request (important on serverless). Only
// fills missing languages (keeps any hand-written Hebrew); results are cached so
// this is a no-op once everything is translated. Required lazily to avoid a
// circular require with ../translate (which requires this module).
function backfillTranslations(store) {
  ;(async () => {
    try {
      const { translateContent } = require('../translate')
      const content = await store.getContent()
      const n = await translateContent(content, { fillMissingOnly: true })
      if (n > 0) {
        content.updatedAt = new Date().toISOString()
        await store.setContent(content)
        console.log('[store] Auto-translated %d content string(s) → he/ar.', n)
      }
    } catch (e) { console.warn('[translate] backfill skipped:', e.message) }
  })()
}

let driverName = 'file'

async function initStore() {
  if (config.useMysql) {
    try {
      const mysqlStore = require('./mysql')
      await mysqlStore.init()
      active = mysqlStore
      driverName = 'mysql'
      console.log('[store] Using MySQL (%s/%s)', config.db.host, config.db.database)
      await ensureJwtSecret(active)
      await ensureAdminAccount(active)
      await migrateContent(active)
      backfillTranslations(active)
      return active
    } catch (err) {
      console.error('[store] MySQL init failed — falling back to JSON file store:', err.message)
    }
  }
  const fileStore = require('./jsonfile')
  await fileStore.init()
  active = fileStore
  driverName = 'file'
  console.log('[store] Using JSON file store (%s)', config.paths.dataFile)
  await ensureJwtSecret(active)
  await ensureAdminAccount(active)
  await migrateContent(active)
  backfillTranslations(active)
  return active
}

function store() {
  if (!active) throw new Error('Store not initialised — call initStore() first')
  return active
}

// What the app is running on — surfaced in Admin -> Dashboard so the owner can
// see when data lives in ephemeral serverless storage (i.e. connect MySQL).
function storeInfo() {
  const onServerless = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME)
  return { driver: driverName, ephemeral: driverName === 'file' && onServerless }
}

module.exports = { initStore, store, storeInfo }
