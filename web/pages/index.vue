<script setup lang="ts">
import { ArrowRight, Calendar } from 'lucide-vue-next'
const { L, dir } = useLang()
const { content } = useContent()
const hero = computed(() => content.value?.hero || {})
const sec = computed(() => content.value?.sections || {})
const services = computed(() => content.value?.services || [])
const categories = computed(() => content.value?.categories || [])
const products = computed(() => content.value?.products || [])
const media = computed(() => content.value?.media || {})
</script>

<template>
  <div>
    <!-- HERO (Inspira Aurora + video carousel) -->
    <AuroraBackground class="bg-pine-800 text-cream-100">
      <div class="mx-auto grid max-w-container items-center gap-10 px-7 py-20 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <span class="font-display text-[13px] uppercase tracking-[0.18em] text-amber-500">{{ L(hero.eyebrow) }}</span>
          <h1 class="mt-4 font-display text-5xl font-medium leading-[1.02] md:text-6xl">
            {{ L(hero.titleA) }} {{ L(hero.titleB) }}<span class="text-amber-500">{{ L(hero.titleC) }}</span>.
          </h1>
          <p class="mt-5 max-w-md text-lg leading-relaxed text-pine-100">{{ L(hero.subtitle) }}</p>
          <div class="mt-8 flex flex-wrap gap-3">
            <NuxtLink to="/eyeglasses" class="rounded-sm bg-amber-600 px-6 py-3 font-display text-sm uppercase tracking-wide text-pine-950 transition hover:brightness-105">{{ L(hero.ctaShop) }}</NuxtLink>
            <NuxtLink to="/booking" class="inline-flex items-center gap-2 rounded-sm border border-cream-100 px-6 py-3 font-display text-sm uppercase tracking-wide transition hover:border-amber-400 hover:text-amber-400"><Calendar :size="16" />{{ L(hero.ctaBook) }}</NuxtLink>
          </div>
        </div>
        <div class="relative aspect-[4/3] overflow-hidden rounded-lg border border-white/10 shadow-dark">
          <HeroVideo />
        </div>
      </div>
    </AuroraBackground>

    <!-- SERVICES -->
    <section class="mx-auto max-w-container px-7 py-16">
      <div class="mb-8 text-center">
        <span class="font-display text-[13px] uppercase tracking-[0.18em] text-amber-700">{{ L(sec.services?.eyebrow) }}</span>
        <h2 class="mt-2 font-display text-3xl text-ink-900">{{ L(sec.services?.title) }}</h2>
      </div>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="(s, i) in services" :key="i" class="rounded-md border border-hair bg-white p-5 transition-shadow hover:shadow-sm">
          <div class="font-display text-base text-ink-900">{{ L(s.title) }}</div>
          <p class="mt-1 text-sm leading-relaxed text-ink-500">{{ L(s.desc) }}</p>
        </div>
      </div>
    </section>

    <!-- CATEGORIES -->
    <section class="mx-auto max-w-container px-7 pb-4">
      <div class="mb-7 text-center">
        <span class="font-display text-[13px] uppercase tracking-[0.18em] text-amber-700">{{ L(sec.categories?.eyebrow) }}</span>
        <h2 class="mt-2 font-display text-3xl text-ink-900">{{ L(sec.categories?.title) }}</h2>
      </div>
      <div class="grid gap-5 sm:grid-cols-3">
        <NuxtLink v-for="cat in categories" :key="cat.key" :to="'/' + cat.key" class="group overflow-hidden rounded-md border border-hair bg-white shadow-sm">
          <div class="aspect-[16/9] overflow-hidden bg-cream-300">
            <img v-if="media['cat-' + cat.key]" :src="media['cat-' + cat.key]" :alt="L(cat.label)" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          </div>
          <div class="flex items-center justify-between p-4">
            <span class="font-display text-[15px] uppercase tracking-[0.08em] text-ink-900">{{ L(cat.label) }}</span>
            <ArrowRight :size="16" class="text-amber-700" :class="dir === 'rtl' ? 'scale-x-[-1]' : ''" />
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- FEATURED PRODUCTS -->
    <section class="mx-auto max-w-container px-7 py-14">
      <div class="mb-6 flex items-end justify-between gap-4">
        <div>
          <span class="font-display text-[13px] uppercase tracking-[0.18em] text-amber-700">{{ L(sec.bestsellers?.eyebrow) }}</span>
          <h2 class="mt-1 font-display text-3xl text-ink-900">{{ L(sec.bestsellers?.title) }}</h2>
        </div>
        <NuxtLink to="/eyeglasses" class="inline-flex items-center gap-1 font-display text-sm text-amber-700">{{ L(sec.bestsellers?.viewall) }}<ArrowRight :size="15" /></NuxtLink>
      </div>
      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <ProductCard v-for="p in products.slice(0, 4)" :key="p.id" :product="p" />
      </div>
    </section>

    <!-- HOUSE OF BRANDS (marquee) -->
    <section class="bg-pine-950 py-16">
      <div class="mx-auto mb-8 max-w-container px-7">
        <span class="font-display text-[13px] uppercase tracking-[0.18em] text-amber-500">The houses we carry</span>
        <h2 class="mt-2 font-display text-3xl text-cream-100">Iconic brands, expertly fitted</h2>
      </div>
      <BrandMarquee />
    </section>

    <!-- TRY MIRROR BANNER -->
    <section class="mx-auto max-w-container px-7 py-16">
      <div class="rounded-xl bg-pine-800 p-10 text-cream-100 md:p-12">
        <span class="font-display text-[13px] uppercase tracking-[0.18em] text-amber-500">{{ L(sec.tryMirror?.eyebrow) }}</span>
        <h2 class="mt-2 font-display text-3xl">{{ L(sec.tryMirror?.title) }}</h2>
        <p class="mt-2 max-w-lg leading-relaxed text-pine-100">{{ L(sec.tryMirror?.subtitle) }}</p>
        <NuxtLink to="/eyeglasses" class="mt-5 inline-block rounded-sm bg-amber-600 px-6 py-3 font-display text-sm uppercase tracking-wide text-pine-950">{{ L(sec.tryMirror?.cta) }}</NuxtLink>
      </div>
    </section>
  </div>
</template>
