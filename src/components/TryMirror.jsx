import React, { useEffect, useRef, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Button, Icon, IconButton } from '../ds/index.js'
import { useFaceLandmarker } from './useFaceLandmarker.js'
import { resolveTryonAsset } from './tryon/config.js'
import { removeBackground } from '../lib/bgRemove.js'
// GlassesEngine (and its Three.js dependency) is loaded on demand — only when a
// product actually has a 3D model — so it never weighs down the storefront bundle.
let _EnginePromise = null
const loadEngine = () => (_EnginePromise ||= import('./tryon/GlassesEngine.js').then((m) => m.GlassesEngine))

// Auto-apply: when a product has no dedicated try-on asset, derive a transparent
// frame from its own product photo (background removed), cached per image URL.
// Only accept a plausible cut-out — a busy/failed removal keeps '' → vector.
const autoCache = new Map()
async function autoDeriveFrame(url) {
  if (!url) return ''
  if (autoCache.has(url)) return autoCache.get(url)
  let out = ''
  try { const r = await removeBackground(url, { auto: true }); if (r && r.coverage > 0.015 && r.coverage < 0.75) out = r.dataUrl } catch { /* → vector */ }
  autoCache.set(url, out)
  return out
}

/**
 * TryMirror — per-product virtual try-on with three input modes:
 *   1) Live camera   2) Upload photo   3) Upload video
 *
 * All processing is in-browser (MediaPipe Face Landmarker, no key, no upload).
 * The overlay follows a per-colour fallback chain (see TRYON_NOTES.md):
 *   1) a real 3D frame model (GlassesEngine / product.tryMirrorModel), else
 *   2) a transparent-PNG frame (product.tryMirrorImg), else
 *   3) a drawn vector rendition from the product's shape + colours.
 * The chosen frame size persists to the cart as a custom size.
 *
 * Props:
 *   open, onClose        modal visibility
 *   product              the opened product (id, brand, name, shape, colors…)
 *   frameAsset           optional legacy single-PNG override (string)
 *   strings              i18n bundle (root.product)
 *   onAddToCart(pct)     called with e.g. "110%" — persisted as line customSize
 */

const BASE_MULT = 2.15    // frame width ≈ 2.15 × outer-eye distance (see asset notes)
const EMA_ALPHA = 0.5     // landmark smoothing factor for live/video (0..1)
const MAX_IMG = 1600      // downscale uploaded photos to this max dimension

// Head pose (yaw/pitch/roll) from MediaPipe's 4×4 column-major transform matrix.
function headAngles(mat) {
  if (!mat) return { yaw: 0, pitch: 0 }
  const m = mat.data || mat
  const r00 = m[0], r10 = m[1], r20 = m[2], r21 = m[6], r22 = m[10]
  const sy = Math.hypot(r00, r10)
  return { pitch: Math.atan2(r21, r22), yaw: Math.atan2(-r20, sy) }
}

const ema = (prev, cur, a) => (prev == null ? cur : { x: prev.x + a * (cur.x - prev.x), y: prev.y + a * (cur.y - prev.y) })

