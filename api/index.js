// Vercel serverless entry — wraps the OPTIZONE Express app as a function.
// Vercel serves the static frontend (dist/) itself; this function handles
// /api/* and /uploads/*. Note: Vercel's filesystem is ephemeral, so on Vercel
// the JSON-file store and uploads live in /tmp and reset on cold starts — fine
// for a preview, but use MySQL (e.g. on Hostinger) for durable production data.
const { createApp } = require('../server/app')
const { initStore } = require('../server/store')

const app = createApp({ serveStatic: false })
let ready = null

module.exports = async (req, res) => {
  if (!ready) ready = initStore().catch((e) => { ready = null; throw e })
  await ready
  return app(req, res)
}
