<script setup lang="ts">
// Homepage & content editor — hero copy, announcement bar, services, category
// labels and section headings. Bilingual (EN/HE) fields edit the content object
// in place; Arabic is auto-translated server-side on the storefront.
const admin = useAdmin()
const content = admin.content
const inp = 'w-full rounded-sm border border-hair px-2.5 py-2 text-sm'
const lbl = 'mb-1 block text-[11px] uppercase tracking-wide text-ink-400'

// ensure nested objects exist
const hero = computed(() => (content.value.hero ||= {}))
const ann = computed(() => (content.value.announcement ||= { enabled: true, en: '', he: '' }))
const sections = computed(() => (content.value.sections ||= {}))
const HERO_FIELDS = ['eyebrow', 'titleA', 'titleB', 'titleC', 'subtitle', 'ctaShop', 'ctaBook'] as const
function biln(obj: any, key: string) { if (!obj[key] || typeof obj[key] !== 'object') obj[key] = { en: '', he: '' }; return obj[key] }
</script>

<template>
  <div class="flex flex-col gap-5">
    <Panel title="Announcement bar" desc="The thin strip above the header.">
      <label class="mb-3 flex items-center gap-2 text-sm"><input type="checkbox" v-model="ann.enabled" class="h-4 w-4 accent-pine-700" /> Show announcement bar</label>
      <div class="grid gap-3 sm:grid-cols-2">
        <div><label :class="lbl">Text (EN)</label><input v-model="ann.en" :class="inp" /></div>
        <div><label :class="lbl">Text (HE)</label><input v-model="ann.he" :class="inp" dir="rtl" /></div>
      </div>
    </Panel>

    <Panel title="Hero" desc="The full-screen video hero copy. Title reads: “{titleA} {titleB}{titleC}.”">
      <div class="grid gap-3 sm:grid-cols-2">
        <div v-for="f in HERO_FIELDS" :key="f" class="grid grid-cols-2 gap-2">
          <div><label :class="lbl">{{ f }} (EN)</label><input :value="biln(hero, f).en" @input="hero[f].en = ($event.target as HTMLInputElement).value" :class="inp" /></div>
          <div><label :class="lbl">{{ f }} (HE)</label><input :value="biln(hero, f).he" @input="hero[f].he = ($event.target as HTMLInputElement).value" :class="inp" dir="rtl" /></div>
        </div>
      </div>
    </Panel>

    <Panel title="Section headings" desc="Eyebrow + title for each home section.">
      <div class="flex flex-col gap-4">
        <div v-for="(sec, key) in sections" :key="key" class="rounded-sm border border-hair p-3">
          <div class="mb-2 font-display text-sm capitalize text-ink-900">{{ key }}</div>
          <div class="grid gap-3 sm:grid-cols-2">
            <div><label :class="lbl">Eyebrow (EN)</label><input :value="biln(sec, 'eyebrow').en" @input="sec.eyebrow.en = ($event.target as HTMLInputElement).value" :class="inp" /></div>
            <div><label :class="lbl">Eyebrow (HE)</label><input :value="biln(sec, 'eyebrow').he" @input="sec.eyebrow.he = ($event.target as HTMLInputElement).value" :class="inp" dir="rtl" /></div>
            <div><label :class="lbl">Title (EN)</label><input :value="biln(sec, 'title').en" @input="sec.title.en = ($event.target as HTMLInputElement).value" :class="inp" /></div>
            <div><label :class="lbl">Title (HE)</label><input :value="biln(sec, 'title').he" @input="sec.title.he = ($event.target as HTMLInputElement).value" :class="inp" dir="rtl" /></div>
          </div>
        </div>
      </div>
    </Panel>

    <Panel title="Services" desc="The “What we do” grid.">
      <div class="flex flex-col gap-3">
        <div v-for="(s, i) in (content.services || [])" :key="i" class="rounded-sm border border-hair p-3">
          <div class="grid gap-3 sm:grid-cols-2">
            <div><label :class="lbl">Title (EN)</label><input :value="biln(s, 'title').en" @input="s.title.en = ($event.target as HTMLInputElement).value" :class="inp" /></div>
            <div><label :class="lbl">Title (HE)</label><input :value="biln(s, 'title').he" @input="s.title.he = ($event.target as HTMLInputElement).value" :class="inp" dir="rtl" /></div>
            <div><label :class="lbl">Desc (EN)</label><input :value="biln(s, 'desc').en" @input="s.desc.en = ($event.target as HTMLInputElement).value" :class="inp" /></div>
            <div><label :class="lbl">Desc (HE)</label><input :value="biln(s, 'desc').he" @input="s.desc.he = ($event.target as HTMLInputElement).value" :class="inp" dir="rtl" /></div>
          </div>
          <div class="mt-2 flex justify-end"><button @click="content.services = content.services.filter((_: any, idx: number) => idx !== i)" class="text-[13px] text-red-500">Remove</button></div>
        </div>
        <button @click="content.services = [...(content.services || []), { icon: 'eye', title: { en: '', he: '' }, desc: { en: '', he: '' } }]" class="self-start rounded-sm border border-hair px-3 py-1.5 text-sm">+ Add service</button>
      </div>
    </Panel>

    <Panel title="Categories" desc="Home “Shop by category” tiles (label only; the key maps to a storefront page).">
      <div class="flex flex-col gap-3">
        <div v-for="(c, i) in (content.categories || [])" :key="i" class="grid items-end gap-3 sm:grid-cols-3">
          <div><label :class="lbl">Key</label><input :value="c.key" disabled :class="inp + ' opacity-60'" /></div>
          <div><label :class="lbl">Label (EN)</label><input :value="biln(c, 'label').en" @input="c.label.en = ($event.target as HTMLInputElement).value" :class="inp" /></div>
          <div><label :class="lbl">Label (HE)</label><input :value="biln(c, 'label').he" @input="c.label.he = ($event.target as HTMLInputElement).value" :class="inp" dir="rtl" /></div>
        </div>
      </div>
    </Panel>
  </div>
</template>
