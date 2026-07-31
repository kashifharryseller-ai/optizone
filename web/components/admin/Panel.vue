<script setup lang="ts">
// Admin content panel — titled card with optional description + header actions.
defineProps<{ title?: string; desc?: string }>()
</script>

<template>
  <section class="rounded-lg border border-hair bg-white p-6 shadow-xs">
    <div v-if="title || $slots.actions" class="mb-4 flex flex-wrap items-start justify-between gap-3">
      <div v-if="title">
        <h2 class="font-display text-lg text-ink-900">{{ title }}</h2>
        <p v-if="desc" class="mt-1 max-w-2xl text-[13px] leading-relaxed text-ink-500">{{ desc }}</p>
      </div>
      <div v-if="$slots.actions" class="flex items-center gap-2"><slot name="actions" /></div>
    </div>
    <slot />
  </section>
</template>
