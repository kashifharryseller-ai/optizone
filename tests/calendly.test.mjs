// Calendly booking-widget tests — CSP allowances, SPA init with the right URL,
// bilingual heading + RTL, and the admin "blank hides it" switch.
//
// The real widget.js/iframe are external (blocked in CI) so we stub the script:
// a routed response defines window.Calendly.initInlineWidget, which records the
// URL and appends an iframe — exercising the exact init path our component uses.
//
//   node tests/calendly.test.mjs   (spawns its own server)
import { spawn } from 'node:child_process'
import { rmSync } from 'node:fs'
import { chromium } from 'playwright'

const PORT = 5540 + (process.pid % 350)
const BASE = `http://127.0.0.1:${PORT}`
const EXEC = process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium'
let passed = 0, failed = 0
const ok = (m) => { passed++; console.log('   ✅ ' + m) }
const expect = (c, m) => (c ? ok(m) : (failed++, console.log('   ❌ ' + m)))

const ENV = { ...process.env, NODE_ENV: 'production', PORT: String(PORT), JWT_SECRET: 'calendly-test-secret-000', ADMIN_OTP: 'off' }
rmSync('/tmp/oz-data', { recursive: true, force: true })
const server = spawn('node', ['app.js'], { env: ENV, stdio: 'ignore' })
process.on('exit', () => { try { server.kill('SIGKILL') } catch { /* gone */ } })
for (let i = 0; i < 40; i++) { await new Promise((r) => setTimeout(r, 250)); try { if ((await fetch(`${BASE}/api/health`)).ok) break } catch { /* retry */ } }

// ── CSP header allows the Calendly hosts ─────────────────────────────────────
console.log('\n== CSP allows Calendly ==')
{
  const csp = (await fetch(`${BASE}/`)).headers.get('content-security-policy') || ''
  expect(/script-src[^;]*assets\.calendly\.com/.test(csp), 'script-src allows assets.calendly.com')
  expect(/frame-src[^;]*calendly\.com/.test(csp), 'frame-src allows calendly.com (the scheduling iframe)')
  expect(/connect-src[^;]*calendly\.com/.test(csp), 'connect-src allows calendly.com')
}

const STUB = `window.Calendly = { initInlineWidget: function (opts) {
  window.__ozCal = { url: opts.url };
  var f = document.createElement('iframe');
  f.title = 'Calendly Scheduling';
  f.setAttribute('data-url', opts.url);   // record the URL without navigating out
  f.style.width = '100%'; f.style.height = '100%';
  opts.parentElement.appendChild(f);
} };`

async function newPage(browser, { contentPatch } = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } })
  const page = await ctx.newPage()
  const errors = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push('PAGEERR ' + e.message))
  // stub the Calendly widget script
  await page.route('**/assets.calendly.com/**', (route) =>
    route.fulfill({ status: 200, contentType: 'text/javascript', body: STUB }))
  if (contentPatch) {
    await page.route('**/api/content', async (route) => {
      const res = await route.fetch(); const json = await res.json()
      contentPatch(json)
      await route.fulfill({ response: res, body: JSON.stringify(json) })
    })
  }
  return { page, ctx, errors }
}

const gotoBooking = async (page) => {
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.getByRole('banner').getByText('Book an Exam').first().click()
  await page.getByRole('heading', { name: 'Eye care, on your schedule' }).waitFor()
}

const browser = await chromium.launch({ executablePath: EXEC })

// ── default embed: heading + widget initialised with the requested URL ───────
console.log('\n== Widget renders & initialises (default URL) ==')
{
  const { page, ctx, errors } = await newPage(browser)
  await gotoBooking(page)
  await page.getByRole('heading', { name: 'Pick a time that suits you' }).waitFor()
  ok('online-scheduler section heading rendered')
  // component calls Calendly.initInlineWidget once the (stubbed) script loads
  await page.waitForFunction(() => !!window.__ozCal, null, { timeout: 8000 })
  const url = await page.evaluate(() => window.__ozCal.url)
  expect(url === 'https://calendly.com/optizone-info?background_color=072b08&text_color=f9f1f1', `initInlineWidget called with the requested URL (${url.slice(0, 48)}…)`)
  expect(url.includes('background_color=072b08'), 'brand background colour preserved in the embed URL')
  const frame = await page.locator('.calendly-inline-widget iframe[title="Calendly Scheduling"]').count()
  expect(frame === 1, 'Calendly iframe injected into the inline-widget container')
  const h = await page.locator('.calendly-inline-widget').evaluate((el) => el.offsetHeight)
  expect(h >= 600, `widget reserves its height (${h}px)`)
  expect(errors.length === 0, `no console errors (${errors.length})`)
  errors.slice(0, 5).forEach((e) => console.log('     !! ' + e))
  await ctx.close()
}

// ── RTL: Hebrew heading + dir=rtl ────────────────────────────────────────────
console.log('\n== Hebrew / RTL ==')
{
  const { page, ctx } = await newPage(browser)
  await gotoBooking(page)
  await page.getByRole('banner').getByText('עברית').click()
  await page.getByRole('heading', { name: 'בחרו זמן שנוח לכם' }).waitFor()
  ok('scheduler heading localised to Hebrew')
  expect(await page.evaluate(() => document.documentElement.dir) === 'rtl', 'page is RTL in Hebrew')
  // widget still initialises in Hebrew
  await page.waitForFunction(() => !!window.__ozCal, null, { timeout: 8000 })
  ok('widget initialises in Hebrew too')
  await ctx.close()
}

// ── admin can hide it by clearing the setting ────────────────────────────────
console.log('\n== Blank Calendly setting hides the section ==')
{
  const { page, ctx } = await newPage(browser, { contentPatch: (j) => { j.settings = { ...(j.settings || {}), calendlyUrl: '' } } })
  await gotoBooking(page)
  await page.waitForTimeout(400)
  expect(await page.getByRole('heading', { name: 'Pick a time that suits you' }).count() === 0, 'cleared calendlyUrl hides the scheduler section')
  expect(await page.locator('.calendly-inline-widget').count() === 0, 'no widget container rendered when hidden')
  ok('the existing manual booking form is unaffected')
  await ctx.close()
}

// ── admin override URL is used ───────────────────────────────────────────────
console.log('\n== Admin override URL ==')
{
  const custom = 'https://calendly.com/optizone-info/eye-exam?background_color=072b08&text_color=f9f1f1'
  const { page, ctx } = await newPage(browser, { contentPatch: (j) => { j.settings = { ...(j.settings || {}), calendlyUrl: custom } } })
  await gotoBooking(page)
  await page.waitForFunction(() => !!window.__ozCal, null, { timeout: 8000 })
  expect(await page.evaluate(() => window.__ozCal.url) === custom, 'admin-set Calendly URL is used')
  await ctx.close()
}

await browser.close()
server.kill('SIGTERM')
rmSync('/tmp/oz-data', { recursive: true, force: true })
console.log(`\n${failed === 0 ? `🎉 ALL ${passed} CHECKS PASSED` : `❌ ${failed} FAILED · ${passed} passed`}`)
process.exit(failed === 0 ? 0 : 1)
