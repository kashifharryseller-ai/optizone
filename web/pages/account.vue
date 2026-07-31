<script setup lang="ts">
import { Package, Calendar, Heart, Settings, LogOut } from 'lucide-vue-next'
const { L, lang } = useLang()
const { user, isAuthed, register, login, logout, updateProfile, changePassword, orders, bookings } = useAuth()
const { content } = useContent()

// Inline trilingual chrome (via L()) — keeps this page self-contained.
const T = {
  welcome: { en: 'Welcome back', he: 'ברוכים השבים', ar: 'مرحبًا بعودتك' },
  signinSub: { en: 'Sign in to your OPTIZONE account', he: 'התחברו לחשבון OPTIZONE שלכם', ar: 'سجّل الدخول إلى حساب OPTIZONE' },
  registerTitle: { en: 'Create your account', he: 'פתיחת חשבון', ar: 'أنشئ حسابك' },
  registerSub: { en: 'Track orders, book faster, save your favourite frames', he: 'עקבו אחר הזמנות, קבעו מהר יותר ושמרו מסגרות אהובות', ar: 'تابع الطلبات واحجز أسرع واحفظ إطاراتك المفضّلة' },
  name: { en: 'Full name', he: 'שם מלא', ar: 'الاسم الكامل' },
  email: { en: 'Email address', he: 'כתובת אימייל', ar: 'البريد الإلكتروني' },
  phone: { en: 'Phone · 05X-XXX-XXXX', he: 'טלפון · 05X-XXX-XXXX', ar: 'الهاتف · 05X-XXX-XXXX' },
  password: { en: 'Password', he: 'סיסמה', ar: 'كلمة المرور' },
  signin: { en: 'Sign in', he: 'התחברות', ar: 'تسجيل الدخول' },
  signup: { en: 'Create account', he: 'פתיחת חשבון', ar: 'إنشاء حساب' },
  toRegister: { en: 'New here? Create an account', he: 'חדשים כאן? פתחו חשבון', ar: 'جديد هنا؟ أنشئ حسابًا' },
  toLogin: { en: 'Already have an account? Sign in', he: 'כבר יש לכם חשבון? התחברו', ar: 'لديك حساب؟ سجّل الدخول' },
  or: { en: 'or', he: 'או', ar: 'أو' },
  google: { en: 'Continue with Google', he: 'המשך עם Google', ar: 'المتابعة عبر Google' },
  forgotLink: { en: 'Forgot password?', he: 'שכחת סיסמה?', ar: 'نسيت كلمة المرور؟' },
  forgotTitle: { en: 'Reset your password', he: 'איפוס סיסמה', ar: 'إعادة تعيين كلمة المرور' },
  forgotSub: { en: 'Enter your email and we’ll send a reset code', he: 'הזינו אימייל ונשלח קוד איפוס', ar: 'أدخل بريدك وسنرسل رمز إعادة تعيين' },
  sendCode: { en: 'Send reset code', he: 'שליחת קוד', ar: 'إرسال الرمز' },
  resetTitle: { en: 'Enter code & new password', he: 'קוד וסיסמה חדשה', ar: 'الرمز وكلمة مرور جديدة' },
  resetSub: { en: 'Check your email for the 6-digit code', he: 'בדקו את האימייל לקוד בן 6 ספרות', ar: 'تحقّق من بريدك للرمز المكوّن من 6 أرقام' },
  resetSent: { en: 'If that email is registered, a reset code is on its way.', he: 'אם האימייל רשום, קוד איפוס בדרך.', ar: 'إذا كان البريد مسجّلاً، فالرمز في الطريق.' },
  code: { en: '6-digit code', he: 'קוד בן 6 ספרות', ar: 'رمز من 6 أرقام' },
  newPw: { en: 'New password', he: 'סיסמה חדשה', ar: 'كلمة مرور جديدة' },
  resetCta: { en: 'Reset password', he: 'איפוס סיסמה', ar: 'إعادة التعيين' },
  backToLogin: { en: '← Back to sign in', he: '→ חזרה להתחברות', ar: '→ العودة لتسجيل الدخول' },
  hello: { en: 'Shalom', he: 'שלום', ar: 'مرحبًا' },
  myAccount: { en: 'My account', he: 'החשבון שלי', ar: 'حسابي' },
  tabsOrders: { en: 'My Orders', he: 'ההזמנות שלי', ar: 'طلباتي' },
  tabsAppts: { en: 'My Appointments', he: 'התורים שלי', ar: 'مواعيدي' },
  tabsWishlist: { en: 'My Wishlist', he: 'המועדפים שלי', ar: 'مفضّلتي' },
  tabsSettings: { en: 'My Settings', he: 'הגדרות', ar: 'إعداداتي' },
  emptyOrders: { en: 'No orders yet — your purchases will appear here.', he: 'אין הזמנות עדיין — הרכישות יופיעו כאן.', ar: 'لا طلبات بعد — ستظهر مشترياتك هنا.' },
  emptyAppts: { en: 'No appointments yet.', he: 'אין תורים עדיין.', ar: 'لا مواعيد بعد.' },
  emptyWishlist: { en: 'Your wishlist is empty — tap the heart on any frame.', he: 'רשימת המועדפים ריקה — הקישו על הלב במסגרת.', ar: 'مفضّلتك فارغة — اضغط القلب على أي إطار.' },
  save: { en: 'Save changes', he: 'שמירה', ar: 'حفظ التغييرات' },
  saved: { en: 'Saved', he: 'נשמר', ar: 'تم الحفظ' },
  changePw: { en: 'Change password', he: 'שינוי סיסמה', ar: 'تغيير كلمة المرور' },
  currentPw: { en: 'Current password', he: 'סיסמה נוכחית', ar: 'كلمة المرور الحالية' },
  newPw: { en: 'New password', he: 'סיסמה חדשה', ar: 'كلمة مرور جديدة' },
  update: { en: 'Update password', he: 'עדכון סיסמה', ar: 'تحديث كلمة المرور' },
  pwChanged: { en: 'Password updated', he: 'הסיסמה עודכנה', ar: 'تم تحديث كلمة المرور' },
  signout: { en: 'Sign out', he: 'התנתקות', ar: 'تسجيل الخروج' },
  browse: { en: 'Browse frames', he: 'עיון במסגרות', ar: 'تصفّح الإطارات' },
}

