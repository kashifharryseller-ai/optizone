// OPTIZONE — automatic translation (English source → Hebrew + Arabic).
//
// Content is authored in English only; this module fills the `he` and `ar`
// values on every bilingual `{ en }` object. Each unique (from,to,text) is
// translated ONCE and cached in the store (meta.i18nCache), so repeat saves are
// cheap and only genuinely new/changed English text hits the network. If a
// translation fails, the value is left as-is and the storefront's L() helper
// falls back to English — the site never breaks over a translation error.
//
// Engine: the free `google-translate-api-x` library by default. If a
// GOOGLE_TRANSLATE_KEY env var is set, the official Google Cloud Translation API
// is used instead (recommended for production reliability/quality).
const crypto = require('crypto')
const { store } = require('./store')

const TARGET_LANGS = ['he', 'ar'] // source is always 'en'
const MAX_CONCURRENCY = 5
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

async function rawTranslate(text, to, from) {
  const gk = process.env.GOOGLE_TRANSLATE_KEY
  if (gk) {
    const res = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(gk)}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ q: text, source: from, target: to, format: 'text' }),
    })
    if (!res.ok) throw new Error(`translate api ${res.status}`)
    const j = await res.json()
    const out = j && j.data && j.data.translations && j.data.translations[0] && j.data.translations[0].translatedText
    if (!out) throw new Error('translate api: empty result')
    return out
  }
  const translate = await lib()
  const r = await translate(String(text), { from, to, forceTo: true, rejectOnPartialFail: false })
  return (r && r.text) || String(text)
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
  if (isBilingual(node)) {
    const en = node.en
    if (en.trim()) {
      for (const to of TARGET_LANGS) out.push({ leaf: node, to, en })
    }
  }
  for (const k of Object.keys(node)) {
    const child = node[k]
    if (child && typeof child === 'object') {
      if (Array.isArray(child)) child.forEach((c) => collect(c, out, seen))
      else collect(child, out, seen)
    }
  }
}

// Run async tasks with a small concurrency cap.
async function pooled(items, worker, limit = MAX_CONCURRENCY) {
  const results = []
  let i = 0
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (i < items.length) {
      const idx = i++
      results[idx] = await worker(items[idx], idx)
    }
  })
  await Promise.all(runners)
  return results
}

/**
 * Fill `he` and `ar` on every English `{ en }` leaf in `content`, in place.
 * @param content        the content document (mutated)
 * @param fillMissingOnly when true, skip leaves that already have a non-empty
 *                        value for the target language (used for boot backfill,
 *                        so existing hand-written Hebrew is preserved); when
 *                        false (admin save), (re)derive he/ar from the current
 *                        English so edits propagate.
 * @returns {Promise<number>} how many network translations were performed
 */
async function translateContent(content, { fillMissingOnly = false } = {}) {
  if (!content || typeof content !== 'object') return 0
  const tasks = []
  collect(content, tasks, new WeakSet())

  // Load the persisted cache once.
  let meta
  try { meta = await store().getMeta() } catch { meta = {} }
  const cache = (meta && meta.i18nCache && typeof meta.i18nCache === 'object') ? meta.i18nCache : {}

  const needed = tasks.filter(({ leaf, to }) => {
    if (fillMissingOnly && typeof leaf[to] === 'string' && leaf[to].trim()) return false
    return true
  })

  let networkCount = 0
  // First satisfy everything we already have cached (no network).
  const misses = []
  for (const task of needed) {
    const k = cacheKey('en', task.to, task.en)
    if (typeof cache[k] === 'string') task.leaf[task.to] = cache[k]
    else misses.push({ ...task, k })
  }

  // Translate the genuine misses with a concurrency cap; tolerate failures.
  await pooled(misses, async (task) => {
    try {
      const out = await rawTranslate(task.en, task.to, 'en')
      if (out && typeof out === 'string') {
        cache[task.k] = out
        task.leaf[task.to] = out
        networkCount++
      }
    } catch (e) {
      // Leave the leaf untranslated → storefront falls back to English.
      console.warn('[translate] %s→%s failed: %s', 'en', task.to, e.message)
    }
  })

  if (networkCount > 0) {
    try { await store().setMeta({ i18nCache: cache }) } catch { /* cache best-effort */ }
  }
  return networkCount
}

module.exports = { translateContent, TARGET_LANGS }
