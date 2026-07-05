// OPTIZONE storefront — sample catalog data.
// Product names / brands are proper nouns and stay as-is; list items carry a
// Hebrew companion (`he`) and attribute values are translated via src/i18n.
// Replace sample content with real frames, prices and photos when available.

export const OZ_DATA = {
  brands: ['Ray-Ban', 'Prada', 'Versace', 'Dolce & Gabbana', 'Tiffany & Co.', 'Persol'],

  nav: [
    { key: 'eyeglasses', label: 'Eyeglasses', he: 'משקפי ראייה' },
    { key: 'sunglasses', label: 'Sunglasses', he: 'משקפי שמש' },
    { key: 'contacts', label: 'Contact Lenses', he: 'עדשות מגע' },
    { key: 'brands', label: 'Brands', he: 'מותגים' },
    { key: 'stores', label: 'Stores', he: 'סניפים' },
    { key: 'book', label: 'Book an Exam', he: 'קביעת תור' },
  ],

  services: [
    { icon: 'eye', title: 'Eye Exams', he: 'בדיקות ראייה', desc: 'Comprehensive vision tests with our optometrists.', hedesc: 'בדיקות ראייה מקיפות אצל האופטומטריסטים שלנו.' },
    { icon: 'glasses', title: 'Prescription & Sun', he: 'משקפי ראייה ושמש', desc: 'Frames fitted to your face and prescription.', hedesc: 'מסגרות מותאמות לפנים ולמרשם שלך.' },
    { icon: 'circle-dot', title: 'Contact Lenses', he: 'עדשות מגע', desc: 'Soft, multifocal and specialty lenses.', hedesc: 'עדשות רכות, מולטיפוקל ועדשות מיוחדות.' },
    { icon: 'target', title: 'Myopia Control', he: 'שליטה בקוצר ראייה', desc: 'Slowing progression for children and teens.', hedesc: 'האטת התקדמות קוצר ראייה בילדים ובני נוער.' },
    { icon: 'layers', title: 'Multifocal Experts', he: 'מומחים למולטיפוקל', desc: 'Progressive lenses done right.', hedesc: 'עדשות פרוגרסיביות, בהתאמה מדויקת.' },
    { icon: 'shield-check', title: 'Keratoconus Care', he: 'טיפול בקרטוקונוס', desc: 'Specialty fitting for irregular corneas.', hedesc: 'התאמה מיוחדת לקרנית לא סדירה.' },
  ],

  products: [
    { id: 1, brand: 'Ray-Ban', name: 'Round Metal RB3447', amount: 390, original: 490, rating: 4.5, reviews: 128, badge: { variant: 'sale', label: { en: 'Sale', he: 'מבצע' } }, tryMirror: true, colors: ['#22402F', '#3A342A', '#E08A2A'], shape: 'Round', material: 'Metal', gender: 'Unisex' },
    { id: 2, brand: 'Persol', name: 'PO3092 Havana', amount: 720, rating: 5, reviews: 64, badge: { variant: 'new', label: { en: 'New', he: 'חדש' } }, tryMirror: true, colors: ['#6B4423', '#1A1A17'], shape: 'Square', material: 'Acetate', gender: 'Men' },
    { id: 3, brand: 'Prada', name: 'PR 17WS Symbole', amount: 1290, rating: 4.5, reviews: 41, badge: { variant: 'bestseller', label: { en: 'Bestseller', he: 'רב מכר' } }, tryMirror: true, colors: ['#1A1A17', '#7E4310'], shape: 'Cat-eye', material: 'Acetate', gender: 'Women' },
    { id: 4, brand: 'Tiffany & Co.', name: 'TF2233B', amount: 980, rating: 4, reviews: 22, tryMirror: false, colors: ['#22402F', '#B4CEC0'], shape: 'Oval', material: 'Metal', gender: 'Women' },
    { id: 5, brand: 'Versace', name: 'VE4361 Medusa', amount: 860, original: 1050, rating: 4.5, reviews: 77, badge: { variant: 'sale', label: { en: 'Sale', he: 'מבצע' } }, tryMirror: true, colors: ['#1A1A17', '#E08A2A'], shape: 'Square', material: 'Acetate', gender: 'Men' },
    { id: 6, brand: 'Dolce & Gabbana', name: 'DG4416 Print', amount: 690, rating: 4, reviews: 18, badge: { variant: 'new', label: { en: 'New', he: 'חדש' } }, tryMirror: true, colors: ['#6B4423', '#3A342A'], shape: 'Round', material: 'Acetate', gender: 'Women' },
  ],

  filters: {
    'Frame Shape': ['Round', 'Square', 'Cat-eye', 'Oval', 'Aviator'],
    Material: ['Acetate', 'Metal', 'Titanium'],
    Gender: ['Women', 'Men', 'Unisex', 'Kids'],
  },

  branches: [
    { en: 'Netanya · Ha-Shlmim 12', he: 'נתניה · השלים 12' },
    { en: 'Tel Aviv · Dizengoff 210', he: 'תל אביב · דיזנגוף 210' },
    { en: 'Haifa · HaNassi 8', he: 'חיפה · הנשיא 8' },
  ],

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

  orders: [
    { id: 'OZ-24817', date: { en: '18 Jun 2026', he: '18 ביוני 2026' }, status: 'In lab', items: { en: 'Ray-Ban Round Metal + 1.6 AR', he: 'ריי-באן Round Metal + 1.6 AR' }, total: 600 },
    { id: 'OZ-24603', date: { en: '2 May 2026', he: '2 במאי 2026' }, status: 'Collected', items: { en: 'Persol PO3092 Havana', he: 'Persol PO3092 Havana' }, total: 720 },
  ],

  prescriptions: [
    { name: { en: 'Distance · Dr. Levi', he: 'למרחק · ד״ר לוי' }, date: { en: '12 Mar 2026', he: '12 במרץ 2026' }, od: '-2.25 / -0.50 × 180', os: '-2.00 / -0.75 × 165', pd: '63', expires: { en: 'Mar 2028', he: 'מרץ 2028' } },
  ],

  savedLooks: [
    { frame: 'Prada PR 17WS', color: '#1A1A17' },
    { frame: 'Versace VE4361', color: '#E08A2A' },
    { frame: 'Ray-Ban RB3447', color: '#22402F' },
  ],
}
