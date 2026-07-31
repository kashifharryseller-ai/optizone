<script setup lang="ts">
import { ShoppingBag } from 'lucide-vue-next'
const props = defineProps<{ product: any }>()
const { L } = useLang()
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
</script>

<template>
  <div class="group relative flex flex-col overflow-hidden rounded-card border border-hair bg-white shadow-xs transition-shadow hover:shadow-md" @mousemove="onMove">
    <div class="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" :style="{ background: `radial-gradient(240px circle at ${mx}% ${my}%, rgba(245,166,35,0.12), transparent 60%)` }" />
    <div class="relative aspect-[4/3] overflow-hidden bg-cream-300">
      <img v-if="p.image" :src="p.image" :alt="`${p.brand} ${p.name}`" loading="lazy" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      <span v-if="badge" class="absolute start-3 top-3 rounded-xs bg-amber-600 px-2 py-1 font-display text-[10px] uppercase tracking-wide text-pine-950">{{ badge.label }}</span>
    </div>
    <div class="flex flex-1 flex-col gap-2 p-4">
      <span v-if="p.brand" class="font-display text-[11px] uppercase tracking-[0.16em] text-amber-700">{{ p.brand }}</span>
      <span class="font-body text-[15px] font-semibold leading-snug text-ink-900">{{ p.name }}</span>
      <div class="mt-auto flex items-center justify-between pt-2">
        <span class="font-display text-lg text-ink-900">
          {{ fmt(p.amount) }}<span v-if="p.original" class="ms-1 text-sm text-ink-400 line-through">{{ fmt(p.original) }}</span>
        </span>
        <button aria-label="Add to cart" class="inline-flex h-9 w-9 items-center justify-center rounded-sm bg-pine-700 text-cream-100 transition-colors hover:bg-amber-600 hover:text-pine-950">
          <ShoppingBag :size="16" />
        </button>
      </div>
    </div>
  </div>
</template>
