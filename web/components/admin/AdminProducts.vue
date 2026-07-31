<script setup lang="ts">
import { ChevronDown, ChevronUp, Upload, Trash2 } from 'lucide-vue-next'
const admin = useAdmin()
const content = admin.content

const CATEGORIES = [
  { value: 'eyeglasses', label: 'Eyeglasses' },
  { value: 'sunglasses', label: 'Sunglasses' },
  { value: 'contacts', label: 'Contact Lenses' },
]
const BADGE_VARIANTS = [
  { value: 'sale', label: 'Sale (amber)' }, { value: 'new', label: 'New (pine)' },
  { value: 'bestseller', label: 'Bestseller' }, { value: 'try', label: 'Try' },
]
const products = computed<any[]>(() => content.value?.products || [])
const filters = computed<any>(() => content.value?.filters || {})

const query = ref('')
const cat = ref('all')
const openId = ref<number | string | null>(null)

const visible = computed(() => {
  const q = query.value.trim().toLowerCase()
  return products.value.filter((p) =>
    (cat.value === 'all' || (p.category || 'eyeglasses') === cat.value) &&
    (!q || `${p.brand} ${p.name}`.toLowerCase().includes(q)))
})
const nextId = () => products.value.reduce((m, p) => Math.max(m, Number(p.id) || 0), 0) + 1
const uniq = (arr: any[]) => [...new Set(arr.filter(Boolean))]

function addProduct() {
  const p = { id: nextId(), category: 'eyeglasses', brand: '', name: 'New frame', amount: 0, original: 0, rating: 5, reviews: 0, badge: null, tryMirror: true, colors: ['#274A3B'], shape: 'Round', material: 'Acetate', gender: 'Unisex', image: '', images: [], desc: { en: '', he: '' }, specs: { lensWidth: '', bridge: '', temple: '', weight: '', lensOpts: { en: '', he: '' } }, active: true }
  content.value.products = [p, ...products.value]
  query.value = ''; cat.value = 'all'; openId.value = p.id
}
function removeProduct(p: any) {
  if (!confirm(`PERMANENTLY remove "${p.brand ? p.brand + ' ' : ''}${p.name}"? To hide it while keeping history, use the Archive toggle instead.`)) return
  content.value.products = products.value.filter((x) => x.id !== p.id)
}
async function onUpload(e: Event, apply: (url: string) => void) {
  const file = (e.target as HTMLInputElement).files?.[0]; if (!file) return
  try { const r: any = await admin.upload(file); apply(r.url || r.path || '') } catch (err: any) { alert('Upload failed: ' + (err?.data?.error || err?.message)) }
  ;(e.target as HTMLInputElement).value = ''
}
const fmt = (n: number) => Number(n || 0).toLocaleString('he-IL')
const inp = 'w-full rounded-sm border border-hair px-2.5 py-2 text-sm'
const lbl = 'mb-1 block text-[11px] uppercase tracking-wide text-ink-400'
</script>

