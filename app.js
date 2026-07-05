// OPTIZONE — production entry point.
// This is the file to set as the "Application startup file" on Hostinger
// (CloudLinux Node.js Selector / Passenger). It serves the built frontend
// (dist/) and the API on process.env.PORT.
const { start } = require('./server/app')

start({ serveStatic: true }).catch((err) => {
  console.error('Failed to start OPTIZONE server:', err)
  process.exit(1)
})
