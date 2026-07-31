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

// One border flood-fill pass at a given neighbour tolerance. Returns the
// background mask and the fraction of pixels kept (not background).
function floodPass(d, w, h, step2) {
  const N = w * h
  const bg = new Uint8Array(N)
  const stack = new Int32Array(N)
  let sp = 0
  const seedAt = (p) => { if (!bg[p]) { bg[p] = 1; stack[sp++] = p } }
  for (let x = 0; x < w; x++) { seedAt(x); seedAt((h - 1) * w + x) }
  for (let y = 0; y < h; y++) { seedAt(y * w); seedAt(y * w + (w - 1)) }
  while (sp) {
    const p = stack[--sp]
    const i = p * 4, r = d[i], g = d[i + 1], b = d[i + 2]
    const x = p % w, y = (p / w) | 0
    const test = (n) => { const j = n * 4; const dr = d[j] - r, dg = d[j + 1] - g, db = d[j + 2] - b; if (dr * dr + dg * dg + db * db < step2) { bg[n] = 1; stack[sp++] = n } }
    if (x > 0 && !bg[p - 1]) test(p - 1)
    if (x < w - 1 && !bg[p + 1]) test(p + 1)
    if (y > 0 && !bg[p - w]) test(p - w)
    if (y < h - 1 && !bg[p + w]) test(p + w)
  }
  let kept = 0
  for (let p = 0; p < N; p++) if (!bg[p]) kept++
  return { bg, keptFrac: kept / N }
}

/**
 * Remove a plain background.
 * @param src File | Blob | URL | HTMLImageElement
 * @param opts.tolerance 0..1 (default 0.14) — higher removes more
 * @param opts.auto true → ignore `tolerance` and self-tune it: start tight (so
 *        anti-aliased / JPEG-soft frame edges are not leaked through) and step
 *        up only while the background clearly isn't being removed.
 * @returns { dataUrl, width, height, coverage, symmetry, plainBg, usedTolerance }
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
  const MAXD = 441.673 // max RGB euclidean distance (255·√3)
  const N = w * h
  const distIdx = (p, r, g, b) => { const i = p * 4; const dr = d[i] - r, dg = d[i + 1] - g, db = d[i + 2] - b; return dr * dr + dg * dg + db * db }

  // ── Flood-fill / "magic wand" from the border ───────────────────────────────
  // Seed the border as background and grow inward; a neighbour joins only when
  // it's close to the pixel it grew from, so smooth gradients/shadows flood but
  // the fill stops at the frame's edge contrast. The per-step tolerance is the
  // critical knob: too high and the fill LEAKS through anti-aliased / JPEG-soft
  // edges and eats the product. In auto mode, climb a ladder from tight to
  // loose and stop at the first pass that plausibly separated the frame.
  let tol = Math.max(0.02, Math.min(0.6, opts.tolerance ?? 0.14))
  let pass
  if (opts.auto) {
    const ladder = [0.05, 0.08, 0.12, 0.16, 0.22, 0.3]
    let best = null
    for (const t of ladder) {
      const cand = floodPass(d, w, h, Math.max(12, t * MAXD * 0.6) ** 2)
      // plausible product cut-out: some of the image kept, most of it removed
      if (cand.keptFrac >= 0.02 && cand.keptFrac <= 0.8) { pass = cand; tol = t; break }
      // background not removed yet (kept almost everything) → loosen and retry;
      // remember the least-destructive failing pass as a fallback.
      if (!best || Math.abs(cand.keptFrac - 0.3) < Math.abs(best.pass.keptFrac - 0.3)) best = { pass: cand, t }
    }
    if (!pass) { pass = best.pass; tol = best.t }
  } else {
    pass = floodPass(d, w, h, Math.max(15, tol * MAXD * 0.6) ** 2)
  }
  const bg = pass.bg

  // Enclosed background (e.g. see-through lens interiors ringed by the frame,
  // which the border flood can't reach): clear remaining pixels that closely
  // match the sampled backdrop colour. Uses a floor so tight auto tolerances
  // still clear near-background lens interiors.
  const enc2 = (Math.max(tol, 0.12) * MAXD * 0.9) ** 2
  for (let p = 0; p < N; p++) if (!bg[p] && distIdx(p, border.color[0], border.color[1], border.color[2]) < enc2) bg[p] = 1

  // ── Far-colour rescue (plain backdrops only) ────────────────────────────────
  // JPEG chroma subsampling can blur a thin metal bridge / wire rim toward the
  // backdrop, letting the flood eat it. On a plain background, any pixel whose
  // colour is clearly NOT background cannot be background — un-flood it. (Busy
  // backdrops skip this: far colours there are usually genuine background.)
  if (border.stdev < 45) {
    const far2 = (0.34 * MAXD) ** 2
    for (let p = 0; p < N; p++) if (bg[p] && distIdx(p, border.color[0], border.color[1], border.color[2]) > far2) bg[p] = 0
  }

  // ── Morphological close (dilate → erode) on the KEEP mask ───────────────────
  // Thin structures — a metal bridge, nose pads, wire rims — are only a few px
  // wide and get nibbled by the flood/cleanup, leaving the two lenses visually
  // disconnected. Closing reconnects small gaps without growing the silhouette.
  const R = Math.max(2, Math.round(Math.min(w, h) / 300)) // ~3px at 900px
  // Separable min/max filter over a (2R+1)² square structuring element:
  // one horizontal + one vertical pass, O(N·R) instead of O(N·R²).
  const spread = (src, val) => { // propagate `val` to any pixel within R
    const tmp = new Uint8Array(N), out = new Uint8Array(N)
    for (let y = 0; y < h; y++) {
      const row = y * w
      for (let x = 0; x < w; x++) {
        let hit = 0
        for (let dx = -R; dx <= R; dx++) { const xx = x + dx; if (xx >= 0 && xx < w && src[row + xx] === val) { hit = 1; break } }
        tmp[row + x] = hit ? val : src[row + x]
      }
    }
    for (let x = 0; x < w; x++) {
      for (let y = 0; y < h; y++) {
        let hit = 0
        for (let dy = -R; dy <= R; dy++) { const yy = y + dy; if (yy >= 0 && yy < h && tmp[yy * w + x] === val) { hit = 1; break } }
        out[y * w + x] = hit ? val : tmp[y * w + x]
      }
    }
    return out
  }
  const closed = spread(spread(bg, 0), 1) // dilate keep(0), then erode (dilate bg)
  for (let p = 0; p < N; p++) bg[p] = closed[p]

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
    usedTolerance: tol,
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
