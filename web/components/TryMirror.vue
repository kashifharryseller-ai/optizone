<script setup lang="ts">
// TryMirror — per-product virtual try-on (live camera / upload photo / upload
// video). All processing in-browser (MediaPipe FaceLandmarker, no key, no
// upload). Overlay fallback chain per colour: 3D model → transparent PNG (incl.
// auto-derived from the product photo) → drawn vector. Vue port of the React
// component; mounted only while open, so mount/unmount == open/close.
import { ShoppingBag, Share2, X, Camera, User, Smartphone, Plus, Info, Play, Pause } from 'lucide-vue-next'
import { resolveTryonAsset } from '~/tryon/config.js'
import { removeBackground } from '~/tryon/bgRemove.js'

const props = withDefaults(defineProps<{
  product: any
  catalog?: any[]
}>(), { catalog: () => [] })
const emit = defineEmits<{ (e: 'close'): void; (e: 'add', size: string, product: any): void }>()

const { L } = useLang()

// GlassesEngine (+ three) is loaded on demand — only when a frame asset exists.
let EnginePromise: Promise<any> | null = null
const loadEngine = () => (EnginePromise ||= import('~/tryon/GlassesEngine.js').then((m: any) => m.GlassesEngine))

// Inline trilingual strings (EN/HE full; AR subset → EN fallback via L()).
const S = {
  tryMirror: { en: 'Try Mirror', he: 'Try Mirror', ar: 'المرآة الافتراضية' },
  modeLive: { en: 'Live', he: 'מצלמה חיה', ar: 'مباشر' },
  modePhoto: { en: 'Upload photo', he: 'העלאת תמונה', ar: 'رفع صورة' },
  modeVideo: { en: 'Upload video', he: 'העלאת וידאו', ar: 'رفع فيديو' },
  choosePhoto: { en: 'Choose a photo', he: 'בחירת תמונה', ar: 'اختر صورة' },
  chooseVideo: { en: 'Choose a video', he: 'בחירת וידאו', ar: 'اختر فيديو' },
  loading: { en: 'Loading face tracking…', he: 'טוען זיהוי פנים…', ar: 'جارٍ تحميل تتبّع الوجه…' },
  noFace: { en: 'No face detected — try a clear, front-facing photo.', he: 'לא זוהו פנים — נסו תמונה ברורה, פנים קדימה.', ar: 'لم يُكتشف وجه — جرّب صورة واضحة من الأمام.' },
  camBlocked: { en: 'Camera permission blocked — you can upload a photo instead.', he: 'הרשאת המצלמה נחסמה — אפשר להעלות תמונה במקום.', ar: 'تم حظر إذن الكاميرا — يمكنك رفع صورة بدلاً من ذلك.' },
  camUnavailable: { en: 'Camera is not available here — upload a photo instead.', he: 'המצלמה אינה זמינה כאן — העלו תמונה במקום.', ar: 'الكاميرا غير متاحة هنا — ارفع صورة بدلاً من ذلك.' },
  noCam: { en: 'No camera found — upload a photo or video instead.', he: 'לא נמצאה מצלמה — העלו תמונה או וידאו במקום.', ar: 'لا كاميرا — ارفع صورة أو فيديو.' },
  badFile: { en: 'That file type isn’t supported — please choose another.', he: 'סוג הקובץ אינו נתמך — בחרו קובץ אחר.', ar: 'نوع الملف غير مدعوم — اختر آخر.' },
  initFail: { en: 'Face tracking couldn’t load — check your connection and try again.', he: 'זיהוי הפנים לא נטען — בדקו את החיבור ונסו שוב.', ar: 'تعذّر تحميل تتبّع الوجه — تحقّق من اتصالك.' },
  position: { en: 'Position your face in the frame', he: 'מקמו את הפנים במסגרת', ar: 'ضع وجهك في الإطار' },
  size: { en: 'Frame size', he: 'גודל מסגרת', ar: 'حجم الإطار' },
  download: { en: 'Download photo', he: 'הורדת תמונה', ar: 'تنزيل الصورة' },
  add: { en: 'Add to Cart', he: 'הוספה לעגלה', ar: 'أضف إلى السلة' },
  retry: { en: 'Retry', he: 'נסו שוב', ar: 'أعد المحاولة' },
  privacy: { en: 'Everything runs on your device — no image ever leaves your browser.', he: 'הכול רץ על המכשיר שלכם — אף תמונה לא עוזבת את הדפדפן.', ar: 'كل شيء يعمل على جهازك — لا تغادر أي صورة متصفحك.' },
}

