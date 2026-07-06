// Try Mirror — MODE 1 (live camera) and MODE 3 (upload video), end-to-end.
//
// Chromium's fake media device (--use-fake-device-for-media-stream) provides a
// real getUserMedia stream, and MODE 3 gets a genuine WebM clip recorded
// in-browser via canvas.captureStream + MediaRecorder. The stub landmarker
// (window.__OZ_FACE_MOCK__) supplies fixed landmarks so the overlay pipeline
// runs deterministically without downloading the model.
//
//   npx vite build && PORT=5000 node app.js
//   node tests/trymirror-media.test.mjs
import { chromium } from 'playwright'
import zlib from 'node:zlib'

const BASE = process.env.BASE_URL || 'http://127.0.0.1:5000'
const EXEC = process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium'
let passed = 0, failed = 0
const ok = (m) => { passed++; console.log('   ✅ ' + m) }
const expect = (c, m) => (c ? ok(m) : (failed++, console.log('   ❌ ' + m)))

// magenta 24×12 PNG used as the product's transparent frame asset
function crc32(buf) { let c = ~0; for (let i = 0; i < buf.length; i++) { c ^= buf[i]; for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xEDB88320 & -(c & 1)) } return ~c >>> 0 }
function chunk(type, data) { const l = Buffer.alloc(4); l.writeUInt32BE(data.length); const t = Buffer.from(type); const cr = Buffer.alloc(4); cr.writeUInt32BE(crc32(Buffer.concat([t, data]))); return Buffer.concat([l, t, data, cr]) }
function png(w, h, [r, g, b]) {
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 2
  const raw = Buffer.alloc((w * 3 + 1) * h)
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const o = y * (w * 3 + 1) + 1 + x * 3; raw[o] = r; raw[o + 1] = g; raw[o + 2] = b }
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))])
}
const FRAME = 'data:image/png;base64,' + png(24, 12, [255, 0, 255]).toString('base64')

const MOCK = `window.__OZ_FACE_MOCK__ = {
  landmarks: { 1:{x:0.5,y:0.52}, 10:{x:0.5,y:0.28}, 33:{x:0.35,y:0.45}, 133:{x:0.44,y:0.45}, 168:{x:0.5,y:0.5}, 175:{x:0.5,y:0.72}, 234:{x:0.28,y:0.5}, 263:{x:0.65,y:0.45}, 362:{x:0.56,y:0.45}, 454:{x:0.72,y:0.5} },
  matrix: [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1],
}`

// wait until the visible canvas has BOTH source pixels (non-black) and the
// magenta frame overlay — i.e. the full draw-source-then-overlay pipeline ran
const waitPainted = (page) => page.waitForFunction(() => {
  const c = document.querySelector('canvas')
  if (!c || !c.width) return false
  const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data
  let src = 0, frame = 0
  for (let i = 0; i < d.length; i += 4) {
    if (d[i] > 200 && d[i + 1] < 90 && d[i + 2] > 200) frame++
    else if (d[i] + d[i + 1] + d[i + 2] > 40) src++
  }
  return frame > 50 && src > 500
}, { timeout: 10000 })

const browser = await chromium.launch({
  executablePath: EXEC,
  args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'],
})
const ctx = await browser.newContext({ viewport: { width: 1280, height: 950 }, permissions: ['camera'] })
const page = await ctx.newPage()
const errors = []
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
page.on('pageerror', (e) => errors.push('PAGEERROR ' + e.message))
await page.addInitScript(MOCK)
await page.route('**/api/content', async (route) => {
  const res = await route.fetch(); const json = await res.json()
  const prod = (json.products || []).find((p) => p.name === 'CONNECTED FRAME') || json.products[0]
  if (prod) { prod.tryMirrorImg = FRAME; prod.tryMirror = true }
  await route.fulfill({ response: res, body: JSON.stringify(json) })
})

await page.goto(BASE, { waitUntil: 'networkidle' })
await page.getByText('CONNECTED FRAME').first().click()
await page.locator('main').getByRole('button', { name: 'Try Mirror' }).first().click()
await page.getByRole('button', { name: 'Allow camera' }).click()
await page.getByText('Frame size').waitFor()

