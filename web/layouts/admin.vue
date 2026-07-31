<script setup lang="ts">
// Bare admin layout — no storefront header/footer/Lenis. The admin page owns its
// own shell (sidebar + header).
</script>

<template>
  <div class="min-h-screen bg-cream-200 text-ink-900">
    <slot />
  </div>
</template>
