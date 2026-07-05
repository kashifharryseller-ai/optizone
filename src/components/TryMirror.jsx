import React, { useEffect, useRef, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Button, Icon, IconButton } from '../ds/index.js'

/**
 * TryMirror — per-product virtual try-on.
 *
 * - Camera (getUserMedia, behind the PDP consent dialog) OR photo upload.
 * - Google MediaPipe Face Landmarker runs fully client-side (no API key, no
 *   uploads — frames are drawn on a local <canvas>; nothing leaves the browser).
 * - Overlays THIS product's frame only:
 *     · product.tryMirrorImg (transparent PNG uploaded in Admin → Products)
 *       is anchored between the eye landmarks, rotated with the head, or
 *     · a vector rendition derived from the product's shape + selected colour
 *       when no PNG asset has been uploaded yet.
 * - Size control (±) scales the frame; the chosen size is returned to the
 *   caller as a "custom size" (e.g. "110%") and follows the cart line.
 * - Download button saves the current canvas as PNG.
 */

// ---- MediaPipe loading (module-level cache; survives close/reopen) ----------
const MP_VERSION = '0.10.20'
const CDN_BASES = [
  `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MP_VERSION}`,
  `https://unpkg.com/@mediapipe/tasks-vision@${MP_VERSION}`,
]
const MODEL_URL = 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task'
const lmCache = {}
let visionPromise = null

async function loadVision() {
  let lastErr
  for (const base of CDN_BASES) {
    try {
      const mod = await import(/* @vite-ignore */ `${base}/vision_bundle.mjs`)
      const fileset = await mod.FilesetResolver.forVisionTasks(`${base}/wasm`)
      return { FaceLandmarker: mod.FaceLandmarker, fileset }
    } catch (e) { lastErr = e }
  }
  throw lastErr || new Error('mediapipe-load-failed')
}

async function getLandmarker(mode) {
  if (lmCache[mode]) return lmCache[mode]
  visionPromise = visionPromise || loadVision()
  const { FaceLandmarker, fileset } = await visionPromise
  const opts = (delegate) => ({
    baseOptions: { modelAssetPath: MODEL_URL, delegate },
    runningMode: mode,
    numFaces: 1,
  })
  try { lmCache[mode] = await FaceLandmarker.createFromOptions(fileset, opts('GPU')) }
  catch { lmCache[mode] = await FaceLandmarker.createFromOptions(fileset, opts('CPU')) }
  return lmCache[mode]
}

// ---- Frame drawing -----------------------------------------------------------
// Landmark indices: 33/263 outer eye corners, 133/362 inner, 234/454 temples.
function eyeGeometry(landmarks, W, H) {
  const P = (i) => ({ x: landmarks[i].x * W, y: landmarks[i].y * H })
  const rO = P(33), lO = P(263), rIn = P(133), lIn = P(362)
  const rEye = { x: (rO.x + rIn.x) / 2, y: (rO.y + rIn.y) / 2 }
  const lEye = { x: (lO.x + lIn.x) / 2, y: (lO.y + lIn.y) / 2 }
  const span = Math.hypot(lO.x - rO.x, lO.y - rO.y)
  const ang = Math.atan2(lO.y - rO.y, lO.x - rO.x)
  return { rEye, lEye, span, ang, rEar: P(234), lEar: P(454) }
}

// PNG mode — the product's transparent frame asset, anchored between the eyes.
function drawPngFrame(ctx, img, geo, size) {
  const { rEye, lEye, ang, span } = geo
  const cx = (rEye.x + lEye.x) / 2
  const cy = (rEye.y + lEye.y) / 2
  const w = span * 2.35 * size
  const h = w * (img.naturalHeight / img.naturalWidth)
  ctx.save()
  ctx.translate(cx, cy)
  ctx.rotate(ang)
  ctx.drawImage(img, -w / 2, -h * 0.5, w, h)
  ctx.restore()
}

