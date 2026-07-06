// Generate a minimal, valid glasses-shaped glTF demo model so the 3D try-on
// engine can be exercised without a commissioned asset. Two torus lenses + a
// bridge + two temple arms extending backward (-z) so the occluder can hide
// them on head turns. Lenses face +z (modelForwardAxis: 'z').
//
// Output is a binary .glb (geometry embedded as a BIN chunk) — NOT a .gltf with
// a data: URI buffer, which the app CSP's connect-src would block. Real product
// assets should likewise be .glb so they load with a single same-origin fetch.
//
//   node scripts/gen-demo-frame.mjs  →  public/tryon/models/demo-frame.glb
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { writeFileSync, mkdirSync } from 'node:fs'

const parts = []
const lensL = new THREE.TorusGeometry(0.9, 0.12, 12, 40); lensL.translate(-1.15, 0, 0)
const lensR = new THREE.TorusGeometry(0.9, 0.12, 12, 40); lensR.translate(1.15, 0, 0)
const bridge = new THREE.BoxGeometry(0.5, 0.14, 0.14); bridge.translate(0, 0.1, 0)
const templeL = new THREE.BoxGeometry(0.14, 0.14, 2.2); templeL.translate(-2.02, 0.15, -1.0)
const templeR = new THREE.BoxGeometry(0.14, 0.14, 2.2); templeR.translate(2.02, 0.15, -1.0)
parts.push(lensL, lensR, bridge, templeL, templeR)

const geo = mergeGeometries(parts, false)
geo.computeVertexNormals()

const pos = geo.getAttribute('position').array
const nor = geo.getAttribute('normal').array
const idx = geo.getIndex().array
const posF = Float32Array.from(pos)
const norF = Float32Array.from(nor)
const idxU = Uint32Array.from(idx)

// min/max for the POSITION accessor
const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity]
for (let i = 0; i < posF.length; i += 3) for (let k = 0; k < 3; k++) { min[k] = Math.min(min[k], posF[i + k]); max[k] = Math.max(max[k], posF[i + k]) }

// pack buffer: [indices][positions][normals], 4-byte aligned
const idxBytes = idxU.byteLength
const posBytes = posF.byteLength
const norBytes = norF.byteLength
const buf = Buffer.alloc(idxBytes + posBytes + norBytes)
Buffer.from(idxU.buffer).copy(buf, 0)
Buffer.from(posF.buffer).copy(buf, idxBytes)
Buffer.from(norF.buffer).copy(buf, idxBytes + posBytes)

const gltf = {
  asset: { version: '2.0', generator: 'OPTIZONE demo-frame' },
  scene: 0,
  scenes: [{ nodes: [0] }],
  nodes: [{ mesh: 0 }],
  materials: [{ name: 'frame', pbrMetallicRoughness: { baseColorFactor: [0.09, 0.09, 0.1, 1], metallicFactor: 0.2, roughnessFactor: 0.6 } }],
  meshes: [{ primitives: [{ attributes: { POSITION: 1, NORMAL: 2 }, indices: 0, material: 0 }] }],
  buffers: [{ byteLength: buf.length }], // no uri → data lives in the GLB BIN chunk
  bufferViews: [
    { buffer: 0, byteOffset: 0, byteLength: idxBytes, target: 34963 },
    { buffer: 0, byteOffset: idxBytes, byteLength: posBytes, target: 34962 },
    { buffer: 0, byteOffset: idxBytes + posBytes, byteLength: norBytes, target: 34962 },
  ],
  accessors: [
    { bufferView: 0, componentType: 5125, count: idxU.length, type: 'SCALAR' },                 // 5125 = UNSIGNED_INT
    { bufferView: 1, componentType: 5126, count: posF.length / 3, type: 'VEC3', min, max },       // 5126 = FLOAT
    { bufferView: 2, componentType: 5126, count: norF.length / 3, type: 'VEC3' },
  ],
}

// ── assemble the binary .glb container ─────────────────────────────────────────
const pad = (b, fill) => { const r = b.length % 4; return r ? Buffer.concat([b, Buffer.alloc(4 - r, fill)]) : b }
const jsonChunk = pad(Buffer.from(JSON.stringify(gltf), 'utf8'), 0x20) // pad with spaces
const binChunk = pad(buf, 0x00)
const header = Buffer.alloc(12)
header.writeUInt32LE(0x46546c67, 0)                                   // magic 'glTF'
header.writeUInt32LE(2, 4)                                            // version 2
header.writeUInt32LE(12 + 8 + jsonChunk.length + 8 + binChunk.length, 8) // total length
const chunk = (len, type) => { const h = Buffer.alloc(8); h.writeUInt32LE(len, 0); h.writeUInt32LE(type, 4); return h }
const glb = Buffer.concat([
  header,
  chunk(jsonChunk.length, 0x4e4f534a), jsonChunk,  // 'JSON'
  chunk(binChunk.length, 0x004e4942), binChunk,    // 'BIN\0'
])

mkdirSync('public/tryon/models', { recursive: true })
writeFileSync('public/tryon/models/demo-frame.glb', glb)
console.log(`demo-frame.glb written — ${idxU.length / 3} tris, ${posF.length / 3} verts, ${(glb.length / 1024).toFixed(1)} KB`)
