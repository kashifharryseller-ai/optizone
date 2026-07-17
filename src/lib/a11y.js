// Accessibility helpers.
//
// activatable(fn) — spread onto a non-button element (a/span/div) that acts as a
// button in this SPA (no href, just an onClick action). It makes the element
// focusable and operable with the keyboard (Enter / Space), which a bare
// `<element onClick>` is not. Prefer a real <button> for new code; this exists
// to make the many existing click-only elements keyboard-accessible without
// disturbing their CSS (which targets the original tag).
export function activatable(onActivate) {
  return {
    role: 'button',
    tabIndex: 0,
    onClick: onActivate,
    onKeyDown: (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault()
        onActivate(e)
      }
    },
  }
}
