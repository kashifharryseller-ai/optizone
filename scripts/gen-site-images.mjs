// Generate the homepage hero photo + category tiles (studio-style renders, no
// network needed) → public/site/*.jpg, wired into content.media.
//
//   node scripts/gen-site-images.mjs
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const OUT = 'public/site'

const DEFS = `
  <defs>
    <radialGradient id="bg" cx="50%" cy="36%" r="85%">
      <stop offset="0%" stop-color="#fdfcfa"/><stop offset="55%" stop-color="#f0eee8"/><stop offset="100%" stop-color="#ddd9d0"/>
    </radialGradient>
    <radialGradient id="bgPine" cx="50%" cy="30%" r="90%">
      <stop offset="0%" stop-color="#2c5240"/><stop offset="60%" stop-color="#1e3c2d"/><stop offset="100%" stop-color="#122419"/>
    </radialGradient>
    <linearGradient id="gBlack" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#3c3c40"/><stop offset="35%" stop-color="#151517"/><stop offset="100%" stop-color="#232326"/>
    </linearGradient>
    <linearGradient id="gGold" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f4dfa0"/><stop offset="45%" stop-color="#caa74e"/><stop offset="100%" stop-color="#a07f2c"/>
    </linearGradient>
    <pattern id="pTort" width="90" height="70" patternUnits="userSpaceOnUse" patternTransform="rotate(18)">
      <rect width="90" height="70" fill="#5a3517"/>
      <ellipse cx="20" cy="18" rx="24" ry="16" fill="#2b1608" opacity="0.85"/>
      <ellipse cx="66" cy="44" rx="26" ry="18" fill="#241105" opacity="0.8"/>
      <ellipse cx="48" cy="10" rx="14" ry="9" fill="#7a4a1e" opacity="0.7"/>
    </pattern>
    <linearGradient id="lGreen" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(120,160,140,0.75)"/><stop offset="100%" stop-color="rgba(8,25,18,0.95)"/>
    </linearGradient>
    <linearGradient id="lClear" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="rgba(255,255,255,0.55)"/><stop offset="40%" stop-color="rgba(230,240,246,0.18)"/><stop offset="100%" stop-color="rgba(170,190,205,0.25)"/>
    </linearGradient>
    <radialGradient id="lensCase" cx="50%" cy="40%" r="65%">
      <stop offset="0%" stop-color="#ffffff"/><stop offset="70%" stop-color="#cfe4ee"/><stop offset="100%" stop-color="#a9c8d8"/>
    </radialGradient>
    <filter id="soft" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="10"/></filter>
    <filter id="softer" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="24"/></filter>
  </defs>`

// A compact front-view frame group centred at (0,0), ~440 units wide.
function frame({ rim = 'url(#gBlack)', stroke = '#0c0c0e', lens = 'url(#lClear)', rw = 16, round = false }) {
  const a = round ? 92 : 100, b = round ? 84 : 66, gap = 46
  const r = round ? '' : `rx="34"`
  const lensEl = (cx) => round
    ? `<ellipse cx="${cx}" cy="0" rx="${a}" ry="${b}" fill="${lens}"/><ellipse cx="${cx}" cy="0" rx="${a}" ry="${b}" fill="none" stroke="${rim}" stroke-width="${rw}"/>`
    : `<rect x="${cx - a}" y="${-b}" width="${a * 2}" height="${b * 2}" ${r} fill="${lens}"/><rect x="${cx - a}" y="${-b}" width="${a * 2}" height="${b * 2}" ${r} fill="none" stroke="${rim}" stroke-width="${rw}"/>`
  const c1 = -(gap / 2 + a), c2 = gap / 2 + a
  return `
    ${lensEl(c1)}${lensEl(c2)}
    <path d="M ${c1 + a * 0.85} ${-b * 0.42} C -14 ${-b * 0.72}, 14 ${-b * 0.72}, ${c2 - a * 0.85} ${-b * 0.42}" fill="none" stroke="${rim}" stroke-width="${Math.max(13, rw * 0.9)}" stroke-linecap="round"/>
    <path d="M ${c1 - a - rw * 0.3} ${-b * 0.35} l -52 -10 q -13 -2 -12 10 l 1 20 q 1 10 12 8 l 51 -11 Z" fill="${rim}" stroke="${stroke}" stroke-width="2"/>
    <path d="M ${c2 + a + rw * 0.3} ${-b * 0.35} l 52 -10 q 13 -2 12 10 l -1 20 q -1 10 -12 8 l -51 -11 Z" fill="${rim}" stroke="${stroke}" stroke-width="2"/>`
}

