// Try Mirror (3-mode) tests — deterministic, headless.
//
// Real camera/face detection can't run in CI, so we inject a stub landmarker
// (window.__OZ_FACE_MOCK__, honoured by useFaceLandmarker) that returns fixed
// landmarks + an identity transform matrix. That lets us drive the SHARED
// render pipeline (used by all three modes) through the Upload-Photo path and
// assert real pixels, scaling, PNG download and cart persistence. Live/Video
// UIs are asserted structurally.
//
//   npx vite build && node app.js       (PORT=5000)
//   node tests/trymirror.test.mjs
import { chromium } from 'playwright'
import zlib from 'node:zlib'

const BASE = process.env.BASE_URL || 'http://127.0.0.1:5000'
const EXEC = process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium'
let passed = 0, failed = 0
const ok = (m) => { passed++; console.log('   ✅ ' + m) }
const expect = (c, m) => (c ? ok(m) : (failed++, console.log('   ❌ ' + m)))

// --- minimal PNG encoder (solid RGB) so we can feed real image bytes ----------
function crc32(buf) { let c = ~0; for (let i = 0; i < buf.length; i++) { c ^= buf[i]; for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xEDB88320 & -(c & 1)) } return ~c >>> 0 }
function pngChunk(type, data) { const len = Buffer.alloc(4); len.writeUInt32BE(data.length); const t = Buffer.from(type, 'ascii'); const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(Buffer.concat([t, data]))); return Buffer.concat([len, t, data, crc]) }
function encodePNG(w, h, [r, g, b]) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 2
  const raw = Buffer.alloc((w * 3 + 1) * h)
  for (let y = 0; y < h; y++) { raw[y * (w * 3 + 1)] = 0; for (let x = 0; x < w; x++) { const o = y * (w * 3 + 1) + 1 + x * 3; raw[o] = r; raw[o + 1] = g; raw[o + 2] = b } }
  const idat = zlib.deflateSync(raw)
  return Buffer.concat([sig, pngChunk('IHDR', ihdr), pngChunk('IDAT', idat), pngChunk('IEND', Buffer.alloc(0))])
}
const MAGENTA_FRAME = 'data:image/png;base64,' + encodePNG(24, 12, [255, 0, 255]).toString('base64')
const GRAY_PHOTO = encodePNG(320, 240, [170, 170, 170])

// Fixed face: eyes at y=0.45 (x 0.35 / 0.65), nose bridge at centre; identity pose.
const MOCK = `window.__OZ_FACE_MOCK__ = {
  landmarks: { 33:{x:0.35,y:0.45}, 133:{x:0.44,y:0.45}, 263:{x:0.65,y:0.45}, 362:{x:0.56,y:0.45}, 168:{x:0.5,y:0.5}, 234:{x:0.28,y:0.5}, 454:{x:0.72,y:0.5} },
  matrix: [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1],
}`

const magentaCount = (page) => page.evaluate(() => {
  const c = document.querySelector('canvas'); if (!c) return -1
  const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data
  let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] > 200 && d[i + 1] < 90 && d[i + 2] > 200) n++
  return n
})

const browser = await chromium.launch({ executablePath: EXEC })
const ctx = await browser.newContext({ viewport: { width: 1280, height: 950 } })
const page = await ctx.newPage()
const errors = []
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
page.on('pageerror', (e) => errors.push('PAGEERROR ' + e.message))
await page.addInitScript(MOCK)
// Give the opened product a transparent-PNG try-on asset.
await page.route('**/api/content', async (route) => {
  const res = await route.fetch(); const json = await res.json()
  const prod = (json.products || []).find((p) => p.name === 'CONNECTED FRAME') || json.products[0]
  if (prod) { prod.tryMirrorImg = MAGENTA_FRAME; prod.tryMirror = true }
  // Force a CONTACTS product ON to prove the category gate ignores the flag.
  const contact = (json.products || []).find((p) => p.category === 'contacts')
  if (contact) { contact.tryMirror = true; contact.tryMirrorImg = MAGENTA_FRAME }
  await route.fulfill({ response: res, body: JSON.stringify(json) })
})

