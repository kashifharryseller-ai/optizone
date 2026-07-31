// OPTIZONE — Express application factory.
const express = require('express')
const fs = require('fs')
const path = require('path')
const config = require('./config')
const { initStore } = require('./store')
const { securityHeaders, corsMiddleware, globalApiLimiter, authLimiter, writeLimiter } = require('./security')
const publicRoutes = require('./routes/public')
const adminRoutes = require('./routes/admin')
const accountRoutes = require('./routes/account')
const googleRoutes = require('./routes/google')

// JWT_SECRET policy:
//  - When JWT_SECRET is set (recommended), it is always used.
//  - When it is not set, initStore() generates a strong random secret and
//    PERSISTS it in the store, so sessions stay stable across restarts and
//    across serverless instances that share the same database (see
//    store/index.js → ensureJwtSecret). We warn in production so operators know
//    to set an explicit secret, but no longer crash — the persisted secret is
//    stable and secure.
if (config.nodeEnv === 'production' && !config.jwtSecretFromEnv) {
  console.warn('[security] JWT_SECRET is not set — using a persisted auto-generated secret. Set a long random JWT_SECRET (e.g. `openssl rand -hex 32`) in your host env for full control. See .env.example.')
}

function createApp({ serveStatic = true } = {}) {
  const app = express()
  app.disable('x-powered-by')
  // Behind Vercel/Passenger there is exactly one proxy — trust it so rate
  // limiting and OAuth redirect detection see the real client IP / protocol.
  app.set('trust proxy', 1)

  app.use(securityHeaders())
  app.use(corsMiddleware())
  app.use(express.json({ limit: '1mb' }))
  app.use(express.urlencoded({ extended: true, limit: '1mb' }))

  // Uploaded media — long cache, and forced download semantics so a crafted
  // upload can never be rendered as an active document in the browser.
  fs.mkdirSync(config.paths.uploads, { recursive: true })
  app.use('/uploads', express.static(config.paths.uploads, {
    maxAge: '30d',
    dotfiles: 'deny',
    setHeaders: (res) => {
      res.setHeader('X-Content-Type-Options', 'nosniff')
      res.setHeader('Content-Disposition', 'inline')
      res.setHeader('Content-Security-Policy', "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; sandbox")
    },
  }))

  // Health check.
  // Health check — for uptime monitors and deploy verification (reports the
  // ACTIVE store driver, incl. MySQL→file fallback, and ephemerality).
  app.get('/api/health', (req, res) => {
    const { storeInfo } = require('./store')
    res.json({ ok: true, uptime: Math.round(process.uptime()), store: storeInfo(), ts: new Date().toISOString() })
  })

  // Rate limiting: broad shield on the whole API, tighter on auth + public writes.
  app.use('/api', globalApiLimiter)
  app.use(['/api/auth/login', '/api/auth/register', '/api/auth/forgot', '/api/auth/reset', '/api/admin/login', '/api/admin/otp', '/api/admin/forgot', '/api/admin/reset'], authLimiter)
  app.use(['/api/orders', '/api/bookings'], writeLimiter)

  // API.
  app.use('/api', publicRoutes)
  app.use('/api', accountRoutes)
  app.use('/api', googleRoutes)
  app.use('/api/admin', adminRoutes)

  // Unknown API route → JSON 404 (never fall through to the SPA).
  app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }))

  // Static frontend + SPA fallback (storefront and /admin share one build).
  // Prefer the Nuxt build (web/.output/public); fall back to the legacy React
  // dist until the Nuxt build exists. Media assets (products, hero videos,
  // brand imagery) are served from the repo `public/` dir alongside either
  // build, so a request for /products/*.webp or /site/*.mp4 always resolves.
  if (serveStatic) {
    const frontend = fs.existsSync(config.paths.webDist) ? config.paths.webDist : config.paths.dist
    if (fs.existsSync(frontend)) {
      // Long-cached media assets. index:false + redirect:false so a bare
      // directory that collides with a page route (e.g. /brands) falls through
      // to the SPA fallback instead of 301-redirecting to a trailing slash.
      if (fs.existsSync(config.paths.assets)) {
        app.use(express.static(config.paths.assets, { index: false, redirect: false, maxAge: '7d' }))
      }
      app.use(express.static(frontend, { index: false, redirect: false, maxAge: '1h' }))
      app.get('*', (req, res) => res.sendFile(path.join(frontend, 'index.html')))
    } else {
      app.get('*', (req, res) => res.status(503).send('Frontend not built yet. Run `npm run build`.'))
    }
  }

  // Error handler — never leaks stack traces; maps known client errors to 4xx.
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    if (err.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ error: 'Image too large' })
    if (err.type === 'entity.too.large' || err.status === 413) return res.status(413).json({ error: 'Request too large' })
    if (err.type === 'entity.parse.failed' || err.status === 400) return res.status(400).json({ error: 'Malformed request' })
    console.error('[error]', err.message)
    res.status(500).json({ error: 'Server error' })
  })

  return app
}

async function start({ serveStatic = true, port = config.port } = {}) {
  await initStore()
  const app = createApp({ serveStatic })
  return new Promise((resolve) => {
    const server = app.listen(port, () => {
      console.log(`[optizone] listening on http://localhost:${port}  (${config.nodeEnv})`)
      resolve(server)
    })
  })
}

module.exports = { createApp, start }
