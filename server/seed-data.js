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
      { id: 1, brand: 'Ray-Ban', name: 'Round Metal RB3447', amount: 390, original: 490, rating: 4.5, reviews: 128, badge: { variant: 'sale', label: { en: 'Sale', he: 'מבצע' } }, tryMirror: true, colors: ['#22402F', '#3A342A', '#E08A2A'], shape: 'Round', material: 'Metal', gender: 'Unisex', image: '' },
      { id: 2, brand: 'Persol', name: 'PO3092 Havana', amount: 720, original: 0, rating: 5, reviews: 64, badge: { variant: 'new', label: { en: 'New', he: 'חדש' } }, tryMirror: true, colors: ['#6B4423', '#1A1A17'], shape: 'Square', material: 'Acetate', gender: 'Men', image: '' },
      { id: 3, brand: 'Prada', name: 'PR 17WS Symbole', amount: 1290, original: 0, rating: 4.5, reviews: 41, badge: { variant: 'bestseller', label: { en: 'Bestseller', he: 'רב מכר' } }, tryMirror: true, colors: ['#1A1A17', '#7E4310'], shape: 'Cat-eye', material: 'Acetate', gender: 'Women', image: '' },
      { id: 4, brand: 'Tiffany & Co.', name: 'TF2233B', amount: 980, original: 0, rating: 4, reviews: 22, badge: null, tryMirror: false, colors: ['#22402F', '#B4CEC0'], shape: 'Oval', material: 'Metal', gender: 'Women', image: '' },
      { id: 5, brand: 'Versace', name: 'VE4361 Medusa', amount: 860, original: 1050, rating: 4.5, reviews: 77, badge: { variant: 'sale', label: { en: 'Sale', he: 'מבצע' } }, tryMirror: true, colors: ['#1A1A17', '#E08A2A'], shape: 'Square', material: 'Acetate', gender: 'Men', image: '' },
      { id: 6, brand: 'Dolce & Gabbana', name: 'DG4416 Print', amount: 690, original: 0, rating: 4, reviews: 18, badge: { variant: 'new', label: { en: 'New', he: 'חדש' } }, tryMirror: true, colors: ['#6B4423', '#3A342A'], shape: 'Round', material: 'Acetate', gender: 'Women', image: '' },
    ],

    filters: {
      'Frame Shape': ['Round', 'Square', 'Cat-eye', 'Oval', 'Aviator'],
      Material: ['Acetate', 'Metal', 'Titanium'],
      Gender: ['Women', 'Men', 'Unisex', 'Kids'],
    },

    brands: ['Ray-Ban', 'Prada', 'Versace', 'Dolce & Gabbana', 'Tiffany & Co.', 'Persol'],

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

    media: {},
  }
}

module.exports = { defaultContent }
