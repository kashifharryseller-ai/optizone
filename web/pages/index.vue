<script setup lang="ts">
// Phase 0 shell: proves Tailwind (brand palette), fonts, and live /api wiring.
const { data: content } = await useAsyncData('content', () => $fetch<any>('/api/content'))
</script>

<template>
  <section class="bg-pine-700 text-cream-100">
    <div class="mx-auto max-w-container px-7 py-24">
      <p class="font-display uppercase tracking-[0.18em] text-amber-500 text-sm">
        {{ content?.hero?.eyebrow?.en }}
      </p>
      <h1 class="font-display font-medium text-6xl leading-[1.02] mt-4">
        {{ content?.hero?.titleA?.en }} {{ content?.hero?.titleB?.en }}<span class="text-amber-500">{{ content?.hero?.titleC?.en }}</span>.
      </h1>
      <p class="mt-5 text-pine-100 max-w-md text-lg leading-relaxed">
        {{ content?.hero?.subtitle?.en }}
      </p>
      <div class="mt-9 inline-flex items-center gap-2 rounded-pill bg-pine-800/70 border border-white/10 px-5 py-3 text-amber-400 font-display text-sm tracking-wide">
        <span class="w-2 h-2 rounded-full bg-amber-500" />
        Nuxt shell live · {{ content?.products?.length || 0 }} products · {{ content?.brands?.length || 0 }} brands from /api
      </div>
    </div>
  </section>
</template>
