// Dependency-free background remover for try-on frame photos.
//
// Tuned for catalog product shots: a frame photographed on a plain / light /
// solid background. It estimates the background colour from the image border,
// removes every pixel within a tolerance of it (globally — so the see-through
// lens areas are cleared too, not just the outer border), feathers the edge,
// then crops to the frame. Complex real-world backgrounds won't be perfect —
// that's the documented trade-off of the no-dependency approach.
//
// Runs entirely in the browser on a <canvas>; nothing leaves the device.

const MAX_DIM = 1200 // downscale huge uploads before processing

// Load a File/Blob/URL/HTMLImageElement into an HTMLImageElement.
function toImage(src) {
  if (src instanceof HTMLImageElement) return Promise.resolve(src)
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('image load failed'))
    img.src = (src instanceof Blob) ? URL.createObjectURL(src) : src
  })
}

const dist2 = (r, g, b, c) => { const dr = r - c[0], dg = g - c[1], db = b - c[2]; return dr * dr + dg * dg + db * db }

// Estimate the background colour + how uniform it is, by sampling the border.
function sampleBackground(data, w, h) {
  const band = Math.max(2, Math.round(Math.min(w, h) * 0.04))
  let r = 0, g = 0, b = 0, n = 0
  const px = (x, y) => { const i = (y * w + x) * 4; r += data[i]; g += data[i + 1]; b += data[i + 2]; n++ }
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (x < band || x >= w - band || y < band || y >= h - band) px(x, y)
  }
  const mean = [r / n, g / n, b / n]
  // variance of the border → is the background actually plain?
  let v = 0, m = 0
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (x < band || x >= w - band || y < band || y >= h - band) { const i = (y * w + x) * 4; v += dist2(data[i], data[i + 1], data[i + 2], mean); m++ }
  }
  return { color: mean, stdev: Math.sqrt(v / m) }
}

/**
 * Remove a plain background.
 * @param src File | Blob | URL | HTMLImageElement
 * @param opts.tolerance 0..1 (default 0.14) — higher removes more
 * @returns { dataUrl, width, height, coverage, symmetry, plainBg }
 *   coverage  — opaque fraction after cut-out (very low = over-removed)
 *   symmetry  — 0..1 left/right alpha symmetry (low = likely an angled photo)
 *   plainBg   — whether the border looked like a plain background
 */