// --- Auth form state ---
const { forgotPassword, resetPassword } = useAuth()
type Mode = 'login' | 'register' | 'forgot' | 'reset'
const mode = ref<Mode>('login')
const form = reactive({ name: '', email: '', phone: '', password: '', code: '', newPassword: '' })
const authErr = ref('')
const authNote = ref('')
const busy = ref(false)

// Surface a Google-OAuth error captured by the client plugin on return.
onMounted(() => {
  try { const e = sessionStorage.getItem('oz_auth_error'); if (e) { authErr.value = e; sessionStorage.removeItem('oz_auth_error') } } catch { /* noop */ }
})

const submit = async () => {
  if (busy.value) return
  busy.value = true; authErr.value = ''; authNote.value = ''
  try {
    if (mode.value === 'login') { await login({ email: form.email, password: form.password }); await loadData() }
    else if (mode.value === 'register') { await register({ name: form.name, email: form.email, phone: form.phone, password: form.password }); await loadData() }
    else if (mode.value === 'forgot') { await forgotPassword(form.email); authNote.value = L(T.resetSent); mode.value = 'reset' }
    else if (mode.value === 'reset') { await resetPassword(form.email, form.code, form.newPassword); await loadData() }
  } catch (e: any) { authErr.value = e?.data?.error || e?.message || 'Something went wrong' }
  finally { busy.value = false }
}
const googleSignIn = () => { window.location.href = '/api/auth/google' }
const setMode = (m: Mode) => { mode.value = m; authErr.value = ''; authNote.value = '' }
// Return the auth card to a clean login state after signing out.
const onLogout = () => { logout(); setMode('login') }

