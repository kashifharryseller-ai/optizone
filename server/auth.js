// OPTIZONE — authentication.
// Two principals share one JWT secret but distinct roles:
//   - 'admin'    : the single store admin (credentials from env)
//   - 'customer' : registered shoppers (rows in the users store)
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const config = require('./config')

function safeEqual(a, b) {
  const ab = Buffer.from(String(a))
  const bb = Buffer.from(String(b))
  if (ab.length !== bb.length) return false
  return crypto.timingSafeEqual(ab, bb)
}

// --- Admin -------------------------------------------------------------------
// Verify submitted credentials against env config. Supports either a plaintext
// ADMIN_PASSWORD or a bcrypt ADMIN_PASSWORD_HASH.
function checkCredentials(username, password) {
  if (!safeEqual(username || '', config.admin.username)) return false
  const hash = process.env.ADMIN_PASSWORD_HASH
  if (hash) {
    try { return bcrypt.compareSync(String(password || ''), hash) } catch (_) { return false }
  }
  return safeEqual(password || '', config.admin.password)
}

function issueToken(username) {
  return jwt.sign({ sub: username, role: 'admin' }, config.jwtSecret, { expiresIn: config.tokenTtl })
}

function readToken(req) {
  const header = req.headers.authorization || ''
  return header.startsWith('Bearer ') ? header.slice(7) : null
}

function requireAuth(req, res, next) {
  const token = readToken(req)
  if (!token) return res.status(401).json({ error: 'Not authenticated' })
  try {
    const payload = jwt.verify(token, config.jwtSecret)
    if (payload.role !== 'admin') return res.status(403).json({ error: 'Admin access required' })
    req.admin = payload
    next()
  } catch (_) {
    res.status(401).json({ error: 'Invalid or expired session' })
  }
}

// --- Customers ----------------------------------------------------------------
const USER_TOKEN_TTL = process.env.USER_TOKEN_TTL || '30d'

function issueUserToken(user) {
  return jwt.sign({ sub: user.id, role: 'customer' }, config.jwtSecret, { expiresIn: USER_TOKEN_TTL })
}

function requireUser(req, res, next) {
  const token = readToken(req)
  if (!token) return res.status(401).json({ error: 'Not signed in' })
  try {
    const payload = jwt.verify(token, config.jwtSecret)
    if (payload.role !== 'customer') return res.status(403).json({ error: 'Customer account required' })
    req.userId = payload.sub
    next()
  } catch (_) {
    res.status(401).json({ error: 'Session expired — please sign in again' })
  }
}

// Attach req.userId when a valid customer token is present; never block.
function optionalUser(req, res, next) {
  const token = readToken(req)
  if (token) {
    try {
      const payload = jwt.verify(token, config.jwtSecret)
      if (payload.role === 'customer') req.userId = payload.sub
    } catch (_) { /* anonymous */ }
  }
  next()
}

// Password hashing for customer accounts.
const hashPassword = (pw) => bcrypt.hashSync(String(pw), 10)
const verifyPassword = (pw, hash) => { try { return bcrypt.compareSync(String(pw), String(hash)) } catch (_) { return false } }

module.exports = { checkCredentials, issueToken, requireAuth, issueUserToken, requireUser, optionalUser, hashPassword, verifyPassword }
