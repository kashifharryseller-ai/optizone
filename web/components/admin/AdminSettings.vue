<script setup lang="ts">
// Store settings + branches — edits content.settings and content.stores.
const admin = useAdmin()
const content = admin.content
const s = computed<any>(() => (content.value.settings ||= {}))
const contact = computed<any>(() => (s.value.contact ||= {}))
const stores = computed<any[]>(() => (content.value.stores ||= []))
const inp = 'w-full rounded-sm border border-hair px-2.5 py-2 text-sm'
const lbl = 'mb-1 block text-[11px] uppercase tracking-wide text-ink-400'
function biln(obj: any, key: string) { if (!obj[key] || typeof obj[key] !== 'object') obj[key] = { en: '', he: '' }; return obj[key] }
function addStore() { content.value.stores = [...stores.value, { name: '', he: '', addr: '', phone: '', hours: { en: '', he: '' }, services: [], x: 50, y: 50 }] }
function removeStore(i: number) { content.value.stores = stores.value.filter((_, idx) => idx !== i) }
</script>

<template>
  <div class="flex flex-col gap-5">
    <Panel title="Store settings" desc="Brand, contact details, shipping thresholds and the footer blurb.">
      <div class="grid gap-3 sm:grid-cols-2">
        <div><label :class="lbl">Brand name</label><input v-model="s.brandName" :class="inp" /></div>
        <div><label :class="lbl">Phone</label><input v-model="contact.phone" :class="inp" dir="ltr" /></div>
        <div><label :class="lbl">Email</label><input v-model="contact.email" :class="inp" /></div>
        <div><label :class="lbl">Website</label><input v-model="contact.site" :class="inp" /></div>
        <div><label :class="lbl">Address (EN)</label><input v-model="contact.addressEn" :class="inp" /></div>
        <div><label :class="lbl">Address (HE)</label><input v-model="contact.addressHe" :class="inp" dir="rtl" /></div>
        <div><label :class="lbl">Free-shipping threshold ₪</label><input v-model.number="s.shippingThreshold" type="number" :class="inp" /></div>
        <div><label :class="lbl">Shipping fee ₪</label><input v-model.number="s.shippingFee" type="number" :class="inp" /></div>
      </div>
      <div class="mt-3 grid gap-3 sm:grid-cols-2">
        <div><label :class="lbl">Footer blurb (EN)</label><textarea :value="biln(s, 'footerBlurb').en" @input="s.footerBlurb.en = ($event.target as HTMLInputElement).value" rows="2" :class="inp" /></div>
        <div><label :class="lbl">Footer blurb (HE)</label><textarea :value="biln(s, 'footerBlurb').he" @input="s.footerBlurb.he = ($event.target as HTMLInputElement).value" rows="2" :class="inp" dir="rtl" /></div>
      </div>
    </Panel>

    <Panel title="Branches" desc="Stores shown on the Stores page and pickup options at checkout.">
      <template #actions><button @click="addStore" class="h-9 rounded-sm bg-pine-700 px-3 text-sm text-cream-100 hover:bg-amber-600 hover:text-pine-950">+ Add branch</button></template>
      <div class="flex flex-col gap-3">
        <div v-for="(st, i) in stores" :key="i" class="rounded-sm border border-hair p-3">
          <div class="grid gap-3 sm:grid-cols-3">
            <div><label :class="lbl">Name (EN)</label><input v-model="st.name" :class="inp" /></div>
            <div><label :class="lbl">Name (HE)</label><input v-model="st.he" :class="inp" dir="rtl" /></div>
            <div><label :class="lbl">Phone</label><input v-model="st.phone" :class="inp" dir="ltr" /></div>
            <div class="sm:col-span-2"><label :class="lbl">Address</label><input v-model="st.addr" :class="inp" /></div>
            <div><label :class="lbl">Hours (EN)</label><input :value="biln(st, 'hours').en" @input="st.hours.en = ($event.target as HTMLInputElement).value" :class="inp" /></div>
          </div>
          <div class="mt-2 flex justify-end"><button @click="removeStore(i)" class="text-[13px] text-red-500">Remove branch</button></div>
        </div>
        <p v-if="!stores.length" class="py-6 text-center text-ink-500">No branches yet.</p>
      </div>
    </Panel>
  </div>
</template>
