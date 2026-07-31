<script setup lang="ts">
// Reports — revenue + order breakdown derived from the orders endpoint.
const admin = useAdmin()
const orders = ref<any[]>([])
const loading = ref(true)
onMounted(async () => { try { orders.value = await admin.orders() as any[] } finally { loading.value = false } })

const revenue = computed(() => orders.value.reduce((s, o) => s + (Number(o.total) || 0), 0))
const byStatus = computed(() => {
  const m: Record<string, number> = {}
  for (const o of orders.value) m[o.status || 'New'] = (m[o.status || 'New'] || 0) + 1
  return Object.entries(m)
})
const avg = computed(() => (orders.value.length ? Math.round(revenue.value / orders.value.length) : 0))
const topProducts = computed(() => {
  const m: Record<string, number> = {}
  for (const o of orders.value) for (const it of (o.items || [])) { const k = `${it.brand} ${it.name}`.trim(); m[k] = (m[k] || 0) + (Number(it.qty) || 1) }
  return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 8)
})
const fmt = (n: number) => Number(n || 0).toLocaleString('he-IL')
</script>

<template>
  <div class="flex flex-col gap-5">
    <Panel title="Sales summary" desc="Derived live from storefront orders.">
      <p v-if="loading" class="text-ink-500">Loading…</p>
      <div v-else class="grid gap-3.5" style="grid-template-columns:repeat(auto-fit,minmax(150px,1fr))">
        <div class="rounded-md border border-hair p-5"><div class="font-display text-2xl text-ink-900">₪{{ fmt(revenue) }}</div><div class="text-[12.5px] text-ink-500">Total revenue</div></div>
        <div class="rounded-md border border-hair p-5"><div class="font-display text-2xl text-ink-900">{{ orders.length }}</div><div class="text-[12.5px] text-ink-500">Orders</div></div>
        <div class="rounded-md border border-hair p-5"><div class="font-display text-2xl text-ink-900">₪{{ fmt(avg) }}</div><div class="text-[12.5px] text-ink-500">Average order</div></div>
      </div>
    </Panel>

    <Panel title="Orders by status">
      <div v-if="!loading" class="flex flex-col gap-2">
        <div v-for="[st, n] in byStatus" :key="st" class="flex items-center gap-3">
          <span class="w-28 text-sm text-ink-600">{{ st }}</span>
          <div class="h-3 flex-1 overflow-hidden rounded-full bg-cream-300"><div class="h-full bg-pine-600" :style="{ width: (orders.length ? (n / orders.length * 100) : 0) + '%' }" /></div>
          <span class="w-8 text-end text-sm text-ink-700">{{ n }}</span>
        </div>
      </div>
    </Panel>

    <Panel title="Top products">
      <div v-if="!loading" class="flex flex-col gap-1.5">
        <div v-for="[name, qty] in topProducts" :key="name" class="flex justify-between border-b border-hair/60 py-1.5 text-sm"><span class="text-ink-800">{{ name }}</span><span class="text-ink-500">{{ qty }} sold</span></div>
        <p v-if="!topProducts.length" class="py-4 text-center text-ink-500">No sales yet.</p>
      </div>
    </Panel>
  </div>
</template>
