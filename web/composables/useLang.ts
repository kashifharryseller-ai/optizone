import { ref, computed, watch } from 'vue'

// Three-language state (en/he/ar) with RTL + an L() resolver, mirroring the
// React app's LangProvider. Content from /api ships as { en, he, ar } objects;
// L() falls back to English so nothing is ever blank. Module-singleton ref so
// every component shares one language (SPA).
type Lang = 'en' | 'he' | 'ar'
const RTL = new Set<Lang>(['he', 'ar'])
const lang = ref<Lang>('en')
let hydrated = false

// Catalog-attribute vocabulary (Frame Shape / Material / Gender values, order &
// booking statuses, contact-lens types). English passes through when a key is
// absent. Ported from the React i18n ATTR maps.
const ATTR: Record<'he' | 'ar', Record<string, string>> = {
  he: {
    'Frame Shape': 'צורת מסגרת', Material: 'חומר', Gender: 'מגדר',
    Round: 'עגול', Square: 'מרובע', 'Cat-eye': 'עין חתול', Oval: 'אובלי', Aviator: 'טייסים',
    Acetate: 'אצטט', Metal: 'מתכת', Titanium: 'טיטניום',
    Women: 'נשים', Men: 'גברים', Unisex: 'יוניסקס', Kids: 'ילדים',
    Daily: 'יומיות', 'Bi-weekly': 'דו-שבועיות', Monthly: 'חודשיות',
    'Silicone Hydrogel': 'סיליקון הידרוג׳ל', 'Water Gradient': 'גרדיאנט מים',
  },
  ar: {
    'Frame Shape': 'شكل الإطار', Material: 'المادة', Gender: 'الفئة',
    Round: 'دائري', Square: 'مربّع', 'Cat-eye': 'عين القطة', Oval: 'بيضوي', Aviator: 'أفياتور',
    Acetate: 'أسيتات', Metal: 'معدن', Titanium: 'تيتانيوم',
    Women: 'نساء', Men: 'رجال', Unisex: 'للجنسين', Kids: 'أطفال',
    Daily: 'يومية', 'Bi-weekly': 'كل أسبوعين', Monthly: 'شهرية',
    'Silicone Hydrogel': 'هيدروجيل سيليكون', 'Water Gradient': 'تدرّج مائي',
  },
}

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
  // Translate a fixed catalog-attribute value; English passes through.
  const A = (v: any): string => {
    if (v == null) return ''
    const s = String(v)
    return lang.value === 'en' ? s : (ATTR[lang.value]?.[s] || s)
  }
  const setLang = (l: Lang) => { lang.value = l }
  const languages = [
    { code: 'en' as Lang, label: 'English' },
    { code: 'he' as Lang, label: 'עברית' },
    { code: 'ar' as Lang, label: 'العربية' },
  ]
  return { lang, dir, L, A, setLang, languages }
}
