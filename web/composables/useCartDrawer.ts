// Shared open-state for the slide-out mini-cart (module singleton), so the
// header, product cards, PDP and Try Mirror can all open it without prop drilling.
import { ref } from 'vue'

const open = ref(false)
export function useCartDrawer() {
  const openCart = () => { open.value = true }
  const closeCart = () => { open.value = false }
  const toggleCart = () => { open.value = !open.value }
  return { open, openCart, closeCart, toggleCart }
}
