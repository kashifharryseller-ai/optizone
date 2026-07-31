<script setup lang="ts">
import { Check, Calendar } from 'lucide-vue-next'
const { L, lang } = useLang()
const { content } = useContent()
const { user } = useAuth()

const T = {
  eyebrow: { en: 'Book an appointment', he: 'קביעת תור', ar: 'احجز موعدًا' },
  h1: { en: 'Eye care, on your schedule', he: 'טיפול בעיניים, בזמן שנוח לכם', ar: 'رعاية العين وفق جدولك' },
  s1: { en: 'Service', he: 'שירות', ar: 'الخدمة' },
  s2: { en: 'Branch', he: 'סניף', ar: 'الفرع' },
  s3: { en: 'Date', he: 'תאריך', ar: 'التاريخ' },
  s4: { en: 'Time', he: 'שעה', ar: 'الوقت' },
  fullName: { en: 'Full name', he: 'שם מלא', ar: 'الاسم الكامل' },
  phone: { en: 'Phone · 05X-XXX-XXXX', he: 'טלפון · 05X-XXX-XXXX', ar: 'الهاتف · 05X-XXX-XXXX' },
  confirm: { en: 'Confirm booking', he: 'אישור התור', ar: 'تأكيد الحجز' },
  noPay: { en: 'No payment needed. Free reschedule & cancellation.', he: 'ללא תשלום. שינוי וביטול ללא עלות.', ar: 'لا حاجة للدفع. إعادة جدولة وإلغاء مجانًا.' },
  doneH1: { en: "You're booked", he: 'התור נקבע', ar: 'تم الحجز' },
  doneNote: { en: 'A confirmation and reminders will be sent via WhatsApp & email.', he: 'אישור ותזכורות יישלחו בוואטסאפ ובאימייל.', ar: 'سيُرسل تأكيد وتذكيرات عبر واتساب والبريد.' },
  backHome: { en: 'Back to home', he: 'חזרה לדף הבית', ar: 'العودة للرئيسية' },
  summary: { en: 'Your appointment', he: 'התור שלך', ar: 'موعدك' },
  err: { en: 'Please complete all fields.', he: 'נא למלא את כל השדות.', ar: 'يرجى إكمال جميع الحقول.' },
}

const services = computed(() => content.value?.bookingServices || [])
const branches = computed(() => content.value?.stores || [])
const slots = computed(() => content.value?.slots || ['09:00', '10:30', '12:00', '13:30', '15:00', '16:30', '18:00'])
// Next five upcoming week days.
const days = computed(() => {
  const names = { en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], he: ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳'], ar: ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'] }
  const arr: string[] = []
  const base = new Date()
  for (let i = 0; i < 5; i++) { const d = new Date(base); d.setDate(base.getDate() + i); arr.push(`${(names as any)[lang.value][d.getDay()]} ${d.getDate()}`) }
  return arr
})

const form = reactive({ service: '', branch: '', day: '', slot: '', name: user.value?.name || '', phone: user.value?.phone || '' })
watch(user, (u) => { if (u) { form.name = form.name || u.name; form.phone = form.phone || u.phone || '' } })

const err = ref('')
const busy = ref(false)
const done = ref(false)
const bookingId = ref('')
const { authHeaders } = useAuth()

const submit = async () => {
  if (busy.value) return
  if (!form.service || !form.branch || !form.day || !form.slot || form.name.trim().length < 2 || form.phone.replace(/\D/g, '').length < 7) { err.value = L(T.err); return }
  busy.value = true; err.value = ''
  try {
    const r: any = await $fetch('/api/bookings', {
      method: 'POST', headers: authHeaders(),
      body: { service: form.service, branch: form.branch, day: form.day, slot: form.slot, name: form.name, phone: form.phone },
    })
    bookingId.value = r?.id || ''
    done.value = true
  } catch (e: any) { err.value = e?.data?.error || 'Something went wrong' }
  finally { busy.value = false }
}

useHead({ title: 'Book an Exam — OPTIZONE' })
</script>

