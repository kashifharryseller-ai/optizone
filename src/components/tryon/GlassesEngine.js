// GlassesEngine — real-time 3D glasses overlay on a detected face.
//
// A self-contained Three.js engine that renders a product's frame model onto an
// offscreen WebGL canvas, which TryMirror composites over the 2D video canvas
// each frame (so a single output canvas keeps Download Photo intact). It:
//   • builds an orthographic scene in pixel space (world x/y = canvas x/y),
//   • derives a full 3D pose (roll + yaw + pitch) from MediaPipe landmarks,
//   • scales the frame to the face and the size slider,
//   • builds a depth-only face-oval occluder so temple arms hide behind the head,
//   • smooths pose with lerp/slerp and holds/fades when the face is lost.
//
// Reference pattern: alperenuzun/basic-virtual-tryon-glasses (MediaPipe + Three).
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { CFG, LM, FACE_OVAL } from './config.js'

// url → Promise<THREE.Group> of a normalised (unit-width, origin-centred) model.
const MODEL_CACHE = new Map()
const loader = new GLTFLoader()

function loadModel(url) {
  if (MODEL_CACHE.has(url)) return MODEL_CACHE.get(url)
  const p = new Promise((resolve, reject) => {
    loader.load(
      url,
      (gltf) => {
        const root = gltf.scene || gltf.scenes?.[0]
        if (!root) return reject(new Error('empty gltf'))
        // Normalise: centre at origin and scale so the widest axis = 1 unit.
        const box = new THREE.Box3().setFromObject(root)
        const size = new THREE.Vector3(); box.getSize(size)
        const center = new THREE.Vector3(); box.getCenter(center)
        root.position.sub(center)
        const wrap = new THREE.Group()
        wrap.add(root)
        const width = size.x || size.y || size.z || 1
        wrap.scale.setScalar(1 / width)
        resolve(wrap)
      },
      undefined,
      (err) => reject(err),
    )
  })
  MODEL_CACHE.set(url, p)
  return p
}