// ── MODE 1: live camera ───────────────────────────────────────────────────────
console.log('\n== MODE 1: live camera (fake device) ==')
await waitPainted(page)
ok('camera stream + frame overlay composited on canvas in realtime')
expect(await page.locator('[role="alert"]').count() === 0, 'no error banner in live mode')
const mirrored = await page.evaluate(() => getComputedStyle(document.querySelector('canvas')).transform !== 'none')
expect(mirrored, 'live view is mirrored (selfie view)')
// track teardown on close
await page.evaluate(() => { window.__tracks = document.querySelector('video').srcObject.getTracks() })
await page.getByRole('button', { name: 'close' }).click()
await page.waitForTimeout(300)
expect(await page.evaluate(() => window.__tracks.every((t) => t.readyState === 'ended')), 'camera tracks stopped when modal closes')

// ── MODE 3: upload video ──────────────────────────────────────────────────────
console.log('\n== MODE 3: upload video (in-browser recorded WebM) ==')
// record a real 1.4s WebM in the page
const b64 = await page.evaluate(async () => {
  const c = document.createElement('canvas'); c.width = 320; c.height = 240
  const g = c.getContext('2d')
  const rec = new MediaRecorder(c.captureStream(15), { mimeType: 'video/webm' })
  const chunks = []
  rec.ondataavailable = (e) => chunks.push(e.data)
  const stopped = new Promise((r) => { rec.onstop = r })
  rec.start(100)
  const t0 = performance.now()
  await new Promise((res) => {
    const draw = () => {
      const t = performance.now() - t0
      g.fillStyle = `hsl(${(t / 4) % 360},70%,45%)`; g.fillRect(0, 0, 320, 240)
      g.fillStyle = '#fff'; g.fillRect((t / 6) % 320, 100, 40, 40)
      t < 1400 ? requestAnimationFrame(draw) : res()
    }
    draw()
  })
  rec.stop(); await stopped
  const buf = new Uint8Array(await new Blob(chunks, { type: 'video/webm' }).arrayBuffer())
  let s = ''; for (let i = 0; i < buf.length; i += 8192) s += String.fromCharCode(...buf.subarray(i, i + 8192))
  return btoa(s)
})
ok(`recorded a real WebM test clip in-browser (${Math.round(b64.length * 0.75 / 1024)} kB)`)

await page.locator('main').getByRole('button', { name: 'Try Mirror' }).first().click()
await page.getByRole('button', { name: 'Allow camera' }).click() // consent gates every open
await page.getByText('Frame size').waitFor()
await page.getByRole('button', { name: 'Upload video', exact: true }).click()
await page.getByRole('button', { name: 'Choose a video' }).waitFor()
await page.locator('input[type="file"][accept="video/*"]').setInputFiles({ name: 'clip.webm', mimeType: 'video/webm', buffer: Buffer.from(b64, 'base64') })
await waitPainted(page)
ok('video frames + overlay composited during playback (glasses track the clip)')
await page.locator('input[aria-label="scrubber"]').waitFor()
ok('transport (play/pause + scrubber) shown')
// pause via transport, confirm the <video> actually paused
await page.waitForTimeout(400)
const pauseBtn = page.getByRole('button', { name: /Pause|Play/ })
await pauseBtn.click()
await page.waitForTimeout(200)
const pausedState = await page.evaluate(() => document.querySelector('video').paused)
expect(pausedState === true, 'play/pause control pauses the clip')
// scrub to ~60% and confirm currentTime follows
await page.locator('input[aria-label="scrubber"]').fill('0.6')
await page.waitForTimeout(200)
const seek = await page.evaluate(() => { const v = document.querySelector('video'); return v.duration ? v.currentTime / v.duration : 0 })
expect(Math.abs(seek - 0.6) < 0.15, `scrubber seeks the clip (landed at ${(seek * 100).toFixed(0)}%)`)
// download captures the current composited frame
const [dl] = await Promise.all([
  page.waitForEvent('download'),
  page.getByRole('button', { name: 'Download photo' }).click(),
])
expect(dl.suggestedFilename() === 'optizone-tryon.png', 'download captures current video frame as optizone-tryon.png')
// add to cart from video mode with adjusted size
await page.getByRole('button', { name: 'larger' }).click()
await page.getByRole('button', { name: /Add to Cart · 105%/ }).click()
await page.getByRole('banner').getByRole('button', { name: 'Cart' }).click()
expect(await page.getByText('Custom size · 105%').isVisible(), 'video-mode custom size persists to cart (105%)')

console.log('')
expect(errors.length === 0, `no console errors (${errors.length})`)
errors.slice(0, 6).forEach((e) => console.log('     !! ' + e))

await browser.close()
console.log(`\n${failed === 0 ? `🎉 ALL ${passed} CHECKS PASSED` : `❌ ${failed} FAILED · ${passed} passed`}`)
process.exit(failed === 0 ? 0 : 1)
