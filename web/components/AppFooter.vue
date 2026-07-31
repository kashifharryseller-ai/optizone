<script setup lang="ts">
const { L } = useLang()
const { content } = useContent()
const s = computed(() => content.value?.settings || {})
const year = new Date().getFullYear()
</script>

<template>
  <footer class="bg-pine-900 text-cream-100/80">
    <div class="mx-auto grid max-w-container gap-10 px-7 py-14 md:grid-cols-4">
      <div>
        <div class="font-display text-lg tracking-[0.22em]">OPTI<span class="text-amber-500">ZONE</span></div>
        <p class="mt-3 max-w-xs text-sm leading-relaxed text-cream-100/70">{{ L(s.footerBlurb) }}</p>
      </div>
      <div>
        <h4 class="footer-h">Shop</h4>
        <ul class="footer-l"><li>Eyeglasses</li><li>Sunglasses</li><li>Contact Lenses</li><li>Brands</li></ul>
      </div>
      <div>
        <h4 class="footer-h">Services</h4>
        <ul class="footer-l"><li>Eye Exams</li><li>Try Mirror</li><li>Book an Exam</li><li>Stores</li></ul>
      </div>
      <div>
        <h4 class="footer-h">OPTIZONE</h4>
        <ul class="footer-l">
          <li>{{ s.contact?.phone }}</li>
          <li>{{ s.contact?.email }}</li>
          <li>{{ s.contact?.addressEn }}</li>
        </ul>
      </div>
    </div>
    <div class="border-t border-cream-100/10 py-5 text-center text-xs text-cream-100/50">© {{ year }} OPTIZONE · Vision &amp; Style</div>
  </footer>
</template>

<style scoped>
.footer-h { font-family: var(--font-display); font-size: 12px; letter-spacing: .14em; text-transform: uppercase; color: var(--amber-500); margin-bottom: 12px; }
.footer-l { display: flex; flex-direction: column; gap: 8px; font-size: 14px; }
.footer-l li { cursor: pointer; }
.footer-l li:hover { color: var(--amber-400); }
</style>
