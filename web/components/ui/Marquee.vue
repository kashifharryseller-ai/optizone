<script setup lang="ts">
// Inspira-UI-style infinite marquee. Duplicates the slot for a seamless loop;
// pauses on hover; reduced-motion safe.
withDefaults(defineProps<{ reverse?: boolean; pauseOnHover?: boolean; duration?: string }>(), {
  reverse: false, pauseOnHover: true, duration: '40s',
})
</script>

<template>
  <div class="group flex overflow-hidden" :style="{ '--oz-mq-dur': duration }">
    <div class="oz-mq-track flex shrink-0 items-stretch gap-5" :class="[reverse && 'oz-rev', pauseOnHover && 'group-hover:[animation-play-state:paused]']">
      <slot />
    </div>
    <div aria-hidden class="oz-mq-track flex shrink-0 items-stretch gap-5" :class="[reverse && 'oz-rev', pauseOnHover && 'group-hover:[animation-play-state:paused]']">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.oz-mq-track { animation: oz-mq var(--oz-mq-dur) linear infinite; }
.oz-mq-track.oz-rev { animation-direction: reverse; }
@keyframes oz-mq { from { transform: translateX(0); } to { transform: translateX(calc(-100% - 1.25rem)); } }
@media (prefers-reduced-motion: reduce) { .oz-mq-track { animation: none; } }
</style>
