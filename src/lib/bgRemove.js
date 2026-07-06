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

  const bg = sampleBackground(d, w, h)
  const tol = Math.max(0.02, Math.min(0.6, opts.tolerance ?? 0.14))
  // work in squared-distance space; 255*sqrt(3) is the max RGB distance
  const t0 = (tol * 441.67) ** 2                 // fully transparent below this
  const t1 = ((tol * 441.67) * 1.7) ** 2         // fully opaque above this (feather between)

  let opaque = 0
  let minX = w, minY = h, maxX = 0, maxY = 0
  for (let i = 0, p = 0; i < d.length; i += 4, p++) {
    const ds = dist2(d[i], d[i + 1], d[i + 2], bg.color)
    let a = d[i + 3]
    if (ds <= t0) a = 0
    else if (ds < t1) a = Math.round(a * (ds - t0) / (t1 - t0))
    d[i + 3] = a
    if (a > 24) {
      opaque++
      const x = p % w, y = (p / w) | 0
      if (x < minX) minX = x; if (x > maxX) maxX = x
      if (y < minY) minY = y; if (y > maxY) maxY = y
    }
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
    plainBg: bg.stdev < 26, // low border variance → plain background
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
