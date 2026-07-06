// OPTIZONE — security middleware: hardened headers, CORS allowlist, and
// layered rate limiting (defence against DoS / brute-force / spam).
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const config = require('./config')

// ---- Security headers (helmet) ---------------------------------------------
// CSP is tuned for the app: bundled self scripts, inline styles (React style
// attributes + the design-system <style> keyframes), data/blob images
// (favicon + uploaded photos), and same-origin XHR. Google sign-in is a
// top-level redirect from a same-origin endpoint, so it needs no CSP allowance.
function securityHeaders() {
  return helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'"],
        // Third-party allowances (each pinned to a specific need):
        //  - maps.googleapis.com: Maps JS + Places/Geocoding at checkout
        //  - cdn.jsdelivr.net / unpkg.com: MediaPipe tasks-vision (Try Mirror)
        //  - storage.googleapis.com: MediaPipe face_landmarker model file
        //  - 'wasm-unsafe-eval': MediaPipe compiles its WASM module in-browser
        //  - assets.calendly.com: Calendly booking widget script/styles/fonts
        //  - calendly.com (frameSrc): the Calendly scheduling iframe
        scriptSrc: ["'self'", "'wasm-unsafe-eval'", 'https://maps.googleapis.com', 'https://cdn.jsdelivr.net', 'https://unpkg.com', 'https://assets.calendly.com'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://assets.calendly.com'],
        imgSrc: ["'self'", 'data:', 'blob:', 'https://maps.googleapis.com', 'https://maps.gstatic.com', 'https://assets.calendly.com', 'https://*.calendly.com'],
        fontSrc: ["'self'", 'data:', 'https://assets.calendly.com'],
        connectSrc: ["'self'", 'https://maps.googleapis.com', 'https://cdn.jsdelivr.net', 'https://unpkg.com', 'https://storage.googleapis.com', 'https://calendly.com', 'https://*.calendly.com'],
        frameSrc: ["'self'", 'https://calendly.com', 'https://*.calendly.com'],
        workerSrc: ["'self'", 'blob:'],
        // blob: is required for Try Mirror's uploaded-video mode (object URLs);
        // without an explicit media-src, default-src 'self' blocks them.
        mediaSrc: ["'self'", 'blob:'],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        // Clickjacking protection: no third-party site may frame us. 'self'
        // (not 'none') so the admin's live-preview iframe keeps working.
        frameAncestors: ["'self'"],
        upgradeInsecureRequests: [],
      },
    },
    crossOriginEmbedderPolicy: false,          // don't break third-party-less assets
    crossOriginResourcePolicy: { policy: 'same-site' },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    hsts: { maxAge: 15552000, includeSubDomains: true },  // 180 days (HTTPS only)
  })
}

// ---- CORS allowlist ---------------------------------------------------------
// The SPA is served same-origin as the API, so cross-origin access is denied by
// default. Extra origins can be allowed via CORS_ORIGINS (comma-separated).
function corsMiddleware() {
  const allow = new Set(
    [config.publicUrl, ...(process.env.CORS_ORIGINS || '').split(',')]
      .map((s) => (s || '').trim().replace(/\/$/, ''))
      .filter(Boolean),
  )
  return (req, res, next) => {
    const origin = req.headers.origin
    if (origin && allow.has(origin.replace(/\/$/, ''))) {
      res.setHeader('Access-Control-Allow-Origin', origin)
      res.setHeader('Vary', 'Origin')
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      res.setHeader('Access-Control-Max-Age', '86400')
    }
    if (req.method === 'OPTIONS') return res.sendStatus(204)
    next()
  }
}

// ---- Rate limiters (per client IP) -----------------------------------------
const mk = (windowMs, limit, message) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { error: message },
    // Never rate-limit static assets or the health check.
    skip: (req) => req.method === 'OPTIONS',
  })

// Broad shield against floods across the whole API.
const globalApiLimiter = mk(60 * 1000, Number(process.env.RL_GLOBAL) || 300,
  'Too many requests — please slow down.')

// Tight limit on auth actions (brute-force / OTP / reset abuse).
const authLimiter = mk(10 * 60 * 1000, Number(process.env.RL_AUTH) || 25,
  'Too many attempts — please try again in a few minutes.')

// Limit on public writes (order/booking/register spam).
const writeLimiter = mk(10 * 60 * 1000, Number(process.env.RL_WRITE) || 40,
  'Too many submissions — please try again shortly.')

module.exports = { securityHeaders, corsMiddleware, globalApiLimiter, authLimiter, writeLimiter }