// --- Dashboard ---
const tab = ref<'orders' | 'appts' | 'wishlist' | 'settings'>('orders')
const myOrders = ref<any[]>([])
const myBookings = ref<any[]>([])
const products = computed(() => content.value?.products || [])
const wishItems = computed(() => products.value.filter((p: any) => user.value?.wishlist?.includes(Number(p.id))))

async function loadData() {
  if (!isAuthed.value) return
  try { myOrders.value = (await orders()) as any[] } catch { myOrders.value = [] }
  try { myBookings.value = (await bookings()) as any[] } catch { myBookings.value = [] }
}
watch(isAuthed, (v) => { if (v) loadData() })
onMounted(() => { if (isAuthed.value) loadData() })

// settings
const profile = reactive({ name: '', phone: '' })
const profileSaved = ref(false)
watch(user, (u) => { if (u) { profile.name = u.name; profile.phone = u.phone || '' } }, { immediate: true })
const saveProfile = async () => { await updateProfile({ name: profile.name, phone: profile.phone }); profileSaved.value = true; setTimeout(() => (profileSaved.value = false), 1600) }
const pw = reactive({ current: '', next: '' })
const pwMsg = ref('')
const savePw = async () => {
  pwMsg.value = ''
  try { await changePassword(pw.current, pw.next); pwMsg.value = L(T.pwChanged); pw.current = ''; pw.next = '' }
  catch (e: any) { pwMsg.value = e?.data?.error || 'Error' }
}
const fmt = (n: number) => Number(n).toLocaleString(lang.value === 'he' ? 'he-IL' : 'en-IL')

useHead({ title: 'Account — OPTIZONE' })
</script>

