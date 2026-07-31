<script setup lang="ts">
import { ShoppingBag, Heart } from 'lucide-vue-next'
const props = defineProps<{ product: any }>()
const { L } = useLang()
const { add } = useCart()
const { isAuthed, inWishlist, toggleWishlist } = useAuth()
const router = useRouter()
const p = props.product
const fmt = (n: number) => '₪' + Number(n).toLocaleString('he-IL')
const badge = computed(() => (p.badge ? { variant: p.badge.variant, label: L(p.badge.label) } : null))

// Inspira-UI-style card spotlight (amber glow tracks the cursor).
const mx = ref(50)
const my = ref(50)
const onMove = (e: MouseEvent) => {
  const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
  mx.value = ((e.clientX - r.left) / r.width) * 100
  my.value = ((e.clientY - r.top) / r.height) * 100
}

const added = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null
const quickAdd = () => {
  add({ id: p.id, name: L(p.name) || p.name, brand: p.brand, amount: p.amount, image: p.image, colors: p.colors })
  added.value = true
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => (added.value = false), 1400)
}

// Wishlist heart — guests are sent to sign in; filled when saved.
const wished = computed(() => isAuthed.value && inWishlist(p.id))
const toggleWish = () => {
  if (!isAuthed.value) { router.push('/account'); return }
  toggleWishlist(p.id).catch(() => { /* re-syncs on next load */ })
}
</script>

<template>
  <div class="group relative flex flex-col overflow-hidden rounded-card border border-hair bg-white shadow-xs transition-shadow hover:shadow-md" @mousemove="onMove">
    <div class="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" :style="{ background: `radial-gradient(240px circle at ${mx}% ${my}%, rgba(245,166,35,0.12), transparent 60%)` }" />
    <div class="relative aspect-[4/3] overflow-hidden bg-cream-300">
      <NuxtLink :to="`/product/${p.id}`" class="block h-full w-full">
        <img v-if="p.image" :src="p.image" :alt="`${p.brand} ${L(p.name) || p.name}`" loading="lazy" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      </NuxtLink>
      <span v-if="badge" class="pointer-events-none absolute start-3 top-3 rounded-xs bg-amber-600 px-2 py-1 font-display text-[10px] uppercase tracking-wide text-pine-950">{{ badge.label }}</span>
      <button @click.stop.prevent="toggleWish" :aria-label="wished ? 'Remove from wishlist' : 'Add to wishlist'"
        class="absolute end-3 top-3 z-20 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/85 backdrop-blur transition-colors hover:bg-white"
        :class="wished ? 'text-red-500' : 'text-ink-500'">
        <Heart :size="16" :fill="wished ? 'currentColor' : 'none'" />
      </button>
    </div>
    <div class="flex flex-1 flex-col gap-2 p-4">
      <span v-if="p.brand" class="font-display text-[11px] uppercase tracking-[0.16em] text-amber-700">{{ p.brand }}</span>
      <NuxtLink :to="`/product/${p.id}`" class="font-body text-[15px] font-semibold leading-snug text-ink-900 transition-colors hover:text-amber-700">{{ L(p.name) || p.name }}</NuxtLink>
      <div class="mt-auto flex items-center justify-between pt-2">
        <span class="font-display text-lg text-ink-900">
          {{ fmt(p.amount) }}<span v-if="p.original" class="ms-1 text-sm text-ink-400 line-through">{{ fmt(p.original) }}</span>
        </span>
        <button :aria-label="added ? 'Added' : 'Add to cart'" @click="quickAdd" class="inline-flex h-9 w-9 items-center justify-center rounded-sm bg-pine-700 text-cream-100 transition-colors hover:bg-amber-600 hover:text-pine-950" :class="added ? 'bg-amber-600 text-pine-950' : ''">
          <ShoppingBag :size="16" />
        </button>
      </div>
    </div>
  </div>
</template>
