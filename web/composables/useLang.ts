import { ref, computed, watch } from 'vue'

// Three-language state (en/he/ar) with RTL + an L() resolver, mirroring the
// React app's LangProvider. Content from /api ships as { en, he, ar } objects;
// L() falls back to English so nothing is ever blank. Module-singleton ref so
// every component shares one language (SPA).
type Lang = 'en' | 'he' | 'ar'
const RTL = new Set<Lang>(['he', 'ar'])
const lang = ref<Lang>('en')
let hydrated = false

export function useLang() {
  if (import.meta.client && !hydrated) {
    hydrated = true
    const saved = localStorage.getItem('oz_lang') as Lang | null
    if (saved === 'en' || saved === 'he' || saved === 'ar') lang.value = saved
    watch(lang, (l) => {
      localStorage.setItem('oz_lang', l)
      document.documentElement.lang = l
      document.documentElement.dir = RTL.has(l) ? 'rtl' : 'ltr'
    }, { immediate: true })
  }
  const dir = computed(() => (RTL.has(lang.value) ? 'rtl' : 'ltr'))
  const L = (v: any): string => (v == null ? '' : typeof v === 'string' ? v : (v[lang.value] ?? v.en ?? ''))
  const setLang = (l: Lang) => { lang.value = l }
  const languages = [
    { code: 'en' as Lang, label: 'English' },
    { code: 'he' as Lang, label: 'עברית' },
    { code: 'ar' as Lang, label: 'العربية' },
  ]
  return { lang, dir, L, setLang, languages }
}
