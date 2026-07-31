<script setup lang="ts">
// Promo codes — edits content.settings.promos ({ code, percent, active }).
const admin = useAdmin()
const content = admin.content
const promos = computed<any[]>(() => {
  content.value.settings ||= {}
  content.value.settings.promos ||= []
  return content.value.settings.promos
})
const inp = 'w-full rounded-sm border border-hair px-2.5 py-2 text-sm'
const lbl = 'mb-1 block text-[11px] uppercase tracking-wide text-ink-400'
function add() { content.value.settings.promos = [...promos.value, { code: '', percent: 10, active: true }] }
function remove(i: number) { content.value.settings.promos = promos.value.filter((_, idx) => idx !== i) }
</script>

<template>
  <Panel title="Discount codes" desc="Codes customers can apply at cart. The server recomputes order totals, so codes here affect the displayed discount only.">
    <template #actions><button @click="add" class="h-9 rounded-sm bg-pine-700 px-3 text-sm text-cream-100 hover:bg-amber-600 hover:text-pine-950">+ Add code</button></template>
    <div class="flex flex-col gap-3">
      <div v-for="(pr, i) in promos" :key="i" class="grid items-end gap-3 sm:grid-cols-[1fr_140px_120px_auto]">
        <div><label :class="lbl">Code</label><input v-model="pr.code" :class="inp" placeholder="WELCOME10" @input="pr.code = pr.code.toUpperCase()" /></div>
        <div><label :class="lbl">Percent %</label><input v-model.number="pr.percent" type="number" min="0" max="100" :class="inp" /></div>
        <label class="flex items-center gap-2 py-2 text-sm"><input type="checkbox" v-model="pr.active" class="h-4 w-4 accent-pine-700" /> Active</label>
        <button @click="remove(i)" class="rounded-sm border border-red-300 px-3 py-2 text-[13px] text-red-600 hover:bg-red-50">Remove</button>
      </div>
      <p v-if="!promos.length" class="py-6 text-center text-ink-500">No discount codes yet.</p>
    </div>
  </Panel>
</template>
