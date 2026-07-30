// OPTIZONE — storefront fallback content (mirror of server/seed-data.js).
// Used when the API is unreachable so the site still renders. The live site
// pulls the editable copy from GET /api/content.

export const SEED_CONTENT = {
  "announcement": {
    "enabled": true,
    "en": "Free shipping over ₪400 · Complete your fitting in any branch",
    "he": "משלוח חינם מעל ₪400 · השלמת התאמה בכל סניף"
  },
  "hero": {
    "eyebrow": { "en": "New · 2026 Collection", "he": "חדש · קולקציית 2026" },
    "titleA": { "en": "See the world", "he": "לראות את העולם" },
    "titleB": { "en": "in ", "he": "" },
    "titleC": { "en": "style", "he": "בסטייל" },
    "subtitle": {
      "en": "Handcrafted frames, expertly fitted. Try any pair on with Try Mirror before you buy — no card needed to reserve.",
      "he": "מסגרות בעבודת יד, מותאמות במומחיות. מדדו כל זוג עם Try Mirror לפני הקנייה — ללא צורך בכרטיס לשריון."
    },
    "ctaShop": { "en": "Shop Frames", "he": "לקולקציית המסגרות" },
    "ctaBook": { "en": "Book an Exam", "he": "קביעת תור לבדיקה" },
    "trusted": { "en": "Trusted since 2009", "he": "אמינים מאז 2009" },
    "slot": { "en": "Drop your hero photo here", "he": "גררו לכאן תמונת קאבר" },
    "tryReady": { "en": "Try Mirror ready", "he": "מוכן ל-Try Mirror" }
  },
  "sections": {
    "services": {
      "eyebrow": { "en": "What we do", "he": "מה אנחנו עושים" },
      "title": { "en": "Complete eye care, beautifully done", "he": "כל שירותי העיניים, במקום אחד" }
    },
    "categories": {
      "eyebrow": { "en": "Categories", "he": "קטגוריות" },
      "title": { "en": "Shop by category", "he": "קנייה לפי קטגוריה" }
    },
    "bestsellers": {
      "eyebrow": { "en": "Bestsellers", "he": "הנמכרים ביותר" },
      "title": { "en": "Frames of the season", "he": "מסגרות העונה" },
      "viewall": { "en": "View all", "he": "לכל הקולקציה" }
    },
    "tryMirror": {
      "eyebrow": { "en": "Try Mirror", "he": "Try Mirror" },
      "title": { "en": "Try them on from home", "he": "מודדים מהבית" },
      "subtitle": {
        "en": "Live, on-device virtual try-on. Compare frames side by side, save your looks, and share to WhatsApp. Nothing is stored.",
        "he": "מדידה וירטואלית חיה, במכשיר שלכם. השוו מסגרות זו לצד זו, שמרו לוקים ושתפו בוואטסאפ. שום דבר לא נשמר."
      },
      "cta": { "en": "Start Try Mirror", "he": "נסו עכשיו" }
    }
  },
  "services": [
    { "icon": "eye", "title": { "en": "Eye Exams", "he": "בדיקות ראייה" }, "desc": { "en": "Comprehensive vision tests with our optometrists.", "he": "בדיקות ראייה מקיפות אצל האופטומטריסטים שלנו." } },
    { "icon": "glasses", "title": { "en": "Prescription & Sun", "he": "משקפי ראייה ושמש" }, "desc": { "en": "Frames fitted to your face and prescription.", "he": "מסגרות מותאמות לפנים ולמרשם שלך." } },
    { "icon": "circle-dot", "title": { "en": "Contact Lenses", "he": "עדשות מגע" }, "desc": { "en": "Soft, multifocal and specialty lenses.", "he": "עדשות רכות, מולטיפוקל ועדשות מיוחדות." } },
    { "icon": "target", "title": { "en": "Myopia Control", "he": "שליטה בקוצר ראייה" }, "desc": { "en": "Slowing progression for children and teens.", "he": "האטת התקדמות קוצר ראייה בילדים ובני נוער." } },
    { "icon": "layers", "title": { "en": "Multifocal Experts", "he": "מומחים למולטיפוקל" }, "desc": { "en": "Progressive lenses done right.", "he": "עדשות פרוגרסיביות, בהתאמה מדויקת." } },
    { "icon": "shield-check", "title": { "en": "Keratoconus Care", "he": "טיפול בקרטוקונוס" }, "desc": { "en": "Specialty fitting for irregular corneas.", "he": "התאמה מיוחדת לקרנית לא סדירה." } }
  ],
  "categories": [
    { "key": "eyeglasses", "label": { "en": "Eyeglasses", "he": "משקפי ראייה" }, "slot": { "en": "Drop eyeglasses photo", "he": "גררו תמונה" } },
    { "key": "sunglasses", "label": { "en": "Sunglasses", "he": "משקפי שמש" }, "slot": { "en": "Drop sunglasses photo", "he": "גררו תמונה" } },
    { "key": "contacts", "label": { "en": "Contact Lenses", "he": "עדשות מגע" }, "slot": { "en": "Drop contact-lens photo", "he": "גררו תמונה" } }
  ],
  "products": [
    { "id": 1, "category": "sunglasses", "brand": "Tom Ford", "name": "Nadia Oversized", "amount": 1290, "original": 0, "rating": 4.5, "reviews": 34, "badge": { "variant": "bestseller", "label": { "en": "Bestseller", "he": "רב מכר" } }, "tryMirror": true, "colors": ["#1A1A17", "#C9A227"], "shape": "Square", "material": "Acetate", "gender": "Women", "image": "/products/tomford-square-sun.webp" },
    { "id": 2, "category": "eyeglasses", "brand": "Tom Ford", "name": "Jensen Optical", "amount": 1150, "original": 0, "rating": 5, "reviews": 21, "badge": { "variant": "new", "label": { "en": "New", "he": "חדש" } }, "tryMirror": true, "colors": ["#6B4423", "#1A1A17"], "shape": "Rectangle", "material": "Acetate", "gender": "Men", "image": "/products/tomford-havana-optical.webp" },
    { "id": 3, "category": "sunglasses", "brand": "Tom Ford", "name": "Marko Aviator", "amount": 1190, "original": 1390, "rating": 4.5, "reviews": 40, "badge": { "variant": "sale", "label": { "en": "Sale", "he": "מבצע" } }, "tryMirror": true, "colors": ["#C9A227", "#3A342A"], "shape": "Aviator", "material": "Metal", "gender": "Men", "image": "/products/tomford-aviator-sun.webp" },
    { "id": 4, "category": "sunglasses", "brand": "Ray-Ban", "name": "Aviator Classic", "amount": 520, "original": 620, "rating": 5, "reviews": 214, "badge": { "variant": "sale", "label": { "en": "Sale", "he": "מבצע" } }, "tryMirror": true, "colors": ["#C9A227", "#2E4034"], "shape": "Aviator", "material": "Metal", "gender": "Unisex", "image": "/products/rayban-aviator-sun.webp" },
    { "id": 5, "category": "sunglasses", "brand": "Ray-Ban", "name": "Wayfarer Original", "amount": 480, "original": 0, "rating": 4.5, "reviews": 189, "badge": { "variant": "bestseller", "label": { "en": "Bestseller", "he": "רב מכר" } }, "tryMirror": true, "colors": ["#1A1A17", "#2E4034"], "shape": "Square", "material": "Acetate", "gender": "Unisex", "image": "/products/rayban-wayfarer.webp", "tryMirrorModel": { "#1A1A17": "/tryon/models/demo-frame.glb" }, "tryMirrorMeta": { "modelForwardAxis": "z", "scaleMultiplier": 1.0, "bridgeYOffset": 0, "frameRealWidthMm": 140 } },
    { "id": 6, "category": "eyeglasses", "brand": "Ray-Ban", "name": "Round Metal Optical", "amount": 420, "original": 490, "rating": 4.5, "reviews": 128, "badge": { "variant": "sale", "label": { "en": "Sale", "he": "מבצע" } }, "tryMirror": true, "colors": ["#4A4E52", "#1A1A17"], "shape": "Round", "material": "Metal", "gender": "Unisex", "image": "/products/rayban-round-optical.webp" },
    { "id": 7, "category": "eyeglasses", "brand": "Tommy Hilfiger", "name": "TH Rectangular Optical", "amount": 390, "original": 0, "rating": 4.5, "reviews": 76, "badge": null, "tryMirror": true, "colors": ["#1E2A44", "#B22234"], "shape": "Rectangle", "material": "Acetate", "gender": "Men", "image": "/products/tommy-rect-optical.webp" },
    { "id": 8, "category": "sunglasses", "brand": "Tommy Hilfiger", "name": "TH Pilot", "amount": 430, "original": 0, "rating": 4, "reviews": 52, "badge": { "variant": "new", "label": { "en": "New", "he": "חדש" } }, "tryMirror": true, "colors": ["#9AA0A6", "#1E2A44"], "shape": "Aviator", "material": "Metal", "gender": "Men", "image": "/products/tommy-pilot-sun.webp" },
    { "id": 9, "category": "eyeglasses", "brand": "Tommy Hilfiger", "name": "TH Round Optical", "amount": 360, "original": 0, "rating": 4, "reviews": 41, "badge": null, "tryMirror": true, "colors": ["#6B4423", "#C9A227"], "shape": "Round", "material": "Acetate", "gender": "Women", "image": "/products/tommy-round-optical.webp" },
    { "id": 10, "category": "sunglasses", "brand": "Guess", "name": "Guess Cat-Eye", "amount": 410, "original": 0, "rating": 4.5, "reviews": 63, "badge": { "variant": "new", "label": { "en": "New", "he": "חדש" } }, "tryMirror": true, "colors": ["#6B4423", "#C9A227"], "shape": "Cat-eye", "material": "Acetate", "gender": "Women", "image": "/products/guess-cateye-sun.webp" },
    { "id": 11, "category": "sunglasses", "brand": "Guess", "name": "Guess Oversized", "amount": 390, "original": 460, "rating": 4, "reviews": 38, "badge": { "variant": "sale", "label": { "en": "Sale", "he": "מבצע" } }, "tryMirror": true, "colors": ["#1A1A17", "#C9A227"], "shape": "Square", "material": "Acetate", "gender": "Women", "image": "/products/guess-oversized-sun.webp" },
    { "id": 12, "category": "eyeglasses", "brand": "Guess", "name": "Guess Optical", "amount": 340, "original": 0, "rating": 4, "reviews": 27, "badge": null, "tryMirror": true, "colors": ["#5E2028", "#C9A227"], "shape": "Cat-eye", "material": "Acetate", "gender": "Women", "image": "/products/guess-burgundy-optical.webp" },
    { "id": 13, "category": "sunglasses", "brand": "Carrera", "name": "Carrera Sport Wrap", "amount": 380, "original": 0, "rating": 4.5, "reviews": 88, "badge": { "variant": "bestseller", "label": { "en": "Bestseller", "he": "רב מכר" } }, "tryMirror": true, "colors": ["#1A1A17", "#2A2A2A"], "shape": "Wraparound", "material": "Nylon", "gender": "Men", "image": "/products/carrera-sport-sun.webp" },
    { "id": 14, "category": "sunglasses", "brand": "Carrera", "name": "Carrera Pilot", "amount": 360, "original": 420, "rating": 4, "reviews": 55, "badge": { "variant": "sale", "label": { "en": "Sale", "he": "מבצע" } }, "tryMirror": true, "colors": ["#C9A227", "#3A342A"], "shape": "Aviator", "material": "Metal", "gender": "Unisex", "image": "/products/carrera-pilot-sun.webp" },
    { "id": 15, "category": "eyeglasses", "brand": "Carrera", "name": "Carrera Optical", "amount": 320, "original": 0, "rating": 4, "reviews": 33, "badge": null, "tryMirror": true, "colors": ["#4A4E52", "#1A1A17"], "shape": "Rectangle", "material": "Acetate", "gender": "Men", "image": "/products/carrera-grey-optical.webp" },
    { "id": 16, "category": "eyeglasses", "brand": "Boss", "name": "BOSS Titanium", "amount": 520, "original": 0, "rating": 5, "reviews": 47, "badge": { "variant": "bestseller", "label": { "en": "Bestseller", "he": "רב מכר" } }, "tryMirror": true, "colors": ["#4A4E52", "#2A2A2A"], "shape": "Rectangle", "material": "Titanium", "gender": "Men", "image": "/products/boss-titanium-optical.webp" },
    { "id": 17, "category": "eyeglasses", "brand": "Boss", "name": "BOSS Rimless", "amount": 560, "original": 0, "rating": 4.5, "reviews": 29, "badge": { "variant": "new", "label": { "en": "New", "he": "חדש" } }, "tryMirror": true, "colors": ["#9AA0A6", "#4A4E52"], "shape": "Rimless", "material": "Titanium", "gender": "Men", "image": "/products/boss-rimless-optical.webp" },
    { "id": 18, "category": "sunglasses", "brand": "Boss", "name": "BOSS Pilot", "amount": 470, "original": 0, "rating": 4.5, "reviews": 44, "badge": null, "tryMirror": true, "colors": ["#3A342A", "#C9A227"], "shape": "Aviator", "material": "Metal", "gender": "Men", "image": "/products/boss-pilot-sun.webp" },
    { "id": 19, "category": "eyeglasses", "brand": "Gant", "name": "GANT Round", "amount": 300, "original": 0, "rating": 4, "reviews": 22, "badge": null, "tryMirror": true, "colors": ["#6B4423", "#3A342A"], "shape": "Round", "material": "Acetate", "gender": "Unisex", "image": "/products/gant-round-optical.webp" },
    { "id": 20, "category": "eyeglasses", "brand": "Gant", "name": "GANT Rectangular", "amount": 290, "original": 340, "rating": 4, "reviews": 19, "badge": { "variant": "sale", "label": { "en": "Sale", "he": "מבצע" } }, "tryMirror": true, "colors": ["#5A3A22", "#1A1A17"], "shape": "Rectangle", "material": "Acetate", "gender": "Men", "image": "/products/gant-rect-optical.webp" },
    { "id": 21, "category": "sunglasses", "brand": "Gant", "name": "GANT Browline", "amount": 340, "original": 0, "rating": 4.5, "reviews": 31, "badge": { "variant": "new", "label": { "en": "New", "he": "חדש" } }, "tryMirror": true, "colors": ["#6B4423", "#C9A227"], "shape": "Browline", "material": "Metal", "gender": "Men", "image": "/products/gant-clubmaster-sun.webp" },
    { "id": 22, "category": "eyeglasses", "brand": "Alvero", "name": "Alvero Rose-Gold", "amount": 330, "original": 0, "rating": 4.5, "reviews": 26, "badge": { "variant": "new", "label": { "en": "New", "he": "חדש" } }, "tryMirror": true, "colors": ["#B76E79", "#C9A227"], "shape": "Rectangle", "material": "Metal", "gender": "Women", "image": "/products/alvero-semirimless-optical.webp" },
    { "id": 23, "category": "eyeglasses", "brand": "Alvero", "name": "Alvero Cat-Eye", "amount": 310, "original": 0, "rating": 4, "reviews": 18, "badge": null, "tryMirror": true, "colors": ["#C9822A", "#6B4423"], "shape": "Cat-eye", "material": "Acetate", "gender": "Women", "image": "/products/alvero-cateye-optical.webp" },
    { "id": 24, "category": "sunglasses", "brand": "Alvero", "name": "Alvero Aviator", "amount": 350, "original": 0, "rating": 4, "reviews": 24, "badge": null, "tryMirror": true, "colors": ["#8C6A3F", "#3A342A"], "shape": "Aviator", "material": "Metal", "gender": "Unisex", "image": "/products/alvero-aviator-sun.webp" },
    { "id": 25, "category": "contacts", "brand": "Johnson & Johnson", "name": "1-Day Moist · 30 pack", "amount": 170, "original": 0, "rating": 4.5, "reviews": 210, "badge": { "variant": "bestseller", "label": { "en": "Bestseller", "he": "רב מכר" } }, "tryMirror": false, "colors": [], "shape": "Daily", "material": "Silicone Hydrogel", "gender": "Unisex", "image": "/products/jj-daily-30.webp" },
    { "id": 26, "category": "contacts", "brand": "Johnson & Johnson", "name": "Oasys · 6 pack", "amount": 150, "original": 0, "rating": 4.5, "reviews": 320, "badge": null, "tryMirror": false, "colors": [], "shape": "Bi-weekly", "material": "Silicone Hydrogel", "gender": "Unisex", "image": "/products/jj-biweekly-6.webp" },
    { "id": 27, "category": "contacts", "brand": "CooperVision", "name": "Biofinity Monthly · 6 pack", "amount": 165, "original": 0, "rating": 4, "reviews": 141, "badge": null, "tryMirror": false, "colors": [], "shape": "Monthly", "material": "Silicone Hydrogel", "gender": "Unisex", "image": "/products/coopervision-monthly-6.webp" },
    { "id": 28, "category": "contacts", "brand": "CooperVision", "name": "MyDay · 30 pack", "amount": 210, "original": 0, "rating": 4.5, "reviews": 96, "badge": { "variant": "new", "label": { "en": "New", "he": "חדש" } }, "tryMirror": false, "colors": [], "shape": "Daily", "material": "Water Gradient", "gender": "Unisex", "image": "/products/coopervision-daily-30.webp" }
  ],
  "categoryPages": {
    "eyeglasses": {
      "title": { "en": "Eyeglasses", "he": "משקפי ראייה" },
      "subtitle": { "en": "Prescription-ready frames, hand-finished and fitted to you.", "he": "מסגרות מוכנות למרשם, בגימור ידני ובהתאמה אישית." }
    },
    "sunglasses": {
      "title": { "en": "Sunglasses", "he": "משקפי שמש" },
      "subtitle": { "en": "Full UV protection with signature style.", "he": "הגנת UV מלאה עם סטייל ייחודי." }
    },
    "contacts": {
      "title": { "en": "Contact Lenses", "he": "עדשות מגע" },
      "subtitle": { "en": "Daily, bi-weekly and monthly lenses from leading labs.", "he": "עדשות יומיות, דו-שבועיות וחודשיות מהמעבדות המובילות." }
    }
  },
  "filters": {
    "Frame Shape": ["Aviator", "Square", "Round", "Cat-eye", "Rectangle", "Browline", "Rimless", "Wraparound"],
    "Material": ["Acetate", "Metal", "Titanium", "Nylon"],
    "Gender": ["Women", "Men", "Unisex", "Kids"]
  },
  "brands": ["Tom Ford", "Ray-Ban", "Tommy Hilfiger", "Guess", "Carrera", "Boss", "Gant", "Alvero", "Johnson & Johnson", "CooperVision"],
  "bookingServices": [
    { "en": "Eye Exam", "he": "בדיקת ראייה" },
    { "en": "Frame Fitting", "he": "התאמת מסגרת" },
    { "en": "Contact-Lens Fitting", "he": "התאמת עדשות מגע" },
    { "en": "Kids' Eye Test", "he": "בדיקת ראייה לילדים" }
  ],
  "slots": ["09:00", "10:30", "12:00", "13:30", "15:00", "16:30", "18:00"],
  "popularSearches": [
    { "en": "Ray-Ban", "he": "ריי-באן" },
    { "en": "Tom Ford", "he": "טום פורד" },
    { "en": "Carrera", "he": "קררה" },
    { "en": "Sunglasses", "he": "משקפי שמש" },
    { "en": "Contact lenses", "he": "עדשות מגע" },
    { "en": "Titanium frames", "he": "מסגרות טיטניום" }
  ],
  "stores": [
    {
      "name": "Netanya",
      "he": "נתניה",
      "addr": "השלים 12, נתניה",
      "phone": "058-644-2303",
      "hours": { "en": "Sun–Thu 09:00–19:00 · Fri 09:00–14:00", "he": "א׳–ה׳ 09:00–19:00 · ו׳ 09:00–14:00" },
      "services": ["Eye Exams", "Try Mirror", "Contact Lenses"],
      "x": 34,
      "y": 46
    },
    {
      "name": "Tel Aviv",
      "he": "תל אביב",
      "addr": "דיזנגוף 210, תל אביב",
      "phone": "03-521-8890",
      "hours": { "en": "Sun–Thu 10:00–21:00 · Fri 10:00–15:00", "he": "א׳–ה׳ 10:00–21:00 · ו׳ 10:00–15:00" },
      "services": ["Eye Exams", "Frame Fitting", "Multifocal"],
      "x": 30,
      "y": 58
    },
    {
      "name": "Haifa",
      "he": "חיפה",
      "addr": "הנשיא 8, חיפה",
      "phone": "04-810-4471",
      "hours": { "en": "Sun–Thu 09:00–19:00 · Fri 09:00–13:30", "he": "א׳–ה׳ 09:00–19:00 · ו׳ 09:00–13:30" },
      "services": ["Eye Exams", "Keratoconus", "Myopia Control"],
      "x": 40,
      "y": 30
    }
  ],
  "settings": {
    "brandName": "OPTIZONE",
    "contact": {
      "addressEn": "Ha-Shlmim 12, Netanya",
      "addressHe": "השלים 12, נתניה",
      "phone": "058-644-2303",
      "site": "www.optizone.co.il",
      "email": "hello@optizone.co.il"
    },
    "footerBlurb": {
      "en": "Premium eyewear & eye care. Try any frame on before you buy.",
      "he": "משקפיים ושירותי ראייה פרימיום. מדדו כל מסגרת לפני שאתם קונים."
    },
    "shippingThreshold": 400,
    "shippingFee": 30
  },
  "media": { "hero-photo": "/site/hero-photo.jpg", "cat-eyeglasses": "/site/cat-eyeglasses.jpg", "cat-sunglasses": "/site/cat-sunglasses.jpg", "cat-contacts": "/site/cat-contacts.jpg" }
}

// Navigation is structural (maps to routes), so it stays in code.
export const NAV = [
  { key: 'eyeglasses', label: { en: 'Eyeglasses', he: 'משקפי ראייה', ar: 'نظارات طبية' } },
  { key: 'sunglasses', label: { en: 'Sunglasses', he: 'משקפי שמש', ar: 'نظارات شمسية' } },
  { key: 'contacts', label: { en: 'Contact Lenses', he: 'עדשות מגע', ar: 'عدسات لاصقة' } },
  { key: 'brands', label: { en: 'Brands', he: 'מותגים', ar: 'العلامات' } },
  { key: 'stores', label: { en: 'Stores', he: 'סניפים', ar: 'الفروع' } },
  { key: 'book', label: { en: 'Book an Exam', he: 'קביעת תור', ar: 'احجز فحصًا' } },
]
