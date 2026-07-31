<script setup lang="ts">
import { Search, X } from 'lucide-vue-next'
const { L } = useLang()
const { content } = useContent()
const { open, closeSearch } = useSearch()
const router = useRouter()

const T = {
  placeholder: { en: 'Search frames, brands, lenses…', he: 'חיפוש מסגרות, מותגים, עדשות…', ar: 'ابحث عن إطارات، علامات، عدسات…' },
  popular: { en: 'Popular searches', he: 'חיפושים פופולריים', ar: 'عمليات بحث رائجة' },
  none: { en: 'No frames match your search.', he: 'אין מסגרות התואמות לחיפוש.', ar: 'لا توجد إطارات تطابق بحثك.' },
}

const q = ref('')
const input = ref<HTMLInputElement | null>(null)
const products = computed(() => content.value?.products || [])
const popular = computed(() => content.value?.popularSearches || [])

const results = computed(() => {
  const s = q.value.trim().toLowerCase()
  if (!s) return []
  return products.value.filter((p: any) =>
    [L(p.name), p.brand, p.shape, p.material, p.category].filter(Boolean).some((f: string) => String(f).toLowerCase().includes(s)),
  ).slice(0, 8)
})

watch(open, async (v) => {
  if (v) { q.value = ''; await nextTick(); input.value?.focus() }
})
const goTo = (p: any) => { closeSearch(); router.push(`/product/${p.id}`) }
const fmt = (n: number) => Number(n).toLocaleString('he-IL')

// Esc closes.
onMounted(() => {
  const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeSearch() }
  window.addEventListener('keydown', onKey)
  onUnmounted(() => window.removeEventListener('keydown', onKey))
})
</script>

<template>
  <Transition name="oz-fade">
    <div v-if="open" class="fixed inset-0 z-[100] bg-pine-950/70 backdrop-blur-sm" @click.self="closeSearch">
      <div class="mx-auto mt-[8vh] max-w-2xl px-5">
        <div class="overflow-hidden rounded-xl bg-white shadow-2xl">
          <div class="flex items-center gap-3 border-b border-hair px-5">
            <Search :size="20" class="text-ink-400" />
            <input ref="input" v-model="q" :placeholder="L(T.placeholder)" class="flex-1 bg-transparent py-4 text-lg outline-none" />
            <button @click="closeSearch" aria-label="Close" class="p-2 text-ink-400 hover:text-ink-700"><X :size="20" /></button>
          </div>
          <div class="max-h-[60vh] overflow-y-auto p-3">
            <!-- popular (empty query) -->
            <div v-if="!q.trim()" class="p-2">
              <div class="mb-2 font-display text-[12px] uppercase tracking-[0.12em] text-ink-400">{{ L(T.popular) }}</div>
              <div class="flex flex-wrap gap-2">
                <button v-for="term in popular" :key="term" @click="q = term" class="rounded-pill border border-hair px-3 py-1.5 text-sm text-ink-700 hover:border-pine-400">{{ term }}</button>
              </div>
            </div>
            <!-- results -->
            <template v-else>
              <div v-if="!results.length" class="p-6 text-center text-ink-500">{{ L(T.none) }}</div>
              <button v-for="p in results" :key="p.id" @click="goTo(p)" class="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-start hover:bg-cream-200">
                <span class="h-12 w-12 flex-none overflow-hidden rounded-sm bg-cream-300"><img v-if="p.image" :src="p.image" :alt="L(p.name)" class="h-full w-full object-cover" /></span>
                <span class="flex-1">
                  <span class="block text-[11px] uppercase tracking-wide text-amber-700">{{ p.brand }}</span>
                  <span class="block text-sm font-semibold text-ink-900">{{ L(p.name) }}</span>
                </span>
                <span class="font-display text-ink-900">₪{{ fmt(p.amount) }}</span>
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.oz-fade-enter-active, .oz-fade-leave-active { transition: opacity 0.2s ease; }
.oz-fade-enter-from, .oz-fade-leave-to { opacity: 0; }
</style>
