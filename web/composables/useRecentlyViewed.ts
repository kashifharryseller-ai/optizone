// Recently-viewed products — a small ordered list of product ids kept in
// localStorage ('oz_recent'), most-recent first, deduped, capped. Shared
// singleton so any surface (PDP strip, home) reflects the same list.
import { ref } from 'vue'

const KEY = 'oz_recent'
const MAX = 12
const ids = ref<Array<number | string>>([])
let loaded = false

function persist() {
  if (typeof localStorage === 'undefined') return
  try { localStorage.setItem(KEY, JSON.stringify(ids.value)) } catch { /* quota */ }
}
function load() {
  if (loaded || typeof localStorage === 'undefined') return
  loaded = true
  try { const raw = localStorage.getItem(KEY); if (raw) ids.value = JSON.parse(raw) || [] } catch { ids.value = [] }
}

export function useRecentlyViewed() {
  if (import.meta.client) load()
  function record(id: number | string) {
    const sid = String(id)
    ids.value = [id, ...ids.value.filter((x) => String(x) !== sid)].slice(0, MAX)
    persist()
  }
  return { ids, record }
}
