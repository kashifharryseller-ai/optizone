<script setup lang="ts">
import { X, Minus, Plus, Trash2, ShoppingBag, Glasses } from 'lucide-vue-next'
const { L, dir } = useLang()
const { t } = useT()
const tc = computed(() => t('cart'))
const { content } = useContent()
const { cart, setQty, remove, subtotal, count } = useCart()
const { open, closeCart } = useCartDrawer()

const settings = computed(() => content.value?.settings || {})
const threshold = computed(() => settings.value.shippingThreshold ?? 400)
const fee = computed(() => settings.value.shippingFee ?? 30)
const shipping = computed(() => (subtotal.value > threshold.value || subtotal.value === 0 ? 0 : fee.value))
const remaining = computed(() => Math.max(0, threshold.value - subtotal.value))
const fmt = (n: number) => Number(n || 0).toLocaleString('he-IL')
const side = computed(() => (dir.value === 'rtl' ? 'left-0' : 'right-0'))
const enterFrom = computed(() => (dir.value === 'rtl' ? '-translate-x-full' : 'translate-x-full'))

// Lock body scroll while open + close on Escape.
watch(open, (v) => {
  if (typeof document === 'undefined') return
  document.body.style.overflow = v ? 'hidden' : ''
})
onMounted(() => {
  const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCart() }
  window.addEventListener('keydown', onKey)
  onUnmounted(() => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' })
})

const freeShipCopy = computed(() => ({
  en: `You're ₪${fmt(remaining.value)} away from free shipping`,
  he: `עוד ₪${fmt(remaining.value)} למשלוח חינם`,
  ar: `يفصلك ₪${fmt(remaining.value)} عن الشحن المجاني`,
}))
const titleCopy = { en: 'Your cart', he: 'העגלה שלך', ar: 'سلتك' }
const viewCart = { en: 'View cart', he: 'צפייה בעגלה', ar: 'عرض السلة' }
const keepShopping = { en: 'Keep shopping', he: 'המשך בקנייה', ar: 'متابعة التسوّق' }
</script>

