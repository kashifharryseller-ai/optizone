import { useCallback, useEffect, useRef, useState } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// MediaPipe FaceLandmarker loader (client-side only, no API key, no uploads).
//
// The JS library is the bundled npm package (`npm install @mediapipe/tasks-vision`,
// dynamically imported so it lands in its own lazy chunk). The WASM runtime and
// the float16 model are fetched from the pinned CDN (both CSP-allowed); this is
// the canonical MediaPipe-on-Vite setup and keeps the app bundle lean. If the
// bundled import is ever unavailable, we fall back to loading the ESM bundle
// straight from the CDN so the feature still degrades gracefully.
// ─────────────────────────────────────────────────────────────────────────────
const MP_VERSION = '0.10.35'  // keep in sync with package.json
const CDN_BASES = [
  `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MP_VERSION}`,
  `https://unpkg.com/@mediapipe/tasks-vision@${MP_VERSION}`,
]
const WASM_BASE = `${CDN_BASES[0]}/wasm`
const MODEL_URL = 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task'

let modulePromise = null
async function loadModule() {
  // 1) Bundled package (spec: npm install @mediapipe/tasks-vision).
  try {
    const mod = await import('@mediapipe/tasks-vision')
    const fileset = await mod.FilesetResolver.forVisionTasks(WASM_BASE)
    return { FaceLandmarker: mod.FaceLandmarker, fileset }
  } catch { /* fall through to CDN */ }
  // 2) CDN ESM fallback.
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

// Deterministic test hook: when window.__OZ_FACE_MOCK__ = { landmarks, matrix }
// is present, return a stub landmarker instead of downloading the real model,
// so the overlay render path can be exercised headlessly.
function makeMockLandmarker() {
  const build = () => {
    const m = window.__OZ_FACE_MOCK__
    if (!m || !m.landmarks) return { faceLandmarks: [], facialTransformationMatrixes: [] }
    const arr = []
    for (const k of Object.keys(m.landmarks)) arr[Number(k)] = m.landmarks[k]
    return { faceLandmarks: [arr], facialTransformationMatrixes: m.matrix ? [{ data: m.matrix }] : [] }
  }
  return { setOptions: async () => {}, detect: build, detectForVideo: build, close: () => {} }
}

let landmarkerPromise = null
// Load FaceLandmarker ONCE (module-scoped cache → instant on reopen). Created
// with facial transformation matrices on, single face, VIDEO running mode by
// default, GPU delegate with automatic CPU fallback.
async function createLandmarker() {
  if (typeof window !== 'undefined' && window.__OZ_FACE_MOCK__) return makeMockLandmarker()
  if (landmarkerPromise) return landmarkerPromise
  landmarkerPromise = (async () => {
    modulePromise = modulePromise || loadModule()
    const { FaceLandmarker, fileset } = await modulePromise
    const opts = (delegate) => ({
      baseOptions: { modelAssetPath: MODEL_URL, delegate },
      runningMode: 'VIDEO',
      numFaces: 1,
      outputFacialTransformationMatrixes: true,
    })
    try { return await FaceLandmarker.createFromOptions(fileset, opts('GPU')) }
    catch { return await FaceLandmarker.createFromOptions(fileset, opts('CPU')) }
  })().catch((e) => { landmarkerPromise = null; modulePromise = null; throw e })
  return landmarkerPromise
}

/**
 * useFaceLandmarker(active) — loads the model when `active` (modal open) and
 * exposes:
 *   status        'idle' | 'loading' | 'ready' | 'error'
 *   get()         the landmarker instance (or null)
 *   setRunningMode(mode)  switch 'VIDEO' ⇄ 'IMAGE' (guarded against re-entrancy)
 *   retry()       re-attempt a failed load
 */
export function useFaceLandmarker(active) {
  const [status, setStatus] = useState('idle')
  const ref = useRef(null)
  const runningMode = useRef('VIDEO')
  const switching = useRef(false)

  const load = useCallback(() => {
    setStatus('loading')
    createLandmarker()
      .then((lm) => { ref.current = lm; runningMode.current = 'VIDEO'; setStatus('ready') })
      .catch(() => { ref.current = null; setStatus('error') })
  }, [])

  useEffect(() => { if (active && !ref.current) load() }, [active, load])

  const setRunningMode = useCallback(async (mode) => {
    const lm = ref.current
    if (!lm || runningMode.current === mode || switching.current) return
    switching.current = true
    try { await lm.setOptions({ runningMode: mode }); runningMode.current = mode }
    finally { switching.current = false }
  }, [])

  return { status, get: () => ref.current, setRunningMode, retry: load, runningMode }
}
