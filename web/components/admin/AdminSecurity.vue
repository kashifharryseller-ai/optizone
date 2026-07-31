<script setup lang="ts">
import { Check, X } from 'lucide-vue-next'
// Owner account (email + password) + environment health + PII access audit.
const admin = useAdmin()
const acct = ref<any>(null)
const stats = ref<any>(null)
const audit = ref<any[]>([])
const form = reactive({ currentPassword: '', email: '', newPassword: '' })
const msg = ref(''); const err = ref('')
const inp = 'w-full rounded-sm border border-hair px-2.5 py-2 text-sm'
const lbl = 'mb-1 block text-[11px] uppercase tracking-wide text-ink-400'

onMounted(async () => {
  try { acct.value = await admin.account(); form.email = acct.value?.email || '' } catch { /* noop */ }
  try { stats.value = await admin.stats() } catch { /* noop */ }
  try { audit.value = await admin.audit() as any[] } catch { /* noop */ }
})
async function save() {
  msg.value = ''; err.value = ''
  try {
    const body: any = { currentPassword: form.currentPassword }
    if (form.email && form.email !== acct.value?.email) body.email = form.email
    if (form.newPassword) body.newPassword = form.newPassword
    await admin.updateAccount(body)
    msg.value = 'Account updated'; form.currentPassword = ''; form.newPassword = ''
  } catch (e: any) { err.value = e?.data?.error || e?.message || 'Update failed' }
}
const checks = computed(() => {
  const sec = stats.value?.security || {}
  return [
    { ok: sec.jwtFromEnv !== false, label: 'JWT_SECRET set in environment' },
    { ok: !!sec.mailConfigured, label: 'Email (SMTP) configured — password resets & OTP' },
    { ok: !stats.value?.store?.ephemeral, label: 'Persistent database (MySQL) connected' },
  ]
})
</script>

<template>
  <div class="flex flex-col gap-5">
    <Panel title="Owner account" desc="Change the admin email or password. Requires your current password.">
      <div class="grid max-w-lg gap-3">
        <div><label :class="lbl">Current password</label><input v-model="form.currentPassword" type="password" :class="inp" /></div>
        <div><label :class="lbl">Email</label><input v-model="form.email" type="email" :class="inp" /></div>
        <div><label :class="lbl">New password (blank = keep)</label><input v-model="form.newPassword" type="password" :class="inp" /></div>
        <p v-if="msg" class="text-[13px] text-emerald-700">{{ msg }}</p>
        <p v-if="err" class="text-[13px] text-red-500">{{ err }}</p>
        <button @click="save" class="self-start rounded-sm bg-pine-700 px-5 py-2.5 font-display text-sm text-cream-100 hover:bg-amber-600 hover:text-pine-950">Save account</button>
      </div>
    </Panel>

    <Panel title="Environment health" desc="Production readiness checklist.">
      <div class="flex flex-col gap-2">
        <div v-for="c in checks" :key="c.label" class="flex items-center gap-2.5 text-sm">
          <span class="inline-flex h-5 w-5 items-center justify-center rounded-full" :class="c.ok ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'"><component :is="c.ok ? Check : X" :size="13" /></span>
          <span :class="c.ok ? 'text-ink-700' : 'text-red-600'">{{ c.label }}</span>
        </div>
      </div>
    </Panel>

    <Panel title="Access audit" desc="Recent administrative actions (PII access is logged).">
      <div v-if="audit.length" class="max-h-72 overflow-y-auto text-[13px]">
        <div v-for="(a, i) in audit.slice(0, 60)" :key="i" class="flex justify-between gap-3 border-b border-hair/60 py-1.5">
          <span class="text-ink-700">{{ a.action }}<span v-if="a.detail" class="text-ink-400"> · {{ a.detail }}</span></span>
          <span class="whitespace-nowrap text-ink-400">{{ a.at ? new Date(a.at).toLocaleString() : '' }}</span>
        </div>
      </div>
      <p v-else class="py-4 text-center text-ink-500">No audit entries.</p>
    </Panel>
  </div>
</template>
