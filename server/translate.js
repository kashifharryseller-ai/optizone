// OPTIZONE — automatic translation (English source → Hebrew + Arabic).
//
// Content is authored in English only; this module fills the `he` and `ar`
// values on every bilingual `{ en }` object. Translations are BATCHED (one
// request per language per chunk) so a whole page's content translates in a
// couple of network calls — fast enough to run synchronously inside a request,
// which is required on serverless (Vercel), where fire-and-forget background
// work is killed before it finishes.
//
// Each unique (from,to,text) is cached in the store (meta.i18nCache). If a
// translation fails, the value is left as-is and the storefront's L() helper
// falls back to English — the site never breaks over a translation error.
//
// Engine: the free `google-translate-api-x` library by default. If a
// GOOGLE_TRANSLATE_KEY env var is set, the official Google Cloud Translation API
// is used instead (recommended for production reliability/quality).
const crypto = require('crypto')
const { store } = require('./store')

const TARGET_LANGS = ['he', 'ar'] // source is always 'en'
const CHUNK = 40                  // strings per batch request
const cacheKey = (from, to, text) => crypto.createHash('sha1').update(`${from}|${to}|${text}`).digest('hex')

// --- Engine ------------------------------------------------------------------
let _lib = null
async function lib() {
  if (!_lib) {
    const mod = await import('google-translate-api-x') // ESM → dynamic import from CJS
    _lib = mod.translate || mod.default
  }
  return _lib
}

// Translate an array of strings EN→`to` in a single request. Returns an array
// aligned to the input (throws on failure so the caller can fall back to EN).
async function batchTranslate(texts, to, from = 'en') {
  if (!texts.length) return []
  const gk = process.env.GOOGLE_TRANSLATE_KEY
  if (gk) {
    const res = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(gk)}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ q: texts, source: from, target: to, format: 'text' }),
    })
    if (!res.ok) throw new Error(`translate api ${res.status}`)
    const j = await res.json()
    const arr = j && j.data && j.data.translations
    if (!Array.isArray(arr) || arr.length !== texts.length) throw new Error('translate api: bad shape')
    return arr.map((t) => t.translatedText)
  }
  const translate = await lib()
  const r = await translate(texts, { from, to, forceTo: true, rejectOnPartialFail: false })
  if (Array.isArray(r)) return r.map((x, i) => (x && x.text) || texts[i])
  // Some versions key the result object by index.
  return texts.map((_, i) => (r && r[i] && r[i].text) || texts[i])
}

// --- Tree walking ------------------------------------------------------------
// A "bilingual leaf" is a plain object with a non-empty string `en` value
// (announcement, hero copy, section headings, services, category tiles/pages,
// product badge/desc/specs, booking services, popular searches, store hours…).
const isBilingual = (v) => v && typeof v === 'object' && !Array.isArray(v) && typeof v.en === 'string'

// Collect every (leaf, targetLang, englishText) that needs a translation.
function collect(node, out, seen) {
  if (!node || typeof node !== 'object') return
  if (seen.has(node)) return
  seen.add(node)
  if (isBilingual(node) && node.en.trim()) {
    for (const to of TARGET_LANGS) out.push({ leaf: node, to, en: node.en })
  }
  for (const k of Object.keys(node)) {
    const child = node[k]
    if (child && typeof child === 'object') {
      if (Array.isArray(child)) child.forEach((c) => collect(c, out, seen))
      else collect(child, out, seen)
    }
  }
}

const chunk = (arr, n) => { const out = []; for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n)); return out }

/**
 * Fill `he` and `ar` on every English `{ en }` leaf in `content`, in place.
 * @param content         the content document (mutated)
 * @param fillMissingOnly when true, skip leaves that already have a value for
 *                        the target language (keeps existing Hebrew, adds only
 *                        what's missing); when false, (re)derive he/ar from the
 *                        current English so edits propagate.
 * @returns {Promise<number>} how many strings were translated over the network
 */
async function translateContent(content, { fillMissingOnly = false } = {}) {
  if (!content || typeof content !== 'object') return 0
  const tasks = []
  collect(content, tasks, new WeakSet())

  let meta
  try { meta = await store().getMeta() } catch { meta = {} }
  const cache = (meta && meta.i18nCache && typeof meta.i18nCache === 'object') ? meta.i18nCache : {}

  const needed = tasks.filter(({ leaf, to }) => !(fillMissingOnly && typeof leaf[to] === 'string' && leaf[to].trim()))

  // Apply cache hits; collect misses per language (deduped by English text).
  let networkCount = 0
  const missByLang = { he: new Map(), ar: new Map() } // en → [leaves]
  for (const task of needed) {
    const k = cacheKey('en', task.to, task.en)
    if (typeof cache[k] === 'string') { task.leaf[task.to] = cache[k]; continue }
    const m = missByLang[task.to]
    if (!m.has(task.en)) m.set(task.en, [])
    m.get(task.en).push(task.leaf)
  }

  // Batch-translate the unique misses, one language at a time, in chunks.
  for (const to of TARGET_LANGS) {
    const entries = [...missByLang[to].entries()] // [ [en, leaves[]], … ]
    for (const group of chunk(entries, CHUNK)) {
      const texts = group.map(([en]) => en)
      let outs
      try { outs = await batchTranslate(texts, to, 'en') } catch (e) { console.warn('[translate] en→%s batch failed: %s', to, e.message); continue }
      group.forEach(([en, leaves], i) => {
        const out = outs[i]
        if (out && typeof out === 'string') {
          cache[cacheKey('en', to, en)] = out
          leaves.forEach((leaf) => { leaf[to] = out })
          networkCount++
        }
      })
    }
  }

  if (networkCount > 0) { try { await store().setMeta({ i18nCache: cache }) } catch { /* best-effort */ } }
  return networkCount
}

// True if any bilingual leaf is missing a Hebrew or Arabic value.
function needsTranslation(content) {
  const tasks = []
  collect(content, tasks, new WeakSet())
  return tasks.some(({ leaf, to }) => !(typeof leaf[to] === 'string' && leaf[to].trim()))
}

// Request-safe wrapper used by GET /api/content. Ensures he/ar are present,
// translating + persisting synchronously (so it runs on serverless). Guarded so
// a persistent failure (e.g. the free endpoint blocked) doesn't hammer the
// network on every request — it retries at most once per cooldown window.
let _lastAttempt = 0
let _inFlight = null
const COOLDOWN_MS = 20000
async function ensureContentTranslations(content) {
  if (!content || !needsTranslation(content)) return content
  if (_inFlight) { try { await _inFlight } catch { /* ignore */ } return content }
  const now = Date.now()
  if (now - _lastAttempt < COOLDOWN_MS) return content // recently tried & still missing → skip
  _lastAttempt = now
  _inFlight = (async () => {
    const n = await translateContent(content, { fillMissingOnly: true })
    if (n > 0) {
      content.updatedAt = new Date().toISOString()
      try { await store().setContent(content) } catch { /* persist best-effort */ }
    }
  })().catch((e) => console.warn('[translate] ensure failed:', e.message)).finally(() => { _inFlight = null })
  await _inFlight
  return content
}

module.exports = { translateContent, ensureContentTranslations, TARGET_LANGS }
