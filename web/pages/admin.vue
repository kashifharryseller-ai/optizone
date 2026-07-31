<script setup lang="ts">
import { LayoutDashboard, Glasses, Package, User, Calendar, FileText, Tag, BarChart3, Settings, Camera, LogOut, Menu, Check, Info } from 'lucide-vue-next'

definePageMeta({ layout: 'admin' })
useHead({ title: 'OPTIZONE Admin' })

const admin = useAdmin()
const { content, dirty, owner } = admin

const authed = ref<boolean | null>(null) // null = checking
const section = ref('dashboard')
const saving = ref(false)
const toast = ref<{ kind: 'ok' | 'err'; text: string } | null>(null)
const stats = ref<any>(null)
const mobileNav = ref(false)

// login form
const lf = reactive({ email: '', password: '', otpChallenge: '', otpCode: '' })
const loginErr = ref('')
const busy = ref(false)

const NAV = [
  { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard, content: false },
  { id: 'products', label: 'Products / Frames', Icon: Glasses, content: true },
  { id: 'orders', label: 'Orders', Icon: Package, content: false, badge: 'newOrders' },
  { id: 'customers', label: 'Customers', Icon: User, content: false },
  { id: 'bookings', label: 'Appointments', Icon: Calendar, content: false, badge: 'newBookings' },
  { id: 'content', label: 'Content & Homepage', Icon: FileText, content: true },
  { id: 'discounts', label: 'Discounts', Icon: Tag, content: true },
  { id: 'settings', label: 'Stores & Settings', Icon: Settings, content: true },
  { id: 'reports', label: 'Reports', Icon: BarChart3, content: false },
  { id: 'security', label: 'Security', Icon: Camera, content: false },
]
const cur = computed(() => NAV.find((n) => n.id === section.value) || NAV[0])
const needsContent = computed(() => cur.value.content)

async function boot() {
  if (!admin.token.value) { authed.value = false; return }
  const u = await admin.me()
  if (u) { authed.value = true; afterAuth() } else { authed.value = false }
}
async function afterAuth() {
  try { stats.value = await admin.stats() } catch { /* noop */ }
  try { await admin.loadContent() } catch (e: any) { toast.value = { kind: 'err', text: `Couldn’t load content — ${e?.message || e}` } }
}

async function doLogin() {
  if (busy.value) return
  busy.value = true; loginErr.value = ''
  try {
    if (lf.otpChallenge) {
      await admin.otp(lf.otpChallenge, lf.otpCode)
    } else {
      const r: any = await admin.login(lf.email, lf.password)
      if (r.otp) { lf.otpChallenge = r.challenge; busy.value = false; return }
    }
    authed.value = true; afterAuth()
  } catch (e: any) { loginErr.value = e?.data?.error || e?.message || 'Sign-in failed' }
  finally { busy.value = false }
}

async function save() {
  saving.value = true; toast.value = null
  try {
    await admin.saveContent()
    toast.value = { kind: 'ok', text: 'Changes saved' }
    setTimeout(() => (toast.value = null), 2600)
  } catch (e: any) {
    toast.value = { kind: 'err', text: `Save failed — ${e?.data?.error || e?.message}. Your edits are still here.` }
  } finally { saving.value = false }
}

function logout() {
  if (dirty.value && !confirm('You have unsaved changes that will be lost. Sign out anyway?')) return
  admin.logout(); authed.value = false
}
const go = (s: string) => { section.value = s; mobileNav.value = false }
const badgeCount = (key?: string) => (key && stats.value ? stats.value[key] || 0 : 0)

onMounted(boot)
</script>

