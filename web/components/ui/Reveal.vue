<script setup lang="ts">
// Section reveal — motion-v in-view fade + rise (optionally blur). Fires once as
// the element scrolls into view, in sync with Lenis. Reduced-motion safe: renders
// its content statically with no transform when the user prefers reduced motion.
import { Motion } from 'motion-v'

const props = withDefaults(defineProps<{
  as?: string
  y?: number
  blur?: boolean
  delay?: number
  duration?: number
  once?: boolean
}>(), { as: 'div', y: 26, blur: false, delay: 0, duration: 0.6, once: true })

const reduce = ref(false)
onMounted(() => {
  reduce.value = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
})

const initial = computed(() => ({
  opacity: 0,
  y: props.y,
  filter: props.blur ? 'blur(10px)' : 'blur(0px)',
}))
const inView = computed(() => ({ opacity: 1, y: 0, filter: 'blur(0px)' }))
const transition = computed(() => ({
  duration: props.duration,
  delay: props.delay,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
}))
</script>

<template>
  <component :is="as" v-if="reduce">
    <slot />
  </component>
  <Motion
    v-else
    :as="as"
    :initial="initial"
    :while-in-view="inView"
    :in-view-options="{ once, margin: '0px 0px -12% 0px' }"
    :transition="transition"
  >
    <slot />
  </Motion>
</template>
