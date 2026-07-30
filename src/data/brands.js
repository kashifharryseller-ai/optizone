// OPTIZONE — featured house brands.
// Structural (image assets live in code, like NAV), so it's defined here rather
// than in the editable content tree. Each tile links into the catalog for the
// brand's primary category. `kind` drives the small eyewear/contacts tag and the
// landing category. Imagery: premium studio shots on the brand pine + amber
// palette (generated to a single cohesive art direction).
export const BRAND_TILES = [
  { name: 'Tom Ford',        img: '/brands/tomford.webp',      kind: 'eyewear',  cat: 'sunglasses' },
  { name: 'Ray-Ban',         img: '/brands/rayban.webp',       kind: 'eyewear',  cat: 'sunglasses' },
  { name: 'Tommy Hilfiger',  img: '/brands/tommy.webp',        kind: 'eyewear',  cat: 'eyeglasses' },
  { name: 'Guess',           img: '/brands/guess.webp',        kind: 'eyewear',  cat: 'sunglasses' },
  { name: 'Carrera',         img: '/brands/carrera.webp',      kind: 'eyewear',  cat: 'sunglasses' },
  { name: 'Boss',            img: '/brands/boss.webp',         kind: 'eyewear',  cat: 'eyeglasses' },
  { name: 'Gant',            img: '/brands/gant.webp',         kind: 'eyewear',  cat: 'eyeglasses' },
  { name: 'Alvero',          img: '/brands/alvero.webp',       kind: 'eyewear',  cat: 'eyeglasses' },
  { name: 'Johnson & Johnson', img: '/brands/jj.webp',         kind: 'contacts', cat: 'contacts' },
  { name: 'CooperVision',    img: '/brands/coopervision.webp', kind: 'contacts', cat: 'contacts' },
]

// Localised chrome for the brand sections. Inline {en,he,ar} so RTL + Arabic
// work through L() with no i18n-table edits.
export const BRAND_COPY = {
  eyebrow: { en: 'The houses we carry', he: 'המותגים שאנחנו מייצגים', ar: 'دور الأزياء التي نقدّمها' },
  title:   { en: 'Iconic brands, expertly fitted', he: 'מותגי יוקרה, בהתאמה מדויקת', ar: 'علامات أيقونية، بمقاس محترف' },
  sub:     { en: 'From timeless icons to modern statements — every frame fitted and finished in-store.', he: 'מאייקונים על-זמניים ועד סטייטמנטים מודרניים — כל מסגרת מותאמת ומוגמרת בחנות.', ar: 'من الأيقونات الخالدة إلى الإطلالات العصرية — كل إطار يُركّب ويُنهى في المتجر.' },
  eyewear: { en: 'Eyewear & Sunglasses', he: 'משקפי ראייה ושמש', ar: 'نظارات طبية وشمسية' },
  contacts:{ en: 'Contact Lenses', he: 'עדשות מגע', ar: 'عدسات لاصقة' },
  explore: { en: 'Explore', he: 'לצפייה', ar: 'استكشف' },
}