// Vector mode — style derived from the product's shape + selected colour.
function vectorStyle(product, color) {
  const shape = String(product?.shape || '').toLowerCase()
  if (shape.includes('aviator')) return { stroke: color || '#b8862f', lw: 0.05, rx: 0.30, ry: 0.25, tint: 'rgba(120,90,30,0.16)' }
  if (shape.includes('round') || shape.includes('oval')) return { stroke: color || '#2b2b2b', lw: 0.055, rx: 0.26, ry: 0.26, tint: 'rgba(20,20,25,0.10)' }
  return { stroke: color || '#141414', lw: 0.075, rx: 0.31, ry: 0.23, tint: null }
}

function drawVectorFrame(ctx, geo, st, size) {
  const { rEye, lEye, ang, span, rEar, lEar } = geo
  const ux = Math.cos(ang), uy = Math.sin(ang)
  const rx = span * st.rx * size, ry = span * st.ry * size
  const lw = Math.max(1.5, span * st.lw * size)
  ctx.save()
  ctx.lineJoin = 'round'; ctx.lineCap = 'round'
  ctx.strokeStyle = st.stroke; ctx.lineWidth = lw
  for (const c of [rEye, lEye]) {
    ctx.beginPath()
    ctx.ellipse(c.x, c.y, rx, ry, ang, 0, Math.PI * 2)
    if (st.tint) { ctx.fillStyle = st.tint; ctx.fill() }
    ctx.stroke()
  }
  const rInner = { x: rEye.x + ux * rx, y: rEye.y + uy * rx }
  const lInner = { x: lEye.x - ux * rx, y: lEye.y - uy * rx }
  ctx.beginPath(); ctx.moveTo(rInner.x, rInner.y); ctx.lineTo(lInner.x, lInner.y); ctx.stroke()
  const rOut = { x: rEye.x - ux * rx, y: rEye.y - uy * rx }
  const lOut = { x: lEye.x + ux * rx, y: lEye.y + uy * rx }
  ctx.beginPath(); ctx.moveTo(rOut.x, rOut.y); ctx.lineTo(rEar.x, rEar.y); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(lOut.x, lOut.y); ctx.lineTo(lEar.x, lEar.y); ctx.stroke()
  ctx.restore()
}

