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
          <Reveal :y="14" :duration="0.5">
            <span class="font-display text-[13px] uppercase tracking-[0.18em] text-amber-500">{{ L(hero.eyebrow) }}</span>
          </Reveal>
          <Reveal as="h1" blur :y="20" :delay="0.06" :duration="0.7" class="mt-4 font-display text-5xl font-medium leading-[1.02] md:text-6xl">
            {{ L(hero.titleA) }} {{ L(hero.titleB) }}<span class="text-amber-500">{{ L(hero.titleC) }}</span>.
          </Reveal>
          <Reveal as="p" :y="18" :delay="0.16" class="mt-5 max-w-md text-lg leading-relaxed text-pine-100">{{ L(hero.subtitle) }}</Reveal>
          <Reveal :y="18" :delay="0.26" class="mt-8 flex flex-wrap gap-3">
            <NuxtLink to="/eyeglasses" class="rounded-sm bg-amber-600 px-6 py-3 font-display text-sm uppercase tracking-wide text-pine-950 transition hover:brightness-105">{{ L(hero.ctaShop) }}</NuxtLink>
            <NuxtLink to="/booking" class="inline-flex items-center gap-2 rounded-sm border border-cream-100 px-6 py-3 font-display text-sm uppercase tracking-wide transition hover:border-amber-400 hover:text-amber-400"><Calendar :size="16" />{{ L(hero.ctaBook) }}</NuxtLink>
          </Reveal>
        </div>
        <Reveal :y="24" :delay="0.12" :duration="0.8" class="relative aspect-[4/3] overflow-hidden rounded-lg border border-white/10 shadow-dark">
          <HeroVideo />
        </Reveal>
      </div>
    </AuroraBackground>

    <!-- SERVICES -->
    <section class="mx-auto max-w-container px-7 py-16">
      <Reveal as="div" blur :y="18" class="mb-8 text-center">
        <span class="font-display text-[13px] uppercase tracking-[0.18em] text-amber-700">{{ L(sec.services?.eyebrow) }}</span>
        <h2 class="mt-2 font-display text-3xl text-ink-900">{{ L(sec.services?.title) }}</h2>
      </Reveal>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Reveal v-for="(s, i) in services" :key="i" as="div" :y="20" :delay="i * 0.06" class="rounded-md border border-hair bg-white p-5 transition-shadow hover:shadow-sm">
          <div class="font-display text-base text-ink-900">{{ L(s.title) }}</div>
          <p class="mt-1 text-sm leading-relaxed text-ink-500">{{ L(s.desc) }}</p>
        </Reveal>
      </div>
    </section>

    <!-- CATEGORIES -->
    <section class="mx-auto max-w-container px-7 pb-4">
      <Reveal as="div" blur :y="18" class="mb-7 text-center">
        <span class="font-display text-[13px] uppercase tracking-[0.18em] text-amber-700">{{ L(sec.categories?.eyebrow) }}</span>
        <h2 class="mt-2 font-display text-3xl text-ink-900">{{ L(sec.categories?.title) }}</h2>
      </Reveal>
      <div class="grid gap-5 sm:grid-cols-3">
        <Reveal v-for="(cat, i) in categories" :key="cat.key" :y="24" :delay="i * 0.08">
          <NuxtLink :to="'/' + cat.key" class="group block overflow-hidden rounded-md border border-hair bg-white shadow-sm">
            <div class="aspect-[16/9] overflow-hidden bg-cream-300">
              <img v-if="media['cat-' + cat.key]" :src="media['cat-' + cat.key]" :alt="L(cat.label)" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div class="flex items-center justify-between p-4">
              <span class="font-display text-[15px] uppercase tracking-[0.08em] text-ink-900">{{ L(cat.label) }}</span>
              <ArrowRight :size="16" class="text-amber-700 transition-transform group-hover:translate-x-1" :class="dir === 'rtl' ? 'scale-x-[-1]' : ''" />
            </div>
          </NuxtLink>
        </Reveal>
      </div>
    </section>

    <!-- FEATURED PRODUCTS -->
    <section class="mx-auto max-w-container px-7 py-14">
      <Reveal as="div" :y="16" class="mb-6 flex items-end justify-between gap-4">
        <div>
          <span class="font-display text-[13px] uppercase tracking-[0.18em] text-amber-700">{{ L(sec.bestsellers?.eyebrow) }}</span>
          <h2 class="mt-1 font-display text-3xl text-ink-900">{{ L(sec.bestsellers?.title) }}</h2>
        </div>
        <NuxtLink to="/eyeglasses" class="inline-flex items-center gap-1 font-display text-sm text-amber-700 transition hover:gap-2">{{ L(sec.bestsellers?.viewall) }}<ArrowRight :size="15" /></NuxtLink>
      </Reveal>
      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Reveal v-for="(p, i) in products.slice(0, 4)" :key="p.id" :y="26" :delay="i * 0.07">
          <ProductCard :product="p" />
        </Reveal>
      </div>
    </section>

    <!-- HOUSE OF BRANDS (marquee) -->
    <section class="bg-pine-950 py-16">
      <Reveal as="div" blur :y="18" class="mx-auto mb-8 max-w-container px-7">
        <span class="font-display text-[13px] uppercase tracking-[0.18em] text-amber-500">The houses we carry</span>
        <h2 class="mt-2 font-display text-3xl text-cream-100">Iconic brands, expertly fitted</h2>
      </Reveal>
      <BrandMarquee />
    </section>

    <!-- TRY MIRROR BANNER -->
    <section class="mx-auto max-w-container px-7 py-16">
      <Reveal :y="28" :duration="0.7">
        <div class="relative overflow-hidden rounded-xl bg-pine-800 p-10 text-cream-100 md:p-12">
          <div aria-hidden class="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-amber-500/15 blur-3xl" />
          <div aria-hidden class="pointer-events-none absolute -bottom-20 left-1/4 h-56 w-56 rounded-full bg-pine-500/25 blur-3xl" />
          <div class="relative">
            <span class="font-display text-[13px] uppercase tracking-[0.18em] text-amber-500">{{ L(sec.tryMirror?.eyebrow) }}</span>
            <h2 class="mt-2 font-display text-3xl">{{ L(sec.tryMirror?.title) }}</h2>
            <p class="mt-2 max-w-lg leading-relaxed text-pine-100">{{ L(sec.tryMirror?.subtitle) }}</p>
            <NuxtLink to="/eyeglasses" class="mt-5 inline-block rounded-sm bg-amber-600 px-6 py-3 font-display text-sm uppercase tracking-wide text-pine-950 transition hover:brightness-105">{{ L(sec.tryMirror?.cta) }}</NuxtLink>
          </div>
        </div>
      </Reveal>
    </section>
  </div>
</template>
