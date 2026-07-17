// Homepage & Content editor tests — character counters/limits, auto-growing
// textareas, drag/keyboard reordering, remove confirmations, upload dropzone
// with crop + alt text, live preview (EN/HE + device), unsaved indicator and
// autosave-draft restore.
//
//   node tests/homepage-editor.test.mjs   (spawns its own server)
import { spawn } from 'node:child_process'
import { rmSync } from 'node:fs'
import zlib from 'node:zlib'
import { chromium } from 'playwright'

const PORT = 5520 + (process.pid % 400)
const BASE = `http://127.0.0.1:${PORT}`
const EXEC = process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium'
let passed = 0, failed = 0
const ok = (m) => { passed++; console.log('   ✅ ' + m) }
const expect = (c, m) => (c ? ok(m) : (failed++, console.log('   ❌ ' + m)))
const expect_eventually = async (fn, tries = 20) => { for (let i = 0; i < tries; i++) { if (await fn().catch(() => false)) return; await new Promise((r) => setTimeout(r, 150)) } }

// tiny valid PNG for upload tests
function crc32(buf) { let c = ~0; for (let i = 0; i < buf.length; i++) { c ^= buf[i]; for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xEDB88320 & -(c & 1)) } return ~c >>> 0 }
function chunk(t, d) { const l = Buffer.alloc(4); l.writeUInt32BE(d.length); const T = Buffer.from(t); const cr = Buffer.alloc(4); cr.writeUInt32BE(crc32(Buffer.concat([T, d]))); return Buffer.concat([l, T, d, cr]) }
function png(w, h) { const ih = Buffer.alloc(13); ih.writeUInt32BE(w, 0); ih.writeUInt32BE(h, 4); ih[8] = 8; ih[9] = 2; const raw = Buffer.alloc((w * 3 + 1) * h, 120); for (let y = 0; y < h; y++) raw[y * (w * 3 + 1)] = 0; return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ih), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]) }

const ENV = {
  ...process.env, NODE_ENV: 'production', PORT: String(PORT),
  VERCEL: '1', VERCEL_GIT_COMMIT_SHA: 'cms-test', VERCEL_URL: 'oz-cms-test.vercel.app',
  ADMIN_EMAIL: 'owner@cms-test.dev', ADMIN_PASSWORD: 'cms-test-admin-pass-1', ADMIN_OTP: 'off',
}
delete ENV.JWT_SECRET
rmSync('/tmp/oz-data', { recursive: true, force: true })
const server = spawn('node', ['app.js'], { env: ENV, stdio: 'ignore' })
process.on('exit', () => { try { server.kill('SIGKILL') } catch { /* gone */ } })
for (let i = 0; i < 40; i++) { await new Promise((r) => setTimeout(r, 250)); try { if ((await fetch(`${BASE}/api/health`)).ok) break } catch { /* retry */ } }

const browser = await chromium.launch({ executablePath: EXEC })
const ctx = await browser.newContext({ viewport: { width: 1500, height: 950 } })
const page = await ctx.newPage()
const errors = []
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
page.on('pageerror', (e) => errors.push('PAGEERR ' + e.message))

const login = async (p) => {
  await p.goto(`${BASE}/admin`, { waitUntil: 'networkidle' })
  await p.getByPlaceholder('info@optizone.co.il').fill('owner@cms-test.dev')
  await p.getByPlaceholder('••••••••').fill('cms-test-admin-pass-1')
  await p.getByRole('button', { name: /sign in/i }).click()
  await p.getByText('Overview').waitFor()
}
await login(page)
await page.locator('aside nav button', { hasText: 'Content & Homepage' }).first().click()
await page.getByRole('heading', { name: 'Announcement bar' }).waitFor()
ok('Homepage editor open')

console.log('\n== Character limits & counters ==')
const eyebrowEn = page.getByLabel('Eyebrow (English)').first()
await eyebrowEn.fill('X'.repeat(60)) // limit is 40
expect((await eyebrowEn.inputValue()).length === 40, 'eyebrow clamped to its 40-char limit')
expect(await page.getByText('40/40').first().isVisible(), 'counter shows 40/40 at the limit')

console.log('\n== Auto-growing textarea ==')
const subEn = page.getByLabel('Subtitle (English)').first()
expect(await subEn.evaluate((el) => el.tagName === 'TEXTAREA'), 'subtitle is a textarea')
const h1 = await subEn.evaluate((el) => el.offsetHeight)
await subEn.fill('Line one.\nLine two is much longer and wraps around.\nLine three.\nLine four keeps growing the field.')
const h2 = await subEn.evaluate((el) => el.offsetHeight)
expect(h2 > h1, `textarea grows with content (${h1}px → ${h2}px)`)

console.log('\n== Unsaved indicator + autosave draft ==')
await page.getByText('Unsaved changes').waitFor()
ok('"Unsaved changes" indicator appears after an edit')
await page.waitForTimeout(2200)
expect(await page.getByText(/draft \d/).isVisible(), 'autosave-draft timestamp shown')

console.log('\n== Drag/keyboard reorder on Services ==')
const grips = page.getByRole('button', { name: /Reorder item/ })
expect(await grips.count() >= 6, `services have reorder grips (${await grips.count()})`)
const svcPanel = page.locator('section', { hasText: 'The six eye-care service tiles' })
const firstTitle = () => svcPanel.getByLabel('Title (English)', { exact: true }).first().inputValue()
const before = await firstTitle()
await grips.first().focus()
await page.keyboard.press('ArrowDown')
await page.waitForTimeout(150)
const after = await firstTitle()
expect(before !== after && !!before, `keyboard ↓ on grip reorders (was "${before}", now "${after}")`)
await grips.nth(1).focus()
await page.keyboard.press('ArrowUp') // put it back
await page.waitForTimeout(150)
expect((await firstTitle()) === before, 'keyboard ↑ restores the order')

