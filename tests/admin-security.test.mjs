// Admin API security & data-safety tests:
//  - every /api/admin/* data route rejects unauthenticated requests (401)
//  - production boot REQUIRES JWT_SECRET on a normal server (fail-fast)
//  - server-side validation clamps product fields & strips HTML (stored XSS)
//  - soft-deleted (archived) products are hidden from the public storefront
//    but stay in the admin catalog
//  - admin actions land in the audit log
//  - /api/health responds
//
//   node tests/admin-security.test.mjs   (spawns its own servers)
import { spawn } from 'node:child_process'
import { rmSync } from 'node:fs'

const PORT = 5103
const BASE = `http://127.0.0.1:${PORT}`
let passed = 0, failed = 0
const ok = (m) => { passed++; console.log('   ✅ ' + m) }
const expect = (c, m) => (c ? ok(m) : (failed++, console.log('   ❌ ' + m)))

const ENV = {
  ...process.env,
  NODE_ENV: 'production',
  PORT: String(PORT),
  VERCEL: '1', // serverless data dir → isolated /tmp/oz-data we can wipe
  VERCEL_GIT_COMMIT_SHA: 'sec-test-sha',
  VERCEL_URL: 'optizone-sec-test.vercel.app',
  ADMIN_EMAIL: 'owner@sec-test.dev',
  ADMIN_PASSWORD: 'sec-test-admin-pass-1',
  ADMIN_OTP: 'off',
}
delete ENV.JWT_SECRET

function spawnServer(env) {
  const proc = spawn('node', ['app.js'], { env, stdio: ['ignore', 'pipe', 'pipe'] })
  let log = ''
  proc.stdout.on('data', (d) => { log += d })
  proc.stderr.on('data', (d) => { log += d })
  return { proc, log: () => log }
}
async function waitUp(s) {
  for (let i = 0; i < 40; i++) {
    await new Promise((r) => setTimeout(r, 250))
    try { if ((await fetch(`${BASE}/api/health`)).ok) return true } catch { /* retry */ }
    if (s.proc.exitCode !== null) return false
  }
  return false
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

// ── JWT_SECRET fail-fast on a NON-serverless production boot ─────────────────
console.log('\n== JWT_SECRET is required in production (fail-fast) ==')
{
  const env = { ...ENV }
  delete env.VERCEL // normal server, production, no secret → must refuse to boot
  const s = spawnServer(env)
  const exited = await new Promise((r) => { s.proc.once('exit', (code) => r(code)); setTimeout(() => r(null), 6000) })
  expect(exited !== null && exited !== 0, `boot refused without JWT_SECRET (exit ${exited})`)
  expect(s.log().includes('JWT_SECRET is required'), 'clear error names the missing variable')
  const s2 = spawnServer({ ...env, JWT_SECRET: 'a-long-test-secret-that-is-fine' })
  expect(await waitUp(s2), 'boots normally once JWT_SECRET is provided')
  await stop(s2)
}

// ── main assertions on a serverless-style instance ───────────────────────────
rmSync('/tmp/oz-data', { recursive: true, force: true })
const S = spawnServer(ENV)
if (!(await waitUp(S))) { console.log('server failed to start:\n' + S.log()); process.exit(1) }

console.log('\n== Health check ==')
{
  const r = await j('/api/health')
  expect(r.status === 200 && r.data.ok === true && r.data.store?.driver, `GET /api/health → ok, store=${r.data.store?.driver}`)
}

console.log('\n== All admin data routes reject unauthenticated requests ==')
{
  const routes = [
    ['GET', '/api/admin/me'], ['GET', '/api/admin/stats'], ['GET', '/api/admin/users'],
    ['GET', '/api/admin/orders'], ['GET', '/api/admin/bookings'], ['GET', '/api/admin/content'],
    ['GET', '/api/admin/audit'], ['GET', '/api/admin/account'],
    ['PUT', '/api/admin/content'], ['PATCH', '/api/admin/orders/x'], ['DELETE', '/api/admin/users/x'],
    ['POST', '/api/admin/upload'],
  ]
  let all = true
  for (const [method, path] of routes) {
    const r = await j(path, { method, body: method === 'GET' ? undefined : {} })
    if (r.status !== 401) { all = false; console.log(`      !! ${method} ${path} → ${r.status} (expected 401)`) }
  }
  expect(all, `${routes.length} admin routes return 401 without a token`)
  // ...and a garbage token is also rejected
  const r = await j('/api/admin/users', { token: 'not-a-real-token' })
  expect(r.status === 401, 'invalid/expired token also rejected (401)')
}

console.log('\n== Validation, sanitization, soft delete, audit ==')
{
  const login = await j('/api/admin/login', { method: 'POST', body: { email: ENV.ADMIN_EMAIL, password: ENV.ADMIN_PASSWORD } })
  const token = login.data.token
  expect(login.status === 200 && !!token, 'admin login ok')

  const content = (await j('/api/admin/content', { token })).data
  const p0 = content.products[0]
  // hostile + out-of-range input
  p0.rating = 99
  p0.amount = -50
  p0.reviews = 3.7
  p0.desc = { en: 'Nice <script>alert(1)</script> frame', he: 'שלום <img src=x onerror=alert(1)>' }
  content.products[1].active = false // archive product #2 (soft delete)
  const put = await j('/api/admin/content', { method: 'PUT', token, body: content })
  expect(put.status === 200, 'content save accepted after server-side cleaning')
  const saved = (await j('/api/admin/content', { token })).data
  const q0 = saved.products[0]
  expect(q0.rating === 5, `rating clamped to 0–5 (99 → ${q0.rating})`)
  expect(q0.amount === 0, `price clamped to ≥ 0 (-50 → ${q0.amount})`)
  expect(q0.reviews === 4, `reviews rounded to integer ≥ 0 (3.7 → ${q0.reviews})`)
  expect(!q0.desc.en.includes('<script>') && !q0.desc.he.includes('<img'), 'HTML stripped from bilingual descriptions (stored-XSS defence)')

  // public storefront must hide the archived product; admin must keep it
  const pub = (await j('/api/content')).data
  const archivedId = saved.products[1].id
  expect(!pub.products.some((p) => p.id === archivedId), 'archived product hidden from public /api/content')
  expect(saved.products.some((p) => p.id === archivedId), 'archived product still present in admin catalog')

  // audit trail: content.save + customers.view land in the log
  await j('/api/admin/users', { token })
  await new Promise((r) => setTimeout(r, 400)) // audit writes are fire-and-forget
  const audit = (await j('/api/admin/audit', { token })).data
  expect(Array.isArray(audit) && audit.some((a) => a.action === 'content.save'), 'audit log records content saves')
  expect(audit.some((a) => a.action === 'customers.view'), 'audit log records customer-PII views')
  expect(audit.every((a) => a.ts && a.actor), 'audit entries carry timestamp + actor')
}

await stop(S)
rmSync('/tmp/oz-data', { recursive: true, force: true })

console.log(`\n${failed === 0 ? `🎉 ALL ${passed} CHECKS PASSED` : `❌ ${failed} FAILED · ${passed} passed`}`)
process.exit(failed === 0 ? 0 : 1)
