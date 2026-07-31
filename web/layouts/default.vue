<script setup lang="ts">
// Global smooth scroll (Lenis). Disabled when the OS asks for reduced motion,
// matching the React app. VueLenis is auto-imported by the lenis/nuxt module.
const reduce = ref(false)
onMounted(() => {
  reduce.value = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
})
</script>

<template>
  <VueLenis root :options="{ lerp: 0.1, smoothWheel: !reduce, wheelMultiplier: 1 }">
    <slot />
  </VueLenis>
</template>
