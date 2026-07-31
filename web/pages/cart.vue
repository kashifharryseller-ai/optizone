<script setup lang="ts">
import { Trash2, Minus, Plus, Glasses } from 'lucide-vue-next'
const { L } = useLang()
const { t } = useT()
const tc = computed(() => t('cart'))
const { content } = useContent()
const { cart, setQty, remove, subtotal } = useCart()

const settings = computed(() => content.value?.settings || {})
const threshold = computed(() => settings.value.shippingThreshold ?? 400)
const fee = computed(() => settings.value.shippingFee ?? 30)

// Promo codes (Admin → Discounts). Applying a valid, active code discounts the
// subtotal by its percentage. The server never trusts client discounts — this is
// a display convenience only (server recomputes on order).
const promoInput = ref('')
const promo = ref<{ code: string; percent: number } | null>(null)
const promoErr = ref('')
const applyPromo = () => {
  const code = promoInput.value.trim().toUpperCase()
  if (!code) return
  const match = (settings.value.promos || []).find((p: any) => p.active !== false && String(p.code || '').toUpperCase() === code)
  if (match) { promo.value = { code, percent: Number(match.percent) || 0 }; promoErr.value = '' }
  else { promo.value = null; promoErr.value = tc.value.promoInvalid }
}
const discount = computed(() => (promo.value ? Math.round(subtotal.value * (promo.value.percent / 100)) : 0))
const shipping = computed(() => ((subtotal.value - discount.value) > threshold.value || subtotal.value === 0 ? 0 : fee.value))
const grandTotal = computed(() => subtotal.value - discount.value + shipping.value)
const fmt = (n: number) => Number(n).toLocaleString('he-IL')

useHead({ title: 'Cart — OPTIZONE' })
</script>

<template>
  <div v-if="cart.length === 0" class="mx-auto max-w-xl px-7 py-24 text-center">
    <Glasses :size="56" class="mx-auto text-pine-300" />
    <h1 class="mb-2 mt-5 font-display text-3xl font-medium text-ink-900">{{ tc.emptyH1 }}</h1>
    <p class="mb-6 text-ink-500">{{ tc.emptyP }}</p>
    <NuxtLink to="/eyeglasses" class="inline-block rounded-sm bg-pine-700 px-7 py-3.5 font-display text-sm uppercase tracking-wide text-cream-100 transition hover:bg-amber-600 hover:text-pine-950">{{ tc.shop }}</NuxtLink>
  </div>

  <div v-else class="mx-auto max-w-container px-7 pb-20 pt-9">
    <h1 class="mb-6 font-display text-4xl font-medium text-ink-900">{{ tc.title }}</h1>
    <div class="grid gap-9 lg:grid-cols-[1fr_340px] lg:items-start">
      <!-- LINES -->
      <div class="flex flex-col gap-3.5">
        <div v-for="(it, idx) in cart" :key="idx" class="flex items-center gap-4 rounded-md border border-hair bg-white p-4">
          <div class="flex h-[92px] w-[92px] flex-none items-center justify-center overflow-hidden rounded-sm bg-cream-300">
            <img v-if="it.image" :src="it.image" :alt="it.name" loading="lazy" class="h-full w-full object-cover" />
            <Glasses v-else :size="26" class="text-pine-500" />
          </div>
          <div class="flex-1">
            <div class="font-display text-[11px] uppercase tracking-[0.14em] text-amber-700">{{ it.brand }}</div>
            <div class="my-1 text-base font-semibold text-ink-900">{{ it.name }}</div>
            <div class="text-[13px] text-ink-500">{{ tc.lineNote }}</div>
            <div v-if="it.customSize" class="mt-0.5 text-[12.5px] text-amber-700">{{ tc.customSize(it.customSize) }}</div>
          </div>
          <div class="flex items-center gap-1 rounded-sm border border-hair">
            <button @click="setQty(idx, it.qty - 1)" aria-label="decrease" class="flex h-8 w-8 items-center justify-center text-ink-600 hover:text-pine-700"><Minus :size="14" /></button>
            <span class="w-6 text-center text-sm">{{ it.qty }}</span>
            <button @click="setQty(idx, it.qty + 1)" aria-label="increase" class="flex h-8 w-8 items-center justify-center text-ink-600 hover:text-pine-700"><Plus :size="14" /></button>
          </div>
          <div class="w-24 text-end font-display text-ink-900">₪{{ fmt(it.amount * it.qty) }}</div>
          <button @click="remove(idx)" aria-label="remove" class="text-ink-300 hover:text-red-500"><Trash2 :size="18" /></button>
        </div>
      </div>

      <!-- SUMMARY -->
      <div class="rounded-lg border border-hair bg-white p-6 lg:sticky lg:top-24">
        <div class="mb-4 font-display text-sm uppercase tracking-[0.1em] text-ink-900">{{ tc.summary }}</div>
        <div class="flex justify-between py-2 text-sm text-ink-700"><span>{{ tc.subtotal }}</span><span>₪{{ fmt(subtotal) }}</span></div>
        <div class="flex justify-between py-2 text-sm text-ink-700"><span>{{ tc.shipping }}</span><span>{{ shipping ? '₪' + shipping : tc.free }}</span></div>
        <div v-if="promo" class="flex justify-between py-2 text-sm text-emerald-700"><span>{{ tc.promoApplied(promo.code) }} · −{{ promo.percent }}%</span><span>−₪{{ fmt(discount) }}</span></div>
        <div class="my-3 flex gap-2">
          <input v-model="promoInput" :placeholder="tc.promo" @keydown.enter="applyPromo" class="flex-1 rounded-sm border border-hair px-3 py-2 text-sm" />
          <button @click="applyPromo" class="rounded-sm border border-pine-700 px-3 py-2 text-sm text-pine-700 hover:bg-pine-50">{{ tc.apply }}</button>
        </div>
        <p v-if="promoErr" role="alert" class="mb-2 text-[12.5px] text-red-500">{{ promoErr }}</p>
        <div class="my-3 border-t border-hair" />
        <div class="flex items-baseline justify-between">
          <span class="font-display text-[15px] uppercase tracking-[0.06em] text-ink-900">{{ tc.total }}</span>
          <span class="font-display text-2xl text-ink-900">₪{{ fmt(grandTotal) }}</span>
        </div>
        <div class="mt-5 flex flex-col gap-2.5">
          <NuxtLink to="/checkout" class="rounded-sm bg-pine-700 px-6 py-3.5 text-center font-display text-sm uppercase tracking-wide text-cream-100 transition hover:bg-amber-600 hover:text-pine-950">{{ tc.checkout }}</NuxtLink>
          <NuxtLink to="/booking" class="rounded-sm px-6 py-2.5 text-center font-display text-sm text-pine-700 hover:text-amber-700">{{ tc.reserve }}</NuxtLink>
        </div>
        <div class="mt-4 flex flex-wrap justify-center gap-3.5 font-display text-[11px] uppercase tracking-[0.08em] text-ink-300">
          <span v-for="pm in tc.pays" :key="pm">{{ pm }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