const shadow = (y, rx, ry, o = 0.3) => `<ellipse cx="0" cy="${y}" rx="${rx}" ry="${ry}" fill="rgba(20,20,16,${o})" filter="url(#softer)"/>`

const SCENES = {
  'hero-photo.jpg': { w: 1040, h: 780, svg: `
    <rect width="1040" height="780" fill="url(#bgPine)"/>
    <ellipse cx="520" cy="240" rx="430" ry="240" fill="rgba(224,138,42,0.10)" filter="url(#softer)"/>
    <g transform="translate(520,300) rotate(-7) scale(1.35)">${shadow(150, 260, 34)}${frame({ rim: 'url(#gGold)', stroke: '#8a6a1f', lens: 'url(#lGreen)', rw: 8, round: true })}</g>
    <g transform="translate(240,610) rotate(6)">${shadow(120, 220, 28, 0.35)}${frame({ rim: 'url(#pTort)', stroke: '#3a2413', rw: 20 })}</g>
    <g transform="translate(830,620) rotate(-4)">${shadow(120, 220, 28, 0.35)}${frame({ rim: 'url(#gBlack)', stroke: '#0c0c0e', rw: 18 })}</g>
    <g filter="url(#soft)" opacity="0.35"><path d="M 120 90 q 380 -70 800 10 l -12 40 q -400 -74 -776 -6 Z" fill="#f4dfa0"/></g>` },
  'cat-eyeglasses.jpg': { w: 900, h: 630, svg: `
    <rect width="900" height="630" fill="url(#bg)"/>
    <g transform="translate(450,300) scale(1.35)">${shadow(140, 240, 30)}${frame({ rim: 'url(#pTort)', stroke: '#3a2413', rw: 19 })}</g>` },
  'cat-sunglasses.jpg': { w: 900, h: 630, svg: `
    <rect width="900" height="630" fill="url(#bg)"/>
    <g transform="translate(450,300) scale(1.35)">${shadow(140, 240, 30)}${frame({ rim: 'url(#gGold)', stroke: '#8a6a1f', lens: 'url(#lGreen)', rw: 8, round: true })}</g>` },
  'cat-contacts.jpg': { w: 900, h: 630, svg: `
    <rect width="900" height="630" fill="url(#bg)"/>
    <g transform="translate(450,330)">
      ${shadow(150, 300, 36)}
      <ellipse cx="-150" cy="40" rx="150" ry="58" fill="#e9f2f7" stroke="#c9d8e2" stroke-width="3"/>
      <ellipse cx="-150" cy="28" rx="104" ry="42" fill="url(#lensCase)" stroke="rgba(150,185,205,0.7)" stroke-width="3"/>
      <ellipse cx="-178" cy="14" rx="34" ry="14" fill="rgba(255,255,255,0.95)"/>
      <ellipse cx="170" cy="10" rx="120" ry="120" fill="none" stroke="#bcd4e0" stroke-width="10"/>
      <ellipse cx="170" cy="10" rx="120" ry="120" fill="url(#lensCase)" opacity="0.55"/>
      <ellipse cx="128" cy="-34" rx="40" ry="18" fill="rgba(255,255,255,0.9)" transform="rotate(-24 128 -34)"/>
    </g>` },
}

mkdirSync(OUT, { recursive: true })
const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium' })
const page = await (await browser.newContext({ deviceScaleFactor: 1 })).newPage()
for (const [file, { w, h, svg }] of Object.entries(SCENES)) {
  await page.setViewportSize({ width: w, height: h })
  await page.setContent(`<!doctype html><body style="margin:0"><svg id="stage" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">${DEFS}${svg}</svg></body>`)
  await page.locator('#stage').screenshot({ path: `${OUT}/${file}`, type: 'jpeg', quality: 90 })
  console.log('✓', file)
}
await browser.close()
console.log('done →', OUT)
