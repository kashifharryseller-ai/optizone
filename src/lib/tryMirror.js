// Try Mirror eligibility — single source of truth.
//
// Business rule: the virtual try-on only makes sense for eyewear worn on the
// face. It must be offered ONLY for glasses and sunglasses, never for contacts
// (or any future non-eyewear category), regardless of a product's `tryMirror`
// flag. Route every Try-Mirror gate (storefront badges/buttons, catalog filter,
// admin asset uploader) through canTryMirror() so the rule lives in one place.

// Categories a face-worn frame overlay applies to. Matched case-insensitively.
export const TRY_MIRROR_CATEGORIES = new Set(['eyeglasses', 'sunglasses'])

// True only when the product is an eyewear frame AND has Try Mirror enabled.
export function canTryMirror(product) {
  if (!product || !product.tryMirror) return false
  return TRY_MIRROR_CATEGORIES.has(String(product.category || '').toLowerCase())
}

// Whether a category is eligible at all (used to show/hide the admin toggle).
export function isTryMirrorCategory(category) {
  return TRY_MIRROR_CATEGORIES.has(String(category || '').toLowerCase())
}
