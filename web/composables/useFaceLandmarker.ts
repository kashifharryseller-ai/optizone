// MediaPipe FaceLandmarker loader (client-only, no key, no uploads) — Vue port of
// the React hook. The npm package is dynamically imported (its own lazy chunk);
// the WASM runtime + float16 model come from the pinned CDN (CSP-allowed), with a
// CDN-ESM fallback if the bundled import is unavailable.
import { ref } from 'vue'

const MP_VERSION = '0.10.35'
const CDN_BASES = [
  `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MP_VERSION}`,
  `https://unpkg.com/@mediapipe/tasks-vision@${MP_VERSION}`,
]
const WASM_BASE = `${CDN_BASES[0]}/wasm`
const MODEL_URL = 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task'

let modulePromise: Promise<any> | null = null
async function loadModule() {
  try {
    const mod: any = await import('@mediapipe/tasks-vision')
    const fileset = await mod.FilesetResolver.forVisionTasks(WASM_BASE)
    return { FaceLandmarker: mod.FaceLandmarker, fileset }
  } catch { /* fall through to CDN */ }
  let lastErr: any
  for (const base of CDN_BASES) {
    try {
      const mod: any = await import(/* @vite-ignore */ `${base}/vision_bundle.mjs`)
      const fileset = await mod.FilesetResolver.forVisionTasks(`${base}/wasm`)
      return { FaceLandmarker: mod.FaceLandmarker, fileset }
    } catch (e) { lastErr = e }
  }
  throw lastErr || new Error('mediapipe-load-failed')
}

let landmarkerPromise: Promise<any> | null = null
async function createLandmarker() {
  if (landmarkerPromise) return landmarkerPromise
  landmarkerPromise = (async () => {
    modulePromise = modulePromise || loadModule()
    const { FaceLandmarker, fileset } = await modulePromise
    const opts = (delegate: string) => ({
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

// useFaceLandmarker() — call load() when the modal opens; exposes status, the
// instance getter, and a VIDEO⇄IMAGE running-mode switch (re-entrancy guarded).
export function useFaceLandmarker() {
  const status = ref<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const instance = ref<any>(null)
  let runningMode = 'VIDEO'
  let switching = false

  function load() {
    if (instance.value) return
    status.value = 'loading'
    createLandmarker()
      .then((lm) => { instance.value = lm; runningMode = 'VIDEO'; status.value = 'ready' })
      .catch(() => { instance.value = null; status.value = 'error' })
  }
  const get = () => instance.value
  async function setRunningMode(mode: 'VIDEO' | 'IMAGE') {
    const lm = instance.value
    if (!lm || runningMode === mode || switching) return
    switching = true
    try { await lm.setOptions({ runningMode: mode }); runningMode = mode }
    finally { switching = false }
  }
  const retry = () => { landmarkerPromise = null; modulePromise = null; instance.value = null; load() }

  return { status, load, get, setRunningMode, retry }
}