<template>
  <!-- LOGIN -->
  <div v-if="authed === false" class="flex min-h-screen items-center justify-center bg-pine-900 px-5">
    <div class="w-full max-w-sm rounded-xl bg-white p-8 shadow-2xl">
      <div class="mb-6 text-center font-display text-2xl tracking-[0.2em]"><span>OPTI</span><span class="text-amber-600">ZONE</span></div>
      <h1 class="mb-1 font-display text-xl text-ink-900">Admin sign-in</h1>
      <p class="mb-5 text-sm text-ink-500">{{ lf.otpChallenge ? 'Enter the code sent to your email' : 'Store owner access' }}</p>
      <form @submit.prevent="doLogin" class="flex flex-col gap-3">
        <template v-if="!lf.otpChallenge">
          <input v-model="lf.email" type="email" placeholder="Email" class="rounded-sm border border-hair px-3.5 py-3 text-sm" />
          <input v-model="lf.password" type="password" placeholder="Password" class="rounded-sm border border-hair px-3.5 py-3 text-sm" />
        </template>
        <input v-else v-model="lf.otpCode" placeholder="6-digit code" class="rounded-sm border border-hair px-3.5 py-3 text-center text-lg tracking-widest" />
        <p v-if="loginErr" class="text-[13px] text-red-500">{{ loginErr }}</p>
        <button type="submit" :disabled="busy" class="rounded-sm bg-pine-700 px-6 py-3 font-display text-sm uppercase tracking-wide text-cream-100 hover:bg-amber-600 hover:text-pine-950 disabled:opacity-60">{{ busy ? 'Signing in…' : (lf.otpChallenge ? 'Verify' : 'Sign in') }}</button>
      </form>
    </div>
  </div>

  <div v-else-if="authed === null" class="flex min-h-screen items-center justify-center text-ink-500">Loading…</div>

  <!-- SHELL -->
  <div v-else class="flex min-h-screen">
    <!-- sidebar -->
    <aside class="fixed inset-y-0 z-40 flex w-60 flex-col bg-pine-900 text-cream-100 transition-transform md:static md:translate-x-0" :class="mobileNav ? 'translate-x-0' : '-translate-x-full'">
      <div class="flex items-center gap-2 px-5 py-4 font-display text-lg tracking-[0.2em]"><span>OPTI</span><span class="text-amber-500">ZONE</span></div>
      <nav class="flex-1 overflow-y-auto px-3 py-2">
        <button v-for="n in NAV" :key="n.id" @click="go(n.id)"
          class="mb-1 flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-start font-display text-[13.5px] transition-colors"
          :class="section === n.id ? 'bg-pine-700 text-cream-100' : 'text-cream-100/75 hover:bg-white/5'">
          <component :is="n.Icon" :size="17" /> <span class="flex-1">{{ n.label }}</span>
          <span v-if="badgeCount(n.badge)" class="rounded-full bg-amber-500 px-2 text-[11px] font-semibold text-pine-950">{{ badgeCount(n.badge) }}</span>
        </button>
      </nav>
      <div class="border-t border-white/10 p-3">
        <div class="mb-2 px-2 text-[12px] text-cream-100/60">{{ owner || 'admin' }} · Store owner</div>
        <div class="flex gap-2">
          <a href="/" target="_blank" class="flex-1 rounded-sm border border-white/15 px-3 py-2 text-center text-[12px] hover:bg-white/5">Storefront ↗</a>
          <button @click="logout" class="inline-flex items-center gap-1.5 rounded-sm border border-white/15 px-3 py-2 text-[12px] hover:bg-white/5"><LogOut :size="14" /> Sign out</button>
        </div>
      </div>
    </aside>
    <div v-if="mobileNav" class="fixed inset-0 z-30 bg-black/40 md:hidden" @click="mobileNav = false" />

    <!-- main -->
    <main class="flex min-w-0 flex-1 flex-col md:ms-0">
      <header class="sticky top-0 z-20 flex items-center gap-4 border-b border-hair bg-cream-100/85 px-5 py-3 backdrop-blur md:px-7">
        <button class="rounded-sm border border-hair bg-white p-2 md:hidden" @click="mobileNav = true"><Menu :size="18" /></button>
        <div class="min-w-0">
          <div class="font-display text-[10.5px] uppercase tracking-[0.14em] text-ink-400">OPTIZONE Admin / <span class="text-amber-700">{{ cur.label }}</span></div>
          <h1 class="font-display text-xl text-ink-900">{{ cur.label }}</h1>
        </div>
        <div class="ms-auto flex items-center gap-3">
          <span v-if="needsContent && dirty" class="inline-flex items-center gap-1.5 font-display text-[12px] uppercase tracking-[0.06em] text-amber-700"><span class="h-2 w-2 rounded-full bg-amber-600" /> Unsaved</span>
          <button v-if="needsContent" @click="save" :disabled="!dirty || saving" class="rounded-sm bg-amber-500 px-5 py-2.5 font-display text-[13px] uppercase tracking-wide text-pine-950 hover:brightness-105 disabled:opacity-50">{{ saving ? 'Saving…' : 'Save changes' }}</button>
        </div>
      </header>

      <div class="w-full max-w-[1080px] p-5 md:p-7">
        <div v-if="needsContent && !content" class="py-20 text-center text-ink-500">Loading content…</div>
        <template v-else>
          <AdminDashboard v-if="section === 'dashboard'" :stats="stats" :go="go" />
          <AdminProducts v-else-if="section === 'products'" />
          <AdminOrders v-else-if="section === 'orders'" />
          <AdminCustomers v-else-if="section === 'customers'" />
          <AdminBookings v-else-if="section === 'bookings'" />
          <AdminContent v-else-if="section === 'content'" />
          <AdminDiscounts v-else-if="section === 'discounts'" />
          <AdminSettings v-else-if="section === 'settings'" />
          <AdminReports v-else-if="section === 'reports'" />
          <AdminSecurity v-else-if="section === 'security'" />
        </template>
      </div>
    </main>

    <!-- toast -->
    <div v-if="toast" class="fixed bottom-6 end-6 z-50 flex items-center gap-2.5 rounded-md px-4 py-3 text-sm text-cream-100 shadow-lg" :class="toast.kind === 'ok' ? 'bg-pine-700' : 'bg-red-700'">
      <component :is="toast.kind === 'ok' ? Check : Info" :size="17" /> {{ toast.text }}
      <button @click="toast = null" class="ms-1 text-cream-200">×</button>
    </div>
  </div>
</template>
