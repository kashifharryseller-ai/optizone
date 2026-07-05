// OPTIZONE storefront — sample catalog data (no real product photos available).
window.OZ_DATA = {
  brands: ['Ray-Ban', 'Prada', 'Versace', 'Dolce & Gabbana', 'Tiffany & Co.', 'Persol'],
  nav: [
    { key: 'eyeglasses', label: 'Eyeglasses' },
    { key: 'sunglasses', label: 'Sunglasses' },
    { key: 'contacts', label: 'Contact Lenses' },
    { key: 'brands', label: 'Brands' },
    { key: 'stores', label: 'Stores' },
    { key: 'book', label: 'Book an Exam' },
  ],
  services: [
    { icon: 'eye', title: 'Eye Exams', he: 'בדיקות ראיה', desc: 'Comprehensive vision tests with our optometrists.' },
    { icon: 'glasses', title: 'Prescription & Sun', he: 'משקפי ראיה ושמש', desc: 'Frames fitted to your face and prescription.' },
    { icon: 'circle-dot', title: 'Contact Lenses', he: 'עדשות מגע', desc: 'Soft, multifocal and specialty lenses.' },
    { icon: 'target', title: 'Myopia Control', he: 'שליטה בקוצר ראיה', desc: 'Slowing progression for children and teens.' },
    { icon: 'layers', title: 'Multifocal Experts', he: 'מומחים למולטיפוקל', desc: 'Progressive lenses done right.' },
    { icon: 'shield-check', title: 'Keratoconus Care', he: 'טיפול בקרטוקונוס', desc: 'Specialty fitting for irregular corneas.' },
  ],
  products: [
    { id: 1, brand: 'Ray-Ban', name: 'Round Metal RB3447', amount: 390, original: 490, rating: 4.5, reviews: 128, badge: { variant: 'sale', label: 'Sale' }, tryMirror: true, colors: ['#22402F', '#3A342A', '#E08A2A'], shape: 'Round', material: 'Metal', gender: 'Unisex' },
    { id: 2, brand: 'Persol', name: 'PO3092 Havana', amount: 720, rating: 5, reviews: 64, badge: { variant: 'new', label: 'New' }, tryMirror: true, colors: ['#6B4423', '#1A1A17'], shape: 'Square', material: 'Acetate', gender: 'Men' },
    { id: 3, brand: 'Prada', name: 'PR 17WS Symbole', amount: 1290, rating: 4.5, reviews: 41, badge: { variant: 'bestseller', label: 'Bestseller' }, tryMirror: true, colors: ['#1A1A17', '#7E4310'], shape: 'Cat-eye', material: 'Acetate', gender: 'Women' },
    { id: 4, brand: 'Tiffany & Co.', name: 'TF2233B', amount: 980, rating: 4, reviews: 22, tryMirror: false, colors: ['#22402F', '#B4CEC0'], shape: 'Oval', material: 'Metal', gender: 'Women' },
    { id: 5, brand: 'Versace', name: 'VE4361 Medusa', amount: 860, original: 1050, rating: 4.5, reviews: 77, badge: { variant: 'sale', label: 'Sale' }, tryMirror: true, colors: ['#1A1A17', '#E08A2A'], shape: 'Square', material: 'Acetate', gender: 'Men' },
    { id: 6, brand: 'Dolce & Gabbana', name: 'DG4416 Print', amount: 690, rating: 4, reviews: 18, badge: { variant: 'new', label: 'New' }, tryMirror: true, colors: ['#6B4423', '#3A342A'], shape: 'Round', material: 'Acetate', gender: 'Women' },
  ],
  filters: {
    'Frame Shape': ['Round', 'Square', 'Cat-eye', 'Oval', 'Aviator'],
    'Material': ['Acetate', 'Metal', 'Titanium'],
    'Gender': ['Women', 'Men', 'Unisex', 'Kids'],
  },
  branches: ['Netanya · השלים 12', 'Tel Aviv · Dizengoff 210', 'Haifa · HaNassi 8'],
  bookingServices: ['Eye Exam', 'Frame Fitting', 'Contact-Lens Fitting', "Kids' Eye Test"],
  slots: ['09:00', '10:30', '12:00', '13:30', '15:00', '16:30', '18:00'],
  popularSearches: ['Ray-Ban', 'Blue-light glasses', 'Sunglasses', 'Progressive lenses', 'Titanium frames', 'Kids'],
  stores: [
    { name: 'Netanya', addr: 'השלים 12, נתניה', phone: '058-644-2303', hours: 'Sun–Thu 09:00–19:00 · Fri 09:00–14:00', services: ['Eye Exams', 'Try Mirror', 'Contact Lenses'], x: 34, y: 46 },
    { name: 'Tel Aviv', addr: 'Dizengoff 210, Tel Aviv', phone: '03-521-8890', hours: 'Sun–Thu 10:00–21:00 · Fri 10:00–15:00', services: ['Eye Exams', 'Frame Fitting', 'Multifocal'], x: 30, y: 58 },
    { name: 'Haifa', addr: 'HaNassi 8, Haifa', phone: '04-810-4471', hours: 'Sun–Thu 09:00–19:00 · Fri 09:00–13:30', services: ['Eye Exams', 'Keratoconus', 'Myopia Control'], x: 40, y: 30 },
  ],
  orders: [
    { id: 'OZ-24817', date: '18 Jun 2026', status: 'In lab', items: 'Ray-Ban Round Metal + 1.6 AR', total: 600 },
    { id: 'OZ-24603', date: '2 May 2026', status: 'Collected', items: 'Persol PO3092 Havana', total: 720 },
  ],
  prescriptions: [
    { name: 'Distance · Dr. Levi', date: '12 Mar 2026', od: '-2.25 / -0.50 × 180', os: '-2.00 / -0.75 × 165', pd: '63', expires: 'Mar 2028' },
  ],
  savedLooks: [
    { frame: 'Prada PR 17WS', color: '#1A1A17' },
    { frame: 'Versace VE4361', color: '#E08A2A' },
    { frame: 'Ray-Ban RB3447', color: '#22402F' },
  ],
};
