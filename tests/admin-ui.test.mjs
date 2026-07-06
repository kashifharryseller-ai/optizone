// Admin console UI tests — icons, breadcrumb, account menu, global search,
// save-toast state machine, Security error-free rendering, branch-remove
// confirmation, pagination presence, RTL on bilingual HE fields.
//
// Spawns its own server (simulated serverless, seeded test admin):
//   node tests/admin-ui.test.mjs
import { spawn } from 'node:child_process'
import { rmSync } from 'node:fs'
import zlib from 'node:zlib'
import { chromium } from 'playwright'

// Minimal PNG encoder → a white image with a dark centred box (a stand-in for a
// frame photographed on a plain white background, for the bg-removal test).
function crc32(b) { let c = ~0; for (let i = 0; i < b.length; i++) { c ^= b[i]; for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xEDB88320 & -(c & 1)) } return ~c >>> 0 }
function chunk(t, d) { const l = Buffer.alloc(4); l.writeUInt32BE(d.length); const T = Buffer.from(t); const cr = Buffer.alloc(4); cr.writeUInt32BE(crc32(Buffer.concat([T, d]))); return Buffer.concat([l, T, d, cr]) }
function framePng(w, h) {
  const raw = Buffer.alloc((w * 3 + 1) * h)
  for (let y = 0; y < h; y++) {
    raw[y * (w * 3 + 1)] = 0
    for (let x = 0; x < w; x++) {
      const o = y * (w * 3 + 1) + 1 + x * 3
      const inBox = x > w * 0.3 && x < w * 0.7 && y > h * 0.35 && y < h * 0.65
      const v = inBox ? 20 : 250 // dark frame on a white background
      raw[o] = v; raw[o + 1] = v; raw[o + 2] = v
    }
  }
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 2
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))])
}

const PORT = 5110 + (process.pid % 400) // unique-ish per run — orphan servers from crashed runs can't shadow us
const BASE = `http://127.0.0.1:${PORT}`
const EXEC = process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium'
let passed = 0, failed = 0
const ok = (m) => { passed++; console.log('   ✅ ' + m) }
const expect = (c, m) => (c ? ok(m) : (failed++, console.log('   ❌ ' + m)))

const ENV = {
  ...process.env, NODE_ENV: 'production', PORT: String(PORT),
  VERCEL: '1', VERCEL_GIT_COMMIT_SHA: 'ui-test', VERCEL_URL: 'oz-ui-test.vercel.app',
  ADMIN_EMAIL: 'owner@ui-test.dev', ADMIN_PASSWORD: 'ui-test-admin-pass-1', ADMIN_OTP: 'off',
}
delete ENV.JWT_SECRET
rmSync('/tmp/oz-data', { recursive: true, force: true })

const server = spawn('node', ['app.js'], { env: ENV, stdio: 'ignore' })
for (let i = 0; i < 40; i++) { await new Promise((r) => setTimeout(r, 250)); try { if ((await fetch(`${BASE}/api/health`)).ok) break } catch { /* retry */ } }

process.on('exit', () => { try { server.kill('SIGKILL') } catch { /* gone */ } })
const browser = await chromium.launch({ executablePath: EXEC })
const page = await (await browser.newContext({ viewport: { width: 1360, height: 900 } })).newPage()
const errors = []
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
page.on('pageerror', (e) => errors.push('PAGEERR ' + e.message))

// navigate the sidebar: expand the group only if the target child isn't
// already visible (clicking an open group would toggle it shut).
async function gotoNav(page, group, item) {
  if (group) {
    const g = page.locator('aside nav button', { hasText: group }).first()
    if ((await g.getAttribute('aria-expanded')) === 'false') { await g.scrollIntoViewIfNeeded(); await g.click() }
    const child = page.locator('aside nav button', { hasText: item }).first()
    await child.waitFor()
    await child.scrollIntoViewIfNeeded()
    await child.click()
    return
  }
  await page.locator('aside nav button', { hasText: item }).first().click()
}

// login
await page.goto(`${BASE}/admin`, { waitUntil: 'networkidle' })
await page.getByPlaceholder('info@optizone.co.il').fill('owner@ui-test.dev')
await page.getByPlaceholder('••••••••').fill('ui-test-admin-pass-1')
await page.getByRole('button', { name: /sign in/i }).click()
await page.getByText('Overview').waitFor()
ok('admin login')

console.log('\n== Icons, breadcrumb, account menu ==')
const svgIcons = await page.locator('aside nav button svg').count()
expect(svgIcons >= 8, `sidebar renders ${svgIcons} vector icons (no glyph boxes)`)
expect(await page.getByLabel('Breadcrumb').textContent().then((t) => t.includes('OPTIZONE Admin')), 'breadcrumb rendered')
// profile chip in the sidebar footer shows the owner + role, opens Profile/Logout
expect(await page.getByText('Store owner').isVisible(), 'sidebar profile chip shows role')
expect(await page.getByText('owner@ui-test.dev').isVisible(), 'sidebar profile chip shows owner email')
await page.locator('aside').getByRole('button', { name: /owner@ui-test.dev/ }).click()
await page.getByRole('menuitem', { name: 'Logout' }).waitFor()
ok('profile dropdown has Logout')
await page.keyboard.press('Escape')

