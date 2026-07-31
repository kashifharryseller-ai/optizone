<script setup lang="ts">
import { ShoppingBag, Package, Calendar, User, Store, CreditCard, Info } from 'lucide-vue-next'
const props = defineProps<{ stats: any; go: (s: string) => void }>()

const notes = computed(() => {
  const s = props.stats; const out: string[] = []
  if (!s) return out
  if (s.store?.ephemeral) out.push('Data is stored in TEMPORARY serverless storage: orders, customers and content edits reset on every redeploy. Connect a MySQL database (DB_HOST / DB_USER / DB_PASSWORD / DB_NAME) to make everything permanent.')
  if (s.security && s.security.jwtFromEnv === false) out.push('JWT_SECRET is not set in the host environment — set a long random JWT_SECRET for secure, stable sign-in sessions.')
  return out
})
const cards = computed(() => {
  const s = props.stats
  return [
    { Icon: ShoppingBag, label: 'Products', value: s ? s.products : '—' },
    { Icon: Package, label: `Orders (${s ? s.newOrders : 0} new)`, value: s ? s.orders : '—' },
    { Icon: Calendar, label: `Appointments (${s ? s.newBookings : 0} new)`, value: s ? s.bookings : '—' },
    { Icon: User, label: 'Customers', value: s ? s.customers : '—' },
    { Icon: Store, label: 'Branches', value: s ? s.stores : '—' },
    { Icon: CreditCard, label: 'Revenue', value: s ? '₪' + Number(s.revenue).toLocaleString('he-IL') : '—' },
  ]
})
</script>

<template>
  <div class="flex flex-col gap-5">
    <div v-if="notes.length" role="alert" class="flex gap-3 rounded-md border border-amber-600 bg-amber-50 px-4 py-3.5">
      <Info :size="19" class="mt-0.5 flex-none text-amber-700" />
      <div class="flex flex-col gap-2">
        <div class="font-display text-[13px] uppercase tracking-[0.08em] text-amber-700">Deployment setup needed</div>
        <div v-for="(n, i) in notes" :key="i" class="text-[13.5px] leading-relaxed text-ink-700">{{ n }}</div>
      </div>
    </div>

    <Panel title="Overview" desc="A snapshot of your store.">
      <div class="grid gap-3.5" style="grid-template-columns:repeat(auto-fit,minmax(150px,1fr))">
        <div v-for="c in cards" :key="c.label" class="rounded-md border border-hair bg-white p-5">
          <span class="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-sm bg-pine-50"><component :is="c.Icon" :size="19" class="text-pine-700" /></span>
          <div class="font-display text-2xl text-ink-900">{{ c.value }}</div>
          <div class="text-[12.5px] text-ink-500">{{ c.label }}</div>
        </div>
      </div>
    </Panel>

    <Panel title="Quick actions">
      <div class="flex flex-wrap gap-2.5">
        <button @click="go('products')" class="rounded-sm bg-pine-700 px-4 py-2.5 text-sm text-cream-100 hover:bg-amber-600 hover:text-pine-950">Manage products</button>
        <button @click="go('content')" class="rounded-sm border border-hair px-4 py-2.5 text-sm text-ink-700 hover:border-pine-400">Edit homepage</button>
        <button @click="go('orders')" class="rounded-sm border border-hair px-4 py-2.5 text-sm text-ink-700 hover:border-pine-400">View orders</button>
        <button @click="go('bookings')" class="rounded-sm border border-hair px-4 py-2.5 text-sm text-ink-700 hover:border-pine-400">View appointments</button>
        <a href="/" target="_blank" class="rounded-sm px-4 py-2.5 text-sm text-pine-700 hover:text-amber-700">Open storefront ↗</a>
      </div>
    </Panel>
  </div>
</template>