const BASE_MULT = 2.15
const EMA_ALPHA = 0.5
const MAX_IMG = 1600

const { status, load: loadLandmarker, get: getLm, setRunningMode, retry: retryLm } = useFaceLandmarker()

// reactive UI state
const active = ref<any>(props.product || {})
const mode = ref<'live' | 'photo' | 'video'>('live')
const size = ref(1)
const colorIdx = ref(0)
const err = ref('')
const hasFace = ref(true)
const sourceLoaded = ref(false)
const playing = ref(false)
const progress = ref(0)
const sizePct = computed(() => `${Math.round(size.value * 100)}%`)

// template refs
const dialogRef = ref<HTMLElement | null>(null)
const videoRef = ref<HTMLVideoElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const photoInputRef = ref<HTMLInputElement | null>(null)
const videoInputRef = ref<HTMLInputElement | null>(null)

// non-reactive engine/loop state (per-instance)
let frameImg: HTMLImageElement | null = null
let engine: any = null
let modelUrlCur = ''
let pngUrlCur = ''
let contentUrlCur = ''
let meta: any = {}
let source: HTMLVideoElement | HTMLImageElement | null = null
let photoDet: { l: any; mat: any } | null = null
let smooth: any = {}
let raf = 0
let running = false
let stream: MediaStream | null = null
let objUrl: string | null = null
let lastTs = 0
let assetToken = 0

const setFace = (v: boolean) => { if (hasFace.value !== v) hasFace.value = v }
const smoothReset = () => { smooth = {} }
const prepCanvas = (w: number, h: number) => { const c = canvasRef.value; if (c) { c.width = w; c.height = h } }

// ── head pose from MediaPipe transform matrix ──────────────────────────────
function headAngles(mat: any) {
  if (!mat) return { yaw: 0, pitch: 0 }
  const m = mat.data || mat
  const r00 = m[0], r10 = m[1], r20 = m[2], r21 = m[6], r22 = m[10]
  const sy = Math.hypot(r00, r10)
  return { pitch: Math.atan2(r21, r22), yaw: Math.atan2(-r20, sy) }
}
const ema = (prev: any, cur: any, a: number) => (prev == null ? cur : { x: prev.x + a * (cur.x - prev.x), y: prev.y + a * (cur.y - prev.y) })

