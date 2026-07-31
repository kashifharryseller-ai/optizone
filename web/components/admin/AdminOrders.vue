<script setup lang="ts">
const admin = useAdmin()
const STATUSES = ['New', 'In lab', 'Shipped', 'Collected', 'Cancelled']
const rows = ref<any[]>([])
const loading = ref(true)
const err = ref('')
const query = ref('')
const statusFilter = ref('all')

async function load() {
  loading.value = true; err.value = ''
  try { rows.value = await admin.orders() as any[] } catch (e: any) { err.value = e?.data?.error || e?.message } finally { loading.value = false }
}
onMounted(load)

async function setStatus(id: string, status: string) {
  try { await admin.setOrderStatus(id, status); const o = rows.value.find((x) => x.id === id); if (o) o.status = status } catch (e: any) { err.value = e?.message }
}
async function del(id: string) {
  if (!confirm(`Delete order ${id}? This cannot be undone.`)) return
  try { await admin.deleteOrder(id); rows.value = rows.value.filter((o) => o.id !== id) } catch (e: any) { err.value = e?.message }
}
const shown = computed(() => {
  const q = query.value.trim().toLowerCase()
  return rows.value.filter((o) =>
    (statusFilter.value === 'all' || o.status === statusFilter.value) &&
    (!q || `${o.id} ${o.customer?.name || ''} ${o.customer?.email || ''} ${o.customer?.phone || ''}`.toLowerCase().includes(q)))
})
const fmt = (n: number) => Number(n || 0).toLocaleString('he-IL')
</script>

<template>
  <Panel title="Orders" desc="Orders placed through the storefront checkout.">
    <template #actions>
      <input v-model="query" placeholder="Search id / name / email…" class="h-9 rounded-sm border border-hair px-3 text-sm" />
      <select v-model="statusFilter" class="h-9 rounded-sm border border-hair px-2 text-sm">
        <option value="all">All statuses</option>
        <option v-for="s in STATUSES" :key="s" :value="s">{{ s }}</option>
      </select>
      <button @click="load" class="h-9 rounded-sm border border-hair px-3 text-sm hover:border-pine-400">Refresh</button>
    </template>

    <p v-if="err" class="mb-3 text-sm text-red-500">{{ err }}</p>
    <p v-if="loading" class="text-ink-500">Loading…</p>
    <p v-else-if="!shown.length" class="py-10 text-center text-ink-500">No matching orders.</p>
    <div v-else class="flex flex-col gap-3">
      <div v-for="o in shown" :key="o.id" class="rounded-sm border border-hair p-3.5">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div><span class="font-display text-ink-900">{{ o.id }}</span><span class="ms-2.5 text-[12.5px] text-ink-400">{{ new Date(o.createdAt).toLocaleString() }}</span></div>
          <div class="flex items-center gap-2">
            <select :value="o.status" @change="setStatus(o.id, ($event.target as HTMLSelectElement).value)" class="h-8 rounded-sm border border-hair px-2 text-sm">
              <option v-for="s in STATUSES" :key="s" :value="s">{{ s }}</option>
            </select>
            <button @click="del(o.id)" class="rounded-sm border border-red-300 px-2.5 py-1 text-[13px] text-red-600 hover:bg-red-50">Delete</button>
          </div>
        </div>
        <div class="mt-2.5 text-[13.5px] text-ink-700"><b>{{ o.customer?.name || '—' }}</b> · {{ o.customer?.phone }} · {{ o.customer?.email }}<template v-if="o.customer?.address"> · {{ o.customer.address }}</template></div>
        <div class="mt-1.5 text-[13px] text-ink-500">{{ (o.items || []).map((it: any) => `${it.qty}× ${it.brand} ${it.name}`).join(' · ') }}</div>
        <div class="mt-2 flex gap-4 text-[13px]"><span class="text-ink-500">Payment: {{ o.payment || '—' }} · {{ o.fulfilment || '—' }}</span><span class="ms-auto font-display text-ink-900">Total ₪{{ fmt(o.total) }}</span></div>
      </div>
    </div>
  </Panel>
</template>
