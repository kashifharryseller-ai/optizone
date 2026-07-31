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
    <!-- HERO — full-section Higgsfield video carousel with overlaid copy.
         Responsive: on phones it's shorter and the copy is anchored to the lower
         third over a strong scrim (so the video's product shows above it); from
         md up it becomes a tall, centred, left-aligned cinematic hero. -->
    <section class="relative min-h-[78svh] w-full overflow-hidden bg-pine-900 text-cream-100 md:min-h-[92svh]">
      <!-- immersive video carousel fills the whole section -->
      <HeroVideo full />
      <!-- desktop: left scrim for the centred copy. hidden on phones. -->
      <div aria-hidden class="pointer-events-none absolute inset-0 z-[5] hidden md:block" style="background: linear-gradient(to right, rgba(6,23,15,0.85), rgba(6,23,15,0.4) 46%, rgba(6,23,15,0.05) 78%);" />
      <!-- bottom scrim: strong on phones (copy sits here), lighter on desktop. -->
      <div aria-hidden class="pointer-events-none absolute inset-0 z-[5] md:hidden" style="background: linear-gradient(to top, rgba(6,23,15,0.94), rgba(6,23,15,0.72) 26%, rgba(6,23,15,0.15) 62%, transparent 82%);" />
      <div aria-hidden class="pointer-events-none absolute inset-0 z-[5] hidden md:block" style="background: linear-gradient(to top, rgba(6,23,15,0.5), transparent 42%);" />
      <!-- overlaid copy; pointer-events-none so the carousel dots stay clickable -->
      <div class="pointer-events-none relative z-20 mx-auto flex min-h-[78svh] max-w-container items-end px-6 pb-12 sm:px-7 md:min-h-[92svh] md:items-center md:pb-0">
        <div class="max-w-2xl md:py-28">
          <Reveal :y="14" :duration="0.5">
            <span class="font-display text-[12px] uppercase tracking-[0.2em] text-amber-400 sm:text-[13px]">{{ L(hero.eyebrow) }}</span>
          </Reveal>
          <Reveal as="h1" blur :y="22" :delay="0.06" :duration="0.8" class="mt-3 font-display text-[2.6rem] font-medium leading-[1.05] sm:mt-4 sm:text-6xl md:text-7xl" style="text-shadow: 0 2px 30px rgba(6,23,15,0.55)">
            {{ L(hero.titleA) }} {{ L(hero.titleB) }}<span class="text-amber-400">{{ L(hero.titleC) }}</span>.
          </Reveal>
          <Reveal as="p" :y="18" :delay="0.18" class="mt-4 max-w-lg text-[15px] leading-relaxed text-cream-100/90 sm:mt-6 sm:text-lg lg:text-xl">{{ L(hero.subtitle) }}</Reveal>
          <Reveal :y="18" :delay="0.28" class="pointer-events-auto mt-6 flex flex-wrap gap-3 sm:mt-9">
            <NuxtLink to="/eyeglasses" class="rounded-sm bg-amber-500 px-6 py-3 font-display text-[13px] uppercase tracking-wide text-pine-950 shadow-lg transition hover:brightness-105 sm:px-7 sm:py-3.5 sm:text-sm">{{ L(hero.ctaShop) }}</NuxtLink>
            <NuxtLink to="/booking" class="inline-flex items-center gap-2 rounded-sm border border-cream-100/80 bg-pine-950/20 px-6 py-3 font-display text-[13px] uppercase tracking-wide backdrop-blur-sm transition hover:border-amber-400 hover:text-amber-400 sm:px-7 sm:py-3.5 sm:text-sm"><Calendar :size="16" />{{ L(hero.ctaBook) }}</NuxtLink>
          </Reveal>
        </div>
      </div>
    </section>

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