// ── vector fallback ────────────────────────────────────────────────────────
function vectorStyle(product: any, color: string) {
  const shape = String(product?.shape || '').toLowerCase()
  if (shape.includes('aviator')) return { stroke: color || '#b8862f', lw: 0.05, rx: 0.30, ry: 0.25, tint: 'rgba(120,90,30,0.16)' }
  if (shape.includes('round') || shape.includes('oval')) return { stroke: color || '#2b2b2b', lw: 0.055, rx: 0.26, ry: 0.26, tint: 'rgba(20,20,25,0.10)' }
  return { stroke: color || '#141414', lw: 0.075, rx: 0.31, ry: 0.23, tint: null as string | null }
}
function drawVector(ctx: any, lm: any, W: number, H: number, st: any, scale: number) {
  const P = (i: number) => ({ x: lm[i].x * W, y: lm[i].y * H })
  if (!lm[33] || !lm[263]) return
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
function drawPng(ctx: any, img: any, p33: any, p263: any, p168: any, mat: any, scale: number) {
  const dx = p263.x - p33.x, dy = p263.y - p33.y
  const eyeDist = Math.hypot(dx, dy)
  const roll = Math.atan2(dy, dx)
  const { yaw, pitch } = headAngles(mat)
  const width = eyeDist * BASE_MULT * scale
  const height = width * (img.naturalHeight / img.naturalWidth || 0.4)
  const squeeze = Math.max(0.45, Math.cos(yaw))
  const yawShift = Math.sin(yaw) * eyeDist * 0.15
  const pitchShift = Math.sin(pitch) * eyeDist * 0.12
  ctx.save()
  ctx.translate(p168.x + yawShift, p168.y + pitchShift)
  ctx.rotate(roll)
  ctx.scale(squeeze, 1)
  ctx.drawImage(img, -width / 2, -height * 0.5, width, height)
  ctx.restore()
}

// ── auto-derive frame from product photo (background removed) ───────────────
const autoCache = new Map<string, string>()
async function autoDeriveFrame(url: string) {
  if (!url) return ''
  if (autoCache.has(url)) return autoCache.get(url)!
  let out = ''
  try { const r: any = await removeBackground(url, { auto: true }); if (r && r.coverage > 0.015 && r.coverage < 0.75) out = r.dataUrl } catch { /* → vector */ }
  autoCache.set(url, out)
  return out
}

// ── shared paint ───────────────────────────────────────────────────────────
function paint(landmarks: any, mat: any, opts: { smooth: boolean; detActive: boolean }) {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')!
  const W = canvas.width, H = canvas.height
  ctx.clearRect(0, 0, W, H)
  if (source) { try { ctx.drawImage(source as any, 0, 0, W, H) } catch { /* not ready */ } }
  if (opts.detActive) setFace(!!landmarks)
  const contentReady = engine && contentUrlCur && engine.hasContent(contentUrlCur)
  if (!landmarks) {
    if (contentReady) { engine.resize(W, H); engine.update(null, meta, size.value, false); try { ctx.drawImage(engine.render(), 0, 0, W, H) } catch { /* gl */ } }
    return
  }
  if (contentReady && landmarks[33] && landmarks[263]) {
    engine.resize(W, H)
    engine.update(landmarks, meta, size.value, false)
    try { ctx.drawImage(engine.render(), 0, 0, W, H) } catch { /* gl */ }
  } else if (frameImg && landmarks[33] && landmarks[263] && landmarks[168]) {
    let a = { x: landmarks[33].x * W, y: landmarks[33].y * H }
    let b = { x: landmarks[263].x * W, y: landmarks[263].y * H }
    let n = { x: landmarks[168].x * W, y: landmarks[168].y * H }
    if (opts.smooth) { a = smooth.a = ema(smooth.a, a, EMA_ALPHA); b = smooth.b = ema(smooth.b, b, EMA_ALPHA); n = smooth.n = ema(smooth.n, n, EMA_ALPHA) }
    drawPng(ctx, frameImg, a, b, n, mat, size.value)
  } else if (!pngUrlCur && !modelUrlCur) {
    drawVector(ctx, landmarks, W, H, vectorStyle(active.value, (active.value.colors || [])[colorIdx.value]), size.value)
  }
}
function repaintPhoto() {
  if (photoDet && source) paint(photoDet.l, photoDet.mat, { smooth: false, detActive: true })
}

// ── asset load (fallback chain) ─────────────────────────────────────────────
async function loadAssets() {
  const p = active.value
  const colorHex = (p.colors || [])[colorIdx.value]
  const { model: modelUrl, png: resolvedPng, meta: m } = resolveTryonAsset(p, colorHex)
  const productImg = p.image || ''
  const token = ++assetToken
  meta = m
  contentUrlCur = ''
  frameImg = null
  const giveUp = () => { if (token === assetToken) { contentUrlCur = ''; repaintPhoto() } }
  const ok = (url: string) => { if (token === assetToken) { contentUrlCur = url; repaintPhoto() } }

  let pngUrl = resolvedPng
  if (!modelUrl && !pngUrl && productImg) pngUrl = await autoDeriveFrame(productImg)
  if (token !== assetToken) return
  pngUrlCur = pngUrl
  modelUrlCur = modelUrl
  if (pngUrl) {
    const img = new Image(); img.crossOrigin = 'anonymous'
    img.onload = () => { if (token === assetToken) { frameImg = img; repaintPhoto() } }
    img.onerror = () => { if (token === assetToken && frameImg === img) frameImg = null }
    img.src = pngUrl
  }
  const contentUrl = modelUrl || pngUrl
  if (!contentUrl) { repaintPhoto(); return }
  let GlassesEngine: any
  try { GlassesEngine = await loadEngine() } catch (e: any) { console.warn('[tryon] engine load failed:', e?.message || e); giveUp(); return }
  if (token !== assetToken) return
  if (!engine) { try { engine = new GlassesEngine(640, 480) } catch (e: any) { console.warn('[tryon] WebGL unavailable:', e?.message || e); giveUp(); return } }
  const tryPlane = () => (pngUrl ? engine.setPlane(pngUrl).then((y: boolean) => (y ? ok(pngUrl) : giveUp())) : giveUp())
  if (modelUrl) await engine.setModel(modelUrl).then((y: boolean) => (y ? ok(modelUrl) : tryPlane()))
  else await tryPlane()
}

// ── loop control ─────────────────────────────────────────────────────────
function stopLoops() {
  running = false
  if (raf) cancelAnimationFrame(raf)
  if (stream) { stream.getTracks().forEach((tr) => tr.stop()); stream = null }
  const v = videoRef.value
  if (v) { try { v.pause() } catch { /* noop */ } }
}
function runVideoLoop() {
  running = true
  const video = videoRef.value!
  const loop = () => {
    if (!running) return
    const lm = getLm()
    if (video && video.readyState >= 2) {
      if (lm) {
        setRunningMode('VIDEO')
        let ts = performance.now(); if (ts <= lastTs) ts = lastTs + 1; lastTs = ts
        let res: any = null
        try { res = lm.detectForVideo(video, ts) } catch { /* mode switching */ }
        paint(res?.faceLandmarks?.[0] || null, res?.facialTransformationMatrixes?.[0] || null, { smooth: true, detActive: true })
      } else {
        paint(null, null, { smooth: true, detActive: false })
      }
    }
    raf = requestAnimationFrame(loop)
  }
  loop()
}

// ── mode 1: live camera ──────────────────────────────────────────────────
async function startLive() {
  try {
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) { err.value = L(S.camUnavailable); return }
    const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
    stream = s
    const video = videoRef.value!
    video.srcObject = s; video.muted = true
    await video.play()
    prepCanvas(video.videoWidth || 640, video.videoHeight || 480)
    source = video
    smoothReset(); sourceLoaded.value = true; err.value = ''
    runVideoLoop()
  } catch (e: any) {
    if (e?.name === 'NotAllowedError') err.value = L(S.camBlocked)
    else if (e?.name === 'NotFoundError' || e?.name === 'DevicesNotFoundError' || e?.name === 'OverconstrainedError') err.value = L(S.noCam)
    else err.value = L(S.camUnavailable)
  }
}

