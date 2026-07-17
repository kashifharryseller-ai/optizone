// Calendly badge-widget tests — CSP allowances, badge init with the requested
// config, in-page CTA opening the popup, bilingual heading/RTL, admin override,
// and the "blank hides it" switch.
//
// The real widget.js/iframe are external (blocked in CI) so we stub the script:
// a routed response defines window.Calendly.initBadgeWidget / showPopupWidget /
// destroyBadgeWidget, exercising the exact paths our component uses.
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

const ENV = { ...process.env, NODE_ENV: 'production', PORT: String(PORT), JWT_SECRET: 'calendly-test-secret-000', ADMIN_EMAIL: 'owner@calendly-test.dev', ADMIN_PASSWORD: 'calendly-admin-pass-1', ADMIN_OTP: 'off' }
rmSync('/tmp/oz-data', { recursive: true, force: true })
const server = spawn('node', ['app.js'], { env: ENV, stdio: 'ignore' })
process.on('exit', () => { try { server.kill('SIGKILL') } catch { /* gone */ } })
for (let i = 0; i < 40; i++) { await new Promise((r) => setTimeout(r, 250)); try { if ((await fetch(`${BASE}/api/health`)).ok) break } catch { /* retry */ } }

// ── CSP header allows the Calendly hosts ─────────────────────────────────────
console.log('\n== CSP allows Calendly ==')
{
  const csp = (await fetch(`${BASE}/`)).headers.get('content-security-policy') || ''
  expect(/script-src[^;]*assets\.calendly\.com/.test(csp), 'script-src allows assets.calendly.com')
  expect(/style-src[^;]*assets\.calendly\.com/.test(csp), 'style-src allows the Calendly widget.css')
  expect(/frame-src[^;]*calendly\.com/.test(csp), 'frame-src allows calendly.com (the popup iframe)')
}

// Stub widget.js: records initBadgeWidget / showPopupWidget calls.
const STUB = `window.Calendly = {
  initBadgeWidget: function (opts) {
    window.__ozBadge = opts;
    var d = document.createElement('div');
    d.className = 'calendly-badge-widget';
    d.style.cssText = 'position:fixed;bottom:15px;right:15px;padding:10px 14px;border-radius:20px;background:' + opts.color + ';color:' + opts.textColor;
    d.textContent = opts.text;
    document.body.appendChild(d);
  },
  destroyBadgeWidget: function () { document.querySelectorAll('.calendly-badge-widget').forEach(function (e) { e.remove() }); },
  showPopupWidget: function (url) { window.__ozPopup = url; },
};`

async function newPage(browser, { contentPatch } = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } })
  const page = await ctx.newPage()
  const errors = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push('PAGEERR ' + e.message))
  // stub the Calendly assets: JS for widget.js, real CSS for widget.css
  await page.route('**/assets.calendly.com/**', (route) => {
    const u = route.request().url()
    if (u.endsWith('.css')) return route.fulfill({ status: 200, contentType: 'text/css', body: '/* calendly stub */' })
    return route.fulfill({ status: 200, contentType: 'text/javascript', body: STUB })
  })
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

// ── badge initialises with the requested config; manual form is gone ─────────
console.log('\n== Badge widget initialises (requested config) ==')
{
  const { page, ctx, errors } = await newPage(browser)
  await gotoBooking(page)
  expect(await page.getByRole('button', { name: 'Confirm booking' }).count() === 0, 'old manual booking form removed')
  expect(await page.locator('.calendly-inline-widget').count() === 0, 'inline embed replaced (no inline widget)')
  await page.waitForFunction(() => !!window.__ozBadge, null, { timeout: 8000 })
  const b = await page.evaluate(() => window.__ozBadge)
  expect(b.url === 'https://calendly.com/optizone', `badge URL is the requested default (${b.url})`)
  expect(b.color === '#0069ff' && b.textColor === '#ffffff' && b.branding === true, `badge colour/textColor/branding match the snippet (${b.color} / ${b.textColor} / ${b.branding})`)
  expect(b.text === 'Schedule time with me', `badge text is "Schedule time with me" (got "${b.text}")`)
  expect(await page.locator('.calendly-badge-widget').isVisible(), 'floating badge is rendered on the page')
  expect(errors.length === 0, `no console errors (${errors.length})`)
  errors.slice(0, 5).forEach((e) => console.log('     !! ' + e))
  await ctx.close()
}

