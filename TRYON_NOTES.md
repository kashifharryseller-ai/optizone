# OPTIZONE — Virtual Try-On (Try Mirror) notes

Real-time glasses overlay on a detected face, in three modes (Live webcam,
Upload Photo, Upload Video). All processing is **in-browser** — MediaPipe
FaceLandmarker for the face mesh, Three.js for the 3D frame. Nothing is uploaded.

## Architecture

```
useFaceLandmarker  → 468-pt face mesh (+ 4×4 transform matrix)
        │
TryMirror.jsx  (paint loop, one 640×480 2D <canvas>)
        │  draws the video frame, then the overlay via the fallback chain:
        ├─ 1. GlassesEngine (Three.js), composited with ctx.drawImage(glCanvas):
        │        • a .glb model  (full all-around 3D), else
        │        • the transparent PNG on a tracked PLANE (3D-tracked flat frame)
        ├─ 2. drawPng()   (flat 2D) — only if WebGL is unavailable
        └─ 3. drawVector() (procedural frame) — last resort, console.warn
```

Both engine paths track the same 3D pose (roll + yaw + pitch + scale) with the
depth occluder and smoothing. The difference is only the geometry: a real model
has volume and temple arms (hide behind the head on turns); a planar PNG is a
flat frame that still tilts/turns with the face — great head-on and for moderate
turns, but with no true side profile.

- The engine renders into its **own offscreen WebGL canvas**, which the paint
  loop composites onto the single 2D canvas each frame. That keeps one output
  canvas, so **Download Photo** (`canvas.toDataURL`) captures the composite and
  never taints.
- The engine (and its ~145 KB gz Three.js dependency) is **lazy-loaded** — the
  `GlassesEngine` chunk is only fetched when a product actually has a 3D model,
  so the storefront bundle is unaffected for everyone else.
- Live mode is mirrored by a single CSS `transform: scaleX(-1)` on the canvas;
  the scene is rendered in video space and flipped once (no left/right swaps).

Key files:
- `src/components/TryMirror.jsx` — modal, modes, paint loop, fallback chain.
- `src/components/tryon/GlassesEngine.js` — Three.js scene, landmark→pose math,
  occluder, smoothing, model cache.
- `src/components/tryon/config.js` — `CFG` / `LM` / `FACE_OVAL` / `DEFAULT_META`
  and `resolveTryonAsset()`.
- `scripts/gen-demo-frame.mjs` — regenerates the demo `.glb`.

## Data model

Each `tryMirror: true` product (glasses & sunglasses only) may carry:

```js
tryMirrorModel: { "#1A1A17": "/tryon/models/frame-black.glb" },  // per-colour 3D
tryMirrorImg:   { "#1A1A17": "/tryon/png/frame-black.png" },     // per-colour 2D fallback
tryMirrorMeta:  { modelForwardAxis: "z", scaleMultiplier: 1.0, bridgeYOffset: 0, frameRealWidthMm: 118 }
```

- Keys are the hex values from the product's `colors` array (the colour dots).
- `tryMirrorImg` may also be a **legacy single string** (applies to every colour);
  it's read that way and migrated to a map on the first per-colour edit.
- Manage all of this in **Admin → Try-Mirror / AR** (per-colour model URL + PNG).
- The server sanitises these fields (`server/routes/admin.js`): asset refs are
  tag-stripped, length-capped, `javascript:` blocked; meta is clamped.

## Asset spec (what to produce)

**3D model — `.glb` (preferred).** A binary glTF, **not** a `.gltf` with a
`data:` URI buffer (the app CSP's `connect-src` blocks `data:`; a `.glb` loads
with one same-origin fetch). Author it:
- **Front view, lenses facing +Z** (the local axis that points out through the
  lenses). If your model faces a different axis, set `tryMirrorMeta.modelForwardAxis`.
- **X = the eye line** (temples left/right), **Y = up**. Temple arms extend
  **backward (−Z)** so the occluder can hide them behind the head on turns.
- Origin near the bridge, real-world proportioned (the engine normalises to
  unit width, then scales to the face — see below).
- Keep it lean (a few k triangles, baked/simple PBR materials). One `.glb` per
  colour, or one model with a per-colour material swap exported separately.

**Frame photo → transparent PNG (the easy path).** In **Admin → Try-Mirror / AR**
you can upload *any* front-facing frame photo — with or without a background.
The browser removes the background automatically (`src/lib/bgRemove.js`): it
samples the border to estimate the backdrop, clears every pixel near that colour
(so the see-through lens areas clear too), feathers the edge and crops to the
frame. You get a live preview on a transparency checkerboard, a slider to tune
how much is removed, and a warning if the shot looks angled or the background is
busy. The result is a transparent PNG rendered as a **3D-tracked plane** (above).

Best input: a **front-on** shot on a **plain, light** background. Busy/real-world
backgrounds are the documented limitation of the no-dependency remover — for
those, cut the frame out in an image editor and upload the transparent PNG, or
use the "Use original (already transparent)" button.

A flat photo has no back or side, so it can't become a truly rotatable model —
that still needs a `.glb` (best) which you add per colour when you have one.

The repo ships `public/tryon/models/demo-frame.glb` (a generated placeholder,
wired to the Prada PR 17WS black variant) purely so the engine can be seen
working. **Replace it with real, brand-accurate models.**

## Calibration (`CFG` in `config.js`, per-product `tryMirrorMeta` overrides)

| Constant | Meaning | Tune when… |
|---|---|---|
| `eyeToFrameRatio` | frame width ÷ outer-eye distance | frame reads too wide/narrow |
| `glassesScale` | global size trim | everything slightly big/small |
| `glassesDepth` | push-out along the face normal (px) | frame sinks into / floats off the face |
| `glassesDown` | drop onto the nose bridge (px) | sits too high/low (global) |
| `glassesCenterX` | horizontal nudge (px) | frame is off-centre |
| `smoothing` | lerp/slerp factor 0–1 | jittery (lower) vs laggy (higher) |
| `faceHoldFrames` | frames to hold pose after a lost face | flicker on brief detection drops |
| `refHeadWidth` / `refFaceHeight` | reference face dimensions | true-to-size scaling reference |

Per-product `tryMirrorMeta`: `modelForwardAxis` (`x`/`y`/`z`), `scaleMultiplier`
(per-frame fudge), `bridgeYOffset` (px up/down for this frame only),
`frameRealWidthMm` (outer width = lensWidth×2 + bridge, for true-to-size scaling).

## Add try-on to a new product

1. Produce a `.glb` per colour (and optionally a transparent PNG fallback).
2. Put the files under `public/tryon/models/` (and `public/tryon/png/`), or host
   them and use absolute same-origin URLs.
3. In **Admin → Try-Mirror / AR**, turn the product's Try-Mirror **On** and paste
   each colour's model URL / upload its PNG. Save.
4. Tune `tryMirrorMeta` if the frame sits slightly off; adjust global `CFG` only
   for catalog-wide corrections.

Try Mirror is restricted to the `eyeglasses` and `sunglasses` categories
(`src/lib/tryMirror.js`); contacts and other categories never show it.