// ── mode 2: upload photo ───────────────────────────────────────────────────
function loadPhoto(file: File) {
  stopLoops()
  if (objUrl) URL.revokeObjectURL(objUrl)
  const url = URL.createObjectURL(file); objUrl = url
  const img = new Image()
  img.onload = async () => {
    const scale = Math.min(1, MAX_IMG / Math.max(img.naturalWidth, img.naturalHeight))
    const W = Math.round(img.naturalWidth * scale), H = Math.round(img.naturalHeight * scale)
    prepCanvas(W, H)
    const canvas = canvasRef.value; if (canvas) canvas.style.transform = 'none'
    source = img; sourceLoaded.value = true
    let l: any = null, mat: any = null
    const lm = getLm()
    if (lm) {
      await setRunningMode('IMAGE')
      try {
        const tmp = document.createElement('canvas'); tmp.width = W; tmp.height = H
        tmp.getContext('2d')!.drawImage(img, 0, 0, W, H)
        const res = lm.detect(tmp)
        l = res?.faceLandmarks?.[0] || null; mat = res?.facialTransformationMatrixes?.[0] || null
      } catch { /* detection failed */ }
    }
    photoDet = { l, mat }
    paint(l, mat, { smooth: false, detActive: !!lm })
    err.value = lm && !l ? L(S.noFace) : ''
  }
  img.onerror = () => { err.value = L(S.badFile) }
  img.src = url
}