// Vector fallback style (only when a product has no transparent-PNG asset yet).
function vectorStyle(product, color) {
  const shape = String(product?.shape || '').toLowerCase()
  if (shape.includes('aviator')) return { stroke: color || '#b8862f', lw: 0.05, rx: 0.30, ry: 0.25, tint: 'rgba(120,90,30,0.16)' }
  if (shape.includes('round') || shape.includes('oval')) return { stroke: color || '#2b2b2b', lw: 0.055, rx: 0.26, ry: 0.26, tint: 'rgba(20,20,25,0.10)' }
  return { stroke: color || '#141414', lw: 0.075, rx: 0.31, ry: 0.23, tint: null }
}
function drawVector(ctx, landmarks, W, H, st, scale) {
  const P = (i) => ({ x: landmarks[i].x * W, y: landmarks[i].y * H })
  if (!landmarks[33] || !landmarks[263]) return
  const rO = P(33), lO = P(263), rIn = P(133) || rO, lIn = P(362) || lO, rEar = P(234) || rO, lEar = P(454) || lO
  const rEye = { x: (rO.x + rIn.x) / 2, y: (rO.y + rIn.y) / 2 }
  const lEye = { x: (lO.x + lIn.x) / 2, y: (lO.y + lIn.y) / 2 }
  const span = Math.hypot(lO.x - rO.x, lO.y - rO.y)
  const ang = Math.atan2(lO.y - rO.y, lO.x - rO.x)
  const ux = Math.cos(ang), uy = Math.sin(ang)
  const rx = span * st.rx * scale, ry = span * st.ry * scale, lw = Math.max(1.5, span * st.lw * scale)
  ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.strokeStyle = st.stroke; ctx.lineWidth = lw
  for (const c of [rEye, lEye]) { ctx.beginPath(); ctx.ellipse(c.x, c.y, rx, ry, ang, 0, Math.PI * 2); if (st.tint) { ctx.fillStyle = st.tint; ctx.fill() } ctx.stroke() }
  ctx.beginPath(); ctx.moveTo(rEye.x + ux * rx, rEye.y + uy * rx); ctx.lineTo(lEye.x - ux * rx, lEye.y - uy * rx); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(rEye.x - ux * rx, rEye.y - uy * rx); ctx.lineTo(rEar.x, rEar.y); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(lEye.x + ux * rx, lEye.y + uy * rx); ctx.lineTo(lEar.x, lEar.y); ctx.stroke()
  ctx.restore()
}

// PNG overlay: centre on nose-bridge (168), rotate to eye tilt, scale by eye
// distance × BASE_MULT × userSize, wrap with a yaw perspective squeeze.
function drawPng(ctx, img, p33, p263, p168, mat, scale) {
  const dx = p263.x - p33.x, dy = p263.y - p33.y
  const eyeDist = Math.hypot(dx, dy)
  const roll = Math.atan2(dy, dx)
  const { yaw, pitch } = headAngles(mat)
  const width = eyeDist * BASE_MULT * scale
  const height = width * (img.naturalHeight / img.naturalWidth || 0.4)
  const squeeze = Math.max(0.45, Math.cos(yaw))         // narrows as the head turns
  const yawShift = Math.sin(yaw) * eyeDist * 0.15        // frame follows the nose
  const pitchShift = Math.sin(pitch) * eyeDist * 0.12
  ctx.save()
  ctx.translate(p168.x + yawShift, p168.y + pitchShift)
  ctx.rotate(roll)
  ctx.scale(squeeze, 1)
  ctx.drawImage(img, -width / 2, -height * 0.5, width, height)
  ctx.restore()
}

const MODES = [
  { key: 'live', icon: 'camera', label: 'modeLive' },
  { key: 'photo', icon: 'user', label: 'modePhoto' },
  { key: 'video', icon: 'smartphone', label: 'modeVideo' },
]

