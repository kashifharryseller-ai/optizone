// OPTIZONE — persistent per-key attempt limiter (brute-force protection).
// Backed by the store (meta.rate), so lockouts survive restarts AND apply
// across serverless instances — unlike the coarse in-memory express-rate-limit
// flood shield. Used for per-account login lockout.
const { store } = require('./store')

async function readRate() {
  const meta = await store().getMeta()
  return meta.rate && typeof meta.rate === 'object' ? meta.rate : {}
}

// Prune expired buckets; returns the pruned map + whether anything changed.
function prune(rate, now) {
  let changed = false
  for (const k of Object.keys(rate)) {
    if (!rate[k] || rate[k].resetAt <= now) { delete rate[k]; changed = true }
  }
  return changed
}

// True (with retryAfter seconds) if this key is currently locked out.
async function isLimited(key, max) {
  const now = Date.now()
  const rate = await readRate()
  if (prune(rate, now)) await store().setMeta({ rate })
  const b = rate[key]
  if (b && b.count >= max) return { limited: true, retryAfter: Math.max(1, Math.ceil((b.resetAt - now) / 1000)) }
  return { limited: false }
}

// Record a failed attempt within the rolling window.
async function recordFailure(key, windowMs) {
  const now = Date.now()
  const rate = await readRate()
  prune(rate, now)
  const cur = rate[key] && rate[key].resetAt > now ? rate[key] : { count: 0, resetAt: now + windowMs }
  cur.count += 1
  rate[key] = cur
  await store().setMeta({ rate })
}

// Clear a key after a successful auth.
async function clearKey(key) {
  const rate = await readRate()
  if (rate[key]) { delete rate[key]; await store().setMeta({ rate }) }
}

module.exports = { isLimited, recordFailure, clearKey }
