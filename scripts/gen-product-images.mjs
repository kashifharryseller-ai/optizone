// Generate studio-style product images for the catalog (no network needed).
// Renders a parameterised SVG scene per product — acetate/tortoise textures,
// metallic rims, tinted lenses with reflections, soft studio shadow — in
// headless Chromium, and writes JPEGs to public/products/.
//
//   node scripts/gen-product-images.mjs
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const OUT = 'public/products'
const W = 1200, H = 900

// ── materials ────────────────────────────────────────────────────────────────
const MAT = {
  black:   { fill: 'url(#gBlack)',  stroke: '#0c0c0e' },
  havana:  { fill: 'url(#pTort)',   stroke: '#3a2413' },
  gold:    { fill: 'url(#gGold)',   stroke: '#8a6a1f' },
  silver:  { fill: 'url(#gSilver)', stroke: '#77797e' },
  print:   { fill: 'url(#pTort)',   stroke: '#4a2a14' },
  tiffany: { fill: 'url(#gSilver)', stroke: '#7b8f8a' },
}

// lens tints
const TINT = {
  clear: { fill: 'rgba(210,225,235,0.16)', grad: 'url(#lClear)' },
  green: { fill: 'rgba(28,60,45,0.85)', grad: 'url(#lGreen)' },
  brown: { fill: 'rgba(70,45,20,0.8)', grad: 'url(#lBrown)' },
  dark:  { fill: 'rgba(15,15,18,0.88)', grad: 'url(#lDark)' },
}

// ── lens shapes (front view, one lens; mirrored for the right side) ──────────
// each returns an SVG path for a lens centred at (cx,cy), half-width a, half-height b
const SHAPES = {
  round: (cx, cy, a, b) => `M ${cx - a} ${cy} a ${a} ${b} 0 1 0 ${a * 2} 0 a ${a} ${b} 0 1 0 ${-a * 2} 0 Z`,
  square: (cx, cy, a, b) => {
    const r = Math.min(a, b) * 0.52
    return `M ${cx - a + r} ${cy - b} h ${2 * a - 2 * r} q ${r} 0 ${r} ${r} v ${2 * b - 2 * r} q 0 ${r} ${-r} ${r} h ${-(2 * a - 2 * r)} q ${-r} 0 ${-r} ${-r} v ${-(2 * b - 2 * r)} q 0 ${-r} ${r} ${-r} Z`
  },
  oval: (cx, cy, a, b) => `M ${cx - a} ${cy} a ${a} ${b * 0.86} 0 1 0 ${a * 2} 0 a ${a} ${b * 0.86} 0 1 0 ${-a * 2} 0 Z`,
  cateye: (cx, cy, a, b, sideSign) => {
    // pronounced upswept outer "flick"; sideSign −1 = left lens (outer = left)
    const u = sideSign
    return `M ${cx - u * a * 0.8} ${cy - b * 0.7}
            C ${cx + u * a * 0.1} ${cy - b * 1.05}, ${cx + u * a * 0.7} ${cy - b * 1.45}, ${cx + u * a * 1.04} ${cy - b * 1.1}
            C ${cx + u * a * 1.16} ${cy - b * 0.62}, ${cx + u * a * 1.02} ${cy + b * 0.22}, ${cx + u * a * 0.8} ${cy + b * 0.6}
            C ${cx + u * a * 0.52} ${cy + b * 1.05}, ${cx - u * a * 0.3} ${cy + b * 1.1}, ${cx - u * a * 0.72} ${cy + b * 0.8}
            C ${cx - u * a * 1.06} ${cy + b * 0.5}, ${cx - u * a * 1.02} ${cy - b * 0.32}, ${cx - u * a * 0.8} ${cy - b * 0.7} Z`
  },
  aviator: (cx, cy, a, b, sideSign) => {
    const o = sideSign
    return `M ${cx - o * a * 0.95} ${cy - b * 0.62}
            C ${cx - o * a * 0.6} ${cy - b * 1.12}, ${cx + o * a * 0.5} ${cy - b * 1.1}, ${cx + o * a * 0.92} ${cy - b * 0.55}
            C ${cx + o * a * 1.08} ${cy - b * 0.25}, ${cx + o * a * 1.02} ${cy + b * 0.25}, ${cx + o * a * 0.7} ${cy + b * 0.68}
            C ${cx + o * a * 0.35} ${cy + b * 1.12}, ${cx - o * a * 0.4} ${cy + b * 1.15}, ${cx - o * a * 0.78} ${cy + b * 0.6}
            C ${cx - o * a * 1.0} ${cy + b * 0.25}, ${cx - o * a * 1.04} ${cy - b * 0.2}, ${cx - o * a * 0.95} ${cy - b * 0.62} Z`
  },
}