<template>
  <Teleport to="body">
    <Transition name="oz-fade">
      <div v-if="open" class="fixed inset-0 z-[1000] bg-pine-950/60 backdrop-blur-sm" @click.self="closeCart" />
    </Transition>
    <Transition :enter-from-class="enterFrom" :leave-to-class="enterFrom" enter-active-class="transition-transform duration-300 ease-out" leave-active-class="transition-transform duration-300 ease-in">
      <aside v-if="open" :class="side" class="fixed inset-y-0 z-[1001] flex w-[min(92vw,420px)] flex-col bg-cream-100 shadow-2xl">
        <!-- header -->
        <div class="flex items-center justify-between border-b border-hair px-5 py-4">
          <span class="flex items-center gap-2 font-display text-lg text-ink-900"><ShoppingBag :size="18" /> {{ L(titleCopy) }} <span v-if="count" class="text-ink-400">({{ count }})</span></span>
          <button @click="closeCart" aria-label="Close" class="rounded-full p-1.5 text-ink-500 hover:bg-cream-300"><X :size="20" /></button>
        </div>

        <!-- empty -->
        <div v-if="!cart.length" class="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
          <Glasses :size="52" class="text-pine-300" />
          <p class="text-ink-500">{{ tc.emptyP }}</p>
          <button @click="closeCart" class="rounded-sm bg-pine-700 px-6 py-3 font-display text-sm uppercase tracking-wide text-cream-100 hover:bg-amber-600 hover:text-pine-950">{{ tc.shop }}</button>
        </div>

        <template v-else>
          <!-- free-shipping progress -->
          <div v-if="remaining > 0" class="border-b border-hair bg-white px-5 py-3">
            <p class="mb-1.5 text-[12.5px] text-ink-600">{{ L(freeShipCopy) }}</p>
            <div class="h-1.5 overflow-hidden rounded-full bg-cream-300"><div class="h-full rounded-full bg-amber-500 transition-all" :style="{ width: Math.min(100, (subtotal / threshold) * 100) + '%' }" /></div>
          </div>

          <!-- lines -->
          <div class="flex-1 overflow-y-auto px-5 py-4">
            <div v-for="(it, idx) in cart" :key="idx" class="flex gap-3 border-b border-hair/60 py-3.5 last:border-0">
              <div class="flex h-20 w-20 flex-none items-center justify-center overflow-hidden rounded-sm bg-cream-300">
                <img v-if="it.image" :src="it.image" :alt="it.name" class="h-full w-full object-cover" />
                <Glasses v-else :size="22" class="text-pine-500" />
              </div>
              <div class="min-w-0 flex-1">
                <div class="font-display text-[10.5px] uppercase tracking-[0.12em] text-amber-700">{{ it.brand }}</div>
                <div class="truncate text-sm font-semibold text-ink-900">{{ it.name }}</div>
                <div v-if="it.customSize" class="text-[12px] text-amber-700">{{ tc.customSize(it.customSize) }}</div>
                <div class="mt-2 flex items-center justify-between">
                  <div class="flex items-center rounded-sm border border-hair">
                    <button @click="setQty(idx, it.qty - 1)" aria-label="decrease" class="flex h-7 w-7 items-center justify-center text-ink-600 hover:text-pine-700"><Minus :size="13" /></button>
                    <span class="w-6 text-center text-[13px]">{{ it.qty }}</span>
                    <button @click="setQty(idx, it.qty + 1)" aria-label="increase" class="flex h-7 w-7 items-center justify-center text-ink-600 hover:text-pine-700"><Plus :size="13" /></button>
                  </div>
                  <span class="font-display text-ink-900">₪{{ fmt(it.amount * it.qty) }}</span>
                </div>
              </div>
              <button @click="remove(idx)" aria-label="remove" class="self-start text-ink-300 hover:text-red-500"><Trash2 :size="16" /></button>
            </div>
          </div>

          <!-- footer -->
          <div class="border-t border-hair bg-white px-5 py-4">
            <div class="mb-1 flex justify-between text-sm text-ink-600"><span>{{ tc.subtotal }}</span><span>₪{{ fmt(subtotal) }}</span></div>
            <div class="mb-3 flex justify-between text-sm text-ink-600"><span>{{ tc.shipping }}</span><span>{{ shipping ? '₪' + shipping : tc.free }}</span></div>
            <div class="mb-4 flex items-baseline justify-between border-t border-hair pt-3">
              <span class="font-display text-[15px] uppercase tracking-[0.06em] text-ink-900">{{ tc.total }}</span>
              <span class="font-display text-xl text-ink-900">₪{{ fmt(subtotal + shipping) }}</span>
            </div>
            <NuxtLink to="/checkout" @click="closeCart" class="block rounded-sm bg-pine-700 px-6 py-3.5 text-center font-display text-sm uppercase tracking-wide text-cream-100 transition hover:bg-amber-600 hover:text-pine-950">{{ tc.checkout }}</NuxtLink>
            <div class="mt-2 flex gap-2">
              <NuxtLink to="/cart" @click="closeCart" class="flex-1 rounded-sm border border-hair px-4 py-2.5 text-center font-display text-[13px] text-ink-700 hover:border-pine-400">{{ L(viewCart) }}</NuxtLink>
              <button @click="closeCart" class="flex-1 rounded-sm px-4 py-2.5 text-center font-display text-[13px] text-pine-700 hover:text-amber-700">{{ L(keepShopping) }}</button>
            </div>
          </div>
        </template>
      </aside>
    </Transition>
  </Teleport>
</template>

<style scoped>
.oz-fade-enter-active, .oz-fade-leave-active { transition: opacity 0.25s ease; }
.oz-fade-enter-from, .oz-fade-leave-to { opacity: 0; }
</style>
