// OPTIZONE — canonical default content used to seed the store on first run.
// This is the server-side source of truth; the admin panel edits copies of it,
// and the storefront renders whatever the API returns.

function defaultContent() {
  return {
    announcement: {
      enabled: true,
      en: 'Free shipping over ₪400 · Complete your fitting in any branch',
      he: 'משלוח חינם מעל ₪400 · השלמת התאמה בכל סניף',
    },

    hero: {
      eyebrow: { en: 'New · 2026 Collection', he: 'חדש · קולקציית 2026' },
      titleA: { en: 'See the world', he: 'לראות את העולם' },
      titleB: { en: 'in ', he: '' },
      titleC: { en: 'style', he: 'בסטייל' },
      subtitle: {
        en: 'Handcrafted frames, expertly fitted. Try any pair on with Try Mirror before you buy — no card needed to reserve.',
        he: 'מסגרות בעבודת יד, מותאמות במומחיות. מדדו כל זוג עם Try Mirror לפני הקנייה — ללא צורך בכרטיס לשריון.',
      },
      ctaShop: { en: 'Shop Frames', he: 'לקולקציית המסגרות' },
      ctaBook: { en: 'Book an Exam', he: 'קביעת תור לבדיקה' },
      trusted: { en: 'Trusted since 2009', he: 'אמינים מאז 2009' },
      slot: { en: 'Drop your hero photo here', he: 'גררו לכאן תמונת קאבר' },
      tryReady: { en: 'Try Mirror ready', he: 'מוכן ל-Try Mirror' },
    },

    sections: {
      services: { eyebrow: { en: 'What we do', he: 'מה אנחנו עושים' }, title: { en: 'Complete eye care, beautifully done', he: 'כל שירותי העיניים, במקום אחד' } },
      categories: { eyebrow: { en: 'Categories', he: 'קטגוריות' }, title: { en: 'Shop by category', he: 'קנייה לפי קטגוריה' } },
      bestsellers: { eyebrow: { en: 'Bestsellers', he: 'הנמכרים ביותר' }, title: { en: 'Frames of the season', he: 'מסגרות העונה' }, viewall: { en: 'View all', he: 'לכל הקולקציה' } },
      tryMirror: {
        eyebrow: { en: 'Try Mirror', he: 'Try Mirror' },
        title: { en: 'Try them on from home', he: 'מודדים מהבית' },
        subtitle: { en: 'Live, on-device virtual try-on. Compare frames side by side, save your looks, and share to WhatsApp. Nothing is stored.', he: 'מדידה וירטואלית חיה, במכשיר שלכם. השוו מסגרות זו לצד זו, שמרו לוקים ושתפו בוואטסאפ. שום דבר לא נשמר.' },
        cta: { en: 'Start Try Mirror', he: 'נסו עכשיו' },
      },
    },

    services: [
      { icon: 'eye', title: { en: 'Eye Exams', he: 'בדיקות ראייה' }, desc: { en: 'Comprehensive vision tests with our optometrists.', he: 'בדיקות ראייה מקיפות אצל האופטומטריסטים שלנו.' } },
      { icon: 'glasses', title: { en: 'Prescription & Sun', he: 'משקפי ראייה ושמש' }, desc: { en: 'Frames fitted to your face and prescription.', he: 'מסגרות מותאמות לפנים ולמרשם שלך.' } },
      { icon: 'circle-dot', title: { en: 'Contact Lenses', he: 'עדשות מגע' }, desc: { en: 'Soft, multifocal and specialty lenses.', he: 'עדשות רכות, מולטיפוקל ועדשות מיוחדות.' } },
      { icon: 'target', title: { en: 'Myopia Control', he: 'שליטה בקוצר ראייה' }, desc: { en: 'Slowing progression for children and teens.', he: 'האטת התקדמות קוצר ראייה בילדים ובני נוער.' } },
      { icon: 'layers', title: { en: 'Multifocal Experts', he: 'מומחים למולטיפוקל' }, desc: { en: 'Progressive lenses done right.', he: 'עדשות פרוגרסיביות, בהתאמה מדויקת.' } },
      { icon: 'shield-check', title: { en: 'Keratoconus Care', he: 'טיפול בקרטוקונוס' }, desc: { en: 'Specialty fitting for irregular corneas.', he: 'התאמה מיוחדת לקרנית לא סדירה.' } },
    ],

    categories: [
      { key: 'eyeglasses', label: { en: 'Eyeglasses', he: 'משקפי ראייה' }, slot: { en: 'Drop eyeglasses photo', he: 'גררו תמונה' } },
      { key: 'sunglasses', label: { en: 'Sunglasses', he: 'משקפי שמש' }, slot: { en: 'Drop sunglasses photo', he: 'גררו תמונה' } },
      { key: 'contacts', label: { en: 'Contact Lenses', he: 'עדשות מגע' }, slot: { en: 'Drop contact-lens photo', he: 'גררו תמונה' } },
    ],

    // Catalog is built around the houses OPTIZONE carries. Product names are
    // descriptive (no counterfeit logos); imagery is a cohesive studio set.
    // he/ar for badge labels ship inline; PDP copy is English and auto-translated.
    products: [
      // Tom Ford
      { id: 1, category: 'sunglasses', brand: 'Tom Ford', name: 'Nadia Oversized', amount: 1290, original: 0, rating: 4.5, reviews: 34, badge: { variant: 'bestseller', label: { en: 'Bestseller', he: 'רב מכר' } }, tryMirror: true, colors: ['#1A1A17', '#C9A227'], shape: 'Square', material: 'Acetate', gender: 'Women', image: '/products/tomford-square-sun.webp' },
      { id: 2, category: 'eyeglasses', brand: 'Tom Ford', name: 'Jensen Optical', amount: 1150, original: 0, rating: 5, reviews: 21, badge: { variant: 'new', label: { en: 'New', he: 'חדש' } }, tryMirror: true, colors: ['#6B4423', '#1A1A17'], shape: 'Rectangle', material: 'Acetate', gender: 'Men', image: '/products/tomford-havana-optical.webp' },
      { id: 3, category: 'sunglasses', brand: 'Tom Ford', name: 'Marko Aviator', amount: 1190, original: 1390, rating: 4.5, reviews: 40, badge: { variant: 'sale', label: { en: 'Sale', he: 'מבצע' } }, tryMirror: true, colors: ['#C9A227', '#3A342A'], shape: 'Aviator', material: 'Metal', gender: 'Men', image: '/products/tomford-aviator-sun.webp' },
      // Ray-Ban
      { id: 4, category: 'sunglasses', brand: 'Ray-Ban', name: 'Aviator Classic', amount: 520, original: 620, rating: 5, reviews: 214, badge: { variant: 'sale', label: { en: 'Sale', he: 'מבצע' } }, tryMirror: true, colors: ['#C9A227', '#2E4034'], shape: 'Aviator', material: 'Metal', gender: 'Unisex', image: '/products/rayban-aviator-sun.webp' },
      // Try-on demo (see TRYON_NOTES.md): black variant wired to a placeholder 3D
      // frame so the engine can be seen working; replace with a real per-colour .glb.
      { id: 5, category: 'sunglasses', brand: 'Ray-Ban', name: 'Wayfarer Original', amount: 480, original: 0, rating: 4.5, reviews: 189, badge: { variant: 'bestseller', label: { en: 'Bestseller', he: 'רב מכר' } }, tryMirror: true, colors: ['#1A1A17', '#2E4034'], shape: 'Square', material: 'Acetate', gender: 'Unisex', image: '/products/rayban-wayfarer.webp', tryMirrorModel: { '#1A1A17': '/tryon/models/demo-frame.glb' }, tryMirrorMeta: { modelForwardAxis: 'z', scaleMultiplier: 1.0, bridgeYOffset: 0, frameRealWidthMm: 140 } },
      { id: 6, category: 'eyeglasses', brand: 'Ray-Ban', name: 'Round Metal Optical', amount: 420, original: 490, rating: 4.5, reviews: 128, badge: { variant: 'sale', label: { en: 'Sale', he: 'מבצע' } }, tryMirror: true, colors: ['#4A4E52', '#1A1A17'], shape: 'Round', material: 'Metal', gender: 'Unisex', image: '/products/rayban-round-optical.webp' },
      // Tommy Hilfiger
      { id: 7, category: 'eyeglasses', brand: 'Tommy Hilfiger', name: 'TH Rectangular Optical', amount: 390, original: 0, rating: 4.5, reviews: 76, badge: null, tryMirror: true, colors: ['#1E2A44', '#B22234'], shape: 'Rectangle', material: 'Acetate', gender: 'Men', image: '/products/tommy-rect-optical.webp' },
      { id: 8, category: 'sunglasses', brand: 'Tommy Hilfiger', name: 'TH Pilot', amount: 430, original: 0, rating: 4, reviews: 52, badge: { variant: 'new', label: { en: 'New', he: 'חדש' } }, tryMirror: true, colors: ['#9AA0A6', '#1E2A44'], shape: 'Aviator', material: 'Metal', gender: 'Men', image: '/products/tommy-pilot-sun.webp' },
      { id: 9, category: 'eyeglasses', brand: 'Tommy Hilfiger', name: 'TH Round Optical', amount: 360, original: 0, rating: 4, reviews: 41, badge: null, tryMirror: true, colors: ['#6B4423', '#C9A227'], shape: 'Round', material: 'Acetate', gender: 'Women', image: '/products/tommy-round-optical.webp' },
      // Guess
      { id: 10, category: 'sunglasses', brand: 'Guess', name: 'Guess Cat-Eye', amount: 410, original: 0, rating: 4.5, reviews: 63, badge: { variant: 'new', label: { en: 'New', he: 'חדש' } }, tryMirror: true, colors: ['#6B4423', '#C9A227'], shape: 'Cat-eye', material: 'Acetate', gender: 'Women', image: '/products/guess-cateye-sun.webp' },
      { id: 11, category: 'sunglasses', brand: 'Guess', name: 'Guess Oversized', amount: 390, original: 460, rating: 4, reviews: 38, badge: { variant: 'sale', label: { en: 'Sale', he: 'מבצע' } }, tryMirror: true, colors: ['#1A1A17', '#C9A227'], shape: 'Square', material: 'Acetate', gender: 'Women', image: '/products/guess-oversized-sun.webp' },
      { id: 12, category: 'eyeglasses', brand: 'Guess', name: 'Guess Optical', amount: 340, original: 0, rating: 4, reviews: 27, badge: null, tryMirror: true, colors: ['#5E2028', '#C9A227'], shape: 'Cat-eye', material: 'Acetate', gender: 'Women', image: '/products/guess-burgundy-optical.webp' },
      // Carrera
      { id: 13, category: 'sunglasses', brand: 'Carrera', name: 'Carrera Sport Wrap', amount: 380, original: 0, rating: 4.5, reviews: 88, badge: { variant: 'bestseller', label: { en: 'Bestseller', he: 'רב מכר' } }, tryMirror: true, colors: ['#1A1A17', '#2A2A2A'], shape: 'Wraparound', material: 'Nylon', gender: 'Men', image: '/products/carrera-sport-sun.webp' },
      { id: 14, category: 'sunglasses', brand: 'Carrera', name: 'Carrera Pilot', amount: 360, original: 420, rating: 4, reviews: 55, badge: { variant: 'sale', label: { en: 'Sale', he: 'מבצע' } }, tryMirror: true, colors: ['#C9A227', '#3A342A'], shape: 'Aviator', material: 'Metal', gender: 'Unisex', image: '/products/carrera-pilot-sun.webp' },
      { id: 15, category: 'eyeglasses', brand: 'Carrera', name: 'Carrera Optical', amount: 320, original: 0, rating: 4, reviews: 33, badge: null, tryMirror: true, colors: ['#4A4E52', '#1A1A17'], shape: 'Rectangle', material: 'Acetate', gender: 'Men', image: '/products/carrera-grey-optical.webp' },
      // Boss
      { id: 16, category: 'eyeglasses', brand: 'Boss', name: 'BOSS Titanium', amount: 520, original: 0, rating: 5, reviews: 47, badge: { variant: 'bestseller', label: { en: 'Bestseller', he: 'רב מכר' } }, tryMirror: true, colors: ['#4A4E52', '#2A2A2A'], shape: 'Rectangle', material: 'Titanium', gender: 'Men', image: '/products/boss-titanium-optical.webp' },
      { id: 17, category: 'eyeglasses', brand: 'Boss', name: 'BOSS Rimless', amount: 560, original: 0, rating: 4.5, reviews: 29, badge: { variant: 'new', label: { en: 'New', he: 'חדש' } }, tryMirror: true, colors: ['#9AA0A6', '#4A4E52'], shape: 'Rimless', material: 'Titanium', gender: 'Men', image: '/products/boss-rimless-optical.webp' },
      { id: 18, category: 'sunglasses', brand: 'Boss', name: 'BOSS Pilot', amount: 470, original: 0, rating: 4.5, reviews: 44, badge: null, tryMirror: true, colors: ['#3A342A', '#C9A227'], shape: 'Aviator', material: 'Metal', gender: 'Men', image: '/products/boss-pilot-sun.webp' },
      // Gant
      { id: 19, category: 'eyeglasses', brand: 'Gant', name: 'GANT Round', amount: 300, original: 0, rating: 4, reviews: 22, badge: null, tryMirror: true, colors: ['#6B4423', '#3A342A'], shape: 'Round', material: 'Acetate', gender: 'Unisex', image: '/products/gant-round-optical.webp' },
      { id: 20, category: 'eyeglasses', brand: 'Gant', name: 'GANT Rectangular', amount: 290, original: 340, rating: 4, reviews: 19, badge: { variant: 'sale', label: { en: 'Sale', he: 'מבצע' } }, tryMirror: true, colors: ['#5A3A22', '#1A1A17'], shape: 'Rectangle', material: 'Acetate', gender: 'Men', image: '/products/gant-rect-optical.webp' },
      { id: 21, category: 'sunglasses', brand: 'Gant', name: 'GANT Browline', amount: 340, original: 0, rating: 4.5, reviews: 31, badge: { variant: 'new', label: { en: 'New', he: 'חדש' } }, tryMirror: true, colors: ['#6B4423', '#C9A227'], shape: 'Browline', material: 'Metal', gender: 'Men', image: '/products/gant-clubmaster-sun.webp' },
      // Alvero
      { id: 22, category: 'eyeglasses', brand: 'Alvero', name: 'Alvero Rose-Gold', amount: 330, original: 0, rating: 4.5, reviews: 26, badge: { variant: 'new', label: { en: 'New', he: 'חדש' } }, tryMirror: true, colors: ['#B76E79', '#C9A227'], shape: 'Rectangle', material: 'Metal', gender: 'Women', image: '/products/alvero-semirimless-optical.webp' },
      { id: 23, category: 'eyeglasses', brand: 'Alvero', name: 'Alvero Cat-Eye', amount: 310, original: 0, rating: 4, reviews: 18, badge: null, tryMirror: true, colors: ['#C9822A', '#6B4423'], shape: 'Cat-eye', material: 'Acetate', gender: 'Women', image: '/products/alvero-cateye-optical.webp' },
      { id: 24, category: 'sunglasses', brand: 'Alvero', name: 'Alvero Aviator', amount: 350, original: 0, rating: 4, reviews: 24, badge: null, tryMirror: true, colors: ['#8C6A3F', '#3A342A'], shape: 'Aviator', material: 'Metal', gender: 'Unisex', image: '/products/alvero-aviator-sun.webp' },
      // Johnson & Johnson (contact lenses)
      { id: 25, category: 'contacts', brand: 'Johnson & Johnson', name: '1-Day Moist · 30 pack', amount: 170, original: 0, rating: 4.5, reviews: 210, badge: { variant: 'bestseller', label: { en: 'Bestseller', he: 'רב מכר' } }, tryMirror: false, colors: [], shape: 'Daily', material: 'Silicone Hydrogel', gender: 'Unisex', image: '/products/jj-daily-30.webp' },
      { id: 26, category: 'contacts', brand: 'Johnson & Johnson', name: 'Oasys · 6 pack', amount: 150, original: 0, rating: 4.5, reviews: 320, badge: null, tryMirror: false, colors: [], shape: 'Bi-weekly', material: 'Silicone Hydrogel', gender: 'Unisex', image: '/products/jj-biweekly-6.webp' },
      // CooperVision (contact lenses)
      { id: 27, category: 'contacts', brand: 'CooperVision', name: 'Biofinity Monthly · 6 pack', amount: 165, original: 0, rating: 4, reviews: 141, badge: null, tryMirror: false, colors: [], shape: 'Monthly', material: 'Silicone Hydrogel', gender: 'Unisex', image: '/products/coopervision-monthly-6.webp' },
      { id: 28, category: 'contacts', brand: 'CooperVision', name: 'MyDay · 30 pack', amount: 210, original: 0, rating: 4.5, reviews: 96, badge: { variant: 'new', label: { en: 'New', he: 'חדש' } }, tryMirror: false, colors: [], shape: 'Daily', material: 'Water Gradient', gender: 'Unisex', image: '/products/coopervision-daily-30.webp' },
    ],

    // Editable header for each category page (title + subtitle, bilingual).
    categoryPages: {
      eyeglasses: {
        title: { en: 'Eyeglasses', he: 'משקפי ראייה' },
        subtitle: { en: 'Prescription-ready frames, hand-finished and fitted to you.', he: 'מסגרות מוכנות למרשם, בגימור ידני ובהתאמה אישית.' },
      },
      sunglasses: {
        title: { en: 'Sunglasses', he: 'משקפי שמש' },
        subtitle: { en: 'Full UV protection with signature style.', he: 'הגנת UV מלאה עם סטייל ייחודי.' },
      },
      contacts: {
        title: { en: 'Contact Lenses', he: 'עדשות מגע' },
        subtitle: { en: 'Daily, bi-weekly and monthly lenses from leading labs.', he: 'עדשות יומיות, דו-שבועיות וחודשיות מהמעבדות המובילות.' },
      },
    },

    filters: {
      'Frame Shape': ['Aviator', 'Square', 'Round', 'Cat-eye', 'Rectangle', 'Browline', 'Rimless', 'Wraparound'],
      Material: ['Acetate', 'Metal', 'Titanium', 'Nylon'],
      Gender: ['Women', 'Men', 'Unisex', 'Kids'],
    },

    brands: ['Tom Ford', 'Ray-Ban', 'Tommy Hilfiger', 'Guess', 'Carrera', 'Boss', 'Gant', 'Alvero', 'Johnson & Johnson', 'CooperVision'],

    bookingServices: [
      { en: 'Eye Exam', he: 'בדיקת ראייה' },
      { en: 'Frame Fitting', he: 'התאמת מסגרת' },
      { en: 'Contact-Lens Fitting', he: 'התאמת עדשות מגע' },
      { en: "Kids' Eye Test", he: 'בדיקת ראייה לילדים' },
    ],

    slots: ['09:00', '10:30', '12:00', '13:30', '15:00', '16:30', '18:00'],

    popularSearches: [
      { en: 'Ray-Ban', he: 'ריי-באן' },
      { en: 'Tom Ford', he: 'טום פורד' },
      { en: 'Carrera', he: 'קררה' },
      { en: 'Sunglasses', he: 'משקפי שמש' },
      { en: 'Contact lenses', he: 'עדשות מגע' },
      { en: 'Titanium frames', he: 'מסגרות טיטניום' },
    ],

    stores: [
      { name: 'Netanya', he: 'נתניה', addr: 'השלים 12, נתניה', phone: '058-644-2303', hours: { en: 'Sun–Thu 09:00–19:00 · Fri 09:00–14:00', he: 'א׳–ה׳ 09:00–19:00 · ו׳ 09:00–14:00' }, services: ['Eye Exams', 'Try Mirror', 'Contact Lenses'], x: 34, y: 46 },
      { name: 'Tel Aviv', he: 'תל אביב', addr: 'דיזנגוף 210, תל אביב', phone: '03-521-8890', hours: { en: 'Sun–Thu 10:00–21:00 · Fri 10:00–15:00', he: 'א׳–ה׳ 10:00–21:00 · ו׳ 10:00–15:00' }, services: ['Eye Exams', 'Frame Fitting', 'Multifocal'], x: 30, y: 58 },
      { name: 'Haifa', he: 'חיפה', addr: 'הנשיא 8, חיפה', phone: '04-810-4471', hours: { en: 'Sun–Thu 09:00–19:00 · Fri 09:00–13:30', he: 'א׳–ה׳ 09:00–19:00 · ו׳ 09:00–13:30' }, services: ['Eye Exams', 'Keratoconus', 'Myopia Control'], x: 40, y: 30 },
    ],

    settings: {
      brandName: 'OPTIZONE',
      contact: { addressEn: 'Ha-Shlmim 12, Netanya', addressHe: 'השלים 12, נתניה', phone: '058-644-2303', site: 'www.optizone.co.il', email: 'hello@optizone.co.il' },
      footerBlurb: { en: 'Premium eyewear & eye care. Try any frame on before you buy.', he: 'משקפיים ושירותי ראייה פרימיום. מדדו כל מסגרת לפני שאתם קונים.' },
      shippingThreshold: 400,
      shippingFee: 30,
    },

    media: { 'hero-photo': '/site/hero-photo.jpg', 'cat-eyeglasses': '/site/cat-eyeglasses.jpg', 'cat-sunglasses': '/site/cat-sunglasses.jpg', 'cat-contacts': '/site/cat-contacts.jpg' },
    mediaAlt: {},   // per-image bilingual alt text ({ id: {en,he} })
  }
}

