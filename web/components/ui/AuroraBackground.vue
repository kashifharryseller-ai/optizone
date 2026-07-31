<script setup lang="ts">
// Inspira-UI-style Aurora background — a rich dark emerald base with a soft,
// slow-moving brand glow (emerald + a touch of amber). Kept subtle so hero text
// stays high-contrast. Reduced-motion safe.
</script>

<template>
  <div class="relative isolate overflow-hidden bg-pine-900">
    <div aria-hidden class="pointer-events-none absolute inset-0 bg-gradient-to-br from-pine-800 to-pine-950" />
    <div aria-hidden class="oz-aurora pointer-events-none absolute inset-0" />
    <div aria-hidden class="pointer-events-none absolute inset-0" style="background: radial-gradient(120% 120% at 50% -10%, transparent 45%, rgba(6,23,15,0.5));" />
    <div class="relative z-10">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.oz-aurora {
  background:
    radial-gradient(55% 50% at 15% 4%, rgba(35, 163, 98, 0.32), transparent 60%),
    radial-gradient(45% 45% at 88% 14%, rgba(70, 188, 128, 0.18), transparent 62%),
    radial-gradient(50% 55% at 82% 98%, rgba(245, 166, 35, 0.16), transparent 60%),
    radial-gradient(45% 50% at 6% 96%, rgba(21, 122, 70, 0.3), transparent 62%);
  filter: blur(42px) saturate(1.05);
  opacity: 0.9;
  animation: oz-aurora-move 22s ease-in-out infinite alternate;
}
@keyframes oz-aurora-move {
  0% { transform: translate3d(-4%, -3%, 0) scale(1.06); }
  50% { transform: translate3d(3%, 2%, 0) scale(1.13); }
  100% { transform: translate3d(2%, -2%, 0) scale(1.07); }
}
@media (prefers-reduced-motion: reduce) { .oz-aurora { animation: none; } }
</style>
