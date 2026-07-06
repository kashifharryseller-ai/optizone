// Admin Sidebar component tests — collapse+persist, sub-menu accordion, order
// badge, collapsed tooltips, active indicator, profile dropdown, language/RTL
// toggle (flips the layout), keyboard navigation, and the mobile off-canvas
// drawer with dimmed overlay.
//
//   node tests/sidebar.test.mjs   (spawns its own server)
import { spawn } from 'node:child_process'
import { rmSync } from 'node:fs'
import { chromium } from 'playwright'

const PORT = 5560 + (process.pid % 300)
const BASE = `http://127.0.0.1:${PORT}`
const EXEC = process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium'
let passed = 0, failed = 0
const ok = (m) => { passed++; console.log('   ✅ ' + m) }
const expect = (c, m) => (c ? ok(m) : (failed++, console.log('   ❌ ' + m)))

const ENV = { ...process.env, NODE_ENV: 'production', PORT: String(PORT), VERCEL: '1', VERCEL_GIT_COMMIT_SHA: 'sb-test', VERCEL_URL: 'oz-sb-test.vercel.app', JWT_SECRET: 'sidebar-test-secret', ADMIN_EMAIL: 'owner@sb.dev', ADMIN_PASSWORD: 'sidebar-admin-pass-1', ADMIN_OTP: 'off' }
rmSync('/tmp/oz-data', { recursive: true, force: true })
const server = spawn('node', ['app.js'], { env: ENV, stdio: 'ignore' })
process.on('exit', () => { try { server.kill('SIGKILL') } catch { /* gone */ } })
for (let i = 0; i < 40; i++) { await new Promise((r) => setTimeout(r, 250)); try { if ((await fetch(`${BASE}/api/health`)).ok) break } catch { /* retry */ } }

// seed one order so the Orders badge shows a count
await fetch(`${BASE}/api/orders`, {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ customer: { name: 'Badge Test', email: 'b@t.co' }, items: [{ id: 1, name: 'X', brand: 'Y', amount: 100, qty: 1 }], subtotal: 100, total: 100, payment: 'cod', fulfilment: 'pickup' }),
})

const browser = await chromium.launch({ executablePath: EXEC })
const desktop = await browser.newContext({ viewport: { width: 1360, height: 900 } })
const page = await desktop.newPage()
const errors = []
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
page.on('pageerror', (e) => errors.push('PAGEERR ' + e.message))

const login = async (p) => {
  await p.goto(`${BASE}/admin`, { waitUntil: 'networkidle' })
  await p.getByPlaceholder('info@optizone.co.il').fill('owner@sb.dev')
  await p.getByPlaceholder('••••••••').fill('sidebar-admin-pass-1')
  await p.getByRole('button', { name: /sign in/i }).click()
  await p.getByText('Overview').waitFor()
}
await login(page)
const asideW = () => page.locator('aside').first().evaluate((el) => el.offsetWidth)

