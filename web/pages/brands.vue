<script setup lang="ts">
const { L } = useLang()
const { content } = useContent()

const T = {
  eyebrow: { en: 'Our partners', he: 'השותפים שלנו', ar: 'شركاؤنا' },
  title: { en: 'Shop by brand', he: 'קנייה לפי מותג', ar: 'تسوّق حسب العلامة' },
  sub: { en: 'The houses we carry — 100% authentic with full manufacturer warranty.', he: 'המותגים שאנו מציעים — מקוריים 100% עם אחריות יצרן מלאה.', ar: 'العلامات التي نوفّرها — أصلية 100% وبضمان الشركة المصنّعة الكامل.' },
  count: (n: number) => ({ en: `${n} ${n === 1 ? 'product' : 'products'}`, he: `${n} מוצרים`, ar: `${n} منتجات` }),
}

// Brand tiles with the generated studio imagery, mirroring the home marquee set.
const IMG: Record<string, string> = {
  'Tom Ford': '/brands/tomford.webp', 'Ray-Ban': '/brands/rayban.webp', 'Tommy Hilfiger': '/brands/tommy.webp',
  Guess: '/brands/guess.webp', Carrera: '/brands/carrera.webp', Boss: '/brands/boss.webp', Gant: '/brands/gant.webp',
  Alvero: '/brands/alvero.webp', 'Johnson & Johnson': '/brands/jj.webp', CooperVision: '/brands/coopervision.webp',
}
const products = computed(() => content.value?.products || [])
const brands = computed(() => {
  const names: string[] = content.value?.brands || []
  return names.map((name) => {
    const items = products.value.filter((p: any) => p.brand === name)
    const cat = items[0]?.category || 'eyeglasses'
    return { name, img: IMG[name] || items[0]?.image, count: items.length, cat }
  })
})

useHead({ title: 'Brands — OPTIZONE' })
</script>

<template>
  <div>
    <div class="bg-pine-700 text-cream-100">
      <div class="mx-auto max-w-container px-7 py-12">
        <span class="font-display text-[13px] uppercase tracking-[0.18em] text-amber-500">{{ L(T.eyebrow) }}</span>
        <h1 class="mb-1.5 mt-2 font-display text-4xl font-medium">{{ L(T.title) }}</h1>
        <p class="max-w-xl text-[15px] text-pine-100">{{ L(T.sub) }}</p>
      </div>
    </div>

    <div class="mx-auto max-w-container px-7 pb-20 pt-8">
      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Reveal v-for="(b, i) in brands" :key="b.name" :y="22" :delay="Math.min(i, 8) * 0.05">
          <NuxtLink :to="`/${b.cat}`" class="group relative block overflow-hidden rounded-lg border border-hair bg-gradient-to-b from-pine-800 to-pine-950">
            <div class="aspect-[4/3] overflow-hidden">
              <img v-if="b.img" :src="b.img" :alt="b.name" loading="lazy" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style="background: radial-gradient(65% 55% at 50% 108%, rgba(245,166,35,0.28), transparent 70%);" />
            <div class="pointer-events-none absolute inset-0" style="background: linear-gradient(to top, rgba(6,23,15,0.85), transparent 55%);" />
            <div class="absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
              <span class="font-display text-lg text-cream-100">{{ b.name }}</span>
              <span class="rounded-pill bg-cream-100/10 px-2.5 py-0.5 text-[11px] text-cream-100/80">{{ L(T.count(b.count)) }}</span>
            </div>
          </NuxtLink>
        </Reveal>
      </div>
    </div>
  </div>
</template>
