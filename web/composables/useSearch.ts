// Shared open-state for the search overlay (module singleton) so the header
// button and the overlay component talk without prop drilling.
import { ref } from 'vue'

const open = ref(false)
export function useSearch() {
  const openSearch = () => { open.value = true }
  const closeSearch = () => { open.value = false }
  return { open, openSearch, closeSearch }
}
