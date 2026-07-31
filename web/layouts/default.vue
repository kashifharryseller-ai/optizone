<script setup lang="ts">
// Global smooth scroll (Lenis), disabled under reduced-motion. VueLenis is
// auto-imported by the lenis/nuxt module. Header + footer wrap every page.
const reduce = ref(false)
onMounted(() => {
  reduce.value = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
})
</script>

<template>
  <VueLenis root :options="{ lerp: 0.1, smoothWheel: !reduce, wheelMultiplier: 1 }">
    <div class="flex min-h-screen flex-col">
      <AppHeader />
      <main class="flex-1">
        <slot />
      </main>
      <AppFooter />
      <SearchOverlay />
    </div>
  </VueLenis>
</template>
