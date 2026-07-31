// Shared storefront content from the existing Express API (same shape as the
// React app: hero, sections, services, categories, products, brands, settings…).
// useAsyncData dedupes by key so every component shares one fetch.
export function useContent() {
  const { data, pending, error, refresh } = useAsyncData<any>(
    'content',
    () => $fetch('/api/content'),
    { default: () => ({}) },
  )
  return { content: data, pending, error, refresh }
}
