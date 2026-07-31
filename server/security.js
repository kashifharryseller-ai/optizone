// OPTIZONE — security middleware: hardened headers, CORS allowlist, and
// layered rate limiting (defence against DoS / brute-force / spam).
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const config = require('./config')

// Compute CSP sha256 hashes for the inline <script> tags the Nuxt SPA shell
// emits (its window.__NUXT__ bootstrap). Hashing them lets us drop
// 'unsafe-inline' from script-src while still allowing our own first-party
// inline scripts — strict CSP with no XSS-injection foothold. External <script
// src> stays covered by 'self'; application/json data blocks are not executable
// and need no hash. Returns [] when the build isn't present (dev), so the caller
// can fall back safely.
function inlineScriptHashes(distPath) {
  try {
    const html = fs.readFileSync(path.join(distPath, 'index.html'), 'utf8')
    const hashes = new Set()
    const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi
    let m
    while ((m = re.exec(html))) {
      const attrs = m[1] || ''
      if (/\bsrc=/i.test(attrs)) continue
      const type = (attrs.match(/\btype=["']([^"']+)["']/i) || [])[1] || ''
      // Only executable scripts (no type, module, or js). Skip application/json etc.
      if (type && !/^(module|text\/javascript|application\/javascript)$/i.test(type)) continue
      if (!m[2]) continue
      hashes.add(`'sha256-${crypto.createHash('sha256').update(m[2], 'utf8').digest('base64')}'`)
    }
    return [...hashes]
  } catch { return [] }
}

// ---- Security headers (helmet) ---------------------------------------------
// CSP is tuned for the app: bundled self scripts, inline styles (React style
// attributes + the design-system <style> keyframes), data/blob images
// (favicon + uploaded photos), and same-origin XHR. Google sign-in is a
// top-level redirect from a same-origin endpoint, so it needs no CSP allowance.
function securityHeaders({ scriptHashes = [] } = {}) {
  // Prefer strict per-build hashes for our inline bootstrap. Only if the build
  // shell can't be read (e.g. local dev before a generate) do we fall back to
  // 'unsafe-inline' so the app still boots — production always ships hashes.
  const inlineScript = scriptHashes.length ? scriptHashes : ["'unsafe-inline'"]
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
        //  - inlineScript: sha256 hashes of the Nuxt SPA's own inline bootstrap
        //    (strict — no 'unsafe-inline' in production).
        scriptSrc: ["'self'", ...inlineScript, "'wasm-unsafe-eval'", 'https://maps.googleapis.com', 'https://cdn.jsdelivr.net', 'https://unpkg.com', 'https://assets.calendly.com'],
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

module.exports = { securityHeaders, inlineScriptHashes, corsMiddleware, globalApiLimiter, authLimiter, writeLimiter }
