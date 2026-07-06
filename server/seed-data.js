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

    products: [
      { id: 1, category: 'eyeglasses', brand: 'Ray-Ban', name: 'Round Metal RB3447', amount: 390, original: 490, rating: 4.5, reviews: 128, badge: { variant: 'sale', label: { en: 'Sale', he: 'מבצע' } }, tryMirror: true, colors: ['#22402F', '#3A342A', '#E08A2A'], shape: 'Round', material: 'Metal', gender: 'Unisex', image: '/products/rayban-rb3447-round.jpg' },
      { id: 2, category: 'eyeglasses', brand: 'Persol', name: 'PO3092 Havana', amount: 720, original: 0, rating: 5, reviews: 64, badge: { variant: 'new', label: { en: 'New', he: 'חדש' } }, tryMirror: true, colors: ['#6B4423', '#1A1A17'], shape: 'Square', material: 'Acetate', gender: 'Men', image: '/products/persol-po3092-havana.jpg' },
      // Try-on assets demo (see TRYON_NOTES.md): the black variant is wired to a
      // placeholder 3D frame so the engine can be seen working; the brown variant
      // has no asset yet and falls back to the drawn frame. Replace demo-frame
      // with real per-colour .glb models (and/or transparent PNGs in tryMirrorImg).
      { id: 3, category: 'eyeglasses', brand: 'Prada', name: 'PR 17WS Symbole', amount: 1290, original: 0, rating: 4.5, reviews: 41, badge: { variant: 'bestseller', label: { en: 'Bestseller', he: 'רב מכר' } }, tryMirror: true, colors: ['#1A1A17', '#7E4310'], shape: 'Cat-eye', material: 'Acetate', gender: 'Women', image: '/products/prada-17ws-cateye.jpg', tryMirrorModel: { '#1A1A17': '/tryon/models/demo-frame.glb' }, tryMirrorMeta: { modelForwardAxis: 'z', scaleMultiplier: 1.0, bridgeYOffset: 0, frameRealWidthMm: 118 } },
      { id: 4, category: 'eyeglasses', brand: 'Tiffany & Co.', name: 'TF2233B', amount: 980, original: 0, rating: 4, reviews: 22, badge: null, tryMirror: false, colors: ['#22402F', '#B4CEC0'], shape: 'Oval', material: 'Metal', gender: 'Women', image: '/products/tiffany-tf2233b-oval.jpg' },
      { id: 5, category: 'eyeglasses', brand: 'Versace', name: 'VE4361 Medusa', amount: 860, original: 1050, rating: 4.5, reviews: 77, badge: { variant: 'sale', label: { en: 'Sale', he: 'מבצע' } }, tryMirror: true, colors: ['#1A1A17', '#E08A2A'], shape: 'Square', material: 'Acetate', gender: 'Men', image: '/products/versace-ve4361-square.jpg' },
      { id: 6, category: 'eyeglasses', brand: 'Dolce & Gabbana', name: 'DG4416 Print', amount: 690, original: 0, rating: 4, reviews: 18, badge: { variant: 'new', label: { en: 'New', he: 'חדש' } }, tryMirror: true, colors: ['#6B4423', '#3A342A'], shape: 'Round', material: 'Acetate', gender: 'Women', image: '/products/dg-dg4416-round.jpg' },
      { id: 7, category: 'sunglasses', brand: 'Ray-Ban', name: 'Aviator Classic RB3025', amount: 520, original: 620, rating: 4.5, reviews: 214, badge: { variant: 'sale', label: { en: 'Sale', he: 'מבצע' } }, tryMirror: true, colors: ['#3A342A', '#E08A2A'], shape: 'Aviator', material: 'Metal', gender: 'Unisex', image: '/products/rayban-rb3025-aviator.jpg' },
      { id: 8, category: 'sunglasses', brand: 'Persol', name: 'PO0714 Folding', amount: 1150, original: 0, rating: 5, reviews: 89, badge: { variant: 'bestseller', label: { en: 'Bestseller', he: 'רב מכר' } }, tryMirror: true, colors: ['#6B4423', '#1A1A17'], shape: 'Square', material: 'Acetate', gender: 'Men', image: '/products/persol-po0714-fold.jpg' },
      { id: 9, category: 'sunglasses', brand: 'Versace', name: 'VE2199 Shield', amount: 890, original: 0, rating: 4, reviews: 33, badge: { variant: 'new', label: { en: 'New', he: 'חדש' } }, tryMirror: true, colors: ['#1A1A17'], shape: 'Aviator', material: 'Metal', gender: 'Women', image: '/products/versace-ve2199-shield.jpg' },
      { id: 10, category: 'contacts', brand: 'Acuvue', name: 'Oasys · 6 pack', amount: 145, original: 0, rating: 4.5, reviews: 320, badge: { variant: 'bestseller', label: { en: 'Bestseller', he: 'רב מכר' } }, tryMirror: false, colors: [], shape: 'Bi-weekly', material: 'Silicone Hydrogel', gender: 'Unisex', image: '/products/acuvue-oasys-box.jpg' },
      { id: 11, category: 'contacts', brand: 'Dailies', name: 'TOTAL1 · 30 pack', amount: 210, original: 0, rating: 4.5, reviews: 187, badge: { variant: 'new', label: { en: 'New', he: 'חדש' } }, tryMirror: false, colors: [], shape: 'Daily', material: 'Water Gradient', gender: 'Unisex', image: '/products/dailies-total1-box.jpg' },
      { id: 12, category: 'contacts', brand: 'Biofinity', name: 'Monthly · 6 pack', amount: 165, original: 0, rating: 4, reviews: 141, badge: null, tryMirror: false, colors: [], shape: 'Monthly', material: 'Silicone Hydrogel', gender: 'Unisex', image: '/products/biofinity-monthly-box.jpg' },
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
      'Frame Shape': ['Round', 'Square', 'Cat-eye', 'Oval', 'Aviator'],
      Material: ['Acetate', 'Metal', 'Titanium'],
      Gender: ['Women', 'Men', 'Unisex', 'Kids'],
    },

    brands: ['Ray-Ban', 'Prada', 'Versace', 'Dolce & Gabbana', 'Tiffany & Co.', 'Persol', 'Acuvue', 'Dailies', 'Biofinity'],

    bookingServices: [
      { en: 'Eye Exam', he: 'בדיקת ראייה' },
      { en: 'Frame Fitting', he: 'התאמת מסגרת' },
      { en: 'Contact-Lens Fitting', he: 'התאמת עדשות מגע' },
      { en: "Kids' Eye Test", he: 'בדיקת ראייה לילדים' },
    ],

    slots: ['09:00', '10:30', '12:00', '13:30', '15:00', '16:30', '18:00'],

    popularSearches: [
      { en: 'Ray-Ban', he: 'ריי-באן' },
      { en: 'Blue-light glasses', he: 'משקפי סינון אור כחול' },
      { en: 'Sunglasses', he: 'משקפי שמש' },
      { en: 'Progressive lenses', he: 'עדשות פרוגרסיביות' },
      { en: 'Titanium frames', he: 'מסגרות טיטניום' },
      { en: 'Kids', he: 'ילדים' },
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
function productDetails() {
  return {
    1: {
      desc: {
        en: 'The Round Metal RB3447 is Ray-Ban’s tribute to the counter-culture icons of the 1960s. Fully round crystal lenses sit in a feather-light gold-tone metal chassis with adjustable plastic-tipped nose pads and slender temples that curl comfortably behind the ear. A timeless choice that suits narrow and mid-width faces, and takes prescription lenses beautifully.',
        he: 'ה-Round Metal RB3447 הוא מחווה של Ray-Ban לאייקונים של שנות ה-60. עדשות עגולות לחלוטין במסגרת מתכת קלה כנוצה בגוון זהב, עם אפי אף מתכווננים וזרועות דקות שמתעגלות בנוחות מאחורי האוזן. בחירה על-זמנית שמתאימה לפנים צרות ובינוניות ומקבלת עדשות אופטיות בצורה מושלמת.',
      },
      specs: { lensWidth: '50 mm', bridge: '21 mm', temple: '145 mm', weight: '24 g', lensOpts: { en: 'Single-vision · Progressive · Blue-light', he: 'חד-מוקד · פרוגרסיב · סינון אור כחול' } },
    },
    2: {
      desc: {
        en: 'Hand-finished in Italy, the Persol PO3092 wears the house’s celebrated Havana acetate — warm tortoise tones polished to a deep gloss. The Meflecto flexible temple system removes pressure at the sides of the head, while the signature Supreme Arrow hinges add a flash of steel. A square silhouette with true heritage character.',
        he: 'ה-Persol PO3092 מיוצר בגימור יד באיטליה מאצטט Havana המהולל של הבית — גווני צב חמים בליטוש עמוק. מערכת הזרועות הגמישות Meflecto מסירה לחץ מצידי הראש, וצירי ה-Supreme Arrow האיקוניים מוסיפים נגיעת פלדה. צללית מרובעת עם אופי מורשת אמיתי.',
      },
      specs: { lensWidth: '50 mm', bridge: '19 mm', temple: '145 mm', weight: '29 g', lensOpts: { en: 'Single-vision · Progressive · Photochromic', he: 'חד-מוקד · פרוגרסיב · פוטוכרומי' } },
    },
    3: {
      desc: {
        en: 'The Prada Symbole PR 17WS is a statement cat-eye carved from thick, glossy acetate with the triangle logo inlaid in enamel at each temple. Sharp modernist lines soften around the lens for all-day wearability, and the generous fit flatters medium to wide faces. Runway presence, engineered for daily life.',
        he: 'ה-Prada Symbole PR 17WS הוא הצהרת חתול-עין מאצטט עבה ומבריק, עם לוגו המשולש משובץ אמייל בכל זרוע. קווים מודרניסטיים חדים מתרככים סביב העדשה לנוחות לאורך כל היום, וההתאמה הנדיבה מחמיאה לפנים בינוניות עד רחבות. נוכחות מסלול, מהונדסת לחיי היומיום.',
      },
      specs: { lensWidth: '49 mm', bridge: '20 mm', temple: '140 mm', weight: '34 g', lensOpts: { en: 'Single-vision · Progressive · Blue-light', he: 'חד-מוקד · פרוגרסיב · סינון אור כחול' } },
    },
    4: {
      desc: {
        en: 'Tiffany & Co.’s TF2233B pairs a refined oval front with the maison’s jewelled sensibility — a delicate Tiffany Blue® enamel accent and crystal detailing at the hinges. The slim metal frame all but disappears on the face, letting the craftsmanship speak in close-up. Elegant, feminine, unmistakably Tiffany.',
        he: 'ה-TF2233B של Tiffany & Co. משלב חזית אובלית מעודנת עם חוש התכשיטנות של הבית — נגיעת אמייל בגוון Tiffany Blue® ועיטורי קריסטל בצירים. מסגרת המתכת הדקה כמעט נעלמת על הפנים ומניחה לאומנות לדבר מקרוב. אלגנטי, נשי, טיפאני ללא ספק.',
      },
      specs: { lensWidth: '52 mm', bridge: '16 mm', temple: '140 mm', weight: '27 g', lensOpts: { en: 'Single-vision · Progressive', he: 'חד-מוקד · פרוגרסיב' } },
    },
    5: {
      desc: {
        en: 'Bold and unapologetic, the Versace VE4361 fronts a strong square acetate frame with the golden Medusa medallion commanding each temple. The deep profile and saturated finishes give it real presence, while sprung hinges keep the fit secure through long days. For wearers who treat eyewear as jewellery.',
        he: 'נועז וללא התנצלויות — ה-Versace VE4361 מציג מסגרת אצטט מרובעת וחזקה עם מדליון המדוזה הזהוב בכל זרוע. הפרופיל העמוק והגימורים הרוויים מעניקים נוכחות אמיתית, וצירים קפיציים שומרים על התאמה יציבה לאורך ימים ארוכים. למי שרואים במשקפיים תכשיט.',
      },
      specs: { lensWidth: '53 mm', bridge: '18 mm', temple: '140 mm', weight: '38 g', lensOpts: { en: 'Single-vision · Progressive · Blue-light', he: 'חד-מוקד · פרוגרסיב · סינון אור כחול' } },
    },
    6: {
      desc: {
        en: 'The Dolce & Gabbana DG4416 rounds a Sicilian-print acetate into a soft, artistic silhouette. Each frame’s pattern falls differently across the front, making every pair subtly one-of-a-kind. Lightweight construction and a neutral bridge make it an easy everyday companion with a couture accent.',
        he: 'ה-DG4416 של Dolce & Gabbana מעגל אצטט בהדפס סיציליאני לצללית רכה ואמנותית. הדוגמה נופלת אחרת על כל מסגרת, כך שכל זוג הוא ייחודי בעדינות. מבנה קל וגשר ניטרלי הופכים אותו לבן לוויה יומיומי עם נגיעת קוטור.',
      },
      specs: { lensWidth: '51 mm', bridge: '20 mm', temple: '140 mm', weight: '31 g', lensOpts: { en: 'Single-vision · Blue-light', he: 'חד-מוקד · סינון אור כחול' } },
    },
    7: {
      desc: {
        en: 'The original pilot’s sunglass since 1937, the Ray-Ban Aviator Classic RB3025 needs no introduction. Teardrop crystal lenses block 100% UVA/UVB, the gold-tone frame stays featherweight, and the bayonet temples slide cleanly under a cap or headset. Offered here with G-15 green and gradient lens options.',
        he: 'משקפי הטייסים המקוריים מאז 1937 — ה-Ray-Ban Aviator Classic RB3025 לא זקוק להקדמות. עדשות קריסטל בצורת טיפה חוסמות 100% UVA/UVB, המסגרת בגוון זהב נשארת קלה במיוחד, והזרועות הישרות מחליקות בקלות מתחת לכובע. זמין עם עדשות G-15 ירוקות או מדורגות.',
      },
      specs: { lensWidth: '58 mm', bridge: '14 mm', temple: '135 mm', weight: '31 g', lensOpts: { en: 'G-15 · Gradient · Polarized · Prescription sun', he: 'G-15 · מדורג · מקוטב · שמש אופטי' } },
    },
    8: {
      desc: {
        en: 'A masterpiece of engineering, the Persol PO0714 is the world’s first folding sunglass — collapsing at the bridge and temples to pocket size without a single compromise in stability. Steve McQueen made it legend; the Havana acetate and crystal lenses keep it timeless. Supplied with a dedicated folding case.',
        he: 'יצירת מופת הנדסית — ה-Persol PO0714 הוא משקף השמש המתקפל הראשון בעולם, מתקפל בגשר ובזרועות לגודל כיס ללא שום פשרה ביציבות. סטיב מקווין הפך אותו לאגדה; אצטט ה-Havana ועדשות הקריסטל שומרים עליו על-זמני. מגיע עם נרתיק קיפול ייעודי.',
      },
      specs: { lensWidth: '54 mm', bridge: '21 mm', temple: '140 mm', weight: '36 g', lensOpts: { en: 'Crystal · Polarized', he: 'קריסטל · מקוטב' } },
    },
    9: {
      desc: {
        en: 'The Versace VE2199 is a sculpted metal shield with the Medusa Biggie motif studding the browline. A single sweeping lens delivers full coverage and a fashion-forward stance, backed by adjustable nose pads for a precise fit. Statement sun protection, Milan style.',
        he: 'ה-Versace VE2199 הוא מגן מתכת מפוסל עם מוטיב Medusa Biggie לאורך קו הגבות. עדשה אחת רחבה מעניקה כיסוי מלא ועמדה אופנתית, עם אפי אף מתכווננים להתאמה מדויקת. הגנת שמש הצהרתית, בסגנון מילאנו.',
      },
      specs: { lensWidth: '38 mm', bridge: '125 mm shield', temple: '145 mm', weight: '42 g', lensOpts: { en: 'Grey shield · Gold mirror', he: 'מגן אפור · מראה זהב' } },
    },
    10: {
      desc: {
        en: 'ACUVUE OASYS bi-weekly lenses with HYDRACLEAR® PLUS keep eyes comfortable in demanding, screen-heavy environments. Class-1 UV blocking (the highest available in a contact lens) and a smooth wetting agent woven through the material make dry, tired eyes a rarity. Six lenses per box.',
        he: 'עדשות ACUVUE OASYS דו-שבועיות עם HYDRACLEAR® PLUS שומרות על נוחות גם בסביבות מסך תובעניות. הגנת UV Class-1 (הגבוהה ביותר בעדשות מגע) וחומר הרטבה חלק הארוג בחומר הופכים עיניים יבשות ועייפות לנדירות. שש עדשות באריזה.',
      },
      specs: { lensWidth: '14.0 mm diameter', bridge: '8.4 base curve', temple: '—', weight: '38% water', lensOpts: { en: 'Spherical · Astigmatism · Multifocal', he: 'ספרי · אסטיגמציה · מולטיפוקל' } },
    },
    11: {
      desc: {
        en: 'DAILIES TOTAL1® is the first water-gradient daily lens: nearly 100% water at the surface, a breathable silicone-hydrogel core inside. The result feels like wearing nothing at all, from the first blink to the end of the day — then you simply throw the pair away. Thirty fresh lenses per box.',
        he: 'DAILIES TOTAL1® היא עדשת היומיום הראשונה עם מפל מים: כמעט 100% מים על פני השטח וליבת סיליקון-הידרוג׳ל נושמת בפנים. התוצאה מרגישה כאילו אין כלום על העין — מהמצמוץ הראשון עד סוף היום, ואז פשוט זורקים. שלושים עדשות טריות באריזה.',
      },
      specs: { lensWidth: '14.1 mm diameter', bridge: '8.5 base curve', temple: '—', weight: '33–80% water gradient', lensOpts: { en: 'Spherical · Multifocal', he: 'ספרי · מולטיפוקל' } },
    },
    12: {
      desc: {
        en: 'Biofinity® monthly lenses use Aquaform® Technology to lock moisture into a naturally wettable silicone hydrogel — no surface treatments, no additives. High oxygen transmissibility keeps eyes white and healthy across a full month of daily wear, at an everyday price. Six lenses per box.',
        he: 'עדשות Biofinity® החודשיות משתמשות בטכנולוגיית Aquaform® שנועלת לחות בסיליקון-הידרוג׳ל רטיב טבעית — בלי ציפויים ובלי תוספים. חדירות חמצן גבוהה שומרת על עיניים לבנות ובריאות לאורך חודש שלם של שימוש יומי, במחיר נגיש. שש עדשות באריזה.',
      },
      specs: { lensWidth: '14.0 mm diameter', bridge: '8.6 base curve', temple: '—', weight: '48% water', lensOpts: { en: 'Spherical · Toric · Multifocal', he: 'ספרי · טורי · מולטיפוקל' } },
    },
  }
}

module.exports = { defaultContent, productDetails }
