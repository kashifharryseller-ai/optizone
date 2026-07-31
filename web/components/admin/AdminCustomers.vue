<script setup lang="ts">
const admin = useAdmin()
const rows = ref<any[]>([])
const loading = ref(true)
const err = ref('')
const query = ref('')

async function load() {
  loading.value = true; err.value = ''
  try { rows.value = await admin.users() as any[] } catch (e: any) { err.value = e?.data?.error || e?.message } finally { loading.value = false }
}
onMounted(load)
async function del(id: string) {
  if (!confirm('Delete this customer account? This cannot be undone.')) return
  try { await admin.deleteUser(id); rows.value = rows.value.filter((u) => u.id !== id) } catch (e: any) { err.value = e?.message }
}
const shown = computed(() => {
  const q = query.value.trim().toLowerCase()
  return rows.value.filter((u) => !q || `${u.name} ${u.email} ${u.phone || ''}`.toLowerCase().includes(q))
})
</script>

<template>
  <Panel title="Customers" desc="Registered storefront accounts.">
    <template #actions>
      <input v-model="query" placeholder="Search name / email…" class="h-9 rounded-sm border border-hair px-3 text-sm" />
      <button @click="load" class="h-9 rounded-sm border border-hair px-3 text-sm hover:border-pine-400">Refresh</button>
    </template>
    <p v-if="err" class="mb-3 text-sm text-red-500">{{ err }}</p>
    <p v-if="loading" class="text-ink-500">Loading…</p>
    <p v-else-if="!shown.length" class="py-10 text-center text-ink-500">No matching customers.</p>
    <div v-else class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead><tr class="border-b border-hair text-start text-[12px] uppercase tracking-wide text-ink-400">
          <th class="py-2 text-start font-medium">Name</th><th class="text-start font-medium">Email</th><th class="text-start font-medium">Phone</th><th class="text-start font-medium">Orders</th><th></th>
        </tr></thead>
        <tbody>
          <tr v-for="u in shown" :key="u.id" class="border-b border-hair/60">
            <td class="py-2.5 font-medium text-ink-900">{{ u.name }}</td>
            <td class="text-ink-600">{{ u.email }}</td>
            <td class="text-ink-600" dir="ltr">{{ u.phone || '—' }}</td>
            <td class="text-ink-600">{{ u.orders ?? u.orderCount ?? '—' }}</td>
            <td class="text-end"><button @click="del(u.id)" class="rounded-sm border border-red-300 px-2.5 py-1 text-[13px] text-red-600 hover:bg-red-50">Delete</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </Panel>
</template>