<template>
  <div class="flex flex-col gap-5">
    <Panel title="Products & catalog" desc="Each product's category decides which storefront page it appears on. Archived products keep their history but are hidden from the store.">
      <template #actions>
        <input v-model="query" :placeholder="`Search ${products.length} products…`" class="h-9 rounded-sm border border-hair px-3 text-sm" />
        <select v-model="cat" class="h-9 rounded-sm border border-hair px-2 text-sm">
          <option value="all">All categories</option>
          <option v-for="c in CATEGORIES" :key="c.value" :value="c.value">{{ c.label }}</option>
        </select>
        <button @click="addProduct" class="h-9 rounded-sm bg-pine-700 px-3 text-sm text-cream-100 hover:bg-amber-600 hover:text-pine-950">+ Add product</button>
      </template>

      <div class="flex flex-col gap-2">
        <div v-for="p in visible" :key="p.id" class="rounded-sm border border-hair">
          <!-- summary row -->
          <button @click="openId = openId === p.id ? null : p.id" class="flex w-full items-center gap-3 p-3 text-start">
            <span class="flex h-9 w-12 flex-none items-center justify-center overflow-hidden rounded bg-cream-300"><img v-if="p.image" :src="p.image" alt="" class="h-full w-full object-cover" /></span>
            <span class="min-w-0 flex-1 truncate"><b class="text-ink-900">{{ p.brand ? p.brand + ' · ' : '' }}{{ p.name }}</b><span class="text-[12.5px] text-ink-500"> · ₪{{ fmt(p.amount) }} · {{ (CATEGORIES.find(c => c.value === (p.category||'eyeglasses'))||{}).label }}</span></span>
            <span v-if="p.active === false" class="flex-none rounded-full bg-amber-500 px-2 py-0.5 text-[10px] uppercase tracking-wide text-pine-950">Archived</span>
            <component :is="openId === p.id ? ChevronUp : ChevronDown" :size="16" class="flex-none text-ink-400" />
          </button>

          <!-- editor -->
          <div v-if="openId === p.id" class="flex flex-col gap-3 border-t border-hair p-4">
            <div class="grid gap-3 sm:grid-cols-3">
              <div><label :class="lbl">Category</label><select v-model="p.category" :class="inp"><option v-for="c in CATEGORIES" :key="c.value" :value="c.value">{{ c.label }}</option></select></div>
              <div><label :class="lbl">Brand</label><input v-model="p.brand" :class="inp" /></div>
              <div><label :class="lbl">Model name</label><input v-model="p.name" :class="inp" /></div>
            </div>
            <div class="grid gap-3 sm:grid-cols-4">
              <div><label :class="lbl">Price ₪</label><input v-model.number="p.amount" type="number" :class="inp" /></div>
              <div><label :class="lbl">Was ₪ (0=none)</label><input v-model.number="p.original" type="number" :class="inp" /></div>
              <div><label :class="lbl">Rating</label><input v-model.number="p.rating" type="number" step="0.1" :class="inp" /></div>
              <div><label :class="lbl">Reviews</label><input v-model.number="p.reviews" type="number" :class="inp" /></div>
            </div>
            <div class="grid gap-3 sm:grid-cols-3">
              <div><label :class="lbl">Shape / type</label><input v-model="p.shape" :class="inp" list="oz-shapes" /></div>
              <div><label :class="lbl">Material</label><input v-model="p.material" :class="inp" list="oz-materials" /></div>
              <div><label :class="lbl">Gender</label><input v-model="p.gender" :class="inp" list="oz-genders" /></div>
            </div>
            <datalist id="oz-shapes"><option v-for="v in uniq([...(filters['Frame Shape']||[]), 'Daily','Bi-weekly','Monthly'])" :key="v" :value="v" /></datalist>
            <datalist id="oz-materials"><option v-for="v in uniq([...(filters.Material||[]), 'Silicone Hydrogel','Water Gradient'])" :key="v" :value="v" /></datalist>
            <datalist id="oz-genders"><option v-for="v in uniq(filters.Gender||[])" :key="v" :value="v" /></datalist>

            <!-- colours + toggles -->
            <div class="flex flex-wrap items-center gap-4">
              <div>
                <label :class="lbl">Colours</label>
                <div class="flex flex-wrap items-center gap-2">
                  <span v-for="(c, i) in (p.colors || [])" :key="i" class="inline-flex items-center gap-1">
                    <input type="color" :value="c" @input="p.colors[i] = ($event.target as HTMLInputElement).value" class="h-8 w-8 cursor-pointer rounded border border-hair" />
                    <button @click="p.colors = p.colors.filter((_: any, idx: number) => idx !== i)" class="text-ink-400">×</button>
                  </span>
                  <button @click="p.colors = [...(p.colors||[]), '#274A3B']" class="rounded-sm border border-hair px-2 py-1 text-[12px]">+ Colour</button>
                </div>
              </div>
              <label class="flex items-center gap-2 text-sm"><input type="checkbox" v-model="p.tryMirror" class="h-4 w-4 accent-pine-700" /> Try Mirror</label>
              <label class="flex items-center gap-2 text-sm"><input type="checkbox" :checked="p.active !== false" @change="p.active = ($event.target as HTMLInputElement).checked" class="h-4 w-4 accent-pine-700" /> In store</label>
              <label class="flex items-center gap-2 text-sm"><input type="checkbox" :checked="!!p.badge" @change="p.badge = ($event.target as HTMLInputElement).checked ? { variant: 'new', label: { en: 'New', he: 'חדש' } } : null" class="h-4 w-4 accent-pine-700" /> Badge</label>
            </div>
            <div v-if="p.badge" class="grid gap-3 sm:grid-cols-3">
              <div><label :class="lbl">Badge style</label><select v-model="p.badge.variant" :class="inp"><option v-for="b in BADGE_VARIANTS" :key="b.value" :value="b.value">{{ b.label }}</option></select></div>
              <div><label :class="lbl">Badge label (EN)</label><input v-model="p.badge.label.en" :class="inp" /></div>
              <div><label :class="lbl">Badge label (HE)</label><input v-model="p.badge.label.he" :class="inp" /></div>
            </div>

            <!-- images -->
            <div>
              <label :class="lbl">Product photo</label>
              <div class="flex items-center gap-3">
                <span class="flex h-14 w-20 items-center justify-center overflow-hidden rounded bg-cream-300"><img v-if="p.image" :src="p.image" alt="" class="h-full w-full object-cover" /></span>
                <input v-model="p.image" :class="inp" placeholder="/products/…webp or URL" />
                <label class="inline-flex cursor-pointer items-center gap-1.5 rounded-sm border border-hair px-3 py-2 text-sm hover:border-pine-400"><Upload :size="15" /> Upload<input type="file" accept="image/*" class="hidden" @change="onUpload($event, (u) => p.image = u)" /></label>
              </div>
            </div>

            <!-- desc + specs -->
            <div class="grid gap-3 sm:grid-cols-2">
              <div><label :class="lbl">Description (EN)</label><textarea v-model="p.desc.en" rows="3" :class="inp" /></div>
              <div><label :class="lbl">Description (HE)</label><textarea v-model="p.desc.he" rows="3" :class="inp" dir="rtl" /></div>
            </div>
            <div class="grid gap-3 sm:grid-cols-4">
              <div><label :class="lbl">Lens width</label><input v-model="p.specs.lensWidth" :class="inp" /></div>
              <div><label :class="lbl">Bridge</label><input v-model="p.specs.bridge" :class="inp" /></div>
              <div><label :class="lbl">Temple</label><input v-model="p.specs.temple" :class="inp" /></div>
              <div><label :class="lbl">Weight</label><input v-model="p.specs.weight" :class="inp" /></div>
            </div>

            <div class="flex justify-end pt-1">
              <button @click="removeProduct(p)" class="inline-flex items-center gap-1.5 rounded-sm border border-red-300 px-3 py-2 text-[13px] text-red-600 hover:bg-red-50"><Trash2 :size="15" /> Remove permanently</button>
            </div>
          </div>
        </div>
        <p v-if="!visible.length" class="py-8 text-center text-ink-500">No matching products.</p>
      </div>
    </Panel>

    <Panel title="Brands" desc="Shown on the Brands page.">
      <div class="flex flex-col gap-2">
        <div v-for="(b, i) in (content.brands || [])" :key="i" class="flex gap-2">
          <input :value="b" @input="content.brands[i] = ($event.target as HTMLInputElement).value" class="flex-1 rounded-sm border border-hair px-2.5 py-2 text-sm" placeholder="Brand name" />
          <button @click="content.brands = content.brands.filter((_: any, idx: number) => idx !== i)" class="rounded-sm border border-hair px-3 text-ink-400">×</button>
        </div>
        <button @click="content.brands = [...(content.brands || []), '']" class="self-start rounded-sm border border-hair px-3 py-1.5 text-sm">+ Add brand</button>
      </div>
    </Panel>
  </div>
</template>
