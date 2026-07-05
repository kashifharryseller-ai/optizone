// Reset the store's content to the built-in defaults. Usage: `npm run seed`
// (orders and bookings are left untouched).
const { initStore, store } = require('./store')
const { defaultContent } = require('./seed-data')

;(async () => {
  await initStore()
  await store().setContent(defaultContent())
  console.log('[seed] Content reset to defaults.')
  process.exit(0)
})().catch((err) => { console.error(err); process.exit(1) })
