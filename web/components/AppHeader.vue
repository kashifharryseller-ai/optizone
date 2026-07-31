<script setup lang="ts">
import { Search, Heart, User, ShoppingBag, ChevronDown, Menu } from 'lucide-vue-next'
import { useWindowScroll } from '@vueuse/core'

const { L, lang, setLang, languages } = useLang()
const { content } = useContent()
const { count } = useCart()
const { openSearch } = useSearch()
const { y } = useWindowScroll()
const scrolled = computed(() => y.value > 6)
const langOpen = ref(false)
const mobileOpen = ref(false)
const ann = computed(() => content.value?.announcement)

// Structural nav (maps to routes), like the React app's NAV.
const NAV = [
  { key: 'eyeglasses', label: { en: 'Eyeglasses', he: 'משקפי ראייה', ar: 'نظارات طبية' } },
  { key: 'sunglasses', label: { en: 'Sunglasses', he: 'משקפי שמש', ar: 'نظارات شمسية' } },
  { key: 'contacts', label: { en: 'Contact Lenses', he: 'עדשות מגע', ar: 'عدسات لاصقة' } },
  { key: 'brands', label: { en: 'Brands', he: 'מותגים', ar: 'العلامات' } },
  { key: 'stores', label: { en: 'Stores', he: 'סניפים', ar: 'الفروع' } },
  { key: 'book', label: { en: 'Book an Exam', he: 'קביעת תור', ar: 'احجز فحصًا' } },
]
const to = (k: string) => (k === 'book' ? '/booking' : '/' + k)
</script>

<template>
  <div>
    <div v-if="ann?.enabled" class="bg-pine-950 text-center text-xs text-cream-100/85 py-2 px-4 font-body">
      {{ L(ann) }}
    </div>
    <header class="sticky top-0 z-50 bg-pine-700 text-cream-100 transition-shadow duration-300" :class="scrolled ? 'shadow-dark' : ''">
      <div class="mx-auto flex max-w-container items-center gap-6 px-7 transition-[height] duration-300" :style="{ height: scrolled ? '60px' : '74px' }">
        <NuxtLink to="/" class="flex items-center gap-1 font-display text-lg tracking-[0.22em]">
          <span>OPTI</span><span class="text-amber-500">ZONE</span>
        </NuxtLink>

        <nav class="mx-auto hidden items-center gap-6 lg:flex">
          <NuxtLink
            v-for="n in NAV" :key="n.key" :to="to(n.key)"
            class="font-display text-[13px] uppercase tracking-[0.08em] text-cream-100/90 transition-colors hover:text-amber-400"
            :class="n.key === 'book' ? 'rounded-pill border border-cream-100/50 px-4 py-2 hover:border-amber-400' : ''"
          >{{ L(n.label) }}</NuxtLink>
        </nav>

        <div class="ms-auto flex items-center gap-2">
          <button aria-label="Search" @click="openSearch" class="p-2 transition-colors hover:text-amber-400"><Search :size="18" /></button>
          <NuxtLink to="/account" aria-label="Wishlist" class="hidden p-2 transition-colors hover:text-amber-400 sm:inline-flex"><Heart :size="18" /></NuxtLink>
          <NuxtLink to="/account" aria-label="Account" class="hidden p-2 transition-colors hover:text-amber-400 sm:inline-flex"><User :size="18" /></NuxtLink>
          <NuxtLink to="/cart" aria-label="Cart" class="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-amber-600 text-pine-950">
            <ShoppingBag :size="17" />
            <span v-if="count" class="absolute -end-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-pine-950 px-1 text-[10px] font-semibold text-cream-100">{{ count }}</span>
          </NuxtLink>

          <div class="relative">
            <button class="inline-flex items-center gap-1 rounded-pill border border-cream-100/40 px-3 py-1.5 font-display text-xs" @click="langOpen = !langOpen">
              {{ lang === 'en' ? 'EN' : lang === 'he' ? 'עב' : 'ع' }}<ChevronDown :size="14" />
            </button>
            <div v-if="langOpen" class="absolute end-0 z-50 mt-2 w-36 overflow-hidden rounded-md bg-white text-ink-800 shadow-lg">
              <button
                v-for="l in languages" :key="l.code"
                class="block w-full px-4 py-2 text-start text-sm hover:bg-cream-200"
                :class="lang === l.code ? 'font-semibold text-pine-700' : ''"
                @click="setLang(l.code); langOpen = false"
              >{{ l.label }}</button>
            </div>
          </div>

          <button class="p-2 lg:hidden" aria-label="Menu" @click="mobileOpen = !mobileOpen"><Menu :size="20" /></button>
        </div>
      </div>

      <div v-if="mobileOpen" class="border-t border-cream-100/10 lg:hidden">
        <NuxtLink
          v-for="n in NAV" :key="n.key" :to="to(n.key)" @click="mobileOpen = false"
          class="block border-b border-cream-100/10 px-7 py-3 font-display text-sm uppercase tracking-wide"
        >{{ L(n.label) }}</NuxtLink>
      </div>
    </header>
  </div>
</template>
