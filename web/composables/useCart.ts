// Cart state — a module-level singleton persisted to localStorage ('oz_cart'),
// shared across every component. Lines carry the configured lens price in
// `amount`; the server always re-floors each line at the catalog base price on
// checkout, so the client total is a display convenience, never trusted.
import { ref, computed } from 'vue'

export interface CartLine {
  id: number | string
  name: string
  brand?: string
  amount: number
  qty: number
  image?: string
  colors?: string[]
  customSize?: string | null
}

const KEY = 'oz_cart'
const cart = ref<CartLine[]>([])
let loaded = false

function persist() {
  if (typeof localStorage === 'undefined') return
  try { localStorage.setItem(KEY, JSON.stringify(cart.value)) } catch { /* quota / private mode */ }
}

function load() {
  if (loaded || typeof localStorage === 'undefined') return
  loaded = true
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) cart.value = JSON.parse(raw) || []
  } catch { cart.value = [] }
}

const clampQty = (n: number) => Math.min(20, Math.max(1, Math.round(Number(n) || 1)))

export function useCart() {
  if (import.meta.client) load()

  // Merge same product + same custom size into one line; otherwise append.
  function add(product: any, opts: { customSize?: string | null; qty?: number } = {}) {
    const line: CartLine = {
      id: product.id,
      name: product.name,
      brand: product.brand,
      amount: Number(product.amount) || 0,
      qty: clampQty(opts.qty || 1),
      image: product.image || (product.images && product.images[0]) || undefined,
      colors: product.colors,
      customSize: opts.customSize ?? null,
    }
    const idx = cart.value.findIndex(
      (c) => String(c.id) === String(line.id) && (c.customSize || null) === (line.customSize || null) && c.amount === line.amount,
    )
    if (idx >= 0) cart.value[idx].qty = clampQty(cart.value[idx].qty + line.qty)
    else cart.value.push(line)
    persist()
  }

  function setQty(index: number, qty: number) {
    if (cart.value[index]) { cart.value[index].qty = clampQty(qty); persist() }
  }
  function remove(index: number) { cart.value.splice(index, 1); persist() }
  function clear() { cart.value = []; persist() }

  const count = computed(() => cart.value.reduce((s, i) => s + i.qty, 0))
  const subtotal = computed(() => cart.value.reduce((s, i) => s + i.amount * i.qty, 0))

  return { cart, add, setQty, remove, clear, count, subtotal }
}
