<script setup lang="ts">
import { Check, ArrowRight, Truck, Store, Package, CreditCard, Lock, Info } from 'lucide-vue-next'
const { L, lang } = useLang()
const { t } = useT()
const tk = computed(() => t('checkout'))
const { content } = useContent()
const { cart, subtotal, clear } = useCart()
const router = useRouter()

const settings = computed(() => content.value?.settings || {})
const branches = computed(() => content.value?.stores || [])
const threshold = computed(() => settings.value.shippingThreshold ?? 400)
const fee = computed(() => settings.value.shippingFee ?? 30)
const locale = computed(() => (lang.value === 'he' ? 'he-IL' : 'en-IL'))
const fmt = (n: number) => Number(n).toLocaleString(locale.value)

const step = ref(0)
const pay = ref('cod')
const ship = ref<'delivery' | 'pickup'>('delivery')
const pickupBranch = ref('')
const placing = ref(false)
const orderErr = ref('')
const contactErr = ref('')
const addrErr = ref('')
const orderId = ref('')
const confirmedTotal = ref(0)

const contact = reactive({ firstName: '', lastName: '', email: '', phone: '', address: '', apt: '', city: '', postal: '' })

const shipping = computed(() => (ship.value === 'pickup' || subtotal.value > threshold.value ? 0 : fee.value))
const total = computed(() => subtotal.value + shipping.value)

// Guard: an empty cart can't check out (unless we're already on the confirmation).
watchEffect(() => {
  if (import.meta.client && cart.value.length === 0 && step.value < 3) router.replace('/cart')
})
watch(step, () => { if (import.meta.client) window.scrollTo({ top: 0 }) })

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const toShipping = () => {
  const okName = `${contact.firstName} ${contact.lastName}`.trim().length > 1
  const okEmail = EMAIL_RE.test(contact.email.trim())
  const okPhone = contact.phone.replace(/\D/g, '').length >= 7
  if (!okName || !okEmail || !okPhone) { contactErr.value = tk.value.contactError; return }
  contactErr.value = ''
  step.value = 1
}
const toPayment = () => {
  if (ship.value === 'delivery' && !contact.address.trim()) { addrErr.value = tk.value.addrManualError; return }
  if (ship.value === 'pickup' && !pickupBranch.value) { addrErr.value = tk.value.selectBranch; return }
  addrErr.value = ''
  step.value = 2
}

const placeOrder = async () => {
  if (placing.value) return
  placing.value = true
  orderErr.value = ''
  const street = contact.apt ? `${contact.address}, ${contact.apt}` : contact.address
  try {
    const r: any = await $fetch('/api/orders', {
      method: 'POST',
      body: {
        customer: {
          name: `${contact.firstName} ${contact.lastName}`.trim(),
          email: contact.email, phone: contact.phone,
          address: street, city: contact.city, postal: contact.postal,
        },
        branch: ship.value === 'pickup' ? pickupBranch.value : undefined,
        items: cart.value.map((it) => ({ id: it.id, name: it.name, brand: it.brand, amount: it.amount, qty: it.qty, customSize: it.customSize || undefined })),
        subtotal: subtotal.value, shipping: shipping.value, total: total.value,
        payment: pay.value, fulfilment: ship.value,
      },
    })
    // Snapshot total + id, then clear the cart on acceptance (server total wins).
    confirmedTotal.value = Number(r?.total) || total.value
    orderId.value = r?.id || ''
    clear()
    step.value = 3
  } catch (e: any) {
    orderErr.value = e?.data?.error || e?.message || tk.value.orderError
  } finally {
    placing.value = false
  }
}

useHead({ title: 'Checkout — OPTIZONE' })
</script>