export class GlassesEngine {
  constructor(width = 640, height = 480) {
    this.w = width; this.h = height
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, premultipliedAlpha: false })
    this.renderer.setClearColor(0x000000, 0)
    this.renderer.setSize(width, height, false)
    this.canvas = this.renderer.domElement

    this.scene = new THREE.Scene()
    // Orthographic, pixel-space: (0,0) top-left, +y down — matches the 2D canvas
    // and landmark coords. Camera in front (+z) looking toward the face plane.
    this.camera = new THREE.OrthographicCamera(0, width, 0, height, -2000, 2000)
    this.camera.position.set(0, 0, 1000)
    this.camera.lookAt(0, 0, 0)

    this.scene.add(new THREE.AmbientLight(0xffffff, 0.9))
    const dir = new THREE.DirectionalLight(0xffffff, 0.8)
    dir.position.set(0.3, -0.5, 1)
    this.scene.add(dir)

    // Frame content holder (a .glb model OR a textured plane), swapped on
    // colour/asset change.
    this.frame = new THREE.Group()
    this.frame.visible = false
    this.scene.add(this.frame)
    this.content = null      // mounted Object3D (model clone or plane mesh)
    this.contentUrl = ''     // its source URL
    this.contentKind = ''    // 'model' | 'plane'
    this._pendingUrl = ''    // most-recent requested URL (async supersession guard)

    // Depth-only occluder (writes depth, not colour) rendered before the frame.
    const occGeo = new THREE.BufferGeometry()
    const ring = FACE_OVAL.length
    // vertices: centroid + ring; triangle-fan indices
    occGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array((ring + 1) * 3), 3))
    const idx = []
    for (let i = 0; i < ring; i++) idx.push(0, i + 1, ((i + 1) % ring) + 1)
    occGeo.setIndex(idx)
    const occMat = new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: true })
    this.occluder = new THREE.Mesh(occGeo, occMat)
    this.occluder.renderOrder = 0
    this.occluder.visible = false
    this.frame.renderOrder = 1
    this.scene.add(this.occluder)

    // Smoothed pose state.
    this._pos = new THREE.Vector3()
    this._quat = new THREE.Quaternion()
    this._scale = 1
    this._init = false
    this._miss = CFG.faceHoldFrames

    // Scratch objects (no per-frame allocation).
    this._m = new THREE.Matrix4()
    this._ex = new THREE.Vector3(); this._ey = new THREE.Vector3(); this._ez = new THREE.Vector3()
    this._a = new THREE.Vector3(); this._b = new THREE.Vector3()
    this._fore = new THREE.Vector3(); this._chin = new THREE.Vector3()
    this._tPos = new THREE.Vector3(); this._tQuat = new THREE.Quaternion()
  }

  resize(width, height) {
    if (width === this.w && height === this.h) return
    this.w = width; this.h = height
    this.renderer.setSize(width, height, false)
    this.camera.right = width; this.camera.bottom = height
    this.camera.updateProjectionMatrix()
  }

  // Whether `url` is loaded and currently mounted as the active frame content.
  hasContent(url) { return !!url && this.contentUrl === url && !!this.content }
  hasModel(url) { return this.hasContent(url) } // back-compat alias

  // Load + mount a .glb/.gltf frame model. Resolves true on success, false on
  // failure (caller falls back to the plane/vector path). `_pendingUrl` tracks
  // the most recent request so an out-of-order async load can't win.
  async setModel(url) {
    if (!url) { this._clearContent(); return false }
    if (this.contentUrl === url && this.content) return true
    this._pendingUrl = url
    try {
      const template = await loadModel(url)
      if (this._pendingUrl !== url) return false // superseded by a newer colour
      this._swap(template.clone(true), 'model', url)
      return true
    } catch (err) {
      console.warn(`[tryon] 3D model failed to load (${url}):`, err?.message || err)
      return false
    }
  }

  // Load a transparent frame image and mount it as a texture on a unit-width
  // plane — tracked in 3D exactly like a model (roll/yaw/pitch/scale + occluder).
  async setPlane(url) {
    if (!url) { this._clearContent(); return false }
    if (this.contentUrl === url && this.content) return true
    this._pendingUrl = url
    try {
      const tex = await new Promise((resolve, reject) => {
        const img = new Image(); img.crossOrigin = 'anonymous'
        img.onload = () => resolve(img); img.onerror = () => reject(new Error('image load failed'))
        img.src = url
      })
      if (this._pendingUrl !== url) return false // superseded
      const aspect = (tex.naturalHeight || 1) / (tex.naturalWidth || 1)
      const texture = new THREE.Texture(tex); texture.colorSpace = THREE.SRGBColorSpace; texture.needsUpdate = true
      const geo = new THREE.PlaneGeometry(1, aspect)
      const mat = new THREE.MeshBasicMaterial({ map: texture, transparent: true, alphaTest: 0.02, depthWrite: false, side: THREE.DoubleSide })
      this._swap(new THREE.Mesh(geo, mat), 'plane', url)
      return true
    } catch (err) {
      console.warn(`[tryon] frame image failed to load (${url}):`, err?.message || err)
      return false
    }
  }

  // Mount new content, disposing whatever was there (per its OLD kind) first.
  _swap(obj, kind, url) {
    this._disposeCurrent()
    this.content = obj; this.contentKind = kind; this.contentUrl = url
    this.frame.add(obj)
    this._init = false
  }

  // Remove + dispose the current content object (a plane owns its GPU resources;
  // a model clone SHARES them with the cached template, so it is never disposed).
  _disposeCurrent() {
    if (!this.content) return
    this.frame.remove(this.content)
    if (this.contentKind === 'plane') {
      this.content.geometry?.dispose?.()
      this.content.material?.map?.dispose?.()
      this.content.material?.dispose?.()
    }
    this.content = null
  }

  _clearContent() {
    this._disposeCurrent()
    this._pendingUrl = ''; this.contentUrl = ''; this.contentKind = ''
    this.frame.visible = false
    this.occluder.visible = false
  }

  // Convert a landmark to pixel-space world coords, honouring mirroring.
  _px(pts, i, out) {
    const p = pts[i]
    const x = this.mirror ? (1 - p.x) * this.w : p.x * this.w
    return out.set(x, p.y * this.h, (p.z || 0) * this.w * -1)
  }

  // Update the frame pose from landmarks. `pts` may be null (face lost).
  update(pts, meta, sliderSize, mirrored) {
    this.mirror = !!mirrored
    if (!this.content) return
    if (!pts || !pts[LM.leftEyeOuter] || !pts[LM.rightEyeOuter] || !pts[LM.forehead] || !pts[LM.chin]) {
      // Face lost (or the mesh is incomplete): hold the last pose, then hide.
      if (++this._miss > CFG.faceHoldFrames) { this.frame.visible = false; this.occluder.visible = false }
      return
    }
    this._miss = 0
    this.frame.visible = true
    this.occluder.visible = true
    const M = meta || {}

    // ── anchors ──────────────────────────────────────────────────────────────
    const lEye = this._px(pts, LM.leftEyeOuter, this._a)
    const rEye = this._px(pts, LM.rightEyeOuter, this._b)
    const eyeMid = this._tPos.copy(lEye).add(rEye).multiplyScalar(0.5)
    const eyeDist = lEye.distanceTo(rEye)

    // ── orientation basis (roll + yaw + pitch) ────────────────────────────────
    // X: along the eye line; Y: chin→forehead (up); Z: face normal = X × Y.
    this._ex.copy(lEye).sub(rEye).normalize()
    const fore = this._px(pts, LM.forehead, this._fore)
    const chin = this._px(pts, LM.chin, this._chin)
    this._ey.copy(fore).sub(chin).normalize()
    this._ez.crossVectors(this._ex, this._ey).normalize()
    if (this._ez.z < 0) this._ez.negate()          // keep the normal facing the camera
    this._ey.crossVectors(this._ez, this._ex).normalize() // re-orthonormalise
    this._m.makeBasis(this._ex, this._ey, this._ez)
    this._tQuat.setFromRotationMatrix(this._m)

    // ── position: on the nose bridge, pushed out along the normal ─────────────
    const down = CFG.glassesDown + (M.bridgeYOffset || 0)
    eyeMid.addScaledVector(this._ez, CFG.glassesDepth)
    eyeMid.addScaledVector(this._ey, -down)          // +y is down; -ey nudges down
    eyeMid.addScaledVector(this._ex, CFG.glassesCenterX)

    // ── scale: tied to eye distance, the size slider and calibration ──────────
    // A planar cut-out's width usually includes the folded temple tips peeking
    // past the lenses, so the lenses land ~12% small — compensate.
    const planeComp = this.contentKind === 'plane' ? 1.12 : 1
    const targetW = eyeDist * CFG.eyeToFrameRatio * CFG.glassesScale * planeComp * (M.scaleMultiplier || 1) * (sliderSize || 1)

    // ── smoothing (snap on first frame after mount) ───────────────────────────
    const k = this._init ? CFG.smoothing : 1
    this._pos.lerp(eyeMid, k)
    this._quat.slerp(this._tQuat, k)
    this._scale += (targetW - this._scale) * k
    this._init = true

    this.frame.position.copy(this._pos)
    this.frame.quaternion.copy(this._quat)
    this.frame.scale.setScalar(this._scale)

    this._updateOccluder(pts)
  }

  _updateOccluder(pts) {
    const pos = this.occluder.geometry.getAttribute('position')
    const arr = pos.array
    let cx = 0, cy = 0, n = 0
    for (let i = 0; i < FACE_OVAL.length; i++) {
      const p = pts[FACE_OVAL[i]]
      if (!p) continue
      const x = this.mirror ? (1 - p.x) * this.w : p.x * this.w
      const y = p.y * this.h
      arr[(i + 1) * 3] = x; arr[(i + 1) * 3 + 1] = y; arr[(i + 1) * 3 + 2] = 0
      cx += x; cy += y; n++
    }
    arr[0] = n ? cx / n : 0; arr[1] = n ? cy / n : 0; arr[2] = 0
    pos.needsUpdate = true
  }

  render() { this.renderer.render(this.scene, this.camera); return this.canvas }

  dispose() {
    this._clearContent()
    this.occluder.geometry.dispose()
    this.occluder.material.dispose()
    this.renderer.dispose()
  }
}