function lensPair(shape, cx1, cx2, cy, a, b) {
  if (shape === 'shield') {
    // one continuous wrap lens
    return [`M ${cx1 - a} ${cy - b * 0.6}
             C ${cx1 - a * 0.5} ${cy - b * 1.25}, ${cx2 + a * 0.5} ${cy - b * 1.25}, ${cx2 + a} ${cy - b * 0.6}
             C ${cx2 + a * 1.1} ${cy - b * 0.1}, ${cx2 + a * 0.9} ${cy + b * 0.75}, ${cx2 + a * 0.45} ${cy + b * 0.95}
             C ${(cx1 + cx2) / 2 + a * 0.2} ${cy + b * 1.18}, ${(cx1 + cx2) / 2 - a * 0.2} ${cy + b * 1.18}, ${cx1 - a * 0.45} ${cy + b * 0.95}
             C ${cx1 - a * 0.9} ${cy + b * 0.75}, ${cx1 - a * 1.1} ${cy - b * 0.1}, ${cx1 - a} ${cy - b * 0.6} Z`]
  }
  const fn = SHAPES[shape] || SHAPES.square
  return [fn(cx1, cy, a, b, -1), fn(cx2, cy, a, b, 1)]
}

// ── the scene ────────────────────────────────────────────────────────────────
function svgFor(cfg) {
  const cy = H * 0.47
  const a = cfg.lensW ?? 205, b = cfg.lensH ?? (a * 0.78)
  const gap = cfg.bridgeGap ?? 120
  const cx1 = W / 2 - gap / 2 - a, cx2 = W / 2 + gap / 2 + a
  const rim = MAT[cfg.material] || MAT.black
  const tint = TINT[cfg.tint] || TINT.clear
  const rw = cfg.rimW ?? (cfg.metal ? 7 : 20)
  const [L, R] = lensPair(cfg.shape, cx1, cx2, cy, a, b)
  const single = !R

  // bridge
  const bridgeY = cy - b * (cfg.shape === 'aviator' ? 0.45 : 0.35)
  const doubleBridge = cfg.shape === 'aviator' || cfg.doubleBridge

  // temples (folded back, tips peeking outward)
  const tmpl = `
    <path d="M ${cx1 - a - rw * 0.4} ${cy - b * 0.42} l -66 -12 q -16 -3 -15 12 l 2 26 q 1 12 14 10 l 65 -14 Z" fill="${rim.fill}" stroke="${rim.stroke}" stroke-width="2"/>
    <path d="M ${cx2 + a + rw * 0.4} ${cy - b * 0.42} l 66 -12 q 16 -3 15 12 l -2 26 q -1 12 -14 10 l -65 -14 Z" fill="${rim.fill}" stroke="${rim.stroke}" stroke-width="2"/>`

  const lens = (d) => `
    <path d="${d}" fill="${tint.fill}"/>
    <path d="${d}" fill="${tint.grad}"/>
    <path d="${d}" fill="none" stroke="${rim.fill}" stroke-width="${rw}" stroke-linejoin="round"/>
    <path d="${d}" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="1.5" transform="translate(0,-${rw * 0.34})"/>`

  const accents = cfg.accent === 'tiffanyTip'
    ? `<circle cx="${cx1 - a - 60}" cy="${cy - b * 0.5}" r="9" fill="#7fd6c9"/><circle cx="${cx2 + a + 60}" cy="${cy - b * 0.5}" r="9" fill="#7fd6c9"/>`
    : cfg.accent === 'goldMedusa'
      ? `<circle cx="${cx1 - a - 52}" cy="${cy - b * 0.46}" r="12" fill="url(#gGold)" stroke="#8a6a1f"/><circle cx="${cx2 + a + 52}" cy="${cy - b * 0.46}" r="12" fill="url(#gGold)" stroke="#8a6a1f"/>`
      : ''

  return `<!doctype html><meta charset="utf-8"><body style="margin:0">
  <svg id="stage" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="bg" cx="50%" cy="38%" r="80%">
        <stop offset="0%" stop-color="#fdfdfc"/><stop offset="55%" stop-color="#f2f0ec"/><stop offset="100%" stop-color="#e2dfd8"/>
      </radialGradient>
      <linearGradient id="gBlack" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#3c3c40"/><stop offset="35%" stop-color="#151517"/><stop offset="100%" stop-color="#232326"/>
      </linearGradient>
      <linearGradient id="gGold" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#f4dfa0"/><stop offset="45%" stop-color="#caa74e"/><stop offset="100%" stop-color="#a07f2c"/>
      </linearGradient>
      <linearGradient id="gSilver" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#eceef0"/><stop offset="50%" stop-color="#b9bcc2"/><stop offset="100%" stop-color="#8e9298"/>
      </linearGradient>
      <linearGradient id="lClear" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="rgba(255,255,255,0.5)"/><stop offset="35%" stop-color="rgba(255,255,255,0.06)"/><stop offset="100%" stop-color="rgba(160,180,195,0.14)"/>
      </linearGradient>
      <linearGradient id="lGreen" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="rgba(120,160,140,0.55)"/><stop offset="100%" stop-color="rgba(8,25,18,0.9)"/>
      </linearGradient>
      <linearGradient id="lBrown" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="rgba(190,140,80,0.5)"/><stop offset="100%" stop-color="rgba(40,22,8,0.9)"/>
      </linearGradient>
      <linearGradient id="lDark" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="rgba(90,95,105,0.5)"/><stop offset="100%" stop-color="rgba(5,5,8,0.92)"/>
      </linearGradient>
      <pattern id="pTort" width="90" height="70" patternUnits="userSpaceOnUse" patternTransform="rotate(18)">
        <rect width="90" height="70" fill="#5a3517"/>
        <ellipse cx="20" cy="18" rx="24" ry="16" fill="#2b1608" opacity="0.85"/>
        <ellipse cx="66" cy="44" rx="26" ry="18" fill="#241105" opacity="0.8"/>
        <ellipse cx="48" cy="10" rx="14" ry="9" fill="#7a4a1e" opacity="0.7"/>
        <ellipse cx="8" cy="52" rx="16" ry="11" fill="#84552a" opacity="0.55"/>
      </pattern>
      <filter id="soft" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="14"/></filter>
      <filter id="softer" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="26"/></filter>
    </defs>

    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    <!-- ground shadow -->
    <ellipse cx="${W / 2}" cy="${cy + b * 1.55}" rx="${a * 2.35}" ry="${b * 0.34}" fill="rgba(30,28,24,0.28)" filter="url(#softer)"/>

    ${tmpl}

    ${single ? lens(L) : lens(L) + lens(R)}

    <!-- bridge -->
    ${single ? '' : (doubleBridge
      ? `<path d="M ${cx1 + a * 0.72} ${bridgeY} C ${W / 2 - 20} ${bridgeY - 26}, ${W / 2 + 20} ${bridgeY - 26}, ${cx2 - a * 0.72} ${bridgeY}" fill="none" stroke="${rim.fill}" stroke-width="${Math.max(6, rw * 0.5)}"/>
         <path d="M ${cx1 + a * 0.8} ${bridgeY + 26} L ${cx2 - a * 0.8} ${bridgeY + 26}" fill="none" stroke="${rim.fill}" stroke-width="${Math.max(5, rw * 0.4)}"/>`
      : `<path d="M ${cx1 + a * 0.88} ${bridgeY} C ${W / 2 - 14} ${bridgeY - 18}, ${W / 2 + 14} ${bridgeY - 18}, ${cx2 - a * 0.88} ${bridgeY}" fill="none" stroke="${rim.fill}" stroke-width="${Math.max(16, rw * 1.15)}" stroke-linecap="round"/>`)}

    <!-- nose pads for metal frames -->
    ${cfg.metal && !single ? `<path d="M ${W / 2 - 34} ${cy + 6} q -12 22 -2 34" stroke="${rim.stroke}" stroke-width="5" fill="none" opacity="0.8"/><path d="M ${W / 2 + 34} ${cy + 6} q 12 22 2 34" stroke="${rim.stroke}" stroke-width="5" fill="none" opacity="0.8"/>` : ''}

    ${accents}

    <!-- glass reflections -->
    <g filter="url(#soft)" opacity="0.5">
      <path d="M ${cx1 - a * 0.55} ${cy - b * 0.7} q ${a * 0.5} ${-b * 0.28} ${a * 1.05} 0 l ${-a * 0.16} ${b * 0.42} q ${-a * 0.42} ${-b * 0.2} ${-a * 0.78} 0 Z" fill="#fff"/>
      <path d="M ${cx2 - a * 0.4} ${cy - b * 0.72} q ${a * 0.45} ${-b * 0.25} ${a * 0.95} 0 l ${-a * 0.15} ${b * 0.4} q ${-a * 0.4} ${-b * 0.18} ${-a * 0.7} 0 Z" fill="#fff"/>
    </g>
  </svg>
  </body>`
}

