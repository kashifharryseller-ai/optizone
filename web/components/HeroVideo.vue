<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
const { L, dir } = useLang()

const slides = [
  { src: '/site/showcase.mp4', poster: '/site/showcase-poster.jpg', eyebrow: { en: 'The Signature Edit', he: 'הקולקציה החתומה', ar: 'المجموعة المميّزة' }, title: { en: 'Crafted to be seen', he: 'נועדו להיראות', ar: 'صُمّمت لتُرى' } },
  { src: '/site/showcase-2.mp4', poster: '/site/showcase-2-poster.webp', eyebrow: { en: 'Timeless Icons', he: 'איקונים על-זמניים', ar: 'أيقونات خالدة' }, title: { en: 'Timeless by design', he: 'עיצוב על-זמני', ar: 'تصميم خالد' } },
  { src: '/site/showcase-3.mp4', poster: '/site/showcase-3-poster.webp', eyebrow: { en: 'Bold & Black', he: 'נועז ושחור', ar: 'جريء وأسود' }, title: { en: 'Made to stand out', he: 'נבנו לבלוט', ar: 'صُنعت لتتميّز' } },
  { src: '/site/showcase-4.mp4', poster: '/site/showcase-4-poster.webp', eyebrow: { en: 'Heritage Tortoise', he: 'מסורת מנומרת', ar: 'أصالة نمشيّة' }, title: { en: 'Detail in every curve', he: 'פרט בכל עקומة', ar: 'تفصيل في كلّ انحناءة' } },
]
const n = slides.length
const idx = ref(0)
const paused = ref(false)
const rtl = computed(() => dir.value === 'rtl')
const videos = ref<HTMLVideoElement[]>([])
let timer: any
const go = (i: number) => { idx.value = ((i % n) + n) % n }
function tick() {
  clearTimeout(timer)
  if (paused.value) return
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) return
  timer = setTimeout(() => { go(idx.value + 1); tick() }, 6000)
}
onMounted(tick)
onUnmounted(() => clearTimeout(timer))
watch(idx, () => {
  videos.value.forEach((v, i) => {
    if (!v) return
    if (i === idx.value) { try { v.currentTime = 0 } catch { /* not ready */ } v.play().catch(() => {}) }
    else v.pause()
  })
})
watch(paused, tick)
</script>

<template>
  <div class="absolute inset-0" @mouseenter="paused = true" @mouseleave="paused = false">
    <div v-for="(s, i) in slides" :key="s.src" class="absolute inset-0 transition-opacity duration-700" :style="{ opacity: i === idx ? 1 : 0, pointerEvents: i === idx ? 'auto' : 'none' }">
      <video :ref="(el) => { if (el) videos[i] = el as HTMLVideoElement }" :src="s.src" :poster="s.poster" muted loop playsinline :preload="i === 0 ? 'metadata' : 'none'" class="absolute inset-0 h-full w-full object-cover" />
      <div class="absolute inset-0" style="background: linear-gradient(to top, rgba(6,23,15,0.9), rgba(6,23,15,0.15) 55%, transparent);" />
      <div class="absolute bottom-0 start-0 max-w-[85%] p-6 pb-10">
        <div class="font-display text-[11px] uppercase tracking-[0.16em] text-amber-500">{{ L(s.eyebrow) }}</div>
        <div class="font-display text-2xl leading-tight text-cream-100">{{ L(s.title) }}</div>
      </div>
    </div>
    <button class="hero-arrow start-2" aria-label="Previous slide" @click="go(idx - 1)"><component :is="rtl ? ChevronRight : ChevronLeft" :size="18" /></button>
    <button class="hero-arrow end-2" aria-label="Next slide" @click="go(idx + 1)"><component :is="rtl ? ChevronLeft : ChevronRight" :size="18" /></button>
    <div class="absolute inset-x-0 bottom-4 z-10 flex justify-center gap-2">
      <button v-for="(s, i) in slides" :key="i" :aria-label="`Go to slide ${i + 1}`" class="h-[7px] rounded-full transition-all" :class="i === idx ? 'w-6 bg-amber-500' : 'w-[7px] bg-cream-100/50'" @click="go(i)" />
    </div>
  </div>
</template>

<style scoped>
.hero-arrow { position: absolute; top: 50%; transform: translateY(-50%); z-index: 10; width: 34px; height: 34px; border-radius: 9999px; display: inline-flex; align-items: center; justify-content: center; color: var(--cream-100); background: rgba(6, 23, 15, 0.5); border: 1px solid rgba(251, 248, 241, 0.3); backdrop-filter: blur(4px); }
</style>