export function TryMirror({ open, onClose, product, catalog = [], frameAsset, strings, onAddToCart }) {
  const t = strings
  // The product currently being tried on — starts as the opened product, but the
  // in-mirror carousel can switch it to any other frame without leaving the modal.
  const [active, setActive] = useState(product || {})
  const p = active

  const { status, get: getEngine, setRunningMode, retry } = useFaceLandmarker(open)

  const [mode, setMode] = useState('live')
  const [size, setSize] = useState(1)
  const [colorIdx, setColorIdx] = useState(0)
  const [err, setErr] = useState('')
  const [hasFace, setHasFace] = useState(true)
  const [sourceLoaded, setSourceLoaded] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)

  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const photoInputRef = useRef(null)
  const videoInputRef = useRef(null)
  const frameRef = useRef(null)          // loaded 2D PNG Image (or null)
  const engineRef = useRef(null)         // lazily-created 3D GlassesEngine (or null)
  const modelUrlRef = useRef('')         // active colour's 3D model URL (resolved; for the vector gate)
  const pngUrlRef = useRef('')           // active colour's 2D PNG URL (resolved; for the vector gate)
  const contentUrlRef = useRef('')       // URL the engine is currently showing (model or plane); '' if none/failed
  const metaRef = useRef({})             // active colour's tryMirrorMeta
  const paintRef = useRef(null)          // latest paint() (avoids hook ordering)
  const sourceRef = useRef(null)         // current drawable: <video> or <img>
  const photoDetRef = useRef(null)       // { l, mat } for the static photo
  const smoothRef = useRef({})
  const rafRef = useRef(null)
  const runningRef = useRef(false)
  const streamRef = useRef(null)
  const objUrlRef = useRef(null)
  const lastTsRef = useRef(0)
  const openRef = useRef(open)
  const sizeRef = useRef(1); sizeRef.current = size
  const colorRef = useRef(0); colorRef.current = colorIdx
  const faceRef = useRef(true)

  const sizePct = `${Math.round(size * 100)}%`
  useEffect(() => { openRef.current = open }, [open])
  // Reset to the opened product each time the modal (re)opens for a new product.
  useEffect(() => { if (open) { setActive(product || {}); setColorIdx(0); setSize(1) } }, [open, product])
  // Carousel: switch the tried-on frame in place (reset colour to the new frame).
  const switchProduct = (prod) => { setActive(prod); setColorIdx(0) }

  const setFace = (v) => { if (faceRef.current !== v) { faceRef.current = v; setHasFace(v) } }
  const smoothReset = () => { smoothRef.current = {} }
  const prepCanvas = (w, h) => { const c = canvasRef.current; if (c) { c.width = w; c.height = h } }

  // Resolve + load the selected colour's try-on assets (fallback chain:
  // 3D model → 2D PNG → drawn vector). Runs on open and on every colour change.
  const colorHex = (p.colors || [])[colorIdx]
  // Legacy `frameAsset` (a single PNG URL) still works as an all-colours override.
  const legacy = typeof frameAsset === 'string' && frameAsset ? { ...p, tryMirrorImg: frameAsset } : p
  const { model: modelUrl, png: resolvedPng, meta } = resolveTryonAsset(legacy, colorHex)
  const productImg = p.image || ''
  useEffect(() => {
    if (!open) return
    let alive = true
    metaRef.current = meta
    contentUrlRef.current = ''
    frameRef.current = null
    const giveUp = () => { if (alive) { contentUrlRef.current = ''; repaintPhoto() } }
    const ok = (url) => { if (alive) { contentUrlRef.current = url; repaintPhoto() } }
    ;(async () => {
      // Fallback chain of SOURCES: explicit PNG → auto-cut product photo.
      let pngUrl = resolvedPng
      if (!modelUrl && !pngUrl && productImg) pngUrl = await autoDeriveFrame(productImg)
      if (!alive) return
      // Record what this frame HAS up front (paint's vector gate reads these).
      pngUrlRef.current = pngUrl
      modelUrlRef.current = modelUrl
      // Flat <img> decode — the WebGL-unavailable fallback.
      if (pngUrl) {
        const img = new Image(); img.crossOrigin = 'anonymous'
        img.onload = () => { if (alive) { frameRef.current = img; repaintPhoto() } }
        img.onerror = () => { if (alive && frameRef.current === img) { frameRef.current = null } }
        img.src = pngUrl
      }
      // Mount 3D content (lazy WebGL): .glb model → PNG on a tracked plane. On
      // failure clear contentUrl so paint falls back to the flat PNG / vector.
      const contentUrl = modelUrl || pngUrl
      if (!contentUrl) { repaintPhoto(); return }
      let GlassesEngine
      try { GlassesEngine = await loadEngine() } catch (e) { console.warn('[tryon] engine load failed, using 2D overlay:', e?.message || e); giveUp(); return }
      if (!alive) return
      if (!engineRef.current) { try { engineRef.current = new GlassesEngine(640, 480) } catch (e) { console.warn('[tryon] WebGL unavailable, using 2D overlay:', e?.message || e); giveUp(); return } }
      const eng = engineRef.current
      const tryPlane = () => (pngUrl ? eng.setPlane(pngUrl).then((y) => (y ? ok(pngUrl) : giveUp())) : giveUp())
      if (modelUrl) await eng.setModel(modelUrl).then((y) => (y ? ok(modelUrl) : tryPlane()))
      else await tryPlane()
    })()
    return () => { alive = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, modelUrl, resolvedPng, productImg, p.id])

  // Repaint the static photo (live/video redraw themselves each frame).
  const repaintPhoto = useCallback(() => {
    if (photoDetRef.current && sourceRef.current) {
      const { l, mat } = photoDetRef.current
      paintRef.current && paintRef.current(l, mat, { smooth: false, detActive: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── shared paint ───────────────────────────────────────────────────────────
  const paint = useCallback((landmarks, mat, { smooth, detActive }) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width, H = canvas.height
    ctx.clearRect(0, 0, W, H)
    if (sourceRef.current) { try { ctx.drawImage(sourceRef.current, 0, 0, W, H) } catch { /* not ready */ } }
    if (detActive) setFace(!!landmarks)
    const frameImg = frameRef.current
    const engine = engineRef.current
    // 3D content ready = either a .glb model OR a transparent PNG on a plane.
    const contentReady = engine && contentUrlRef.current && engine.hasContent(contentUrlRef.current)
    // On a dropped-detection frame, let the 3D engine hold/fade the last pose
    // (its faceHoldFrames logic) instead of instantly flickering off.
    if (!landmarks) {
      if (contentReady) { engine.resize(W, H); engine.update(null, metaRef.current, sizeRef.current, false); try { ctx.drawImage(engine.render(), 0, 0, W, H) } catch { /* gl not ready */ } }
      return
    }
    // Fallback chain: 3D-tracked content (model or planar PNG) → flat PNG (only
    // if WebGL is unavailable) → drawn vector. The vector tier keys off whether
    // the product HAS assets (refs), so it never flashes over a loading asset.
    if (contentReady && landmarks[33] && landmarks[263]) {
      // The 2D canvas is CSS-mirrored for Live; render the scene in video space
      // and let that single CSS flip apply — so pass mirrored=false here.
      engine.resize(W, H)
      engine.update(landmarks, metaRef.current, sizeRef.current, false)
      try { ctx.drawImage(engine.render(), 0, 0, W, H) } catch { /* gl not ready */ }
    } else if (frameImg && landmarks[33] && landmarks[263] && landmarks[168]) {
      let a = { x: landmarks[33].x * W, y: landmarks[33].y * H }
      let b = { x: landmarks[263].x * W, y: landmarks[263].y * H }
      let n = { x: landmarks[168].x * W, y: landmarks[168].y * H }
      if (smooth) { const s = smoothRef.current; a = s.a = ema(s.a, a, EMA_ALPHA); b = s.b = ema(s.b, b, EMA_ALPHA); n = s.n = ema(s.n, n, EMA_ALPHA) }
      drawPng(ctx, frameImg, a, b, n, mat, sizeRef.current)
    } else if (!pngUrlRef.current && !modelUrlRef.current) {
      // Last resort only — the product has no 3D and no 2D asset for this colour.
      drawVector(ctx, landmarks, W, H, vectorStyle(p, (p.colors || [])[colorRef.current]), sizeRef.current)
    }
  }, [p])
  paintRef.current = paint

  // ── loop control ───────────────────────────────────────────────────────────
  const stopLoops = useCallback(() => {
    runningRef.current = false
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    if (streamRef.current) { streamRef.current.getTracks().forEach((tr) => tr.stop()); streamRef.current = null }
    const v = videoRef.current
    if (v) { try { v.pause() } catch { /* noop */ } }
  }, [])

  const runVideoLoop = useCallback(() => {
    runningRef.current = true
    const video = videoRef.current
    const loop = () => {
      if (!runningRef.current) return
      const lm = getEngine()
      if (video && video.readyState >= 2) {
        if (lm) {
          setRunningMode('VIDEO')
          let ts = performance.now(); if (ts <= lastTsRef.current) ts = lastTsRef.current + 1; lastTsRef.current = ts
          let res = null
          try { res = lm.detectForVideo(video, ts) } catch { /* wrong mode during switch */ }
          paint(res?.faceLandmarks?.[0] || null, res?.facialTransformationMatrixes?.[0] || null, { smooth: true, detActive: true })
        } else {
          paint(null, null, { smooth: true, detActive: false })  // draw frame, model still loading
        }
      }
      rafRef.current = requestAnimationFrame(loop)
    }
    loop()
  }, [getEngine, setRunningMode, paint])

  // ── mode 1: live camera ────────────────────────────────────────────────────
  const startLive = useCallback(async () => {
    try {
      if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) { setErr(t.mirrorCamUnavailable); return }
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
      if (!openRef.current) { stream.getTracks().forEach((x) => x.stop()); return }
      streamRef.current = stream
      const video = videoRef.current
      video.srcObject = stream; video.muted = true
      await video.play()
      prepCanvas(video.videoWidth || 640, video.videoHeight || 480)
      sourceRef.current = video
      smoothReset(); setSourceLoaded(true); setErr('')
      runVideoLoop()
    } catch (e) {
      if (e?.name === 'NotAllowedError') setErr(t.mirrorCamBlocked)
      else if (e?.name === 'NotFoundError' || e?.name === 'DevicesNotFoundError' || e?.name === 'OverconstrainedError') setErr(t.mirrorNoCam)
      else setErr(t.mirrorCamUnavailable)
    }
  }, [t, runVideoLoop])

  // ── mode 2: upload photo ───────────────────────────────────────────────────
  const loadPhoto = useCallback((file) => {
    stopLoops()
    if (objUrlRef.current) URL.revokeObjectURL(objUrlRef.current)
    const url = URL.createObjectURL(file); objUrlRef.current = url
    const img = new Image()
    img.onload = async () => {
      const scale = Math.min(1, MAX_IMG / Math.max(img.naturalWidth, img.naturalHeight))
      const W = Math.round(img.naturalWidth * scale), H = Math.round(img.naturalHeight * scale)
      prepCanvas(W, H)
      const canvas = canvasRef.current; if (canvas) canvas.style.transform = 'none'
      sourceRef.current = img; setSourceLoaded(true)
      let l = null, mat = null
      const lm = getEngine()
      if (lm) {
        await setRunningMode('IMAGE')
        try {
          const tmp = document.createElement('canvas'); tmp.width = W; tmp.height = H
          tmp.getContext('2d').drawImage(img, 0, 0, W, H)
          const res = lm.detect(tmp)
          l = res?.faceLandmarks?.[0] || null; mat = res?.facialTransformationMatrixes?.[0] || null
        } catch { /* detection failed */ }
      }
      photoDetRef.current = { l, mat }
      paint(l, mat, { smooth: false, detActive: !!lm })
      setErr(lm && !l ? t.mirrorNoFace : '')
    }
    img.onerror = () => setErr(t.mirrorBadFile)
    img.src = url
  }, [stopLoops, getEngine, setRunningMode, paint, t])

  // ── mode 3: upload video ───────────────────────────────────────────────────
  const loadVideo = useCallback((file) => {
    stopLoops()
    if (objUrlRef.current) URL.revokeObjectURL(objUrlRef.current)
    const url = URL.createObjectURL(file); objUrlRef.current = url
    const video = videoRef.current
    video.srcObject = null; video.src = url; video.muted = true; video.loop = false
    video.style.transform = 'none'
    video.onloadedmetadata = () => {
      prepCanvas(video.videoWidth || 640, video.videoHeight || 480)
      sourceRef.current = video; smoothReset(); setSourceLoaded(true); setErr('')
      runVideoLoop()
      video.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
    }
    video.ontimeupdate = () => setProgress(video.duration ? video.currentTime / video.duration : 0)
    video.onended = () => setPlaying(false)
    video.onerror = () => setErr(t.mirrorBadFile)
  }, [stopLoops, runVideoLoop, t])

  const handleFile = (file, kind) => {
    if (!file) return
    const ok = kind === 'photo' ? file.type.startsWith('image/') : file.type.startsWith('video/')
    if (!ok) { setErr(t.mirrorBadFile); return }
    setErr(''); setPlaying(false); setProgress(0)
    kind === 'photo' ? loadPhoto(file) : loadVideo(file)
  }

  // ── (re)start on mode change / open ─────────────────────────────────────────
  useEffect(() => {
    if (!open) return
    stopLoops()
    sourceRef.current = null; photoDetRef.current = null
    setSourceLoaded(false); setErr(''); setFace(true); setPlaying(false); setProgress(0)
    const canvas = canvasRef.current
    if (canvas) { canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height); canvas.style.transform = mode === 'live' ? 'scaleX(-1)' : 'none' }
    if (mode === 'live') startLive()
    return () => stopLoops()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, mode])

  // Re-render the static photo when size / colour change (video redraws itself).
  useEffect(() => {
    if (mode === 'photo' && photoDetRef.current) {
      const { l, mat } = photoDetRef.current
      paint(l, mat, { smooth: false, detActive: !!getEngine() })
    }
  }, [size, colorIdx, mode, paint, getEngine])

  // Full teardown on close/unmount.
  useEffect(() => {
    if (open) return
    stopLoops()
    if (objUrlRef.current) { URL.revokeObjectURL(objUrlRef.current); objUrlRef.current = null }
    const v = videoRef.current; if (v) { v.srcObject = null; v.removeAttribute('src') }
    if (engineRef.current) { try { engineRef.current.dispose() } catch { /* noop */ } engineRef.current = null }
    modelUrlRef.current = ''
  }, [open, stopLoops])
  useEffect(() => stopLoops, [stopLoops])

  const togglePlay = () => {
    const v = videoRef.current; if (!v) return
    if (v.paused) { v.play().then(() => setPlaying(true)).catch(() => {}) } else { v.pause(); setPlaying(false) }
  }
  const scrub = (frac) => { const v = videoRef.current; if (v && v.duration) { v.currentTime = frac * v.duration; setProgress(frac) } }

  const download = () => {
    const canvas = canvasRef.current; if (!canvas) return
    // Live preview is CSS-mirrored (selfie view); flip the export to match what
    // the user actually saw. Photo/video are shown un-mirrored, so export as-is.
    let src = canvas
    if (mode === 'live') {
      const t = document.createElement('canvas'); t.width = canvas.width; t.height = canvas.height
      const c = t.getContext('2d'); c.translate(t.width, 0); c.scale(-1, 1); c.drawImage(canvas, 0, 0); src = t
    }
    const a = document.createElement('a')
    a.download = 'optizone-tryon.png'
    a.href = src.toDataURL('image/png')
    a.click()
  }

  const bump = (d) => setSize((v) => Math.min(1.4, Math.max(0.8, Math.round((v + d) * 100) / 100)))

  if (!open) return null

  const banner = err
    ? { tone: 'danger', msg: err, retry: false }
    : status === 'loading' ? { tone: 'info', msg: t.mirrorLoading, retry: false }
    : status === 'error' ? { tone: 'danger', msg: t.mirrorInitFail, retry: true }
    : null

  // Portal to <body> — ancestor CSS transforms (.oz-route) would re-anchor a
  // fixed overlay. dir is inherited from <html> so RTL works automatically.
  return createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'var(--pine-950)', display: 'flex', flexDirection: 'column' }}>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', color: 'var(--cream-100)' }}>
        <span style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.14em', textTransform: 'uppercase', fontSize: 13, color: 'var(--amber-500)' }}>
          {t.tryMirror} · {p.brand} {p.name}
        </span>
        <IconButton variant="ghost" onClick={() => { stopLoops(); onClose() }} aria-label="close" style={{ color: 'var(--cream-100)' }}><Icon name="x" color="var(--cream-100)" /></IconButton>
      </div>

      {/* mode switcher */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', padding: '0 16px 12px', flexWrap: 'wrap' }}>
        {MODES.map((m) => {
          const active = mode === m.key
          return (
            <button key={m.key} onClick={() => setMode(m.key)} aria-pressed={active}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 'var(--radius-pill)', cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: 12.5, letterSpacing: '0.08em', textTransform: 'uppercase', border: `1px solid ${active ? 'var(--amber-500)' : 'var(--border-on-dark)'}`, background: active ? 'var(--amber-500)' : 'transparent', color: active ? 'var(--pine-950)' : 'var(--cream-200)' }}>
              <Icon name={m.icon} size={15} color="currentColor" /> {t[m.label]}
            </button>
          )
        })}
      </div>

      {/* banners */}
      {banner && (
        <div role={banner.tone === 'danger' ? 'alert' : 'status'} style={{ margin: '0 16px 10px', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: 13.5, textAlign: 'center', background: banner.tone === 'danger' ? 'rgba(190,60,60,0.16)' : 'rgba(255,255,255,0.08)', color: banner.tone === 'danger' ? '#ffb4a8' : 'var(--cream-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <Icon name={banner.tone === 'danger' ? 'info' : 'camera'} size={15} color="currentColor" /> {banner.msg}
          {banner.retry && <Button variant="outline" size="sm" onClick={retry} style={{ color: 'var(--cream-100)', borderColor: 'var(--cream-100)' }}>{t.mirrorRetry}</Button>}
        </div>
      )}

      {/* stage */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '0 16px', minHeight: 0 }}>
        <div style={{ position: 'relative', width: 'min(92vw, 640px)', maxHeight: '100%', aspectRatio: '4/3', borderRadius: 'var(--radius-lg)', background: '#0e0e0e', border: '1px solid var(--border-on-dark)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <video ref={videoRef} playsInline muted style={{ display: 'none' }} />
          <canvas ref={canvasRef} width={640} height={480} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />

          {/* per-mode empty state / hints */}
          {(mode === 'photo' || mode === 'video') && !sourceLoaded && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, color: 'var(--cream-200)' }}>
              <Icon name={mode === 'photo' ? 'user' : 'smartphone'} size={40} color="var(--pine-300)" />
              <Button variant="outline" style={{ color: 'var(--cream-100)', borderColor: 'var(--cream-100)' }}
                onClick={() => (mode === 'photo' ? photoInputRef.current : videoInputRef.current)?.click()}>
                {mode === 'photo' ? t.mirrorChoosePhoto : t.mirrorChooseVideo}
              </Button>
            </div>
          )}
          {mode !== 'photo' && sourceLoaded && status === 'ready' && !hasFace && !err && (
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '10px 14px', fontSize: 13, color: 'var(--cream-100)', background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', textAlign: 'center' }}>{t.mirrorPosition}</div>
          )}
        </div>
      </div>

      {/* video transport (mode 3) */}
      {mode === 'video' && sourceLoaded && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 24px 0', maxWidth: 680, margin: '0 auto', width: '100%' }}>
          <IconButton variant="ghost" size="sm" onClick={togglePlay} aria-label={playing ? t.mirrorPause : t.mirrorPlay} style={{ color: 'var(--cream-100)', border: '1px solid var(--border-on-dark)' }}>
            <Icon name={playing ? 'chevron-up' : 'arrow-right'} size={15} color="currentColor" />
          </IconButton>
          <input type="range" min="0" max="1" step="0.001" value={progress} onChange={(e) => scrub(Number(e.target.value))} aria-label="scrubber" style={{ flex: 1, accentColor: 'var(--amber-500)' }} />
        </div>
      )}

      {/* product carousel — swipe through frames without leaving the mirror */}
      {catalog.length > 1 && (
        <div role="listbox" aria-label={t.tryMirror} style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '6px 20px 10px', scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
          {catalog.map((prod) => {
            const isActive = prod.id === active.id
            return (
              <button key={prod.id} role="option" aria-selected={isActive} onClick={() => switchProduct(prod)}
                style={{ flex: '0 0 auto', width: 112, scrollSnapAlign: 'center', cursor: 'pointer', textAlign: 'center', padding: 8, borderRadius: 'var(--radius-md)', border: `1.5px solid ${isActive ? 'var(--amber-500)' : 'var(--border-on-dark)'}`, background: isActive ? 'rgba(224,138,42,0.14)' : 'transparent', color: 'var(--cream-100)' }}>
                <span style={{ height: 44, marginBottom: 6, borderRadius: 6, background: 'rgba(255,255,255,0.06)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {prod.image ? <img src={prod.image} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} /> : <Icon name="glasses" size={18} color="var(--pine-300)" />}
                </span>
                <span style={{ display: 'block', fontSize: 9.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--pine-200)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{prod.brand}</span>
                <span style={{ display: 'block', fontSize: 11, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{prod.name}</span>
                <span style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: 'var(--amber-500)' }}>₪{prod.amount}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* controls */}
      <div style={{ padding: '12px 24px 22px', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--cream-100)' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 11.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--pine-200)' }}>{t.mirrorSize}</span>
          <IconButton variant="ghost" size="sm" onClick={() => bump(-0.05)} aria-label="smaller" style={{ color: 'var(--cream-100)', border: '1px solid var(--border-on-dark)' }}><span style={{ fontSize: 17, lineHeight: 1 }}>−</span></IconButton>
          <input type="range" min="0.8" max="1.4" step="0.05" value={size} onChange={(e) => setSize(Number(e.target.value))} aria-label={t.mirrorSize} style={{ width: 160, accentColor: 'var(--amber-500)' }} />
          <IconButton variant="ghost" size="sm" onClick={() => bump(0.05)} aria-label="larger" style={{ color: 'var(--cream-100)', border: '1px solid var(--border-on-dark)' }}><Icon name="plus" size={15} color="currentColor" /></IconButton>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, minWidth: 44, textAlign: 'center', color: 'var(--amber-500)' }}>{sizePct}</span>
        </div>

        {(p.colors || []).length > 0 && (
          <div style={{ display: 'flex', gap: 10 }}>
            {p.colors.map((c, i) => (
              <button key={i} onClick={() => setColorIdx(i)} aria-label={`color ${i + 1}`} style={{ width: 30, height: 30, borderRadius: 999, background: c, border: `2px solid ${colorIdx === i ? 'var(--amber-500)' : 'transparent'}`, cursor: 'pointer' }} />
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button variant="ghost" onClick={download} style={{ color: 'var(--pine-100)' }} startIcon={<Icon name="share-2" size={16} color="currentColor" />}>{t.mirrorDownload}</Button>
          <Button variant="primary" onClick={() => { stopLoops(); onAddToCart(sizePct, active); onClose() }} startIcon={<Icon name="shopping-bag" size={17} color="currentColor" />}>
            {t.mirrorAdd} · {sizePct}
          </Button>
        </div>
        <span style={{ fontSize: 11.5, color: 'var(--pine-300)', letterSpacing: '0.04em', textAlign: 'center' }}>{t.mirrorPrivacy}</span>
      </div>

      {/* hidden inputs (also reachable from the empty-state buttons) */}
      <input ref={photoInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => { setMode('photo'); handleFile(e.target.files && e.target.files[0], 'photo'); e.target.value = '' }} />
      <input ref={videoInputRef} type="file" accept="video/*" style={{ display: 'none' }} onChange={(e) => { handleFile(e.target.files && e.target.files[0], 'video'); e.target.value = '' }} />
    </div>,
    document.body,
  )
}