// contacts: a clean product box + lens blister render
function svgBox(cfg) {
  return `<!doctype html><meta charset="utf-8"><body style="margin:0">
  <svg id="stage" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="bg" cx="50%" cy="38%" r="80%">
        <stop offset="0%" stop-color="#fdfdfc"/><stop offset="55%" stop-color="#f1f0ee"/><stop offset="100%" stop-color="#e0ddd8"/>
      </radialGradient>
      <linearGradient id="boxTop" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ffffff"/><stop offset="100%" stop-color="#eef1f4"/></linearGradient>
      <linearGradient id="band" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="${cfg.c1}"/><stop offset="100%" stop-color="${cfg.c2}"/></linearGradient>
      <radialGradient id="lens" cx="50%" cy="42%" r="60%"><stop offset="0%" stop-color="rgba(255,255,255,0.95)"/><stop offset="70%" stop-color="rgba(190,220,235,0.5)"/><stop offset="100%" stop-color="rgba(140,180,205,0.35)"/></radialGradient>
      <filter id="softer" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="24"/></filter>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    <ellipse cx="${W / 2}" cy="700" rx="430" ry="60" fill="rgba(30,28,24,0.25)" filter="url(#softer)"/>
    <!-- box (slight 3D) -->
    <g transform="translate(${W / 2 - 290},260)">
      <polygon points="0,60 60,0 580,0 520,60" fill="#f6f8fa" stroke="#d8dce0"/>
      <polygon points="520,60 580,0 580,320 520,380" fill="#dde2e8" stroke="#ccd1d6"/>
      <rect x="0" y="60" width="520" height="320" fill="url(#boxTop)" stroke="#d8dce0"/>
      <rect x="0" y="60" width="520" height="96" fill="url(#band)"/>
      <text x="28" y="122" font-family="Georgia, serif" font-size="44" font-weight="bold" fill="#fff">${cfg.brand}</text>
      <text x="28" y="216" font-family="Georgia, serif" font-size="34" fill="#2c3540">${cfg.name}</text>
      <text x="28" y="262" font-family="Georgia, serif" font-size="24" fill="#66707c">${cfg.sub}</text>
      <text x="28" y="352" font-family="Georgia, serif" font-size="22" fill="#8a94a0">${cfg.count}</text>
    </g>
    <!-- lens blister -->
    <g transform="translate(${W / 2 + 190},560)">
      <ellipse cx="0" cy="26" rx="150" ry="34" fill="rgba(30,28,24,0.18)" filter="url(#softer)"/>
      <ellipse cx="0" cy="0" rx="140" ry="56" fill="#e9f2f7" stroke="#c9d8e2"/>
      <ellipse cx="0" cy="-8" rx="96" ry="38" fill="url(#lens)" stroke="rgba(150,185,205,0.6)"/>
      <ellipse cx="-26" cy="-18" rx="30" ry="12" fill="rgba(255,255,255,0.9)"/>
    </g>
  </svg></body>`
}

