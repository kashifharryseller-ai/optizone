<script setup lang="ts">
import { ShoppingBag, Heart, Truck, Store, ChevronDown, ChevronUp, Info, Camera } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const { L, A, dir } = useLang()
const { t } = useT()
const tp = computed(() => t('product'))
const { content } = useContent()
const { add } = useCart()
const { openCart } = useCartDrawer()
const { isAuthed, inWishlist, toggleWishlist } = useAuth()

const p = computed(() => {
  const list = content.value?.products || []
  return list.find((x: any) => String(x.id) === String(route.params.id)) || {}
})
const found = computed(() => !!p.value?.id)

// Recently-viewed tracking + "You may also like" (same category, then brand).
const { ids: recentIds, record } = useRecentlyViewed()
watchEffect(() => { if (import.meta.client && p.value?.id) record(p.value.id) })
const allProducts = computed<any[]>(() => (content.value?.products || []).filter((x: any) => x.active !== false))
const related = computed(() => {
  const cur = p.value
  if (!cur?.id) return []
  const pool = allProducts.value.filter((x) => String(x.id) !== String(cur.id))
  const sameCat = pool.filter((x) => (x.category || 'eyeglasses') === (cur.category || 'eyeglasses'))
  const sameBrand = pool.filter((x) => x.brand && x.brand === cur.brand)
  // Prefer same brand within the category, then fill from the category, deduped.
  const seen = new Set<string>()
  const out: any[] = []
  for (const x of [...sameBrand, ...sameCat]) { const k = String(x.id); if (!seen.has(k)) { seen.add(k); out.push(x) } }
  return out.slice(0, 4)
})
const recentlyViewed = computed(() => {
  const cur = String(p.value?.id)
  return recentIds.value
    .filter((id) => String(id) !== cur)
    .map((id) => allProducts.value.find((x) => String(x.id) === String(id)))
    .filter(Boolean)
    .slice(0, 4)
})

const canTry = computed(() => !!p.value?.tryMirror && ['eyeglasses', 'sunglasses'].includes(String(p.value.category || '').toLowerCase()))
const colors = computed(() => p.value?.colors || [])
const cat = computed(() => p.value?.category || 'eyeglasses')
const catLabel = computed(() => {
  const c = (content.value?.categories || []).find((x: any) => x.key === cat.value)
  return c ? L(c.label) : ''
})

// Gallery
const gallery = computed(() => [p.value?.image, ...((p.value?.images) || [])].filter(Boolean))
const imgIdx = ref(0)
const mainSrc = computed(() => (gallery.value.length ? gallery.value[Math.min(imgIdx.value, gallery.value.length - 1)] : undefined))
watch(() => route.params.id, () => { imgIdx.value = 0; tab.value = 'desc'; lensOpen.value = false })

// Lens configuration
const lensOpen = ref(false)
const index = ref('1.6')
const arCoat = ref(true)
const blue = ref(false)
const photo = ref(false)
const lensPrice = computed(() =>
  (index.value === '1.6' ? 120 : index.value === '1.67' ? 260 : index.value === '1.74' ? 420 : 0)
  + (arCoat.value ? 90 : 0) + (blue.value ? 70 : 0) + (photo.value ? 180 : 0),
)
const total = computed(() => (Number(p.value?.amount) || 0) + lensPrice.value)
const summaryParts = computed(() => [
  `${tp.value.index} ${index.value}`,
  arCoat.value && tp.value.antiReflective,
  blue.value && tp.value.blueLight,
  photo.value && tp.value.photochromic,
].filter(Boolean) as string[])

const tab = ref<'desc' | 'specs' | 'reviews'>('desc')
const richDesc = computed(() => L(p.value?.desc))
const descParas = computed(() => (richDesc.value ? richDesc.value.split(/\n+/) : []))
const sp = computed(() => p.value?.specs || {})
const fmt = (n: number) => Number(n).toLocaleString('he-IL')

const addedNote = ref(false)
const addToCart = (customSize?: string) => {
  add({ id: p.value.id, name: L(p.value.name) || p.value.name, brand: p.value.brand, amount: total.value, image: gallery.value[0], colors: colors.value }, { customSize: customSize || null })
  addedNote.value = true
  openCart()
  setTimeout(() => (addedNote.value = false), 1600)
}

// Try Mirror — consent gate → live modal. The mirror carousel spans every
// Try-Mirror-eligible frame so shoppers can switch without leaving the modal.
const consent = ref(false)
const mirror = ref(false)
const mirrorCatalog = computed(() =>
  (content.value?.products || []).filter((x: any) => !!x?.tryMirror && ['eyeglasses', 'sunglasses'].includes(String(x.category || '').toLowerCase())),
)
// Wishlist — guests are sent to sign in; the heart reflects saved state.
const wished = computed(() => isAuthed.value && inWishlist(p.value.id))
const onHeart = () => {
  if (!isAuthed.value) { router.push('/account'); return }
  toggleWishlist(p.value.id).catch(() => { /* stays in sync on next load */ })
}