console.log('\n== Remove confirmation on services ==')
let dlg = ''
page.once('dialog', (d) => { dlg = d.message(); d.dismiss() })
await page.locator('section', { hasText: 'The six eye-care service tiles' }).getByRole('button', { name: 'Remove item' }).first().click()
await page.waitForTimeout(250)
expect(dlg.includes('service tile'), `remove asks for confirmation ("${dlg.slice(0, 50)}…")`)

console.log('\n== Upload: dropzone hints, crop modal, alt text ==')
const heroPanel = page.locator('section', { hasText: 'The main banner on the homepage' })
// The seed ships a hero photo — clear it (accepting the confirm dialog) so the
// empty-dropzone state shows.
if (await heroPanel.getByRole('button', { name: 'Remove', exact: true }).count()) {
  page.once('dialog', (d) => d.accept())
  await heroPanel.getByRole('button', { name: 'Remove', exact: true }).click()
  await page.waitForTimeout(250)
}
expect(await page.getByText(/Recommended 1200 × 900 px/).isVisible(), 'hero dropzone shows recommended dimensions + size hint')
expect(await page.getByLabel('Alt text (for accessibility & SEO) (English)').first().isVisible(), 'alt-text EN field present (English-only; he/ar auto-translated)')
// choose a file → crop modal appears → apply → uploaded thumb with Replace/Remove
await page.route('**/api/admin/upload', (route) => route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ url: '/uploads/hero-test.jpg' }) }))
await page.route('**/uploads/hero-test.jpg', (route) => route.fulfill({ status: 200, contentType: 'image/png', body: png(24, 18) }))
await heroPanel.locator('input[type="file"]').setInputFiles({ name: 'hero.png', mimeType: 'image/png', buffer: png(320, 200) })
await page.getByRole('dialog', { name: 'Crop image' }).waitFor()
ok('crop modal opens with the chosen photo')
expect(await page.getByLabel('Zoom').isVisible(), 'cropper has a zoom control')
await page.getByRole('button', { name: 'Apply crop' }).click()
await heroPanel.getByRole('button', { name: 'Replace' }).waitFor()
expect(await heroPanel.getByRole('button', { name: 'Remove', exact: true }).isVisible(), 'preview thumb with Replace/Remove controls after upload')

console.log('\n== Live preview (EN/HE + device) ==')
await page.getByRole('button', { name: 'Live preview' }).click()
const frame = page.frameLocator('iframe[title="Storefront preview"]')
await frame.getByText('CONNECTED', { exact: false }).first().waitFor({ timeout: 10000 }).catch(() => {})
// edit hero title line 1 EN → preview updates without saving
await page.getByLabel('Title line 1 (English)').first().fill('PREVIEW LIVE TEST')
await frame.getByText('PREVIEW LIVE TEST').first().waitFor({ timeout: 6000 })
ok('preview updates live as fields change (unsaved content)')
// Hebrew switch flips the iframe to RTL
await page.getByRole('button', { name: 'עברית' }).click()
await page.waitForFunction(() => {
  const f = document.querySelector('iframe[title="Storefront preview"]')
  return f && f.contentDocument && f.contentDocument.documentElement.dir === 'rtl'
}, { timeout: 6000 })
ok('Hebrew switch → preview renders RTL')
// device toggle switches viewport width
await page.getByLabel('Desktop preview').click()
const w = await page.locator('iframe[title="Storefront preview"]').evaluate((el) => el.offsetWidth)
expect(w === 1280, `desktop preview renders at 1280px (scaled) — got ${w}`)

console.log('\n== Draft restore after reload ==')
await page.waitForTimeout(1900) // let the autosave-draft debounce (1500ms) persist the last edit
await page.reload({ waitUntil: 'networkidle' })
await page.getByText('Overview').waitFor()
await page.getByText(/unsaved local draft/).waitFor({ timeout: 6000 })
ok('restore banner offered after reload with unsaved edits')
await page.getByRole('button', { name: 'Restore draft' }).click()
await page.waitForTimeout(300)
await page.locator('aside nav button', { hasText: 'Content & Homepage' }).first().click()
await page.getByLabel('Title line 1 (English)').first().waitFor()
await expect_eventually(() => page.getByLabel('Title line 1 (English)').first().inputValue().then((v) => v === 'PREVIEW LIVE TEST'))
expect((await page.getByLabel('Title line 1 (English)').first().inputValue()) === 'PREVIEW LIVE TEST', 'restored draft brings back the edit')
expect(await page.getByText('Unsaved changes').isVisible(), 'restored draft is marked unsaved (ready to Save)')

console.log('')
expect(errors.length === 0, `no console errors (${errors.length})`)
errors.slice(0, 8).forEach((e) => console.log('     !! ' + e))

await browser.close()
server.kill('SIGTERM')
rmSync('/tmp/oz-data', { recursive: true, force: true })
console.log(`\n${failed === 0 ? `🎉 ALL ${passed} CHECKS PASSED` : `❌ ${failed} FAILED · ${passed} passed`}`)
process.exit(failed === 0 ? 0 : 1)
