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
const mode = ref<'login' | 'register'>('login')
const form = reactive({ name: '', email: '', phone: '', password: '' })
const authErr = ref('')
const busy = ref(false)
const submit = async () => {
  if (busy.value) return
  busy.value = true; authErr.value = ''
  try {
    if (mode.value === 'login') await login({ email: form.email, password: form.password })
    else await register({ name: form.name, email: form.email, phone: form.phone, password: form.password })
    await loadData()
  } catch (e: any) { authErr.value = e?.data?.error || e?.message || 'Something went wrong' }
  finally { busy.value = false }
}

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
      <h1 class="font-display text-3xl font-medium text-ink-900">{{ mode === 'login' ? L(T.welcome) : L(T.registerTitle) }}</h1>
      <p class="mb-6 mt-1 text-sm text-ink-500">{{ mode === 'login' ? L(T.signinSub) : L(T.registerSub) }}</p>
      <form @submit.prevent="submit" class="flex flex-col gap-3.5">
        <input v-if="mode === 'register'" v-model="form.name" :placeholder="L(T.name)" class="rounded-sm border border-hair px-3.5 py-3 text-sm" />
        <input v-model="form.email" type="email" :placeholder="L(T.email)" class="rounded-sm border border-hair px-3.5 py-3 text-sm" />
        <input v-if="mode === 'register'" v-model="form.phone" :placeholder="L(T.phone)" class="rounded-sm border border-hair px-3.5 py-3 text-sm" />
        <input v-model="form.password" type="password" :placeholder="L(T.password)" class="rounded-sm border border-hair px-3.5 py-3 text-sm" />
        <p v-if="authErr" role="alert" class="text-[13px] text-red-500">{{ authErr }}</p>
        <button type="submit" :disabled="busy" class="rounded-sm bg-pine-700 px-6 py-3.5 font-display text-sm uppercase tracking-wide text-cream-100 transition hover:bg-amber-600 hover:text-pine-950 disabled:opacity-60">
          {{ mode === 'login' ? L(T.signin) : L(T.signup) }}
        </button>
      </form>
      <button @click="mode = mode === 'login' ? 'register' : 'login'; authErr = ''" class="mt-5 block w-full text-center text-sm text-amber-700 hover:underline">
        {{ mode === 'login' ? L(T.toRegister) : L(T.toLogin) }}
      </button>
    </div>
  </div>

  <!-- SIGNED IN — dashboard -->
  <div v-else class="mx-auto max-w-container px-7 pb-20 pt-9">
    <div class="mb-6 flex items-center justify-between gap-4">
      <div>
        <span class="font-display text-[13px] uppercase tracking-[0.14em] text-amber-700">{{ L(T.myAccount) }}</span>
        <h1 class="mt-1 font-display text-3xl font-medium text-ink-900">{{ L(T.hello) }}, {{ user?.name }}</h1>
      </div>
      <button @click="logout" class="inline-flex items-center gap-2 rounded-sm border border-hair px-4 py-2 text-sm text-ink-600 hover:border-red-300 hover:text-red-500"><LogOut :size="16" /> {{ L(T.signout) }}</button>
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