// ── mode 3: upload video ───────────────────────────────────────────────────
function loadVideo(file: File) {
  stopLoops()
  if (objUrl) URL.revokeObjectURL(objUrl)
  const url = URL.createObjectURL(file); objUrl = url
  const video = videoRef.value!
  video.srcObject = null; video.src = url; video.muted = true; video.loop = false
  video.style.transform = 'none'
  video.onloadedmetadata = () => {
    prepCanvas(video.videoWidth || 640, video.videoHeight || 480)
    source = video; smoothReset(); sourceLoaded.value = true; err.value = ''
    runVideoLoop()
    video.play().then(() => (playing.value = true)).catch(() => (playing.value = false))
  }
  video.ontimeupdate = () => { progress.value = video.duration ? video.currentTime / video.duration : 0 }
  video.onended = () => { playing.value = false }
  video.onerror = () => { err.value = L(S.badFile) }
}

function handleFile(file: File | null | undefined, kind: 'photo' | 'video') {
  if (!file) return
  const okType = kind === 'photo' ? file.type.startsWith('image/') : file.type.startsWith('video/')
  if (!okType) { err.value = L(S.badFile); return }
  err.value = ''; playing.value = false; progress.value = 0
  kind === 'photo' ? loadPhoto(file) : loadVideo(file)
}

// ── mode switch ────────────────────────────────────────────────────────────
function applyMode() {
  stopLoops()
  source = null; photoDet = null
  sourceLoaded.value = false; err.value = ''; setFace(true); playing.value = false; progress.value = 0
  const canvas = canvasRef.value
  if (canvas) { canvas.getContext('2d')!.clearRect(0, 0, canvas.width, canvas.height); canvas.style.transform = mode.value === 'live' ? 'scaleX(-1)' : 'none' }
  if (mode.value === 'live') startLive()
}
watch(mode, applyMode)
watch([colorIdx, active], loadAssets, { deep: true })
watch([size, colorIdx], () => { if (mode.value === 'photo' && photoDet) paint(photoDet.l, photoDet.mat, { smooth: false, detActive: !!getLm() }) })

// carousel: switch tried-on frame in place
function switchProduct(prod: any) { active.value = prod; colorIdx.value = 0 }

// transport
function togglePlay() {
  const v = videoRef.value; if (!v) return
  if (v.paused) { v.play().then(() => (playing.value = true)).catch(() => {}) } else { v.pause(); playing.value = false }
}
function scrub(frac: number) { const v = videoRef.value; if (v && v.duration) { v.currentTime = frac * v.duration; progress.value = frac } }

function download() {
  const canvas = canvasRef.value; if (!canvas) return
  let src: HTMLCanvasElement = canvas
  if (mode.value === 'live') {
    const tc = document.createElement('canvas'); tc.width = canvas.width; tc.height = canvas.height
    const c = tc.getContext('2d')!; c.translate(tc.width, 0); c.scale(-1, 1); c.drawImage(canvas, 0, 0); src = tc
  }
  const a = document.createElement('a')
  a.download = 'optizone-tryon.png'
  a.href = src.toDataURL('image/png')
  a.click()
}
const bump = (d: number) => { size.value = Math.min(1.4, Math.max(0.8, Math.round((size.value + d) * 100) / 100)) }

const banner = computed(() => {
  if (err.value) return { tone: 'danger', msg: err.value, retry: false }
  if (status.value === 'loading') return { tone: 'info', msg: L(S.loading), retry: false }
  if (status.value === 'error') return { tone: 'danger', msg: L(S.initFail), retry: true }
  return null
})

const MODES = [
  { key: 'live', Icon: Camera, label: S.modeLive },
  { key: 'photo', Icon: User, label: S.modePhoto },
  { key: 'video', Icon: Smartphone, label: S.modeVideo },
] as const

function close() { stopLoops(); emit('close') }
function addToCart() { stopLoops(); emit('add', sizePct.value, active.value); emit('close') }