console.log('\n== Business rule: glasses & sunglasses only ==')
await page.goto(BASE, { waitUntil: 'networkidle' })
// Contacts category page: even with tryMirror forced ON in the mock, no Try
// Mirror badge/filter is offered (the category gate ignores the flag).
await page.getByRole('navigation').getByText('Contact Lenses').first().click()
await page.getByText(/Acuvue|Dailies|Biofinity/).first().waitFor({ timeout: 5000 })
// Scope to <main> so the site-wide footer "Try Mirror" promo link is ignored.
expect(await page.locator('main').getByText('Try Mirror').count() === 0, 'contacts category shows no Try Mirror (badge/filter absent)')
// Open a contacts product → no Try Mirror button on the PDP.
await page.getByText(/Acuvue|Dailies|Biofinity/).first().click()
await page.getByRole('button', { name: /Add to cart/i }).first().waitFor({ timeout: 5000 })
expect(await page.locator('main').getByRole('button', { name: 'Try Mirror' }).count() === 0, 'contacts product page has no Try Mirror button')

console.log('\n== Try Mirror — model init + modal ==')
await page.goto(BASE, { waitUntil: 'networkidle' })
await page.getByText('CONNECTED FRAME').first().click()
// Eyewear product DOES offer Try Mirror (the button we click next).
ok('glasses product page offers Try Mirror')
await page.locator('main').getByRole('button', { name: 'Try Mirror' }).first().click()
await page.getByRole('button', { name: 'Allow camera' }).click()
await page.getByText('Frame size').waitFor()
ok('modal opens with shared controls')
// model init: the stub resolves → no persistent "loading" / init-failure banner
await page.waitForTimeout(400)
expect(await page.getByText('Loading face tracking…').count() === 0, 'model init settled (no loading banner)')
expect(await page.getByText(/couldn’t load/).count() === 0, 'no init-failure banner (model ready)')
const tabs = await page.getByRole('button', { name: /^(Live|Upload photo|Upload video)$/ }).count()
expect(tabs === 3, `three mode tabs present (got ${tabs})`)

console.log('\n== Mode 2: Upload photo renders an overlay ==')
await page.getByRole('button', { name: 'Upload photo', exact: true }).click()
expect(await page.getByRole('button', { name: 'Choose a photo' }).isVisible(), 'photo empty-state shows "Choose a photo"')
await page.locator('input[type="file"][accept="image/*"]').setInputFiles({ name: 'face.png', mimeType: 'image/png', buffer: GRAY_PHOTO })
await page.waitForFunction(() => {
  const c = document.querySelector('canvas'); if (!c) return false
  const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data
  for (let i = 0; i < d.length; i += 4) if (d[i] > 200 && d[i + 1] < 90 && d[i + 2] > 200) return true
  return false
}, { timeout: 5000 })
const baseCount = await magentaCount(page)
expect(baseCount > 0, `frame overlay painted onto the photo (${baseCount} px)`)

console.log('\n== Size scale affects output ==')
// enlarge to 140% via the +/- control, then compare painted area
for (let i = 0; i < 8; i++) await page.getByRole('button', { name: 'larger' }).click()
expect(await page.getByText('140%').first().isVisible(), 'size control reaches 140%')
await page.waitForTimeout(150)
const bigCount = await magentaCount(page)
expect(bigCount > baseCount * 1.1, `larger size paints more frame pixels (${baseCount} → ${bigCount})`)

console.log('\n== Download produces a PNG ==')
const [dl] = await Promise.all([
  page.waitForEvent('download'),
  page.getByRole('button', { name: 'Download photo' }).click(),
])
expect(dl.suggestedFilename() === 'optizone-tryon.png', `download named optizone-tryon.png (got ${dl.suggestedFilename()})`)

console.log('\n== Mode 3: Upload video UI ==')
await page.getByRole('button', { name: 'Upload video', exact: true }).click()
const videoEmpty = await page.getByRole('button', { name: 'Choose a video' }).waitFor({ state: 'visible', timeout: 3000 }).then(() => true).catch(() => false)
expect(videoEmpty, 'video empty-state shows "Choose a video"')

console.log('\n== Custom size persists to cart ==')
// back to photo (keeps 140%) and add to cart
await page.getByRole('button', { name: 'Upload photo', exact: true }).click()
await page.getByRole('button', { name: /Add to Cart · 140%/ }).click()
await page.getByRole('banner').getByRole('button', { name: 'Cart' }).click()
expect(await page.getByText('Custom size · 140%').isVisible(), 'cart line shows custom size 140%')

console.log('')
expect(errors.length === 0, `no console errors (${errors.length})`)
errors.slice(0, 5).forEach((e) => console.log('     !! ' + e))

await browser.close()
console.log(`\n${failed === 0 ? `🎉 ALL ${passed} CHECKS PASSED` : `❌ ${failed} FAILED · ${passed} passed`}`)
process.exit(failed === 0 ? 0 : 1)