// Per-product PDP content (rich description + structured specs), editable in
// Admin → Products. Keyed by product id; merged into existing stores by
// migrateContent so every product ships with unique, professional copy.
// English source copy; Hebrew + Arabic are auto-translated on the server and
// cached (see server/translate.js). Keyed by product id.
function productDetails() {
  const spec = (lensWidth, bridge, temple, weight, lensOpts) => ({ lensWidth, bridge, temple, weight, lensOpts: { en: lensOpts } })
  const d = (en) => ({ desc: { en } })
  return {
    1: { ...d('The Tom Ford Nadia is an oversized square statement carved from thick, glossy black acetate, with slim gold-tone metal accents at the temples and a soft green gradient lens. Generous coverage and a confident silhouette flatter medium to wide faces — red-carpet presence for everyday wear.'), specs: spec('55 mm', '18 mm', '140 mm', '36 g', 'Gradient · Polarized · Prescription sun') },
    2: { ...d('Hand-finished in rich havana tortoiseshell acetate, the Tom Ford Jensen is a refined rectangular optical frame with subtle gold rivet detailing and a deep, warm gloss. Balanced proportions and sprung hinges make it an easy all-day companion that takes prescription lenses beautifully.'), specs: spec('52 mm', '19 mm', '145 mm', '31 g', 'Single-vision · Progressive · Blue-light') },
    3: { ...d('The Tom Ford Marko is a classic double-bridge pilot in polished gold metal with brown gradient lenses and sculpted temple tips. Featherlight yet substantial, it delivers full UVA/UVB protection with unmistakable luxury character.'), specs: spec('58 mm', '14 mm', '140 mm', '33 g', 'Gradient · Polarized · Prescription sun') },
    4: { ...d('The original pilot’s sunglass, reborn. Teardrop lenses block 100% UVA/UVB in a featherweight gold-tone frame with G-15 green lenses and bayonet temples that slide cleanly under a cap or headset. A timeless icon that suits almost every face.'), specs: spec('58 mm', '14 mm', '135 mm', '31 g', 'G-15 · Gradient · Polarized · Prescription sun') },
    5: { ...d('The frame that defined a generation. Glossy black acetate, dark green crystal lenses and a bold trapezoidal front give the Wayfarer its unmistakable stance. 100% UV protection and a comfortable, secure fit make it the everyday go-to — and it looks just as good with prescription lenses.'), specs: spec('52 mm', '18 mm', '145 mm', '30 g', 'Crystal · Gradient · Polarized · Prescription sun') },
    6: { ...d('A tribute to the counter-culture icons of the 1960s. Fully round lenses sit in a feather-light gunmetal chassis with adjustable nose pads and a slender keyhole bridge. A timeless choice that suits narrow and mid-width faces and takes prescription lenses effortlessly.'), specs: spec('50 mm', '21 mm', '145 mm', '24 g', 'Single-vision · Progressive · Blue-light') },
    7: { ...d('A modern rectangular optical frame in deep navy-blue acetate, finished with the house’s signature red-and-white stripe along the temple. Clean lines and a comfortable medium fit make it a sharp, versatile everyday choice for work and weekends alike.'), specs: spec('53 mm', '17 mm', '145 mm', '28 g', 'Single-vision · Progressive · Blue-light') },
    8: { ...d('A refined pilot in brushed silver metal with cool blue gradient lenses. Lightweight, double-bridge construction and adjustable nose pads deliver a precise fit and full UV protection — sporty polish with a preppy edge.'), specs: spec('57 mm', '15 mm', '140 mm', '30 g', 'Gradient · Polarized · Prescription sun') },
    9: { ...d('A warm, approachable round optical frame in tortoiseshell acetate with a slim gold temple accent. Soft curves and a light build make it easy to wear all day, flattering to most face shapes and ready for any prescription.'), specs: spec('49 mm', '20 mm', '140 mm', '26 g', 'Single-vision · Progressive · Blue-light') },
    10: { ...d('A glamorous cat-eye in honey tortoiseshell acetate with gold metal temple detailing and brown gradient lenses. The upswept silhouette lifts the face and turns heads, while full UV protection keeps eyes safe in the sun.'), specs: spec('54 mm', '17 mm', '140 mm', '29 g', 'Gradient · Polarized · Prescription sun') },
    11: { ...d('An oversized square sunglass in glossy black acetate with a decorative gold temple accent and smooth grey gradient lenses. Bold coverage, a fashion-forward stance and 100% UV protection — a confident finishing touch to any look.'), specs: spec('55 mm', '18 mm', '140 mm', '34 g', 'Gradient · Polarized · Prescription sun') },
    12: { ...d('A striking cat-eye optical frame in glossy burgundy acetate with a slim gold temple accent. Feminine lines and a comfortable fit make it a distinctive everyday frame that pairs effortlessly with any prescription.'), specs: spec('52 mm', '16 mm', '140 mm', '28 g', 'Single-vision · Progressive · Blue-light') },
    13: { ...d('A sporty wraparound in matte black with bold thick temples and a subtle rubberized finish. Built for movement, it stays put during activity and delivers full-coverage smoke lenses with 100% UV protection — racing attitude, everyday durability.'), specs: spec('62 mm', '13 mm', '125 mm', '28 g', 'Smoke · Polarized · Mirror') },
    14: { ...d('A double-bridge pilot in warm gold metal with brown lenses and bold sporty temples. Lightweight and confident, it balances heritage aviator lines with a modern, athletic edge and full UV protection.'), specs: spec('60 mm', '14 mm', '140 mm', '31 g', 'Gradient · Polarized · Prescription sun') },
    15: { ...d('A rectangular optical frame in matte transparent smoke-grey acetate with bold sporty temples. Understated but modern, its light build and neutral tone make it an easy everyday frame for any prescription.'), specs: spec('54 mm', '16 mm', '145 mm', '27 g', 'Single-vision · Progressive · Blue-light') },
    16: { ...d('A refined minimalist rectangular frame in brushed gunmetal titanium — light, hypoallergenic and virtually indestructible. Thin, sophisticated lines make it the executive’s choice, comfortable through the longest days and ready for any prescription.'), specs: spec('54 mm', '17 mm', '145 mm', '18 g', 'Single-vision · Progressive · Blue-light') },
    17: { ...d('An elegant rimless optical frame in polished silver titanium, where lightweight strength meets near-invisible styling. With no rims to distract, the focus stays on you — a quietly premium choice that disappears on the face.'), specs: spec('53 mm', '18 mm', '145 mm', '15 g', 'Single-vision · Progressive · Blue-light') },
    18: { ...d('A sophisticated pilot in gold-brown metal with brown gradient lenses and slim temples. Executive polish meets full UV protection in a lightweight frame that flatters and performs from boardroom to boulevard.'), specs: spec('59 mm', '15 mm', '145 mm', '30 g', 'Gradient · Polarized · Prescription sun') },
    19: { ...d('A classic round optical frame in warm tortoiseshell acetate with a keyhole bridge and understated American-heritage character. Light, comfortable and endlessly versatile, it suits most faces and any prescription.'), specs: spec('49 mm', '21 mm', '145 mm', '25 g', 'Single-vision · Progressive · Blue-light') },
    20: { ...d('A clean rectangular optical frame in warm chestnut-brown acetate. Understated and preppy, its balanced proportions and light build make it a dependable everyday frame that works with any prescription.'), specs: spec('53 mm', '17 mm', '145 mm', '27 g', 'Single-vision · Progressive · Blue-light') },
    21: { ...d('A browline sunglass with a tortoiseshell brow, gold metal lower rim and dark green lenses. Retro-intellectual character meets full UV protection — a heritage silhouette that never goes out of style.'), specs: spec('51 mm', '19 mm', '145 mm', '28 g', 'Green · Gradient · Prescription sun') },
    22: { ...d('An elegant semi-rimless optical frame in warm rose-gold metal with soft amber-tinted lenses. Refined and contemporary, its delicate build and warm tone flatter the face while taking any prescription with ease.'), specs: spec('52 mm', '17 mm', '140 mm', '20 g', 'Single-vision · Progressive · Blue-light') },
    23: { ...d('A modern cat-eye optical frame in translucent amber acetate with slim gold temples. Warm, luminous and light on the face, it brings a contemporary lift to any look and any prescription.'), specs: spec('51 mm', '16 mm', '140 mm', '26 g', 'Single-vision · Progressive · Blue-light') },
    24: { ...d('A modern aviator in brushed bronze metal with amber-brown gradient lenses. Warm-toned and lightweight, it softens the classic pilot silhouette with a contemporary finish and full UV protection.'), specs: spec('58 mm', '14 mm', '140 mm', '29 g', 'Gradient · Polarized · Prescription sun') },
    25: { ...d('Premium 1-day contact lenses that stay fresh and comfortable from morning to night, then get thrown away — no cleaning, no cases. A smooth, moisture-rich surface and Class-1 UV blocking keep eyes bright through long, screen-heavy days. Thirty single-use lenses per box.'), specs: spec('14.2 mm diameter', '8.5 base curve', '—', '58% water', 'Spherical · Astigmatism · Multifocal') },
    26: { ...d('Bi-weekly lenses engineered for demanding, screen-heavy environments. A silky wetting technology woven through the material and Class-1 UV blocking — the highest available in a contact lens — make dry, tired eyes a rarity. Six lenses per box.'), specs: spec('14.0 mm diameter', '8.4 base curve', '—', '38% water', 'Spherical · Astigmatism · Multifocal') },
    27: { ...d('Naturally wettable monthly lenses that lock moisture into a breathable silicone hydrogel — no surface treatments, no additives. High oxygen transmissibility keeps eyes white and healthy across a full month of daily wear, at an everyday price. Six lenses per box.'), specs: spec('14.0 mm diameter', '8.6 base curve', '—', '48% water', 'Spherical · Toric · Multifocal') },
    28: { ...d('Smart-material daily lenses that adapt to your eyes, balancing moisture and oxygen for effortless all-day comfort. Ultra-thin edges make them easy to forget you’re wearing — then simply throw the pair away. Thirty single-use lenses per box.'), specs: spec('14.2 mm diameter', '8.4 base curve', '—', '54% water gradient', 'Spherical · Toric · Multifocal') },
  }
}

module.exports = { defaultContent, productDetails }
