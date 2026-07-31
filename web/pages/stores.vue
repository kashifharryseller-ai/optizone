<script setup lang="ts">
import { MapPin, Clock, Phone, Calendar, Navigation } from 'lucide-vue-next'
const { L, A, lang } = useLang()
const { content } = useContent()

const T = {
  eyebrow: { en: 'Find us', he: 'מצאו אותנו', ar: 'اعثر علينا' },
  h1: { en: 'Our branches', he: 'הסניפים שלנו', ar: 'فروعنا' },
  branch: { en: 'Branch', he: 'סניף', ar: 'فرع' },
  bookHere: { en: 'Book at this branch', he: 'קביעת תור בסניף', ar: 'احجز في هذا الفرع' },
  directions: { en: 'Get directions', he: 'הוראות הגעה', ar: 'الحصول على الاتجاهات' },
}

const stores = computed(() => content.value?.stores || [])
const active = ref(0)
const s = computed(() => stores.value[active.value] || stores.value[0] || {})
const storeName = (st: any) => (lang.value === 'he' ? st.he : st.name)
const directions = (st: any) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`OPTIZONE ${storeName(st)} ${st.addr || ''}`)}`

useHead({ title: 'Stores — OPTIZONE' })
</script>

<template>
  <div>
    <div class="bg-pine-700 text-cream-100">
      <div class="mx-auto max-w-container px-7 py-12">
        <span class="font-display text-[13px] uppercase tracking-[0.18em] text-amber-500">{{ L(T.eyebrow) }}</span>
        <h1 class="mt-2 font-display text-4xl font-medium">{{ L(T.h1) }}</h1>
      </div>
    </div>

    <div class="mx-auto grid max-w-container gap-8 px-7 pb-20 pt-8 lg:grid-cols-[360px_1fr] lg:items-start">
      <!-- list -->
      <div class="flex flex-col gap-3.5">
        <button v-for="(st, i) in stores" :key="st.name" @click="active = i"
          class="rounded-md border p-5 text-start transition-all"
          :class="active === i ? 'border-pine-700 bg-pine-50 shadow-sm' : 'border-hair bg-white'">
          <div class="mb-2 flex items-center gap-2.5"><MapPin :size="18" class="text-pine-700" /><span class="font-display text-lg text-ink-900">OPTIZONE {{ storeName(st) }}</span></div>
          <div class="text-[13.5px] leading-relaxed text-ink-500">{{ st.addr }}<br />{{ L(st.hours) }}</div>
          <div class="mt-3 flex flex-wrap gap-1.5">
            <span v-for="sv in st.services" :key="sv" class="rounded-pill bg-pine-100 px-2.5 py-0.5 text-[11px] text-pine-700">{{ A(sv) }}</span>
          </div>
        </button>
      </div>

      <!-- detail -->
      <div class="rounded-lg border border-hair bg-white p-7 shadow-sm">
        <span class="font-display text-[12px] uppercase tracking-[0.14em] text-amber-700">{{ L(T.branch) }}</span>
        <h2 class="mb-3 mt-1.5 font-display text-2xl font-medium text-ink-900">OPTIZONE {{ storeName(s) }}</h2>
        <div class="flex flex-col gap-2 text-sm text-ink-700">
          <span class="flex items-center gap-2.5"><MapPin :size="16" class="text-pine-700" /> {{ s.addr }}</span>
          <span class="flex items-center gap-2.5"><Clock :size="16" class="text-pine-700" /> {{ L(s.hours) }}</span>
          <span class="flex items-center gap-2.5"><Phone :size="16" class="text-pine-700" /> <span dir="ltr">{{ s.phone }}</span></span>
        </div>
        <div class="mt-6 flex flex-wrap gap-3">
          <NuxtLink to="/booking" class="inline-flex items-center gap-2 rounded-sm bg-pine-700 px-5 py-3 font-display text-sm text-cream-100 hover:bg-amber-600 hover:text-pine-950"><Calendar :size="17" /> {{ L(T.bookHere) }}</NuxtLink>
          <a :href="directions(s)" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 rounded-sm border border-pine-700 px-5 py-3 font-display text-sm text-pine-700 hover:bg-pine-50"><Navigation :size="17" /> {{ L(T.directions) }}</a>
        </div>
      </div>
    </div>
  </div>
</template>
