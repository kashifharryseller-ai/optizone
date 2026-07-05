// Store selector — MySQL when configured & reachable, else JSON-file fallback.
const config = require('../config')

let active = null

async function initStore() {
  if (config.useMysql) {
    try {
      const mysqlStore = require('./mysql')
      await mysqlStore.init()
      active = mysqlStore
      console.log('[store] Using MySQL (%s/%s)', config.db.host, config.db.database)
      return active
    } catch (err) {
      console.error('[store] MySQL init failed — falling back to JSON file store:', err.message)
    }
  }
  const fileStore = require('./jsonfile')
  await fileStore.init()
  active = fileStore
  console.log('[store] Using JSON file store (%s)', config.paths.dataFile)
  return active
}

function store() {
  if (!active) throw new Error('Store not initialised — call initStore() first')
  return active
}

module.exports = { initStore, store }