<template>
  <div>
    <!-- header band -->
    <div class="bg-pine-700 text-cream-100">
      <div class="mx-auto max-w-container px-7 py-12">
        <span class="font-display text-[13px] uppercase tracking-[0.18em] text-amber-500">{{ L(T.eyebrow) }}</span>
        <h1 class="mt-2 font-display text-4xl font-medium">{{ L(T.h1) }}</h1>
      </div>
    </div>

    <!-- DONE -->
    <div v-if="done" class="mx-auto max-w-lg px-7 py-16 text-center">
      <span class="mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full bg-pine-50"><Check :size="36" class="text-pine-700" /></span>
      <h2 class="mb-1.5 mt-6 font-display text-3xl font-medium text-ink-900">{{ L(T.doneH1) }}</h2>
      <p class="text-ink-700">{{ L(T.doneNote) }}</p>
      <p class="mt-2 text-sm text-ink-500">{{ form.service }} · OPTIZONE {{ form.branch }} · {{ form.day }} · {{ form.slot }}</p>
      <NuxtLink to="/" class="mt-6 inline-block rounded-sm bg-pine-700 px-6 py-3 font-display text-sm text-cream-100 hover:bg-amber-600 hover:text-pine-950">{{ L(T.backHome) }}</NuxtLink>
    </div>

    <!-- FORM -->
    <div v-else class="mx-auto grid max-w-container gap-8 px-7 py-10 lg:grid-cols-[1fr_320px] lg:items-start">
      <div class="flex flex-col gap-6">
        <div>
          <div class="mb-2.5 font-display text-[12px] uppercase tracking-[0.12em] text-ink-400">1 · {{ L(T.s1) }}</div>
          <div class="flex flex-wrap gap-2.5">
            <button v-for="s in services" :key="L(s)" @click="form.service = L(s)" class="rounded-pill border px-4 py-2 text-sm transition-colors" :class="form.service === L(s) ? 'border-pine-700 bg-pine-700 text-cream-100' : 'border-hair bg-white text-ink-700 hover:border-pine-400'">{{ L(s) }}</button>
          </div>
        </div>
        <div>
          <div class="mb-2.5 font-display text-[12px] uppercase tracking-[0.12em] text-ink-400">2 · {{ L(T.s2) }}</div>
          <div class="flex flex-wrap gap-2.5">
            <button v-for="b in branches" :key="b.name" @click="form.branch = b.name" class="rounded-pill border px-4 py-2 text-sm transition-colors" :class="form.branch === b.name ? 'border-pine-700 bg-pine-700 text-cream-100' : 'border-hair bg-white text-ink-700 hover:border-pine-400'">OPTIZONE {{ L({ en: b.name, he: b.he }) || b.name }}</button>
          </div>
        </div>
        <div>
          <div class="mb-2.5 font-display text-[12px] uppercase tracking-[0.12em] text-ink-400">3 · {{ L(T.s3) }}</div>
          <div class="flex flex-wrap gap-2.5">
            <button v-for="d in days" :key="d" @click="form.day = d" class="rounded-sm border px-4 py-2 text-sm transition-colors" :class="form.day === d ? 'border-pine-700 bg-pine-700 text-cream-100' : 'border-hair bg-white text-ink-700 hover:border-pine-400'">{{ d }}</button>
          </div>
        </div>
        <div>
          <div class="mb-2.5 font-display text-[12px] uppercase tracking-[0.12em] text-ink-400">4 · {{ L(T.s4) }}</div>
          <div class="flex flex-wrap gap-2.5">
            <button v-for="sl in slots" :key="sl" @click="form.slot = sl" class="rounded-sm border px-4 py-2 text-sm transition-colors" :class="form.slot === sl ? 'border-pine-700 bg-pine-700 text-cream-100' : 'border-hair bg-white text-ink-700 hover:border-pine-400'">{{ sl }}</button>
          </div>
        </div>
        <div class="grid gap-3 sm:grid-cols-2">
          <input v-model="form.name" :placeholder="L(T.fullName)" class="rounded-sm border border-hair px-3.5 py-3 text-sm" />
          <input v-model="form.phone" :placeholder="L(T.phone)" class="rounded-sm border border-hair px-3.5 py-3 text-sm" />
        </div>
        <p v-if="err" role="alert" class="text-[13px] text-red-500">{{ err }}</p>
      </div>

      <!-- summary -->
      <div class="rounded-lg border border-hair bg-white p-6 lg:sticky lg:top-24">
        <div class="mb-4 font-display text-sm uppercase tracking-[0.1em] text-ink-900">{{ L(T.summary) }}</div>
        <dl class="flex flex-col gap-2.5 text-sm">
          <div class="flex justify-between gap-3"><dt class="text-ink-400">{{ L(T.s1) }}</dt><dd class="text-end text-ink-900">{{ form.service || '—' }}</dd></div>
          <div class="flex justify-between gap-3"><dt class="text-ink-400">{{ L(T.s2) }}</dt><dd class="text-end text-ink-900">{{ form.branch || '—' }}</dd></div>
          <div class="flex justify-between gap-3"><dt class="text-ink-400">{{ L(T.s3) }}</dt><dd class="text-end text-ink-900">{{ form.day || '—' }}</dd></div>
          <div class="flex justify-between gap-3"><dt class="text-ink-400">{{ L(T.s4) }}</dt><dd class="text-end text-ink-900">{{ form.slot || '—' }}</dd></div>
        </dl>
        <button @click="submit" :disabled="busy" class="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-pine-700 px-6 py-3.5 font-display text-sm uppercase tracking-wide text-cream-100 transition hover:bg-amber-600 hover:text-pine-950 disabled:opacity-60"><Calendar :size="17" /> {{ L(T.confirm) }}</button>
        <p class="mt-3 text-center text-[12.5px] text-ink-400">{{ L(T.noPay) }}</p>
      </div>
    </div>
  </div>
</template>