const onMirrorAdd = (sizePct: string, chosen: any) => {
  const prod = chosen || p.value
  // The opened product keeps its lens-option total; a carousel-picked frame is
  // added at its own base price.
  add(
    { id: prod.id, name: L(prod.name) || prod.name, brand: prod.brand, amount: prod.id === p.value.id ? total.value : prod.amount, image: prod.image, colors: prod.colors },
    { customSize: sizePct },
  )
}

const specRows = computed(() => ([
  [tp.value.specLabels.brand, p.value?.brand],
  [tp.value.specLabels.shape, A(p.value?.shape)],
  [tp.value.specLabels.material, A(p.value?.material)],
  [tp.value.specLabels.gender, A(p.value?.gender)],
  [tp.value.specLabels.lensWidth, sp.value.lensWidth],
  [tp.value.specLabels.bridge, sp.value.bridge],
  [tp.value.specLabels.temple, sp.value.temple],
  [tp.value.specLabels.weight, sp.value.weight],
  [tp.value.specLabels.colorOpts, colors.value.length ? String(colors.value.length) : ''],
  [tp.value.specLabels.lensOpts, L(sp.value.lensOpts)],
  [tp.value.specLabels.tryMirror, canTry.value ? tp.value.yes : tp.value.no],
] as [string, any][]).filter(([, v]) => v))

useHead(() => ({ title: found.value ? `${p.value.brand} ${L(p.value.name) || p.value.name} — OPTIZONE` : 'OPTIZONE' }))
</script>