let onKey: (e: KeyboardEvent) => void
onMounted(() => {
  loadLandmarker()
  loadAssets()
  applyMode()
  dialogRef.value?.focus()
  onKey = (e) => { if (e.key === 'Escape') close() }
  window.addEventListener('keydown', onKey)
})
onUnmounted(() => {
  stopLoops()
  if (onKey) window.removeEventListener('keydown', onKey)
  if (objUrl) { URL.revokeObjectURL(objUrl); objUrl = null }
  const v = videoRef.value; if (v) { v.srcObject = null; v.removeAttribute('src') }
  if (engine) { try { engine.dispose() } catch { /* noop */ } engine = null }
})
</script>

<template>
  <Teleport to="body">
    <div ref="dialogRef" tabindex="-1" role="dialog" aria-modal="true" :aria-label="`${L(S.tryMirror)} · ${active.brand} ${L(active.name) || active.name}`"
      class="fixed inset-0 z-[1100] flex flex-col bg-pine-950 text-cream-100 outline-none">
      <!-- header -->
      <div class="flex items-center justify-between px-5 py-3.5">
        <span class="font-display text-[13px] uppercase tracking-[0.14em] text-amber-500">{{ L(S.tryMirror) }} · {{ active.brand }} {{ L(active.name) || active.name }}</span>
        <button @click="close" aria-label="close" class="rounded-full p-2 text-cream-100 hover:bg-white/10"><X :size="20" /></button>
      </div>

      <!-- mode switcher -->
      <div class="flex flex-wrap justify-center gap-2 px-4 pb-3">
        <button v-for="m in MODES" :key="m.key" @click="mode = m.key as any" :aria-pressed="mode === m.key"
          class="inline-flex items-center gap-2 rounded-pill border px-4 py-2 font-display text-[12.5px] uppercase tracking-[0.08em] transition-colors"
          :class="mode === m.key ? 'border-amber-500 bg-amber-500 text-pine-950' : 'border-white/25 text-cream-200 hover:border-white/50'">
          <component :is="m.Icon" :size="15" /> {{ L(m.label) }}
        </button>
      </div>

      <!-- banner -->
      <div v-if="banner" :role="banner.tone === 'danger' ? 'alert' : 'status'" class="mx-4 mb-2.5 flex items-center justify-center gap-2.5 rounded-md px-3.5 py-2.5 text-center text-[13.5px]"
        :class="banner.tone === 'danger' ? 'bg-red-500/15 text-red-200' : 'bg-white/10 text-cream-100'">
        <Info :size="15" /> {{ banner.msg }}
        <button v-if="banner.retry" @click="retryLm" class="rounded-sm border border-cream-100 px-3 py-1 text-xs">{{ L(S.retry) }}</button>
      </div>

      <!-- stage -->
      <div class="relative flex min-h-0 flex-1 items-center justify-center px-4">
        <div class="relative flex items-center justify-center overflow-hidden rounded-lg border border-white/20 bg-[#0e0e0e]" style="width:min(92vw,640px); max-height:100%; aspect-ratio:4/3">
          <video ref="videoRef" playsinline muted class="hidden" />
          <canvas ref="canvasRef" width="640" height="480" class="block h-full w-full object-cover" />
          <div v-if="(mode === 'photo' || mode === 'video') && !sourceLoaded" class="absolute inset-0 flex flex-col items-center justify-center gap-3.5 text-cream-200">
            <component :is="mode === 'photo' ? User : Smartphone" :size="40" class="text-pine-300" />
            <button @click="(mode === 'photo' ? photoInputRef : videoInputRef)?.click()" class="rounded-sm border border-cream-100 px-5 py-2.5 text-sm">
              {{ mode === 'photo' ? L(S.choosePhoto) : L(S.chooseVideo) }}
            </button>
          </div>
          <div v-if="mode !== 'photo' && sourceLoaded && status === 'ready' && !hasFace && !err" class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3.5 py-2.5 text-center text-[13px] text-cream-100">{{ L(S.position) }}</div>
        </div>
      </div>

      <!-- video transport -->
      <div v-if="mode === 'video' && sourceLoaded" class="mx-auto flex w-full max-w-[680px] items-center gap-3 px-6 pt-2.5">
        <button @click="togglePlay" :aria-label="playing ? 'pause' : 'play'" class="rounded-sm border border-white/20 p-2 text-cream-100"><component :is="playing ? Pause : Play" :size="15" /></button>
        <input type="range" min="0" max="1" step="0.001" :value="progress" @input="scrub(Number(($event.target as HTMLInputElement).value))" aria-label="scrubber" class="flex-1 accent-amber-500" />
      </div>

      <!-- product carousel -->
      <div v-if="catalog.length > 1" role="listbox" :aria-label="L(S.tryMirror)" class="flex gap-2.5 overflow-x-auto px-5 pb-2.5 pt-1.5" style="scroll-snap-type:x mandatory">
        <button v-for="prod in catalog" :key="prod.id" role="option" :aria-selected="prod.id === active.id" @click="switchProduct(prod)"
          class="w-28 flex-none rounded-md border p-2 text-center text-cream-100" style="scroll-snap-align:center"
          :class="prod.id === active.id ? 'border-amber-500 bg-amber-500/15' : 'border-white/20'">
          <span class="mb-1.5 flex h-11 items-center justify-center overflow-hidden rounded bg-white/5">
            <img v-if="prod.image" :src="prod.image" alt="" class="max-h-full max-w-full object-contain" />
          </span>
          <span class="block truncate text-[9.5px] uppercase tracking-wide text-pine-200">{{ prod.brand }}</span>
          <span class="block truncate text-[11px] leading-tight">{{ L(prod.name) || prod.name }}</span>
          <span class="block text-[12.5px] font-bold text-amber-500">₪{{ prod.amount }}</span>
        </button>
      </div>

      <!-- controls -->
      <div class="flex flex-col items-center gap-3 px-6 pb-6 pt-3">
        <div class="flex items-center gap-3 text-cream-100">
          <span class="font-display text-[11.5px] uppercase tracking-[0.12em] text-pine-200">{{ L(S.size) }}</span>
          <button @click="bump(-0.05)" aria-label="smaller" class="rounded-sm border border-white/20 px-2.5 py-1 text-lg leading-none">−</button>
          <input type="range" min="0.8" max="1.4" step="0.05" v-model.number="size" :aria-label="L(S.size)" class="w-40 accent-amber-500" />
          <button @click="bump(0.05)" aria-label="larger" class="rounded-sm border border-white/20 p-1.5"><Plus :size="15" /></button>
          <span class="min-w-[44px] text-center font-display text-sm text-amber-500">{{ sizePct }}</span>
        </div>
        <div v-if="(active.colors || []).length" class="flex gap-2.5">
          <button v-for="(c, i) in active.colors" :key="i" @click="colorIdx = i" :aria-label="`color ${i + 1}`"
            class="h-[30px] w-[30px] rounded-full border-2" :style="{ background: c }" :class="colorIdx === i ? 'border-amber-500' : 'border-transparent'" />
        </div>
        <div class="flex flex-wrap justify-center gap-2.5">
          <button @click="download" class="inline-flex items-center gap-2 rounded-sm px-4 py-2.5 text-pine-100 hover:bg-white/10"><Share2 :size="16" /> {{ L(S.download) }}</button>
          <button @click="addToCart" class="inline-flex items-center gap-2 rounded-sm bg-amber-500 px-5 py-2.5 font-display text-sm text-pine-950 hover:brightness-105"><ShoppingBag :size="17" /> {{ L(S.add) }} · {{ sizePct }}</button>
        </div>
        <span class="text-center text-[11.5px] tracking-[0.04em] text-pine-300">{{ L(S.privacy) }}</span>
      </div>

      <input ref="photoInputRef" type="file" accept="image/*" class="hidden" @change="mode = 'photo'; handleFile(($event.target as HTMLInputElement).files?.[0], 'photo'); ($event.target as HTMLInputElement).value = ''" />
      <input ref="videoInputRef" type="file" accept="video/*" class="hidden" @change="handleFile(($event.target as HTMLInputElement).files?.[0], 'video'); ($event.target as HTMLInputElement).value = ''" />
    </div>
  </Teleport>
</template>