<template>
  <!-- CONFIRMATION -->
  <div v-if="step === 3" class="mx-auto max-w-xl px-7 py-16 text-center">
    <span class="mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full bg-pine-50">
      <Check :size="36" class="text-pine-700" />
    </span>
    <h1 class="mb-1.5 mt-6 font-display text-3xl font-medium text-ink-900">{{ tk.confirmedH1 }}</h1>
    <p class="text-base leading-relaxed text-ink-700">
      {{ tk.confirmedP(fmt(confirmedTotal), orderId) }}<br />{{ tk.confirmedNote }}
    </p>
    <div class="mt-7 flex flex-wrap justify-center gap-3">
      <NuxtLink to="/account" class="rounded-sm border border-pine-700 px-6 py-3 font-display text-sm text-pine-700 hover:bg-pine-50">{{ tk.trackOrder }}</NuxtLink>
      <NuxtLink to="/" class="rounded-sm bg-pine-700 px-6 py-3 font-display text-sm text-cream-100 hover:bg-amber-600 hover:text-pine-950">{{ tk.continueShopping }}</NuxtLink>
    </div>
  </div>

  <div v-else class="mx-auto max-w-container px-7 pb-20 pt-8">
    <h1 class="mb-5 font-display text-3xl font-medium text-ink-900">{{ tk.title }}</h1>
    <!-- steps -->
    <div class="mb-8 flex flex-wrap gap-7">
      <div v-for="(s, i) in tk.steps" :key="s" class="flex items-center gap-2.5" :class="step === i || step > i ? 'opacity-100' : 'opacity-50'">
        <span class="flex h-8 w-8 items-center justify-center rounded-full font-display text-[13px]"
          :class="step > i ? 'bg-emerald-600 text-cream-100' : step === i ? 'bg-pine-700 text-cream-100' : 'bg-cream-300 text-ink-500'">
          <Check v-if="step > i" :size="15" /><template v-else>{{ i + 1 }}</template>
        </span>
        <span class="font-display text-[12.5px] uppercase tracking-[0.06em]" :class="step === i ? 'text-ink-900' : 'text-ink-500'">{{ s }}</span>
      </div>
    </div>

    <div class="grid gap-9 lg:grid-cols-[1fr_340px] lg:items-start">
      <div class="flex flex-col gap-4">
        <!-- STEP 0 — CONTACT -->
        <template v-if="step === 0">
          <div class="font-display text-[13px] uppercase tracking-[0.08em] text-ink-900">{{ tk.contactTitle }}</div>
          <div class="grid gap-3.5 sm:grid-cols-2">
            <input v-model="contact.firstName" :placeholder="tk.firstName" class="rounded-sm border border-hair px-3.5 py-3 text-sm" />
            <input v-model="contact.lastName" :placeholder="tk.lastName" class="rounded-sm border border-hair px-3.5 py-3 text-sm" />
          </div>
          <input v-model="contact.email" type="email" :placeholder="tk.email" class="rounded-sm border border-hair px-3.5 py-3 text-sm" />
          <input v-model="contact.phone" :placeholder="tk.phone" class="rounded-sm border border-hair px-3.5 py-3 text-sm" />
          <p v-if="contactErr" role="alert" class="text-[13px] text-red-500">{{ contactErr }}</p>
          <button @click="toShipping" class="inline-flex items-center justify-center gap-2 rounded-sm bg-pine-700 px-6 py-3.5 font-display text-sm uppercase tracking-wide text-cream-100 hover:bg-amber-600 hover:text-pine-950">
            {{ tk.toShipping }}<ArrowRight :size="18" />
          </button>
        </template>

        <!-- STEP 1 — SHIPPING -->
        <template v-else-if="step === 1">
          <div class="font-display text-[13px] uppercase tracking-[0.08em] text-ink-900">{{ tk.deliveryTitle }}</div>
          <button @click="ship = 'delivery'" class="flex items-center gap-3.5 rounded-md border px-4 py-3.5 text-start" :class="ship === 'delivery' ? 'border-pine-700 bg-pine-50' : 'border-hair bg-white'">
            <span class="flex h-10 w-10 flex-none items-center justify-center rounded-sm bg-cream-300"><Truck :size="20" class="text-pine-700" /></span>
            <span class="flex-1"><span class="block font-semibold text-ink-900">{{ tk.homeDelivery }}</span><span class="text-[13px] text-ink-500">{{ subtotal > threshold ? tk.homeFree : tk.homePaid }}</span></span>
          </button>
          <button @click="ship = 'pickup'" class="flex items-center gap-3.5 rounded-md border px-4 py-3.5 text-start" :class="ship === 'pickup' ? 'border-pine-700 bg-pine-50' : 'border-hair bg-white'">
            <span class="flex h-10 w-10 flex-none items-center justify-center rounded-sm bg-cream-300"><Store :size="20" class="text-pine-700" /></span>
            <span class="flex-1"><span class="block font-semibold text-ink-900">{{ tk.pickup }}</span><span class="text-[13px] text-ink-500">{{ tk.pickupSub }}</span></span>
          </button>

          <div v-if="ship === 'delivery'" class="mt-1 flex flex-col gap-3.5">
            <div class="font-display text-[13px] uppercase tracking-[0.08em] text-ink-900">{{ tk.addrTitle }}</div>
            <div class="grid gap-3.5 sm:grid-cols-[2fr_1fr]">
              <input v-model="contact.address" :placeholder="tk.street" class="rounded-sm border border-hair px-3.5 py-3 text-sm" />
              <input v-model="contact.apt" :placeholder="tk.apt" class="rounded-sm border border-hair px-3.5 py-3 text-sm" />
            </div>
            <div class="grid gap-3.5 sm:grid-cols-[2fr_1fr]">
              <input v-model="contact.city" :placeholder="tk.city" class="rounded-sm border border-hair px-3.5 py-3 text-sm" />
              <input v-model="contact.postal" :placeholder="tk.postal" class="rounded-sm border border-hair px-3.5 py-3 text-sm" />
            </div>
          </div>
          <div v-else class="mt-1">
            <select v-model="pickupBranch" class="w-full rounded-sm border border-hair bg-white px-3.5 py-3 text-sm">
              <option value="">{{ tk.selectBranch }}</option>
              <option v-for="b in branches" :key="b.name" :value="b.name">OPTIZONE {{ L({ en: b.name, he: b.he }) || b.name }}</option>
            </select>
          </div>
          <p v-if="addrErr" role="alert" class="flex items-center gap-1.5 text-[13px] text-red-500"><Info :size="15" /> {{ addrErr }}</p>
          <div class="mt-1.5 flex gap-3">
            <button @click="step = 0" class="rounded-sm px-5 py-3 font-display text-sm text-ink-600 hover:text-pine-700">{{ tk.back }}</button>
            <button @click="toPayment" class="inline-flex flex-1 items-center justify-center gap-2 rounded-sm bg-pine-700 px-6 py-3.5 font-display text-sm uppercase tracking-wide text-cream-100 hover:bg-amber-600 hover:text-pine-950">{{ tk.toPayment }}<ArrowRight :size="18" /></button>
          </div>
        </template>

        <!-- STEP 2 — PAYMENT -->
        <template v-else-if="step === 2">
          <div class="font-display text-[13px] uppercase tracking-[0.08em] text-ink-900">{{ tk.payTitle }}</div>
          <button @click="pay = 'cod'" class="flex items-center gap-3.5 rounded-md border px-4 py-3.5 text-start" :class="pay === 'cod' ? 'border-pine-700 bg-pine-50' : 'border-hair bg-white'">
            <span class="flex h-10 w-10 flex-none items-center justify-center rounded-sm bg-cream-300"><Package :size="20" class="text-pine-700" /></span>
            <span class="flex-1"><span class="block font-semibold text-ink-900">{{ tk.cod }}</span><span class="text-[13px] text-ink-500">{{ tk.codSub }}</span></span>
          </button>
          <div class="flex cursor-not-allowed items-center gap-3.5 rounded-md border border-hair bg-white px-4 py-3.5 opacity-55">
            <span class="flex h-10 w-10 flex-none items-center justify-center rounded-sm bg-cream-300"><CreditCard :size="20" class="text-pine-700" /></span>
            <span class="flex-1">
              <span class="flex items-center gap-2 font-semibold text-ink-900">{{ tk.card }}<span class="rounded-pill bg-amber-500 px-2 py-0.5 font-display text-[10px] uppercase tracking-wide text-pine-950">{{ tk.comingSoon }}</span></span>
              <span class="block text-[13px] text-ink-500">{{ tk.cardSoonNote }}</span>
            </span>
          </div>
          <div class="mt-1 flex items-center gap-2 text-[12.5px] text-ink-500"><Lock :size="14" /> {{ tk.secure }}</div>
          <p v-if="orderErr" role="alert" class="flex items-center gap-1.5 text-[13px] text-red-500"><Info :size="15" /> {{ orderErr }}</p>
          <div class="mt-1.5 flex gap-3">
            <button @click="step = 1" :disabled="placing" class="rounded-sm px-5 py-3 font-display text-sm text-ink-600 hover:text-pine-700 disabled:opacity-50">{{ tk.back }}</button>
            <button @click="placeOrder" :disabled="placing" class="inline-flex flex-1 items-center justify-center gap-2 rounded-sm bg-pine-700 px-6 py-3.5 font-display text-sm uppercase tracking-wide text-cream-100 hover:bg-amber-600 hover:text-pine-950 disabled:opacity-60">
              <Check :size="17" />{{ placing ? tk.placing : tk.placeOrder(fmt(total)) }}
            </button>
          </div>
        </template>
      </div>

      <!-- SUMMARY -->
      <div class="rounded-lg border border-hair bg-white p-5 shadow-xs lg:sticky lg:top-24">
        <div class="mb-4 font-display text-sm uppercase tracking-[0.1em] text-ink-900">{{ tk.summary }}</div>
        <div class="mb-3.5 flex flex-col gap-3">
          <div v-for="(it, i) in cart" :key="i" class="flex items-center gap-3">
            <span class="flex h-11 w-11 flex-none items-center justify-center overflow-hidden rounded-sm bg-cream-300">
              <img v-if="it.image" :src="it.image" :alt="it.name" class="h-full w-full object-cover" />
            </span>
            <span class="flex-1 text-[13.5px]">
              <b class="text-ink-900">{{ it.name }}</b><br />
              <span class="text-ink-500">{{ tk.qty(it.qty) }}</span>
            </span>
            <span class="text-[13.5px] font-semibold">₪{{ fmt(it.amount * it.qty) }}</span>
          </div>
        </div>
        <div class="border-t border-hair pt-3">
          <div class="flex justify-between py-1.5 text-sm text-ink-700"><span>{{ tk.subtotal }}</span><span>₪{{ fmt(subtotal) }}</span></div>
          <div class="flex justify-between py-1.5 text-sm text-ink-700"><span>{{ tk.shipping }}</span><span>{{ shipping ? '₪' + shipping : tk.free }}</span></div>
        </div>
        <div class="mt-2 flex items-baseline justify-between border-t border-hair pt-3">
          <span class="font-display text-[15px] uppercase tracking-[0.06em] text-ink-900">{{ tk.total }}</span>
          <span class="font-display text-2xl text-ink-900">₪{{ fmt(total) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
