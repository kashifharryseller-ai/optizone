// Try-on engine configuration — every tunable in one place.
//
// The virtual try-on overlays the real product frame on a detected face using
// MediaPipe FaceLandmarker (468-point mesh) + Three.js. These constants control
// placement, scale, occlusion and smoothing; per-product overrides come from
// `product.tryMirrorMeta` (see resolveTryonAsset / TRYON_NOTES.md).

// Global calibration. Tune here; per-product `tryMirrorMeta` overrides a subset.
export const CFG = {
  refHeadWidth: 140,     // reference cheek↔cheek distance (px) at nominal scale
  refFaceHeight: 210,    // reference forehead↔chin distance (px)
  glassesDepth: 10,      // push the frame outward along the face normal (px/z)
  glassesDown: 2,        // nudge the frame down onto the nose bridge (px)
  glassesCenterX: 0,     // horizontal nudge (px)
  glassesScale: 1.05,    // global scale trim applied to every frame
  smoothing: 0.4,        // lerp/slerp factor toward the new pose (0..1, higher = snappier)
  eyeToFrameRatio: 1.4,  // frame width ÷ outer-eye distance — 2D fallback path only
  faceHoldFrames: 6,     // keep the last pose this many frames after a face is lost
}

// MediaPipe FaceLandmarker canonical indices (468-mesh). Do not renumber.
export const LM = {
  leftEyeOuter: 33, rightEyeOuter: 263,
  leftEyeInner: 133, rightEyeInner: 362,
  leftTemple: 127, rightTemple: 356,
  leftCheek: 234, rightCheek: 454,
  forehead: 10, chin: 175, noseBridge: 168, noseTip: 1,
}

// Face-oval contour (36 pts) used to build the depth-only occluder mesh so the
// temple arms hide behind the head when the user turns.
export const FACE_OVAL = [
  10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379,
  378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127,
  162, 21, 54, 103, 67, 109,
]

// Default per-product metadata; merged under any `product.tryMirrorMeta`.
export const DEFAULT_META = {
  modelForwardAxis: 'z', // which local model axis points out through the lenses
  scaleMultiplier: 1.0,  // per-frame fudge factor
  bridgeYOffset: 0,      // extra px nudge up/down to sit on the nose
  frameRealWidthMm: 0,   // outer frame width in mm (lensWidth*2 + bridge); 0 = proportional scale
}

// Resolve a product's try-on assets for a given colour hex, with backward
// compatibility: `tryMirrorImg` may be a legacy single string (all colours) or
// a { "#hex": url } map; `tryMirrorModel` is a { "#hex": url } map.
//
//   → { model, png, meta }   (model/png are '' when absent)
export function resolveTryonAsset(product, colorHex) {
  const pick = (field) => {
    const v = product && product[field]
    if (!v) return ''
    if (typeof v === 'string') return v            // legacy: one asset for all colours
    if (typeof v === 'object') {
      // Exact colour only — never show a different colour's frame on the
      // storefront. With no colour context, use any defined asset.
      if (colorHex) return v[colorHex] || ''
      return Object.values(v).find(Boolean) || ''
    }
    return ''
  }
  return {
    model: pick('tryMirrorModel'),
    png: pick('tryMirrorImg'),
    meta: { ...DEFAULT_META, ...(product && product.tryMirrorMeta) },
  }
}