export async function removeBackground(src, opts = {}) {
  const img = await toImage(src)
  const scale = Math.min(1, MAX_DIM / Math.max(img.naturalWidth || img.width, img.naturalHeight || img.height))
  const w = Math.max(1, Math.round((img.naturalWidth || img.width) * scale))
  const h = Math.max(1, Math.round((img.naturalHeight || img.height) * scale))
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h
  const ctx = cv.getContext('2d', { willReadFrequently: true })
  ctx.drawImage(img, 0, 0, w, h)
  const imgData = ctx.getImageData(0, 0, w, h)
  const d = imgData.data

  const border = sampleBackground(d, w, h)
  const tol = Math.max(0.02, Math.min(0.6, opts.tolerance ?? 0.14))
  const MAXD = 441.673 // max RGB euclidean distance (255·√3)
  const N = w * h

  // ── Flood-fill / "magic wand" from the border ───────────────────────────────
  // A single average-colour key can't remove a gradient / shadowed / multi-tone
  // backdrop. Instead, seed the outer border as background and grow INWARD:
  // a neighbour joins the background only if it's close to the pixel it grew
  // from. Small local steps follow gradual colour change (gradients, soft
  // shadows) but stop at the sharp contrast of the frame edge.
  const bg = new Uint8Array(N)      // 1 = background
  const stack = new Int32Array(N)   // DFS stack of pixel indices
  let sp = 0
  const distIdx = (p, r, g, b) => { const i = p * 4; const dr = d[i] - r, dg = d[i + 1] - g, db = d[i + 2] - b; return dr * dr + dg * dg + db * db }
  const seedAt = (p) => { if (!bg[p]) { bg[p] = 1; stack[sp++] = p } }
  for (let x = 0; x < w; x++) { seedAt(x); seedAt((h - 1) * w + x) }         // top + bottom
  for (let y = 0; y < h; y++) { seedAt(y * w); seedAt(y * w + (w - 1)) }     // left + right

  const step2 = Math.max(15, tol * MAXD * 0.6) ** 2 // neighbour-to-neighbour tolerance
  while (sp) {
    const p = stack[--sp]
    const i = p * 4, r = d[i], g = d[i + 1], b = d[i + 2]
    const x = p % w, y = (p / w) | 0
    if (x > 0)     { const n = p - 1; if (!bg[n] && distIdx(n, r, g, b) < step2) { bg[n] = 1; stack[sp++] = n } }
    if (x < w - 1) { const n = p + 1; if (!bg[n] && distIdx(n, r, g, b) < step2) { bg[n] = 1; stack[sp++] = n } }
    if (y > 0)     { const n = p - w; if (!bg[n] && distIdx(n, r, g, b) < step2) { bg[n] = 1; stack[sp++] = n } }
    if (y < h - 1) { const n = p + w; if (!bg[n] && distIdx(n, r, g, b) < step2) { bg[n] = 1; stack[sp++] = n } }
  }

  // Enclosed background (e.g. see-through lens interiors ringed by the frame,
  // which the border flood can't reach): clear remaining pixels that closely
  // match the sampled backdrop colour.
  const enc2 = (tol * MAXD * 0.9) ** 2
  for (let p = 0; p < N; p++) if (!bg[p] && distIdx(p, border.color[0], border.color[1], border.color[2]) < enc2) bg[p] = 1

  // ── Feathered alpha (3×3 average of the keep-mask → 1px anti-aliased edge) ───
  let opaque = 0, minX = w, minY = h, maxX = 0, maxY = 0
  for (let p = 0; p < N; p++) {
    const x = p % w, y = (p / w) | 0
    let s = 0, c = 0
    for (let dy = -1; dy <= 1; dy++) { const yy = y + dy; if (yy < 0 || yy >= h) continue; for (let dx = -1; dx <= 1; dx++) { const xx = x + dx; if (xx < 0 || xx >= w) continue; s += bg[yy * w + xx] ? 0 : 1; c++ } }
    const a = Math.round(d[p * 4 + 3] * (s / c))
    d[p * 4 + 3] = a
    if (a > 24) { opaque++; if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y }
  }
  ctx.putImageData(imgData, 0, 0)

  const coverage = opaque / (w * h)
  // Crop to the frame (opaque bounding box) with a little padding.
  let outCv = cv, cw = w, ch = h
  if (maxX >= minX && maxY >= minY) {
    const pad = Math.round(Math.min(w, h) * 0.02)
    minX = Math.max(0, minX - pad); minY = Math.max(0, minY - pad)
    maxX = Math.min(w - 1, maxX + pad); maxY = Math.min(h - 1, maxY + pad)
    cw = maxX - minX + 1; ch = maxY - minY + 1
    outCv = document.createElement('canvas'); outCv.width = cw; outCv.height = ch
    outCv.getContext('2d').drawImage(cv, minX, minY, cw, ch, 0, 0, cw, ch)
  }

  return {
    dataUrl: outCv.toDataURL('image/png'),
    width: cw, height: ch,
    coverage,
    symmetry: alphaSymmetry(outCv),
    // Border variance: a gradient/shadow is fine (the flood-fill handles it) —
    // only flag a genuinely busy/multi-tone backdrop.
    plainBg: border.stdev < 45,
  }
}

// Left/right symmetry of the alpha mask (1 = perfectly symmetric). A front-on
// frame is highly symmetric; a strongly angled photo is not.
function alphaSymmetry(cv) {
  const w = cv.width, h = cv.height
  if (w < 4 || h < 4) return 1
  const d = cv.getContext('2d').getImageData(0, 0, w, h).data
  let same = 0, tot = 0
  const half = w >> 1
  for (let y = 0; y < h; y++) for (let x = 0; x < half; x++) {
    const a = d[(y * w + x) * 4 + 3] > 32 ? 1 : 0
    const b = d[(y * w + (w - 1 - x)) * 4 + 3] > 32 ? 1 : 0
    if (a || b) { tot++; if (a === b) same++ }
  }
  return tot ? same / tot : 1
}