// ── in-page CTA opens the Calendly popup ─────────────────────────────────────
console.log('\n== In-page CTA opens the popup ==')
{
  const { page, ctx } = await newPage(browser)
  await gotoBooking(page)
  await page.getByRole('button', { name: 'Schedule time with me' }).click()
  await page.waitForFunction(() => !!window.__ozPopup, null, { timeout: 6000 })
  expect(await page.evaluate(() => window.__ozPopup) === 'https://calendly.com/optizone', 'CTA button calls Calendly.showPopupWidget with the URL')
  await ctx.close()
}

// ── badge is removed when leaving the booking page ───────────────────────────
console.log('\n== Badge torn down on navigation ==')
{
  const { page, ctx } = await newPage(browser)
  await gotoBooking(page)
  await page.waitForFunction(() => !!document.querySelector('.calendly-badge-widget'), null, { timeout: 8000 })
  await page.getByRole('banner').getByText('Eyeglasses').first().click()
  await page.waitForTimeout(300)
  expect(await page.locator('.calendly-badge-widget').count() === 0, 'badge is destroyed after navigating away (no leak across routes)')
  await ctx.close()
}

// ── Hebrew / RTL: heading + localised badge text ─────────────────────────────
console.log('\n== Hebrew / RTL ==')
{
  const { page, ctx } = await newPage(browser)
  await gotoBooking(page)
  // 3-way language switcher: open the header dropdown, choose Hebrew.
  await page.getByRole('banner').getByRole('button', { name: /Language/ }).click()
  await page.getByRole('option', { name: 'עברית' }).click()
  await page.getByRole('heading', { name: 'טיפול בעיניים, בזמן שנוח לכם' }).waitFor()
  ok('booking page heading localised to Hebrew')
  expect(await page.evaluate(() => document.documentElement.dir) === 'rtl', 'page is RTL in Hebrew')
  await page.waitForFunction(() => window.__ozBadge && window.__ozBadge.text === 'קביעת תור עכשיו', null, { timeout: 6000 })
  ok('floating badge text follows the language (Hebrew)')
  await ctx.close()
}

// ── admin blank hides it ─────────────────────────────────────────────────────
console.log('\n== Blank setting hides online booking ==')
{
  const { page, ctx } = await newPage(browser, { contentPatch: (j) => { j.settings = { ...(j.settings || {}), calendlyUrl: '' } } })
  await gotoBooking(page)
  await page.waitForTimeout(500)
  expect(await page.evaluate(() => !window.__ozBadge), 'no badge initialised when the setting is cleared')
  expect(await page.getByText('Online booking is temporarily unavailable', { exact: false }).isVisible(), 'graceful fallback message with a phone link is shown')
  await ctx.close()
}

// ── admin override URL ───────────────────────────────────────────────────────
console.log('\n== Admin override URL ==')
{
  const custom = 'https://calendly.com/optizone/eye-exam'
  const { page, ctx } = await newPage(browser, { contentPatch: (j) => { j.settings = { ...(j.settings || {}), calendlyUrl: custom } } })
  await gotoBooking(page)
  await page.waitForFunction(() => !!window.__ozBadge, null, { timeout: 8000 })
  expect(await page.evaluate(() => window.__ozBadge.url) === custom, 'admin-set Calendly URL is used by the badge')
  await ctx.close()
}

await browser.close()
server.kill('SIGTERM')
rmSync('/tmp/oz-data', { recursive: true, force: true })
console.log(`\n${failed === 0 ? `🎉 ALL ${passed} CHECKS PASSED` : `❌ ${failed} FAILED · ${passed} passed`}`)
process.exit(failed === 0 ? 0 : 1)
