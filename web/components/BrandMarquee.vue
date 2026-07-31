<script setup lang="ts">
// Brand marquee — the generated brand imagery on an infinite scroll (Inspira
// Marquee). Links into the brands page.
const BRANDS = [
  { name: 'Tom Ford', img: '/brands/tomford.webp' },
  { name: 'Ray-Ban', img: '/brands/rayban.webp' },
  { name: 'Tommy Hilfiger', img: '/brands/tommy.webp' },
  { name: 'Guess', img: '/brands/guess.webp' },
  { name: 'Carrera', img: '/brands/carrera.webp' },
  { name: 'Boss', img: '/brands/boss.webp' },
  { name: 'Gant', img: '/brands/gant.webp' },
  { name: 'Alvero', img: '/brands/alvero.webp' },
  { name: 'Johnson & Johnson', img: '/brands/jj.webp' },
  { name: 'CooperVision', img: '/brands/coopervision.webp' },
]
</script>

<template>
  <Marquee duration="52s">
    <NuxtLink
      v-for="b in BRANDS" :key="b.name" to="/brands"
      class="group relative w-64 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-gradient-to-b from-pine-800 to-pine-950 transition-colors duration-300 hover:border-amber-400/40"
    >
      <div class="aspect-[4/3] overflow-hidden">
        <img :src="b.img" :alt="b.name" loading="lazy" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      </div>
      <!-- Card-spotlight: amber glow rises on hover -->
      <div class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style="background: radial-gradient(65% 55% at 50% 108%, rgba(245,166,35,0.28), transparent 70%);" />
      <div class="pointer-events-none absolute inset-0" style="background: linear-gradient(to top, rgba(6,23,15,0.82), transparent 55%);" />
      <div class="absolute bottom-3 start-4 font-display text-cream-100 transition-colors duration-300 group-hover:text-amber-100">{{ b.name }}</div>
    </NuxtLink>
  </Marquee>
</template>