console.log('\n== Global search → deep link ==')
await page.getByLabel('Search everything').fill('persol')
await page.getByRole('button', { name: /Persol PO3092/ }).first().click()
await page.getByText('Products & catalog').waitFor()
const searchVal = await page.getByLabel('Search products').inputValue()
expect(searchVal.includes('PO3092'), `landed on Products pre-filtered ("${searchVal}")`)
const editBtns = await page.getByRole('button', { name: 'Edit' }).count()
expect(editBtns === 1, `list filtered to the matching product (${editBtns} row)`)

console.log('\n== Save state machine (toast, disabled-when-clean) ==')
const saveBtn = page.getByRole('button', { name: /Save changes|Saving…/ })
expect(await saveBtn.isDisabled(), 'Save disabled with no unsaved edits')
await page.getByLabel('Search products').fill('')
await page.getByRole('button', { name: 'Edit' }).first().click()
const priceInput = page.locator('input[type="number"]').first()
const cur = await priceInput.inputValue()
await priceInput.fill(String((Number(cur) || 0) + 1)) // guaranteed-dirty edit
expect(await saveBtn.isEnabled(), 'Save enables after an edit')
await saveBtn.click()
await page.getByText('Changes saved').waitFor()
ok('transient success toast confirms the save')
await page.waitForTimeout(3200)
expect(await page.getByText('Changes saved').count() === 0, 'toast auto-dismisses')
expect(await saveBtn.isDisabled(), 'Save disabled again once persisted')

console.log('\n== Security page: no stuck Loading, error-free ==')
await gotoNav(page, 'Settings', 'Users & Roles')
await page.getByText('Owner account').waitFor()
await page.locator('input[value="owner@ui-test.dev"]').waitFor()
ok('Owner account form loaded (not stuck on Loading…)')
await page.getByText('Production readiness').waitFor()
await page.getByText('Audit log').waitFor()
await page.getByText('content.save').first().waitFor({ timeout: 5000 })
ok('Audit log loaded with recorded entries')
expect(await page.getByText('Loading…').count() === 0, 'no panel stuck on "Loading…"')

console.log('\n== Branch remove asks for confirmation ==')
await gotoNav(page, 'Settings', 'Store')
await page.getByRole('heading', { name: 'Branches' }).waitFor()
let confirmMsg = ''
page.once('dialog', (d) => { confirmMsg = d.message(); d.dismiss() })
await page.getByRole('button', { name: 'Remove item' }).first().click()
await page.waitForTimeout(300)
expect(confirmMsg.includes('branch'), `confirmation dialog names the branch ("${confirmMsg.slice(0, 60)}…")`)
const branchCount = await page.getByRole('button', { name: 'Remove item' }).count()
expect(branchCount >= 2, 'dismissing the dialog keeps the branch')

console.log('\n== Empty states with CTA ==')
await page.getByRole('button', { name: /Orders/ }).first().click()
await page.getByText('No orders yet').waitFor()
expect(await page.getByRole('button', { name: /Open the storefront/ }).isVisible(), 'Orders empty state offers a call-to-action')

console.log('\n== RTL on bilingual Hebrew fields ==')
await page.locator('aside nav button', { hasText: 'Content & Homepage' }).first().click()
await page.waitForTimeout(500)
const rtlInputs = await page.locator('input[dir="rtl"], textarea[dir="rtl"]').count()
expect(rtlInputs > 0, `${rtlInputs} Hebrew fields render dir="rtl"`)

console.log('\n== Try-Mirror: automatic background removal ==')
await page.locator('aside nav button', { hasText: 'Try-Mirror / AR' }).first().click()
await page.getByText('Try-Mirror / AR assets').waitFor()
// First eyewear product ships Try-Mirror ON → per-colour frame fields are shown.
await page.locator('input[type="file"][accept="image/*"]').first().setInputFiles({ name: 'frame.png', mimeType: 'image/png', buffer: framePng(200, 150) })
await page.getByAltText('cut-out preview').waitFor({ timeout: 10000 })
ok('uploading a photo shows an auto-removed cut-out preview')
// The white background must be gone (transparent) and the frame shape kept.
const cut = await page.getByAltText('cut-out preview').evaluate((img) => {
  const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight
  const x = c.getContext('2d'); x.drawImage(img, 0, 0)
  const d = x.getImageData(0, 0, c.width, c.height).data
  const A = (px, py) => d[(py * c.width + px) * 4 + 3]
  return { corner: A(1, 1), center: A(c.width >> 1, c.height >> 1) }
})
expect(cut.corner < 24, `plain background removed → transparent (corner alpha ${cut.corner})`)
expect(cut.center > 200, `frame shape preserved → opaque (centre alpha ${cut.center})`)
expect(await page.getByRole('button', { name: 'Use cut-out' }).isVisible(), 'offers "Use cut-out" to save the transparent frame')

console.log('')
expect(errors.length === 0, `no console errors (${errors.length})`)
errors.slice(0, 6).forEach((e) => console.log('     !! ' + e))

await browser.close()
server.kill('SIGTERM')
rmSync('/tmp/oz-data', { recursive: true, force: true })
console.log(`\n${failed === 0 ? `🎉 ALL ${passed} CHECKS PASSED` : `❌ ${failed} FAILED · ${passed} passed`}`)
process.exit(failed === 0 ? 0 : 1)
