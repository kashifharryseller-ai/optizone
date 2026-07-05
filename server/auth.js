// OPTIZONE — admin authentication (JWT, single admin from env credentials).
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

function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Not authenticated' })
  try {
    req.admin = jwt.verify(token, config.jwtSecret)
    next()
  } catch (_) {
    res.status(401).json({ error: 'Invalid or expired session' })
  }
}

module.exports = { checkCredentials, issueToken, requireAuth }