<template>
  <div class="mx-auto max-w-container px-7 pb-20 pt-7">
    <div v-if="!found" class="py-24 text-center text-ink-500">
      <p>Product not found.</p>
      <NuxtLink to="/eyeglasses" class="mt-4 inline-block text-amber-700 hover:underline">← Browse frames</NuxtLink>
    </div>

    <template v-else>
      <NuxtLink :to="`/${cat}`" class="font-display text-xs uppercase tracking-[0.14em] text-ink-400 hover:text-amber-700">{{ tp.backTo(catLabel) }}</NuxtLink>

      <div class="mt-5 grid gap-12 md:grid-cols-2 md:items-start">
        <!-- GALLERY -->
        <div class="flex gap-4">
          <div class="flex flex-col gap-3">
            <button
              v-for="(g, i) in (gallery.length ? gallery.slice(0, 4) : [0, 1, 2, 3])" :key="i"
              @click="imgIdx = i"
              class="h-16 w-16 overflow-hidden rounded-sm border bg-cream-300"
              :class="imgIdx === i ? 'border-pine-700' : 'border-hair'"
            >
              <img v-if="gallery.length" :src="(g as string)" alt="" loading="lazy" class="h-full w-full object-cover" />
            </button>
          </div>
          <div class="relative flex flex-1 items-center justify-center overflow-hidden rounded-lg border border-hair bg-cream-300" style="aspect-ratio:1">
            <img v-if="mainSrc" :src="mainSrc" :alt="`${p.brand} ${L(p.name) || p.name}`" class="absolute inset-0 h-full w-full object-cover" />
            <span v-if="canTry" class="absolute start-4 top-4 z-10 rounded-pill bg-pine-800/90 px-3 py-1 font-display text-[11px] uppercase tracking-wide text-cream-100">{{ tp.tryMirror }}</span>
            <button v-if="canTry" @click="consent = true" class="absolute bottom-4 start-4 z-10 inline-flex items-center gap-2 rounded-sm bg-amber-500 px-4 py-2 font-display text-xs uppercase tracking-wide text-pine-950 shadow-lg transition hover:brightness-105"><Camera :size="15" /> {{ tp.tryMirror }}</button>
          </div>
        </div>

        <!-- INFO -->
        <div>
          <span class="font-display text-[13px] uppercase tracking-[0.16em] text-amber-700">{{ p.brand }}</span>
          <h1 class="mb-3 mt-2 font-display text-4xl font-medium text-ink-900">{{ L(p.name) || p.name }}</h1>
          <div class="mb-4 flex flex-wrap items-center gap-3 text-sm">
            <span class="text-amber-600">★ {{ p.rating }}</span>
            <span class="text-ink-300">·</span>
            <span class="font-semibold text-emerald-700">{{ tp.inStock }}</span>
          </div>
          <div class="flex items-baseline gap-3">
            <span class="font-display text-3xl text-ink-900">₪{{ fmt(total) }}</span>
            <span v-if="p.original" class="text-lg text-ink-400 line-through">₪{{ fmt(p.original + lensPrice) }}</span>
          </div>
          <p class="my-5 max-w-md text-[15px] leading-relaxed text-ink-700">
            {{ descParas.length ? descParas[0] : tp.descGeneric(L(p.name) || p.name, p.shape, p.material) }}
          </p>

          <!-- colors -->
          <div v-if="colors.length" class="mb-6">
            <div class="mb-2.5 font-display text-[12px] uppercase tracking-[0.12em] text-ink-400">{{ tp.color }}</div>
            <div class="flex gap-2.5">
              <button
                v-for="(c, i) in colors" :key="i" @click="imgIdx = i" :aria-label="`${tp.color} ${i + 1}`"
                class="h-8 w-8 rounded-full border-2" :style="{ background: c }"
                :class="imgIdx === i ? 'border-amber-600 ring-2 ring-amber-100' : 'border-hair'"
              />
            </div>
          </div>

          <!-- lens config -->
          <button @click="lensOpen = !lensOpen" class="mb-3.5 flex w-full items-center justify-between rounded-md border border-hair bg-cream-100 px-4 py-3.5 text-start">
            <span>
              <span class="block font-display text-[13px] uppercase tracking-[0.06em] text-ink-900">{{ tp.lensConfig }}</span>
              <span class="text-[13px] text-ink-500">{{ tp.lensSummary(summaryParts, lensPrice) }}</span>
            </span>
            <component :is="lensOpen ? ChevronUp : ChevronDown" :size="18" class="text-ink-500" />
          </button>
          <div v-if="lensOpen" class="mb-5 rounded-md border border-hair bg-white px-4 pb-4 pt-1">
            <div class="flex items-center justify-between gap-4 border-b border-hair py-3.5">
              <span class="text-sm text-ink-700">{{ tp.lensIndex }}</span>
              <select v-model="index" class="w-40 rounded-sm border border-hair bg-white px-2 py-1.5 text-sm">
                <option v-for="o in tp.lensOpts" :key="o.value" :value="o.value">{{ o.label }}</option>
              </select>
            </div>
            <label class="flex items-center justify-between gap-4 border-b border-hair py-3.5 text-sm text-ink-700">
              {{ tp.arRow }}<input type="checkbox" v-model="arCoat" class="h-4 w-4 accent-pine-700" />
            </label>
            <label class="flex items-center justify-between gap-4 border-b border-hair py-3.5 text-sm text-ink-700">
              {{ tp.blueRow }}<input type="checkbox" v-model="blue" class="h-4 w-4 accent-pine-700" />
            </label>
            <label class="flex items-center justify-between gap-4 py-3.5 text-sm text-ink-700">
              {{ tp.photoRow }}<input type="checkbox" v-model="photo" class="h-4 w-4 accent-pine-700" />
            </label>
            <div class="mt-3 flex items-center gap-2 text-[12.5px] text-ink-400"><Info :size="15" /> {{ tp.lensNote }}</div>
          </div>

          <!-- actions -->
          <div class="flex flex-wrap items-center gap-3">
            <button @click="addToCart()" class="inline-flex flex-1 items-center justify-center gap-2 rounded-sm bg-pine-700 px-6 py-3.5 font-display text-sm uppercase tracking-wide text-cream-100 transition-colors hover:bg-amber-600 hover:text-pine-950">
              <ShoppingBag :size="18" /> {{ tp.addToCart(total) }}
            </button>
            <button v-if="canTry" @click="consent = true" class="inline-flex items-center justify-center gap-2 rounded-sm bg-amber-500 px-5 py-3.5 font-display text-sm uppercase tracking-wide text-pine-950 transition hover:brightness-105">
              <Camera :size="18" /> {{ tp.tryMirror }}
            </button>
            <button @click="onHeart" aria-label="wishlist" class="inline-flex h-12 w-12 items-center justify-center rounded-sm border transition-colors" :class="wished ? 'border-red-300 text-red-500' : 'border-hair text-pine-700 hover:border-pine-400'">
              <Heart :size="20" :fill="wished ? 'currentColor' : 'none'" />
            </button>
          </div>
          <p v-if="addedNote" class="mt-3 text-sm font-medium text-emerald-700">✓ Added to cart</p>
          <div class="mt-4 flex flex-wrap gap-5 text-sm text-ink-500">
            <span class="flex items-center gap-1.5"><Truck :size="16" /> {{ tp.freeShip }}</span>
            <span class="flex items-center gap-1.5"><Store :size="16" /> {{ tp.reserveFit }}</span>
          </div>
        </div>
      </div>

      <!-- TABS -->
      <div class="mt-14 max-w-3xl">
        <div class="flex gap-6 border-b border-hair">
          <button v-for="[k, label] in ([['desc', tp.tabsDesc], ['specs', tp.tabsSpecs], ['reviews', tp.tabsReviews]] as [any, string][])" :key="k"
            @click="tab = k"
            class="-mb-px border-b-2 pb-3 font-display text-sm transition-colors"
            :class="tab === k ? 'border-pine-700 text-ink-900' : 'border-transparent text-ink-400 hover:text-ink-700'"
          >{{ label }}</button>
        </div>
        <div class="py-6 text-[15px] leading-relaxed text-ink-700">
          <template v-if="tab === 'desc'">
            <p v-for="(para, i) in (descParas.length ? descParas : [tp.descGeneric(L(p.name) || p.name, p.shape, p.material)])" :key="i" :class="i ? 'mt-3.5' : ''">{{ para }}</p>
          </template>
          <div v-else-if="tab === 'specs'" class="grid max-w-xl gap-x-10 gap-y-3 sm:grid-cols-2">
            <div v-for="[k, v] in specRows" :key="k" class="flex justify-between gap-3 border-b border-hair pb-2">
              <span class="text-ink-400">{{ k }}</span><span class="text-end font-semibold text-ink-900">{{ v }}</span>
            </div>
          </div>
          <p v-else class="text-ink-500">{{ tp.reviewsLine(p.reviews, p.rating) }}</p>
        </div>
      </div>

      <!-- You may also like -->
      <section v-if="related.length" class="mt-16">
        <Reveal as="h2" blur :y="16" class="mb-6 font-display text-2xl text-ink-900">{{ L({ en: 'You may also like', he: 'אולי גם יעניין אותך', ar: 'قد يعجبك أيضًا' }) }}</Reveal>
        <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Reveal v-for="(rp, i) in related" :key="rp.id" :y="24" :delay="i * 0.06">
            <ProductCard :product="rp" />
          </Reveal>
        </div>
      </section>

      <!-- Recently viewed -->
      <section v-if="recentlyViewed.length" class="mt-14">
        <Reveal as="h2" blur :y="16" class="mb-6 font-display text-2xl text-ink-900">{{ L({ en: 'Recently viewed', he: 'נצפו לאחרונה', ar: 'شوهدت مؤخرًا' }) }}</Reveal>
        <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Reveal v-for="(rp, i) in recentlyViewed" :key="rp.id" :y="24" :delay="i * 0.06">
            <ProductCard :product="rp" />
          </Reveal>
        </div>
      </section>

      <!-- Try Mirror consent gate -->
      <Teleport to="body">
        <div v-if="consent" class="fixed inset-0 z-[1090] flex items-center justify-center bg-pine-950/70 p-5 backdrop-blur-sm" @click.self="consent = false">
          <div class="max-w-md rounded-xl bg-white p-7 shadow-2xl">
            <span class="font-display text-[12px] uppercase tracking-[0.14em] text-amber-700">{{ tp.tryMirror }}</span>
            <h3 class="mb-3 mt-1.5 font-display text-2xl text-ink-900">{{ L({ en: 'Camera & try-on consent', he: 'הסכמה למצלמה ולמדידה', ar: 'موافقة الكاميرا والتجربة' }) }}</h3>
            <p class="text-[15px] leading-relaxed text-ink-700">{{ L({ en: "OPTIZONE's Try Mirror uses your camera on-device to place frames on your face in real time. No image or biometric data is stored. You can also upload a photo instead.", he: 'ה-Try Mirror של OPTIZONE משתמש במצלמה שלך במכשיר עצמו כדי להציב מסגרות על הפנים בזמן אמת. שום תמונה או מידע ביומטרי אינם נשמרים. ניתן גם להעלות תמונה במקום.', ar: 'تستخدم مرآة OPTIZONE كاميرتك على جهازك لوضع الإطارات على وجهك في الوقت الحقيقي. لا تُخزَّن أي صورة أو بيانات حيوية. يمكنك أيضًا رفع صورة.' }) }}</p>
            <div class="mt-6 flex justify-end gap-3">
              <button @click="consent = false" class="rounded-sm px-5 py-2.5 font-display text-sm text-ink-600 hover:text-pine-700">{{ L({ en: 'Not now', he: 'לא עכשיו', ar: 'ليس الآن' }) }}</button>
              <button @click="consent = false; mirror = true" class="rounded-sm bg-pine-700 px-5 py-2.5 font-display text-sm text-cream-100 hover:bg-amber-600 hover:text-pine-950">{{ L({ en: 'Allow camera', he: 'אישור מצלמה', ar: 'السماح بالكاميرا' }) }}</button>
            </div>
          </div>
        </div>
      </Teleport>

      <!-- Try Mirror modal (mounted only while open) -->
      <TryMirror v-if="mirror" :product="p" :catalog="mirrorCatalog" @close="mirror = false" @add="onMirrorAdd" />
    </template>
  </div>
</template>

