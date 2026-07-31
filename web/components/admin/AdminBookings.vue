<script setup lang="ts">
const admin = useAdmin()
const STATUSES = ['New', 'Confirmed', 'Completed', 'Cancelled']
const rows = ref<any[]>([])
const loading = ref(true)
const err = ref('')
const query = ref('')
const statusFilter = ref('all')

async function load() {
  loading.value = true; err.value = ''
  try { rows.value = await admin.bookings() as any[] } catch (e: any) { err.value = e?.data?.error || e?.message } finally { loading.value = false }
}
onMounted(load)
async function setStatus(id: string, status: string) {
  try { await admin.setBookingStatus(id, status); const r = rows.value.find((x) => x.id === id); if (r) r.status = status } catch (e: any) { err.value = e?.message }
}
async function del(id: string) {
  if (!confirm(`Delete appointment ${id}? This cannot be undone.`)) return
  try { await admin.deleteBooking(id); rows.value = rows.value.filter((r) => r.id !== id) } catch (e: any) { err.value = e?.message }
}
const shown = computed(() => {
  const q = query.value.trim().toLowerCase()
  return rows.value.filter((r) =>
    (statusFilter.value === 'all' || r.status === statusFilter.value) &&
    (!q || `${r.id} ${r.name || ''} ${r.phone || ''} ${r.service || ''} ${r.branch || ''}`.toLowerCase().includes(q)))
})
</script>

<template>
  <Panel title="Appointments" desc="Bookings requested from the storefront.">
    <template #actions>
      <input v-model="query" placeholder="Search name / phone / service…" class="h-9 rounded-sm border border-hair px-3 text-sm" />
      <select v-model="statusFilter" class="h-9 rounded-sm border border-hair px-2 text-sm">
        <option value="all">All statuses</option>
        <option v-for="s in STATUSES" :key="s" :value="s">{{ s }}</option>
      </select>
      <button @click="load" class="h-9 rounded-sm border border-hair px-3 text-sm hover:border-pine-400">Refresh</button>
    </template>

    <p v-if="err" class="mb-3 text-sm text-red-500">{{ err }}</p>
    <p v-if="loading" class="text-ink-500">Loading…</p>
    <p v-else-if="!shown.length" class="py-10 text-center text-ink-500">No matching appointments.</p>
    <div v-else class="flex flex-col gap-3">
      <div v-for="r in shown" :key="r.id" class="rounded-sm border border-hair p-3.5">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div><span class="font-display text-ink-900">{{ r.service || '—' }}</span><span class="ms-2.5 text-[12.5px] text-ink-400">{{ r.id }}</span></div>
          <div class="flex items-center gap-2">
            <select :value="r.status" @change="setStatus(r.id, ($event.target as HTMLSelectElement).value)" class="h-8 rounded-sm border border-hair px-2 text-sm">
              <option v-for="s in STATUSES" :key="s" :value="s">{{ s }}</option>
            </select>
            <button @click="del(r.id)" class="rounded-sm border border-red-300 px-2.5 py-1 text-[13px] text-red-600 hover:bg-red-50">Delete</button>
          </div>
        </div>
        <div class="mt-2 text-[13.5px] text-ink-700"><b>{{ r.name }}</b> · {{ r.phone }} · OPTIZONE {{ r.branch }} · {{ r.day }} · {{ r.slot }}</div>
      </div>
    </div>
  </Panel>
</template>
