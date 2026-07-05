// OPTIZONE — development API entry (`npm run dev:server`).
// Runs the API only (Vite serves the frontend on 5173 and proxies /api here).
process.env.PORT = process.env.PORT || '5000'
process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const { start } = require('./app')

start({ serveStatic: false, port: Number(process.env.PORT) }).catch((err) => {
  console.error('Failed to start API server:', err)
  process.exit(1)
})