console.log('\n== Structure & active state ==')
expect(await page.locator('aside nav ul li').count() >= 10, 'semantic nav > ul > li with all items')
const dashBtn = page.locator('aside nav button', { hasText: 'Dashboard' }).first()
expect(await dashBtn.getAttribute('aria-current') === 'page', 'active item marked aria-current=page (Dashboard on load)')
// amber left-border indicator on the active item
const shadow = await dashBtn.evaluate((el) => getComputedStyle(el).boxShadow)
expect(/rgb\(2\d\d,\s*1\d\d/.test(shadow) || shadow.includes('inset'), `active item has an inset (amber) indicator (${shadow.slice(0, 40)})`)

console.log('\n== Order badge ==')
const ordersBtn = page.locator('aside nav button', { hasText: 'Orders' }).first()
expect(await ordersBtn.getByText('1').isVisible(), 'Orders shows a "1 new" count badge')

console.log('\n== Sub-menu accordion ==')
const productsGroup = page.locator('aside nav button', { hasText: 'Products / Frames' }).first()
expect(await productsGroup.getAttribute('aria-expanded') === 'false', 'group starts collapsed (aria-expanded=false)')
await productsGroup.click()
await page.locator('aside nav button', { hasText: 'All Products' }).first().waitFor()
expect(await productsGroup.getAttribute('aria-expanded') === 'true', 'clicking the group expands it')
// opening Settings closes Products (accordion)
await page.locator('aside nav button', { hasText: 'Settings' }).first().click()
await page.locator('aside nav button', { hasText: 'Users & Roles' }).first().waitFor()
expect(await productsGroup.getAttribute('aria-expanded') === 'false', 'opening another group closes the first (accordion)')

console.log('\n== Collapse + persist + tooltip ==')
const full = await asideW()
await page.getByRole('button', { name: 'Collapse sidebar' }).click()
await page.waitForTimeout(350)
const rail = await asideW()
expect(rail < full && rail <= 80, `collapses to a ~64px icon rail (${full}px → ${rail}px)`)
// labels hidden, tooltip appears on hover
expect(await page.locator('aside').getByText('Dashboard', { exact: true }).count() === 0, 'labels hidden in the collapsed rail')
await page.locator('aside nav button').first().hover()
await page.getByRole('tooltip').first().waitFor({ timeout: 3000 })
ok('hovering a collapsed item shows a tooltip label')
// persists across reload
await page.reload({ waitUntil: 'networkidle' })
await page.getByText('Overview').waitFor()
expect(await asideW() <= 80, 'collapsed state persists across reload')
await page.getByRole('button', { name: 'Expand sidebar' }).click()
await page.waitForTimeout(300)
expect(await asideW() > 80, 'expands again')

console.log('\n== Profile dropdown ==')
const chip = page.locator('aside').getByRole('button', { name: /owner@sb.dev/ }).first()
await chip.click()
await page.getByRole('menuitem', { name: 'Profile' }).waitFor()
expect(await page.getByRole('menuitem', { name: 'Logout' }).isVisible(), 'profile chip opens Profile + Logout menu')
await page.keyboard.press('Escape')
expect(await page.getByRole('menuitem', { name: 'Logout' }).count() === 0, 'Escape closes the profile menu')

console.log('\n== Language / RTL toggle ==')
const dirBtn = page.getByRole('button', { name: /Switch layout direction/ })
expect(await page.evaluate(() => document.documentElement.dir) === 'ltr', 'admin starts LTR')
const leftBefore = await page.locator('aside').first().evaluate((el) => el.getBoundingClientRect().left)
await dirBtn.click()
await page.waitForTimeout(300)
expect(await page.evaluate(() => document.documentElement.dir) === 'rtl', 'toggle flips the admin to RTL')
const leftAfter = await page.locator('aside').first().evaluate((el) => el.getBoundingClientRect().left)
expect(leftAfter > leftBefore, `sidebar moves to the right in RTL (left ${Math.round(leftBefore)} → ${Math.round(leftAfter)})`)
await dirBtn.click() // back to LTR
await page.waitForTimeout(200)
expect(await page.evaluate(() => document.documentElement.dir) === 'ltr', 'toggles back to LTR')

console.log('\n== Keyboard navigation ==')
await page.locator('aside nav button').first().focus()
await page.keyboard.press('ArrowDown')
const moved = await page.evaluate(() => document.activeElement?.textContent || '')
expect(/Products/.test(moved), `Arrow keys move focus down the nav (now on "${moved.trim().slice(0, 20)}")`)
await page.keyboard.press('Enter') // activates → expands Products group
await page.locator('aside nav button', { hasText: 'All Products' }).first().waitFor()
ok('Enter activates the focused item')

console.log('\n== Mobile off-canvas drawer ==')
const mobile = await browser.newContext({ viewport: { width: 420, height: 820 } })
const mp = mobile.newPage ? await mobile.newPage() : null
{
  const m = await mobile.newPage()
  const merr = []
  m.on('console', (e) => e.type() === 'error' && merr.push(e.text()))
  await login(m)
  // sidebar is off-canvas (translated out) until the hamburger opens it
  const offscreen = await m.locator('aside').first().evaluate((el) => el.getBoundingClientRect().right <= 1)
  expect(offscreen, 'drawer is off-canvas by default on mobile')
  await m.getByRole('button', { name: 'Open menu' }).click()
  await m.waitForTimeout(350)
  const onscreen = await m.locator('aside').first().evaluate((el) => el.getBoundingClientRect().left >= 0 && el.getBoundingClientRect().right > 100)
  expect(onscreen, 'hamburger slides the drawer in')
  // dimmed overlay present
  const overlay = await m.locator('div[aria-hidden="true"]').filter({ hasNot: m.locator('nav') }).first()
  const hasOverlay = await m.evaluate(() => !![...document.querySelectorAll('div')].find((d) => { const s = getComputedStyle(d); return s.position === 'fixed' && parseFloat(s.zIndex) >= 60 && s.backgroundColor.startsWith('rgba(15') }))
  expect(hasOverlay, 'a dimmed overlay backs the drawer')
  // tapping a nav item navigates AND closes the drawer
  await m.locator('aside nav button', { hasText: 'Customers' }).first().click()
  await m.waitForTimeout(350)
  const closed = await m.locator('aside').first().evaluate((el) => el.getBoundingClientRect().right <= 1)
  expect(closed, 'selecting an item closes the drawer')
  expect(merr.length === 0, `mobile: no console errors (${merr.length})`)
  await m.close()
}
await mobile.close()

console.log('')
expect(errors.length === 0, `no console errors (${errors.length})`)
errors.slice(0, 6).forEach((e) => console.log('     !! ' + e))

await browser.close()
server.kill('SIGTERM')
rmSync('/tmp/oz-data', { recursive: true, force: true })
console.log(`\n${failed === 0 ? `🎉 ALL ${passed} CHECKS PASSED` : `❌ ${failed} FAILED · ${passed} passed`}`)
process.exit(failed === 0 ? 0 : 1)
