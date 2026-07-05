// Database / auth connection tests — reproduces & guards the Vercel failures:
//   "Invalid or expired session" + "Not authenticated" in the admin, and
//   orders missing from My Orders / the admin dashboard.
//
// Serverless = many processes. We simulate that by starting the server, doing
// work, killing it, and starting a SECOND process with the same deployment env
// (VERCEL_* identifiers): tokens issued by process A must still verify on
// process B (deterministic derived JWT secret), and orders must be linked to
// accounts by session OR checkout email.
//
//   node tests/connection.test.mjs      (no prior server needed — spawns its own)
import { spawn } from 'node:child_process'
import { rmSync } from 'node:fs'

const PORT = 5101
const BASE = `http://127.0.0.1:${PORT}`
let passed = 0, failed = 0
const ok = (m) => { passed++; console.log('   ✅ ' + m) }
const expect = (c, m) => (c ? ok(m) : (failed++, console.log('   ❌ ' + m)))

// Stable "deployment" identity shared by both simulated instances. Test-only
// admin credentials (seeded because the data dir starts empty).
const ENV = {
  ...process.env,
  NODE_ENV: 'production',
  PORT: String(PORT),
  VERCEL: '1',
  VERCEL_GIT_COMMIT_SHA: 'testsha1234567890',
  VERCEL_URL: 'optizone-conn-test.vercel.app',
  ADMIN_EMAIL: 'owner@conn-test.dev',
  ADMIN_PASSWORD: 'conn-test-admin-pass-1',
  ADMIN_OTP: 'off',
}
delete ENV.JWT_SECRET // the whole point: no env secret configured

async function startServer() {
  const proc = spawn('node', ['app.js'], { env: ENV, stdio: ['ignore', 'pipe', 'pipe'] })
  let log = ''
  proc.stdout.on('data', (d) => { log += d })
  proc.stderr.on('data', (d) => { log += d })
  for (let i = 0; i < 40; i++) {
    await new Promise((r) => setTimeout(r, 250))
    try {
      const r = await fetch(`${BASE}/api/content`)
      if (r.ok) return { proc, log: () => log }
    } catch { /* not up yet */ }
  }
  throw new Error('server did not start:\n' + log)
}
const stop = (s) => new Promise((r) => { s.proc.once('exit', r); s.proc.kill('SIGTERM'); setTimeout(() => { s.proc.kill('SIGKILL'); r() }, 3000) })

const j = async (path, { method = 'GET', body, token } = {}) => {
  const res = await fetch(BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  })
  return { status: res.status, data: await res.json().catch(() => ({})) }
}

// Fresh "deployment": wipe the serverless data dir so the test admin seeds.
rmSync('/tmp/oz-data', { recursive: true, force: true })

console.log('\n== Instance A: accounts, orders, admin all connected ==')
let A = await startServer()
expect(A.log().includes('deployment-stable secret'), 'server derives a deployment-stable JWT secret (no JWT_SECRET set)')

// customer register + login
const EMAIL = 'shopper@conn-test.dev'
let r = await j('/api/auth/register', { method: 'POST', body: { name: 'Conn Shopper', email: EMAIL, password: 'shopper-pass-1', phone: '052-1112233' } })
expect(r.status === 201 || r.status === 200, `customer registered (${r.status})`)
r = await j('/api/auth/login', { method: 'POST', body: { email: EMAIL, password: 'shopper-pass-1' } })
const userToken = r.data.token
expect(r.status === 200 && !!userToken, 'customer login returns a session token')

// order placed WHILE SIGNED IN → linked by session
r = await j('/api/orders', { method: 'POST', token: userToken, body: {
  customer: { name: 'Conn Shopper', email: EMAIL, phone: '052-1112233', address: 'Herzl 1', city: 'Netanya', postal: '42000' },
  items: [{ id: 1, name: 'CONNECTED FRAME', brand: 'Ray-Ban', amount: 600, qty: 1, customSize: '110%' }],
  subtotal: 600, shipping: 0, total: 600, payment: 'cod', fulfilment: 'delivery',
} })
const orderId1 = r.data.id
expect(r.status === 201 && !!orderId1, `signed-in order created (${orderId1})`)

// GUEST order with the same email → must auto-link to the account
r = await j('/api/orders', { method: 'POST', body: {
  customer: { name: 'Conn Shopper', email: EMAIL.toUpperCase(), phone: '052-1112233', address: 'Herzl 1', city: 'Netanya', postal: '42000' },
  items: [{ id: 2, name: 'PO3092 Havana', brand: 'Persol', amount: 720, qty: 1 }],
  subtotal: 720, shipping: 0, total: 720, payment: 'cod', fulfilment: 'pickup',
} })
const orderId2 = r.data.id
expect(r.status === 201 && !!orderId2, `guest order with same email created (${orderId2})`)

// My Orders shows BOTH
r = await j('/api/account/orders', { token: userToken })
expect(r.status === 200 && r.data.length === 2, `My Orders shows both orders (got ${Array.isArray(r.data) ? r.data.length : r.status})`)
expect(r.data.some((o) => (o.items || []).some((it) => it.customSize === '110%')), 'custom size persisted on the stored order')

// admin sees them too
r = await j('/api/admin/login', { method: 'POST', body: { email: ENV.ADMIN_EMAIL, password: ENV.ADMIN_PASSWORD } })
const adminToken = r.data.token
expect(r.status === 200 && !!adminToken, 'admin login returns a token (OTP off)')
r = await j('/api/admin/orders', { token: adminToken })
const adminOrders = Array.isArray(r.data) ? r.data : r.data.orders || []
expect(r.status === 200 && adminOrders.length === 2, `admin Orders lists both orders (got ${adminOrders.length})`)
r = await j('/api/admin/stats', { token: adminToken })
expect(r.status === 200 && r.data.orders === 2 && r.data.customers === 1, `admin stats connected (orders=${r.data.orders}, customers=${r.data.customers})`)
expect(r.data.store?.ephemeral === true, 'stats reports ephemeral serverless storage (dashboard banner will show)')
expect(r.data.security?.jwtFromEnv === false, 'stats reports JWT_SECRET missing (dashboard banner will show)')

console.log('\n== Instance B: fresh process, same deployment — sessions must survive ==')
await stop(A)
let B = await startServer()

r = await j('/api/account/me', { token: userToken })
expect(r.status === 200 && r.data.user?.email === EMAIL, 'customer token from instance A works on instance B (no more "expired session")')
r = await j('/api/admin/me', { token: adminToken })
expect(r.status === 200, 'admin token from instance A works on instance B (no more "Not authenticated")')
r = await j('/api/account/orders', { token: userToken })
expect(r.status === 200 && r.data.length === 2, `orders still visible on instance B (got ${Array.isArray(r.data) ? r.data.length : r.status})`)
r = await j('/api/admin/orders', { token: adminToken })
const bOrders = Array.isArray(r.data) ? r.data : r.data.orders || []
expect(bOrders.length === 2, `admin orders still visible on instance B (got ${bOrders.length})`)

await stop(B)
rmSync('/tmp/oz-data', { recursive: true, force: true })

console.log(`\n${failed === 0 ? `🎉 ALL ${passed} CHECKS PASSED` : `❌ ${failed} FAILED · ${passed} passed`}`)
process.exit(failed === 0 ? 0 : 1)
