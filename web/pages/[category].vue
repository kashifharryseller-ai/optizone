<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'

// One page per catalog category (eyeglasses / sunglasses / contacts). Only these
// slugs match — every other route (cart, checkout, brands, product/*) has its own
// page and wins over this dynamic segment.
const CATS = ['eyeglasses', 'sunglasses', 'contacts']
definePageMeta({
  validate: (route) => CATS.includes(String(route.params.category)),
})

const route = useRoute()
const category = computed(() => String(route.params.category))

const { L, A } = useLang()
const { t } = useT()
const tc = computed(() => t('catalog'))
const { content } = useContent()

// Try Mirror eligibility — face-worn eyewear only.
const canTry = (p: any) => !!p?.tryMirror && ['eyeglasses', 'sunglasses'].includes(String(p.category || '').toLowerCase())

const FIELD_OF: Record<string, (p: any) => any> = {
  'Frame Shape': (p) => p.shape, Material: (p) => p.material, Gender: (p) => p.gender,
}

const selected = ref<Record<string, string[]>>({})
const tryOnly = ref(false)
const sort = ref<'popular' | 'price-asc' | 'price-desc'>('popular')
watch(category, () => { selected.value = {}; tryOnly.value = false; sort.value = 'popular' })

const inCategory = computed(() =>
  (content.value?.products || []).filter((p: any) => (p.category || 'eyeglasses') === category.value),
)

// Only show filter groups whose values actually appear on this page.
const groups = computed(() =>
  Object.entries(content.value?.filters || {})
    .map(([group, vals]: any) => {
      const present = new Set(inCategory.value.map(FIELD_OF[group] || (() => null)))
      return [group, (vals as string[]).filter((v) => present.has(v))] as [string, string[]]
    })
    .filter(([, vals]) => vals.length > 1),
)
const hasTryMirror = computed(() => inCategory.value.some(canTry))

const toggle = (group: string, val: string) => {
  const cur = new Set(selected.value[group] || [])
  cur.has(val) ? cur.delete(val) : cur.add(val)
  selected.value = { ...selected.value, [group]: [...cur] }
}
const activeCount = computed(() => Object.values(selected.value).flat().length)
const clearFilters = () => { selected.value = {} }

const list = computed(() => {
  let l = inCategory.value.filter((p: any) => {
    if (tryOnly.value && !canTry(p)) return false
    for (const [g, vals] of Object.entries(selected.value)) {
      if (!vals.length) continue
      if (!vals.includes((FIELD_OF[g] || (() => null))(p))) return false
    }
    return true
  })
  if (sort.value === 'price-asc') l = [...l].sort((a, b) => a.amount - b.amount)
  if (sort.value === 'price-desc') l = [...l].sort((a, b) => b.amount - a.amount)
  return l
})

// Editable page header (falls back to the category label).
const pageConf = computed(() => (content.value?.categoryPages || {})[category.value] || {})
const catLabel = computed(() => {
  const c = (content.value?.categories || []).find((x: any) => x.key === category.value)
  return c ? L(c.label) : ''
})
const title = computed(() => L(pageConf.value.title) || catLabel.value || category.value)
const subtitle = computed(() => L(pageConf.value.subtitle))
const crumb = computed(() => `${t('common').home} / ${title.value}`)

useHead(() => ({ title: `${title.value} — OPTIZONE` }))
</script>

<template>
  <div>
    <!-- Header band -->
    <div class="border-b border-hair bg-cream-300">
      <div class="mx-auto max-w-container px-7 py-9">
        <span class="font-display text-xs uppercase tracking-[0.14em] text-ink-400">{{ crumb }}</span>
        <h1 class="mt-2 font-display text-4xl font-medium text-ink-900">{{ title }}</h1>
        <p v-if="subtitle" class="mt-2 max-w-xl text-[15px] text-ink-500">{{ subtitle }}</p>
      </div>
    </div>

    <div class="mx-auto grid max-w-container gap-9 px-7 pb-20 pt-7" :class="(groups.length || hasTryMirror) ? 'md:grid-cols-[250px_1fr]' : 'grid-cols-1'">
      <!-- FILTERS -->
      <aside v-if="groups.length || hasTryMirror" class="flex flex-col gap-6 md:sticky md:top-24 md:self-start">
        <div class="flex items-center justify-between">
          <span class="font-display text-sm uppercase tracking-[0.1em] text-ink-900">{{ tc.filters }}</span>
          <button v-if="activeCount" @click="clearFilters" class="text-[13px] text-amber-700 hover:underline">{{ tc.clear }}</button>
        </div>
        <label v-if="hasTryMirror" class="flex items-center gap-2 border-y border-hair py-3 text-sm text-ink-700">
          <input type="checkbox" v-model="tryOnly" class="h-4 w-4 accent-pine-700" />
          {{ tc.tryOnly }}
        </label>
        <div v-for="[group, vals] in groups" :key="group">
          <div class="mb-3 font-display text-[12px] uppercase tracking-[0.12em] text-ink-400">{{ A(group) }}</div>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="v in vals" :key="v" @click="toggle(group, v)"
              class="rounded-pill border px-3 py-1.5 text-[13px] transition-colors"
              :class="(selected[group] || []).includes(v) ? 'border-pine-700 bg-pine-700 text-cream-100' : 'border-hair bg-white text-ink-700 hover:border-pine-400'"
            >{{ A(v) }}</button>
          </div>
        </div>
      </aside>

      <!-- GRID -->
      <div>
        <div class="mb-5 flex items-center justify-between gap-4">
          <span class="text-sm text-ink-500">{{ tc.count(list.length) }}</span>
          <select v-model="sort" class="rounded-sm border border-hair bg-white px-3 py-2 text-sm text-ink-800">
            <option value="popular">{{ tc.sortPopular }}</option>
            <option value="price-asc">{{ tc.sortAsc }}</option>
            <option value="price-desc">{{ tc.sortDesc }}</option>
          </select>
        </div>
        <div v-if="list.length === 0" class="py-16 text-center text-ink-500">{{ tc.empty }}</div>
        <div v-else class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Reveal v-for="(p, i) in list" :key="p.id" :y="20" :delay="Math.min(i, 8) * 0.04">
            <ProductCard :product="p" />
          </Reveal>
        </div>
      </div>
    </div>
  </div>
</template>