export function TryMirror({ open, onClose, product, strings, onAddToCart }) {
  const p = product || {}
  const t = strings
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const fileRef = useRef(null)
  const stateRef = useRef({ running: false, raf: null, stream: null, photo: null, frameImg: null })
  const [status, setStatus] = useState('')
  const [camOn, setCamOn] = useState(false)
  const [size, setSize] = useState(1)          // 1 = 100 %
  const [colorIdx, setColorIdx] = useState(0)
  const sizeRef = useRef(1); sizeRef.current = size
  const colorRef = useRef(0); colorRef.current = colorIdx
  const sizePct = `${Math.round(size * 100)}%`

  // Preload the product's transparent-PNG frame asset (if the admin set one).
  useEffect(() => {
    if (!open || !p.tryMirrorImg) return
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => { stateRef.current.frameImg = img }
    img.src = p.tryMirrorImg
    return () => { stateRef.current.frameImg = null }
  }, [open, p.tryMirrorImg])

  const drawFrame = useCallback((ctx, landmarks, W, H) => {
    const geo = eyeGeometry(landmarks, W, H)
    const img = stateRef.current.frameImg
    if (img) drawPngFrame(ctx, img, geo, sizeRef.current)
    else drawVectorFrame(ctx, geo, vectorStyle(p, (p.colors || [])[colorRef.current]), sizeRef.current)
  }, [p])

  const stopAll = useCallback(() => {
    const s = stateRef.current
    s.running = false
    if (s.raf) cancelAnimationFrame(s.raf)
    if (s.stream) { s.stream.getTracks().forEach((tr) => tr.stop()); s.stream = null }
    setCamOn(false)
  }, [])

  useEffect(() => { if (!open) stopAll() }, [open, stopAll])
  useEffect(() => stopAll, [stopAll]) // unmount cleanup

  // ---- camera mode -----------------------------------------------------------
  const startCamera = async () => {
    const video = videoRef.current, canvas = canvasRef.current
    if (!video || !canvas) return
    try {
      setStatus(t.mirrorLoading)
      const lm = await getLandmarker('VIDEO')
      if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
        setStatus(t.mirrorCamUnavailable); return
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
      stateRef.current.stream = stream
      stateRef.current.photo = null
      video.srcObject = stream
      await video.play()
      const ctx = canvas.getContext('2d')
      const W = canvas.width = video.videoWidth || 640
      const H = canvas.height = video.videoHeight || 480
      canvas.style.transform = 'scaleX(-1)' // mirror the selfie view
      setStatus('')
      setCamOn(true)
      stateRef.current.running = true
      let last = -1
      const loop = () => {
        const s = stateRef.current
        if (!s.running) return
        if (video.currentTime !== last) {
          last = video.currentTime
          const res = lm.detectForVideo(video, performance.now())
          ctx.clearRect(0, 0, W, H)
          ctx.drawImage(video, 0, 0, W, H)
          const l = res.faceLandmarks && res.faceLandmarks[0]
          if (l) drawFrame(ctx, l, W, H)
        }
        s.raf = requestAnimationFrame(loop)
      }
      loop()
    } catch (err) {
      setStatus(err && err.name === 'NotAllowedError' ? t.mirrorCamBlocked : t.mirrorCamUnavailable)
    }
  }

  // ---- photo mode ------------------------------------------------------------
  const handlePhoto = async (file) => {
    if (!file) return
    const canvas = canvasRef.current
    if (!canvas) return
    try {
      stopAll()
      canvas.style.transform = 'none'
      setStatus(t.mirrorLoading)
      const lm = await getLandmarker('IMAGE')
      const img = new Image()
      img.src = URL.createObjectURL(file)
      await img.decode()
      const W = canvas.width = img.naturalWidth
      const H = canvas.height = img.naturalHeight
      const res = lm.detect(img)
      const l = res.faceLandmarks && res.faceLandmarks[0]
      stateRef.current.photo = { img, landmarks: l, W, H }
      renderPhoto()
      setStatus(l ? '' : t.mirrorNoFace)
    } catch {
      setStatus(t.mirrorNoFace)
    }
  }

  const renderPhoto = useCallback(() => {
    const canvas = canvasRef.current
    const ph = stateRef.current.photo
    if (!canvas || !ph) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, ph.W, ph.H)
    ctx.drawImage(ph.img, 0, 0, ph.W, ph.H)
    if (ph.landmarks) drawFrame(ctx, ph.landmarks, ph.W, ph.H)
  }, [drawFrame])

  // Re-render the still photo when size / colour change (video re-draws itself).
  useEffect(() => { if (stateRef.current.photo) renderPhoto() }, [size, colorIdx, renderPhoto])

  const download = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const a = document.createElement('a')
    a.download = `optizone-try-mirror-${(p.name || 'frame').replace(/\s+/g, '-').toLowerCase()}.png`
    a.href = canvas.toDataURL('image/png')
    a.click()
  }

  if (!open) return null

  const bump = (d) => setSize((v) => Math.min(1.4, Math.max(0.7, Math.round((v + d) * 100) / 100)))

  // Portal to <body>: ancestors animate with CSS transforms (.oz-route), which
  // would otherwise re-anchor this fixed overlay and break full-screen cover.
  return createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'var(--pine-950)', display: 'flex', flexDirection: 'column' }}>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px', color: 'var(--cream-100)' }}>
        <span style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.14em', textTransform: 'uppercase', fontSize: 13, color: 'var(--amber-500)' }}>
          {t.mirrorLive} · {p.brand} {p.name}
        </span>
        <IconButton variant="ghost" onClick={() => { stopAll(); onClose() }} aria-label="close" style={{ color: 'var(--cream-100)' }}><Icon name="x" color="var(--cream-100)" /></IconButton>
      </div>

      {/* stage */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '0 16px', minHeight: 0 }}>
        <div style={{ position: 'relative', width: 'min(92vw, 640px)', maxHeight: '100%', aspectRatio: '4/3', borderRadius: 'var(--radius-lg)', background: '#0e0e0e', border: '1px solid var(--border-on-dark)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <video ref={videoRef} playsInline muted style={{ display: 'none' }} />
          <canvas ref={canvasRef} width={640} height={480} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          {status && (
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '10px 14px', fontSize: 12.5, color: 'var(--cream-100)', background: 'linear-gradient(transparent, rgba(0,0,0,0.65))', textAlign: 'center' }}>{status}</div>
          )}
        </div>
      </div>

      {/* controls */}
      <div style={{ padding: '14px 24px 26px', display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
        {/* size */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--cream-100)' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 11.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--pine-200)' }}>{t.mirrorSize}</span>
          <IconButton variant="ghost" size="sm" onClick={() => bump(-0.05)} aria-label="smaller" style={{ color: 'var(--cream-100)', border: '1px solid var(--border-on-dark)' }}><span style={{ fontSize: 17, lineHeight: 1 }}>−</span></IconButton>
          <input
            type="range" min="0.7" max="1.4" step="0.05" value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            aria-label={t.mirrorSize}
            style={{ width: 170, accentColor: 'var(--amber-500)' }}
          />
          <IconButton variant="ghost" size="sm" onClick={() => bump(0.05)} aria-label="larger" style={{ color: 'var(--cream-100)', border: '1px solid var(--border-on-dark)' }}><Icon name="plus" size={15} color="currentColor" /></IconButton>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, minWidth: 44, textAlign: 'center', color: 'var(--amber-500)' }}>{sizePct}</span>
        </div>

        {/* colour swatches drive the vector frame tint (when no PNG asset) */}
        {!p.tryMirrorImg && (p.colors || []).length > 0 && (
          <div style={{ display: 'flex', gap: 10 }}>
            {p.colors.map((c, i) => (
              <button key={i} onClick={() => setColorIdx(i)} aria-label={`color ${i + 1}`} style={{ width: 32, height: 32, borderRadius: 999, background: c, border: `2px solid ${colorIdx === i ? 'var(--amber-500)' : 'transparent'}`, cursor: 'pointer' }} />
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button variant="outline" onClick={startCamera} disabled={camOn} style={{ color: 'var(--cream-100)', borderColor: 'var(--cream-100)' }} startIcon={<Icon name="camera" size={17} color="currentColor" />}>
            {camOn ? t.mirrorLive : t.mirrorStart}
          </Button>
          <Button variant="ghost" onClick={() => fileRef.current && fileRef.current.click()} style={{ color: 'var(--pine-100)' }}>{t.mirrorPhotoAlt}</Button>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handlePhoto(e.target.files && e.target.files[0])} />
          <Button variant="ghost" onClick={download} style={{ color: 'var(--pine-100)' }} startIcon={<Icon name="share-2" size={16} color="currentColor" />}>{t.mirrorDownload}</Button>
          <Button variant="primary" onClick={() => { stopAll(); onAddToCart(sizePct); onClose() }} startIcon={<Icon name="shopping-bag" size={17} color="currentColor" />}>
            {t.mirrorAdd} · {sizePct}
          </Button>
        </div>

        <span style={{ fontSize: 11.5, color: 'var(--pine-300)', letterSpacing: '0.04em', textAlign: 'center' }}>{t.mirrorPrivacy}</span>
      </div>
    </div>,
    document.body,
  )
}
