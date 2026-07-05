// OPTIZONE — Express application factory.
const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const config = require('./config')
const { initStore } = require('./store')
const publicRoutes = require('./routes/public')
const adminRoutes = require('./routes/admin')
const accountRoutes = require('./routes/account')

function createApp({ serveStatic = true } = {}) {
  const app = express()
  app.disable('x-powered-by')
  app.use(cors())
  app.use(express.json({ limit: '4mb' }))
  app.use(express.urlencoded({ extended: true }))

  // Uploaded media.
  fs.mkdirSync(config.paths.uploads, { recursive: true })
  app.use('/uploads', express.static(config.paths.uploads, { maxAge: '30d' }))

  // Health check.
  app.get('/api/health', (req, res) => res.json({ ok: true, store: config.useMysql ? 'mysql' : 'file' }))

  // API.
  app.use('/api', publicRoutes)
  app.use('/api', accountRoutes)
  app.use('/api/admin', adminRoutes)

  // Unknown API route → JSON 404 (never fall through to the SPA).
  app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }))

  // Static frontend + SPA fallback (storefront and /admin share one build).
  if (serveStatic) {
    if (fs.existsSync(config.paths.dist)) {
      app.use(express.static(config.paths.dist, { index: false, maxAge: '1h' }))
      app.get('*', (req, res) => res.sendFile(path.join(config.paths.dist, 'index.html')))
    } else {
      app.get('*', (req, res) => res.status(503).send('Frontend not built yet. Run `npm run build`.'))
    }
  }

  // Error handler.
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.error('[error]', err.message)
    if (err.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ error: 'Image too large' })
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