<template>
  <!-- SIGNED OUT — auth card -->
  <div v-if="!isAuthed" class="mx-auto max-w-md px-7 py-16">
    <div class="rounded-lg border border-hair bg-white p-8 shadow-sm">
      <h1 class="font-display text-3xl font-medium text-ink-900">{{ mode === 'login' ? L(T.welcome) : mode === 'register' ? L(T.registerTitle) : mode === 'forgot' ? L(T.forgotTitle) : L(T.resetTitle) }}</h1>
      <p class="mb-6 mt-1 text-sm text-ink-500">{{ mode === 'login' ? L(T.signinSub) : mode === 'register' ? L(T.registerSub) : mode === 'forgot' ? L(T.forgotSub) : L(T.resetSub) }}</p>

      <!-- Google sign-in (login/register only) -->
      <template v-if="mode === 'login' || mode === 'register'">
        <button @click="googleSignIn" class="flex w-full items-center justify-center gap-2.5 rounded-sm border border-hair px-6 py-3 text-sm font-medium text-ink-800 transition hover:border-pine-400">
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"/><path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.2 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"/></svg>
          {{ L(T.google) }}
        </button>
        <div class="my-5 flex items-center gap-3 text-[12px] uppercase tracking-wide text-ink-400"><span class="h-px flex-1 bg-hair" />{{ L(T.or) }}<span class="h-px flex-1 bg-hair" /></div>
      </template>

      <form @submit.prevent="submit" class="flex flex-col gap-3.5">
        <input v-if="mode === 'register'" v-model="form.name" :placeholder="L(T.name)" class="rounded-sm border border-hair px-3.5 py-3 text-sm" />
        <input v-if="mode !== 'reset'" v-model="form.email" type="email" :placeholder="L(T.email)" class="rounded-sm border border-hair px-3.5 py-3 text-sm" />
        <input v-if="mode === 'register'" v-model="form.phone" :placeholder="L(T.phone)" class="rounded-sm border border-hair px-3.5 py-3 text-sm" />
        <input v-if="mode === 'login' || mode === 'register'" v-model="form.password" type="password" :placeholder="L(T.password)" class="rounded-sm border border-hair px-3.5 py-3 text-sm" />
        <input v-if="mode === 'reset'" v-model="form.code" :placeholder="L(T.code)" class="rounded-sm border border-hair px-3.5 py-3 text-center text-lg tracking-widest" />
        <input v-if="mode === 'reset'" v-model="form.newPassword" type="password" :placeholder="L(T.newPw)" class="rounded-sm border border-hair px-3.5 py-3 text-sm" />
        <p v-if="authNote" class="text-[13px] text-emerald-700">{{ authNote }}</p>
        <p v-if="authErr" role="alert" class="text-[13px] text-red-500">{{ authErr }}</p>
        <button type="submit" :disabled="busy" class="rounded-sm bg-pine-700 px-6 py-3.5 font-display text-sm uppercase tracking-wide text-cream-100 transition hover:bg-amber-600 hover:text-pine-950 disabled:opacity-60">
          {{ busy ? '…' : mode === 'login' ? L(T.signin) : mode === 'register' ? L(T.signup) : mode === 'forgot' ? L(T.sendCode) : L(T.resetCta) }}
        </button>
      </form>

      <button v-if="mode === 'login'" @click="setMode('forgot')" class="mt-4 block w-full text-center text-[13px] text-ink-500 hover:text-amber-700">{{ L(T.forgotLink) }}</button>
      <button v-if="mode === 'login' || mode === 'register'" @click="setMode(mode === 'login' ? 'register' : 'login')" class="mt-2 block w-full text-center text-sm text-amber-700 hover:underline">
        {{ mode === 'login' ? L(T.toRegister) : L(T.toLogin) }}
      </button>
      <button v-if="mode === 'forgot' || mode === 'reset'" @click="setMode('login')" class="mt-4 block w-full text-center text-sm text-amber-700 hover:underline">{{ L(T.backToLogin) }}</button>
    </div>
  </div>

  <!-- SIGNED IN — dashboard -->
  <div v-else class="mx-auto max-w-container px-7 pb-20 pt-9">
    <div class="mb-6 flex items-center justify-between gap-4">
      <div>
        <span class="font-display text-[13px] uppercase tracking-[0.14em] text-amber-700">{{ L(T.myAccount) }}</span>
        <h1 class="mt-1 font-display text-3xl font-medium text-ink-900">{{ L(T.hello) }}, {{ user?.name }}</h1>
      </div>
      <button @click="onLogout" class="inline-flex items-center gap-2 rounded-sm border border-hair px-4 py-2 text-sm text-ink-600 hover:border-red-300 hover:text-red-500"><LogOut :size="16" /> {{ L(T.signout) }}</button>
    </div>

    <div class="grid gap-8 md:grid-cols-[220px_1fr] md:items-start">
      <!-- side tabs -->
      <nav class="flex flex-row flex-wrap gap-1.5 md:flex-col">
        <button v-for="[k, label, Icon2] in ([['orders', L(T.tabsOrders), Package], ['appts', L(T.tabsAppts), Calendar], ['wishlist', L(T.tabsWishlist), Heart], ['settings', L(T.tabsSettings), Settings]] as [any, string, any][])" :key="k"
          @click="tab = k"
          class="inline-flex items-center gap-2.5 rounded-sm px-4 py-2.5 text-start font-display text-sm transition-colors"
          :class="tab === k ? 'bg-pine-700 text-cream-100' : 'text-ink-700 hover:bg-cream-200'">
          <component :is="Icon2" :size="16" /> {{ label }}
        </button>
      </nav>

      <div>
        <!-- ORDERS -->
        <div v-if="tab === 'orders'">
          <div v-if="!myOrders.length" class="rounded-lg border border-dashed border-hair py-14 text-center text-ink-500">
            {{ L(T.emptyOrders) }}<br /><NuxtLink to="/eyeglasses" class="mt-3 inline-block text-amber-700 hover:underline">{{ L(T.browse) }}</NuxtLink>
          </div>
          <div v-else class="flex flex-col gap-3">
            <div v-for="o in myOrders" :key="o.id" class="rounded-md border border-hair bg-white p-4">
              <div class="flex items-center justify-between">
                <span class="font-display text-ink-900">#{{ o.id }}</span>
                <span class="rounded-pill bg-pine-100 px-2.5 py-0.5 text-xs text-pine-700">{{ o.status }}</span>
              </div>
              <div class="mt-1.5 text-sm text-ink-500">{{ (o.items || []).length }} items · ₪{{ fmt(o.total) }} · {{ (o.createdAt || '').slice(0, 10) }}</div>
            </div>
          </div>
        </div>

        <!-- APPOINTMENTS -->
        <div v-else-if="tab === 'appts'">
          <div v-if="!myBookings.length" class="rounded-lg border border-dashed border-hair py-14 text-center text-ink-500">
            {{ L(T.emptyAppts) }}<br /><NuxtLink to="/booking" class="mt-3 inline-block text-amber-700 hover:underline">{{ L({ en: 'Book an exam', he: 'קביעת תור', ar: 'احجز فحصًا' }) }}</NuxtLink>
          </div>
          <div v-else class="flex flex-col gap-3">
            <div v-for="b in myBookings" :key="b.id" class="rounded-md border border-hair bg-white p-4">
              <div class="flex items-center justify-between">
                <span class="font-display text-ink-900">{{ b.service }}</span>
                <span class="rounded-pill bg-pine-100 px-2.5 py-0.5 text-xs text-pine-700">{{ b.status }}</span>
              </div>
              <div class="mt-1.5 text-sm text-ink-500">OPTIZONE {{ b.branch }} · {{ b.day }} · {{ b.slot }}</div>
            </div>
          </div>
        </div>

        <!-- WISHLIST -->
        <div v-else-if="tab === 'wishlist'">
          <div v-if="!wishItems.length" class="rounded-lg border border-dashed border-hair py-14 text-center text-ink-500">
            {{ L(T.emptyWishlist) }}<br /><NuxtLink to="/eyeglasses" class="mt-3 inline-block text-amber-700 hover:underline">{{ L(T.browse) }}</NuxtLink>
          </div>
          <div v-else class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <ProductCard v-for="p in wishItems" :key="p.id" :product="p" />
          </div>
        </div>

        <!-- SETTINGS -->
        <div v-else class="max-w-md">
          <div class="rounded-lg border border-hair bg-white p-6">
            <div class="mb-4 font-display text-sm uppercase tracking-[0.08em] text-ink-900">{{ L(T.tabsSettings) }}</div>
            <div class="flex flex-col gap-3">
              <input v-model="profile.name" :placeholder="L(T.name)" class="rounded-sm border border-hair px-3.5 py-3 text-sm" />
              <input v-model="profile.phone" :placeholder="L(T.phone)" class="rounded-sm border border-hair px-3.5 py-3 text-sm" />
              <button @click="saveProfile" class="rounded-sm bg-pine-700 px-5 py-3 font-display text-sm text-cream-100 hover:bg-amber-600 hover:text-pine-950">{{ profileSaved ? '✓ ' + L(T.saved) : L(T.save) }}</button>
            </div>
            <div class="my-5 border-t border-hair" />
            <div class="mb-3 font-display text-sm uppercase tracking-[0.08em] text-ink-900">{{ L(T.changePw) }}</div>
            <div class="flex flex-col gap-3">
              <input v-model="pw.current" type="password" :placeholder="L(T.currentPw)" class="rounded-sm border border-hair px-3.5 py-3 text-sm" />
              <input v-model="pw.next" type="password" :placeholder="L(T.newPw)" class="rounded-sm border border-hair px-3.5 py-3 text-sm" />
              <p v-if="pwMsg" class="text-[13px] text-emerald-700">{{ pwMsg }}</p>
              <button @click="savePw" class="rounded-sm border border-pine-700 px-5 py-3 font-display text-sm text-pine-700 hover:bg-pine-50">{{ L(T.update) }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