const PRODUCTS = [
  { id: 1, file: 'rayban-rb3447-round.jpg', kind: 'glasses', cfg: { shape: 'round', material: 'gold', metal: true, rimW: 8, tint: 'clear', lensW: 190, lensH: 165, bridgeGap: 105 } },
  { id: 2, file: 'persol-po3092-havana.jpg', kind: 'glasses', cfg: { shape: 'square', material: 'havana', tint: 'clear', lensW: 210, lensH: 138 } },
  { id: 3, file: 'prada-17ws-cateye.jpg', kind: 'glasses', cfg: { shape: 'cateye', material: 'black', tint: 'clear', lensW: 200, lensH: 122 } },
  { id: 4, file: 'tiffany-tf2233b-oval.jpg', kind: 'glasses', cfg: { shape: 'oval', material: 'tiffany', metal: true, rimW: 7, tint: 'clear', lensW: 185, lensH: 140, accent: 'tiffanyTip' } },
  { id: 5, file: 'versace-ve4361-square.jpg', kind: 'glasses', cfg: { shape: 'square', material: 'black', tint: 'clear', lensW: 208, lensH: 142, accent: 'goldMedusa' } },
  { id: 6, file: 'dg-dg4416-round.jpg', kind: 'glasses', cfg: { shape: 'round', material: 'print', tint: 'clear', lensW: 190, lensH: 165, rimW: 22 } },
  { id: 7, file: 'rayban-rb3025-aviator.jpg', kind: 'glasses', cfg: { shape: 'aviator', material: 'gold', metal: true, rimW: 7, tint: 'green', lensW: 200, lensH: 170, bridgeGap: 95 } },
  { id: 8, file: 'persol-po0714-fold.jpg', kind: 'glasses', cfg: { shape: 'square', material: 'havana', tint: 'brown', lensW: 204, lensH: 145 } },
  { id: 9, file: 'versace-ve2199-shield.jpg', kind: 'glasses', cfg: { shape: 'shield', material: 'black', tint: 'dark', lensW: 205, lensH: 150, bridgeGap: 90 } },
  { id: 10, file: 'acuvue-oasys-box.jpg', kind: 'box', cfg: { brand: 'ACUVUE', name: 'Oasys with Hydraclear Plus', sub: 'Bi-weekly silicone hydrogel', count: '6 lenses', c1: '#0b7fb8', c2: '#15a7d8' } },
  { id: 11, file: 'dailies-total1-box.jpg', kind: 'box', cfg: { brand: 'DAILIES', name: 'TOTAL1 Water Gradient', sub: 'Daily disposable', count: '30 lenses', c1: '#0e8a4d', c2: '#28b06a' } },
  { id: 12, file: 'biofinity-monthly-box.jpg', kind: 'box', cfg: { brand: 'Biofinity', name: 'Comfilcon A Monthly', sub: 'Monthly silicone hydrogel', count: '6 lenses', c1: '#2b5ea7', c2: '#3f83d2' } },
]

mkdirSync(OUT, { recursive: true })
const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium' })
const page = await (await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 })).newPage()
for (const p of PRODUCTS) {
  await page.setContent(p.kind === 'box' ? svgBox(p.cfg) : svgFor(p.cfg), { waitUntil: 'networkidle' })
  await page.locator('#stage').screenshot({ path: `${OUT}/${p.file}`, type: 'jpeg', quality: 90 })
  console.log('✓', p.file)
}
await browser.close()
console.log('done →', OUT)
