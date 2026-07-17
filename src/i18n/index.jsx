import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

// ---------------------------------------------------------------------------
// Attribute value map — translates catalog values (shapes, materials, genders,
// filter groups, service tags, order statuses). Keys are the canonical English
// values stored in the catalog; values are unique so one flat map suffices.
// ---------------------------------------------------------------------------
const ATTR_HE = {
  'Frame Shape': 'צורת מסגרת', Material: 'חומר', Gender: 'מגדר',
  Round: 'עגול', Square: 'מרובע', 'Cat-eye': 'עין חתול', Oval: 'אובלי', Aviator: 'טייסים',
  Acetate: 'אצטט', Metal: 'מתכת', Titanium: 'טיטניום',
  Women: 'נשים', Men: 'גברים', Unisex: 'יוניסקס', Kids: 'ילדים',
  'Eye Exams': 'בדיקות ראייה', 'Try Mirror': 'Try Mirror', 'Contact Lenses': 'עדשות מגע',
  'Frame Fitting': 'התאמת מסגרת', Multifocal: 'מולטיפוקל', Keratoconus: 'קרטוקונוס',
  'Myopia Control': 'שליטה בקוצר ראייה',
  'In lab': 'במעבדה', Collected: 'נאסף', Shipped: 'נשלח',
  New: 'חדש', Cancelled: 'בוטל', Confirmed: 'אושר', Completed: 'הושלם',
  Daily: 'יומיות', 'Bi-weekly': 'דו-שבועיות', Monthly: 'חודשיות',
  'Silicone Hydrogel': 'סיליקון הידרוג׳ל', 'Water Gradient': 'גרדיאנט מים',
}

// ---------------------------------------------------------------------------
// Full bilingual string table. Every user-visible page string lives here.
// ---------------------------------------------------------------------------
const STRINGS = {
  en: {
    langLabel: 'עברית', // shown in the toggle → switches TO Hebrew
    announce: 'Free shipping over ₪400 · Complete your fitting in any branch',
    aria: { search: 'Search', wishlist: 'Wishlist', account: 'Account', cart: 'Cart', menu: 'Menu' },

    home: {
      hero_eyebrow: 'New · 2026 Collection',
      hero_h1a: 'See the world', hero_h1b: 'in ', hero_h1c: 'style',
      hero_p: 'Handcrafted frames, expertly fitted. Try any pair on with Try Mirror before you buy — no card needed to reserve.',
      cta_shop: 'Shop Frames', cta_book: 'Book an Exam', trusted: 'Trusted since 2009',
      hero_slot: 'Drop your hero photo here', tryReady: 'Try Mirror ready',
      services_eyebrow: 'What we do', services_h2: 'Complete eye care, beautifully done',
      cat_eyebrow: 'Categories', cat_h2: 'Shop by category',
      cats: [
        { key: 'eyeglasses', label: 'Eyeglasses', slot: 'Drop eyeglasses photo' },
        { key: 'sunglasses', label: 'Sunglasses', slot: 'Drop sunglasses photo' },
        { key: 'contacts', label: 'Contact Lenses', slot: 'Drop contact-lens photo' },
      ],
      best_eyebrow: 'Bestsellers', best_h2: 'Frames of the season', viewall: 'View all',
      try_eyebrow: 'Try Mirror', try_h2: 'Try them on from home',
      try_p: 'Live, on-device virtual try-on. Compare frames side by side, save your looks, and share to WhatsApp. Nothing is stored.',
      try_cta: 'Start Try Mirror',
      showcase_eyebrow: 'The Signature Edit', showcase_h2: 'Crafted to be seen',
      showcase_p: 'Precision-milled frames, finished by hand.',
    },

    footer: {
      blurb: 'Premium eyewear & eye care. Try any frame on before you buy.',
      address: 'Ha-Shlmim 12, Netanya',
      cols: [
        { h: 'Shop', items: ['Eyeglasses', 'Sunglasses', 'Contact Lenses', 'Accessories', 'Gift Cards'] },
        { h: 'Services', items: ['Book an Eye Exam', 'Try Mirror', 'Lens Guide', 'Store Locator', 'Prescription Help'] },
        { h: 'OPTIZONE', items: ['Our Story', 'Branches', 'Careers', 'Blog', 'Contact'] },
      ],
      copyright: '© 2026 OPTIZONE · Vision & Style',
      legal: ['Accessibility Statement (IS 5568)', 'Privacy', 'Terms'],
    },

    catalog: {
      home: 'Home',
      crumb: 'Home / Eyeglasses', title: 'Eyeglasses',
      filters: 'Filters', clear: 'Clear', tryOnly: 'Try Mirror only',
      count: (n) => `${n} frames`, empty: 'No frames match these filters.',
      sort: { popular: 'Sort: Popularity', asc: 'Price: Low to High', desc: 'Price: High to Low' },
    },

    product: {
      back: '← Back to Eyeglasses',
      backTo: (l) => `← Back to ${l}`,
      inStock: 'In stock · Netanya, Tel Aviv',
      photoSlot: 'Drop product photo',
      desc: (shape, material) => `A refined ${shape.toLowerCase()} silhouette in premium ${material.toLowerCase()}. Lightweight, precisely balanced, and ready for your prescription.`,
      color: 'Color',
      lensConfig: 'Lens configuration',
      lensSummary: (parts, price) => `${parts.join(' · ')} · +₪${price}`,
      index: 'Index',
      antiReflective: 'Anti-reflective', blueLight: 'Blue-light', photochromic: 'Photochromic',
      lensIndex: 'Lens index',
      lensOpts: [
        { value: '1.5', label: '1.5 · Standard' },
        { value: '1.6', label: '1.6 · Thin +₪120' },
        { value: '1.67', label: '1.67 +₪260' },
        { value: '1.74', label: '1.74 +₪420' },
      ],
      arRow: 'Anti-reflective coating (+₪90)', blueRow: 'Blue-light filter (+₪70)', photoRow: 'Photochromic (+₪180)',
      lensNote: 'Out-of-range prescriptions are fitted in-store, not blocked.',
      addToCart: (total) => `Add to Cart · ₪${total}`, tryMirror: 'Try Mirror',
      freeShip: 'Free shipping over ₪400', reserveFit: 'Reserve & fit in-store',
      tabs: { desc: 'Description', specs: 'Specs', reviews: 'Reviews' },
      descLong: (name, shape, material) => `The ${name} pairs a timeless ${shape.toLowerCase()} shape with OPTIZONE's precision fitting. Hand-finished ${material.toLowerCase()}, sprung hinges, and adjustable nose pads for all-day comfort. Compatible with single-vision, progressive, and blue-light lenses.`,
      specLabels: { brand: 'Brand', shape: 'Shape', material: 'Material', gender: 'Gender', lensWidth: 'Lens width', bridge: 'Bridge', temple: 'Temple length', weight: 'Weight', colorOpts: 'Color options', lensOpts: 'Lens options', tryMirror: 'Try Mirror' },
      yes: 'Yes', no: 'No',
      reviewsLine: (n, r) => `${n} verified reviews · ${r}/5 average. Reviews module (Phase 2) with moderation.`,
      consentEyebrow: 'Try Mirror', consentTitle: 'Camera & try-on consent',
      consentBody: "OPTIZONE's Try Mirror uses your camera on-device to place frames on your face in real time. No image or biometric data is stored (Privacy Protection Law, IS 5568). You can also upload a photo instead.",
      notNow: 'Not now', allowCamera: 'Allow camera',
      mirrorLive: 'Try Mirror · Live', mirrorPreview: 'Camera preview (mock)',
      capture: 'Capture look', mirrorAdd: 'Add to Cart',
      mirrorStart: 'Start camera', mirrorPhotoAlt: 'or try on a photo',
      mirrorSize: 'Frame size', mirrorDownload: 'Download photo',
      mirrorLoading: 'Loading face tracking…',
      mirrorNoFace: 'No face detected — try a clear, front-facing photo.',
      mirrorCamBlocked: 'Camera permission blocked — you can upload a photo instead.',
      mirrorCamUnavailable: 'Camera is not available here — upload a photo instead.',
      mirrorPrivacy: 'Everything runs on your device — no image ever leaves your browser.',
      modeLive: 'Live', modePhoto: 'Upload photo', modeVideo: 'Upload video',
      mirrorChoosePhoto: 'Choose a photo', mirrorChooseVideo: 'Choose a video',
      mirrorPosition: 'Position your face in the frame',
      mirrorNoCam: 'No camera found — upload a photo or video instead.',
      mirrorBadFile: 'That file type isn’t supported — please choose another.',
      mirrorInitFail: 'Face tracking couldn’t load — check your connection and try again.',
      mirrorPlay: 'Play', mirrorPause: 'Pause', mirrorRetry: 'Retry',
    },

    booking: {
      eyebrow: 'Book an appointment', h1: 'Eye care, on your schedule',
      s1: '1 · Service', s2: '2 · Branch', s3: '3 · Date', s4: '4 · Time',
      days: ['Sun 6', 'Mon 7', 'Tue 8', 'Wed 9', 'Thu 10'],
      summary: 'Your appointment',
      rowService: 'Service', rowBranch: 'Branch', rowDate: 'Date', rowTime: 'Time',
      fullName: 'Full name', phone: 'Phone · 05X-XXX-XXXX',
      confirm: 'Confirm booking', noPay: 'No payment needed. Free reschedule & cancellation.',
      doneH1: "You're booked",
      doneNote: 'A confirmation and reminders will be sent via WhatsApp & email. Reschedule anytime from the link.',
      edit: 'Edit booking', backHome: 'Back to home',
      calendlyEyebrow: 'Book online', calendlyH: 'Pick a time that suits you',
      calendlySub: 'Choose a live slot from our calendar — instant confirmation, free reschedule.',
      calendlyLoading: 'Loading the scheduler…',
      calendlyOff: 'Online booking is temporarily unavailable — please call us at',
      calendlyCta: 'Schedule time with me',
      calendlyBadgeHint: 'Or tap the “Schedule time with me” button in the corner anytime.',
    },

    cart: {
      emptyH1: 'Your cart is empty', emptyP: 'Find a frame you love — and try it on before you buy.', shop: 'Shop Frames',
      title: 'Your cart', lineNote: 'Frame + lens · configured',
      customSize: (v) => `Custom size · ${v}`,
      summary: 'Summary', subtotal: 'Subtotal', shipping: 'Shipping', free: 'Free',
      promo: 'Promo code', apply: 'Apply', total: 'TOTAL',
      promoApplied: (c) => `Code ${c}`, promoInvalid: 'That code isn’t valid or has expired.',
      checkout: 'Checkout', reserve: 'Reserve & fit in-store',
      pays: ['Visa', 'Mastercard', 'Bit', 'Installments'],
    },

    search: {
      placeholder: 'Search frames, brands, lenses…',
      popular: 'Popular searches',
      results: (n) => `${n} ${n === 1 ? 'result' : 'results'}`,
      none: (q) => `No frames match “${q}”. Try a brand or shape.`,
    },

    account: {
      welcome: 'Welcome back', signinSub: 'Sign in to your OPTIZONE account',
      registerTitle: 'Create your account', registerSub: 'Track orders, book faster, and save your favourite frames',
      name: 'Full name', email: 'Email address', phone: 'Phone · 05X-XXX-XXXX', password: 'Password',
      pwHint: 'At least 6 characters',
      signin: 'Sign in', signup: 'Create account', or: 'or',
      google: 'Continue with Google',
      toRegister: 'New here? Create an account', toLogin: 'Already have an account? Sign in',
      protected: 'Protected sign-in · rate-limited · IS 5568 accessible',
      reset: {
        forgotLink: 'Forgot password?',
        forgotTitle: 'Reset your password', forgotSub: 'Enter your email and we\u2019ll send a reset code',
        sendCode: 'Send reset code',
        resetTitle: 'Enter code & new password', resetSub: 'Check your email for the 6-digit code',
        sentNote: 'If that email is registered, a reset code is on its way.',
        code: '6-digit code', newPassword: 'New password', resetCta: 'Reset password',
        backToLogin: '\u2190 Back to sign in',
      },
      myAccount: 'My account', hello: (n) => `Shalom, ${n}`,
      stats: { orders: 'Orders', appts: 'Appointments', wishlist: 'Wishlist', spent: 'Total spent' },
      tabs: { orders: 'My Orders', appts: 'My Appointments', wishlist: 'My Wishlist', settings: 'My Settings' },
      track: 'Track',
      emptyOrders: 'No orders yet — your purchases will appear here.', startShopping: 'Start shopping',
      emptyAppts: 'No appointments yet.', bookNow: 'Book an exam',
      emptyWishlist: 'Your wishlist is empty — tap the heart on any frame.', browse: 'Browse frames',
      profile: 'Profile details', save: 'Save changes', saved: 'Saved',
      changePw: 'Change password', currentPw: 'Current password', newPw: 'New password',
      update: 'Update password', pwChanged: 'Password updated',
      signout: 'Sign out',
      menu: { account: 'My account', orders: 'My orders', appts: 'My appointments', wishlist: 'My wishlist', settings: 'My settings', signin: 'Sign in', register: 'Create account', signout: 'Sign out' },
    },

    checkout: {
      title: 'Checkout', steps: ['Contact', 'Shipping', 'Payment'],
      contactTitle: 'Contact details', firstName: 'First name', lastName: 'Last name', email: 'Email', phone: 'Phone · 05X-XXX-XXXX',
      toShipping: 'Continue to shipping',
      deliveryTitle: 'Delivery method',
      homeDelivery: 'Home delivery', homeFree: 'Free · 2–4 business days', homePaid: '₪30 · 2–4 business days',
      pickup: 'Collect in branch', pickupSub: 'Free · ready in 1–2 days',
      addrTitle: 'Shipping address', street: 'Street & number', apt: 'Apt / entrance', city: 'City', postal: 'Postal code',
      back: 'Back', toPayment: 'Continue to payment',
      payTitle: 'Payment method',
      card: 'Credit / debit card', cardSub: 'Visa · Mastercard · secured gateway',
      bit: 'Bit', bitSub: 'Pay from your phone',
      installments: 'תשלומים · Installments', installmentsSub: 'Split into up to 12 payments',
      cardNumber: 'Card number', expiry: 'MM / YY', cvv: 'CVV',
      instOpt: (n, x) => `${n} payments · ₪${x}/mo`,
      secure: 'No card data touches our servers · PCI-DSS via gateway',
      pay: (total) => `Pay ₪${total}`,
      cod: 'Cash on Delivery', codSub: 'Pay in cash when your order arrives',
      comingSoon: 'Coming Soon', cardSoonNote: 'Card payments coming soon.',
      placeOrder: (total) => `Place order · ₪${total}`,
      addrSearch: 'Street & number — start typing for suggestions',
      addrVerifiedMsg: 'Address verified',
      addrError: 'Please choose a verified address from the suggestions.',
      addrManualError: 'Please enter your shipping address.',
      contactError: 'Please enter your name, a valid email, and a phone number.',
      orderError: 'Sorry — we couldn’t place your order. Please try again.',
      placing: 'Placing order…',
      selectBranch: 'Select a branch',
      confirmedH1: 'Order confirmed',
      confirmedP: (total, id) => `Order${id ? ` #${id}` : ''} · ₪${total}`,
      confirmedNote: 'A tax invoice (חשבונית מס) and tracking link are on the way via email & WhatsApp.',
      thankYou: 'Thank you', trackOrder: 'Track order', continueShopping: 'Continue shopping',
      summary: 'Order summary', qty: (n) => `Qty ${n}`, subtotal: 'Subtotal', shipping: 'Shipping', free: 'Free', total: 'TOTAL',
    },

    brands: {
      eyebrow: 'Our Partners', title: 'Shop by Brand',
      sub: 'The houses we carry — 100% authentic, with full manufacturer warranty.',
      count: (n) => `${n} ${n === 1 ? 'product' : 'products'}`,
    },

    stores: {
      eyebrow: 'Find us', h1: 'Our branches',
      branch: 'Branch', bookHere: 'Book at this branch', directions: 'Get directions',
    },

    toast: { added: 'Added to cart' },
  },

  he: {
    langLabel: 'English', // shown in the toggle → switches TO English
    announce: 'משלוח חינם מעל ₪400 · השלמת התאמה בכל סניף',
    aria: { search: 'חיפוש', wishlist: 'מועדפים', account: 'החשבון שלי', cart: 'עגלה', menu: 'תפריט' },

    home: {
      hero_eyebrow: 'חדש · קולקציית 2026',
      hero_h1a: 'לראות את העולם', hero_h1b: '', hero_h1c: 'בסטייל',
      hero_p: 'מסגרות בעבודת יד, מותאמות במומחיות. מדדו כל זוג עם Try Mirror לפני הקנייה — ללא צורך בכרטיס לשריון.',
      cta_shop: 'לקולקציית המסגרות', cta_book: 'קביעת תור לבדיקה', trusted: 'אמינים מאז 2009',
      hero_slot: 'גררו לכאן תמונת קאבר', tryReady: 'מוכן ל-Try Mirror',
      services_eyebrow: 'מה אנחנו עושים', services_h2: 'כל שירותי העיניים, במקום אחד',
      cat_eyebrow: 'קטגוריות', cat_h2: 'קנייה לפי קטגוריה',
      cats: [
        { key: 'eyeglasses', label: 'משקפי ראייה', slot: 'גררו תמונה' },
        { key: 'sunglasses', label: 'משקפי שמש', slot: 'גררו תמונה' },
        { key: 'contacts', label: 'עדשות מגע', slot: 'גררו תמונה' },
      ],
      best_eyebrow: 'הנמכרים ביותר', best_h2: 'מסגרות העונה', viewall: 'לכל הקולקציה',
      try_eyebrow: 'Try Mirror', try_h2: 'מודדים מהבית',
      try_p: 'מדידה וירטואלית חיה, במכשיר שלכם. השוו מסגרות זו לצד זו, שמרו לוקים ושתפו בוואטסאפ. שום דבר לא נשמר.',
      try_cta: 'נסו עכשיו',
      showcase_eyebrow: 'הקולקציה החתומה', showcase_h2: 'נועדו להיראות',
      showcase_p: 'מסגרות בעיבוד מדויק, בגימור ידני.',
    },

    footer: {
      blurb: 'משקפיים ושירותי ראייה פרימיום. מדדו כל מסגרת לפני שאתם קונים.',
      address: 'השלים 12, נתניה',
      cols: [
        { h: 'קנייה', items: ['משקפי ראייה', 'משקפי שמש', 'עדשות מגע', 'אביזרים', 'שוברי מתנה'] },
        { h: 'שירותים', items: ['קביעת תור לבדיקה', 'Try Mirror', 'מדריך עדשות', 'איתור סניפים', 'עזרה עם מרשם'] },
        { h: 'OPTIZONE', items: ['הסיפור שלנו', 'סניפים', 'דרושים', 'בלוג', 'צור קשר'] },
      ],
      copyright: '© 2026 OPTIZONE · Vision & Style',
      legal: ['הצהרת נגישות (ת״י 5568)', 'פרטיות', 'תנאים'],
    },

    catalog: {
      home: 'בית',
      crumb: 'בית / משקפי ראייה', title: 'משקפי ראייה',
      filters: 'סינון', clear: 'ניקוי', tryOnly: 'רק Try Mirror',
      count: (n) => `${n} מסגרות`, empty: 'אין מסגרות התואמות לסינון.',
      sort: { popular: 'מיון: פופולריות', asc: 'מחיר: מהנמוך לגבוה', desc: 'מחיר: מהגבוה לנמוך' },
    },

    product: {
      back: 'חזרה למשקפי ראייה →',
      backTo: (l) => `חזרה ל${l} →`,
      inStock: 'במלאי · נתניה, תל אביב',
      photoSlot: 'גררו תמונת מוצר',
      desc: (shape, material) => `צללית ${ATTR_HE[shape] || shape} מוקפדת ב${ATTR_HE[material] || material} איכותי. קלה, מאוזנת במדויק ומוכנה למרשם שלך.`,
      color: 'צבע',
      lensConfig: 'תצורת עדשות',
      lensSummary: (parts, price) => `${parts.join(' · ')} · +₪${price}`,
      index: 'אינדקס',
      antiReflective: 'אנטי-רפלקס', blueLight: 'סינון אור כחול', photochromic: 'פוטוכרומי',
      lensIndex: 'אינדקס עדשה',
      lensOpts: [
        { value: '1.5', label: '1.5 · רגיל' },
        { value: '1.6', label: '1.6 · דק +₪120' },
        { value: '1.67', label: '1.67 +₪260' },
        { value: '1.74', label: '1.74 +₪420' },
      ],
      arRow: 'ציפוי אנטי-רפלקס (+₪90)', blueRow: 'סינון אור כחול (+₪70)', photoRow: 'עדשות פוטוכרומיות (+₪180)',
      lensNote: 'מרשמים מחוץ לטווח מותאמים בסניף, ללא חסימה.',
      addToCart: (total) => `הוספה לעגלה · ₪${total}`, tryMirror: 'Try Mirror',
      freeShip: 'משלוח חינם מעל ₪400', reserveFit: 'שריון והתאמה בסניף',
      tabs: { desc: 'תיאור', specs: 'מפרט', reviews: 'ביקורות' },
      descLong: (name, shape, material) => `${name} משלב צורת ${ATTR_HE[shape] || shape} נצחית עם התאמה מדויקת של OPTIZONE. ${ATTR_HE[material] || material} בגימור ידני, צירים קפיציים ומשענות אף מתכווננות לנוחות לאורך כל היום. מתאים לעדשות חד-מוקדיות, פרוגרסיביות וסינון אור כחול.`,
      specLabels: { brand: 'מותג', shape: 'צורה', material: 'חומר', gender: 'מגדר', lensWidth: 'רוחב עדשה', bridge: 'גשר', temple: 'אורך זרוע', weight: 'משקל', colorOpts: 'אפשרויות צבע', lensOpts: 'אפשרויות עדשה', tryMirror: 'Try Mirror' },
      yes: 'כן', no: 'לא',
      reviewsLine: (n, r) => `${n} ביקורות מאומתות · ממוצע ${r}/5. מודול הביקורות (שלב 2) עם ניהול תוכן.`,
      consentEyebrow: 'Try Mirror', consentTitle: 'הסכמה למצלמה ולמדידה',
      consentBody: 'ה-Try Mirror של OPTIZONE משתמש במצלמה שלך במכשיר עצמו כדי להציב את המסגרות על הפנים בזמן אמת. שום תמונה או מידע ביומטרי אינם נשמרים (חוק הגנת הפרטיות, ת״י 5568). ניתן גם להעלות תמונה במקום.',
      notNow: 'לא עכשיו', allowCamera: 'אישור מצלמה',
      mirrorLive: 'Try Mirror · חי', mirrorPreview: 'תצוגת מצלמה (הדגמה)',
      capture: 'צילום הלוק', mirrorAdd: 'הוספה לעגלה',
      mirrorStart: 'הפעלת מצלמה', mirrorPhotoAlt: 'או מדידה על תמונה',
      mirrorSize: 'גודל מסגרת', mirrorDownload: 'הורדת תמונה',
      mirrorLoading: 'טוען זיהוי פנים…',
      mirrorNoFace: 'לא זוהו פנים — נסו תמונה ברורה, פנים קדימה.',
      mirrorCamBlocked: 'הרשאת המצלמה נחסמה — אפשר להעלות תמונה במקום.',
      mirrorCamUnavailable: 'המצלמה אינה זמינה כאן — העלו תמונה במקום.',
      mirrorPrivacy: 'הכול רץ על המכשיר שלכם — אף תמונה לא עוזבת את הדפדפן.',
      modeLive: 'מצלמה חיה', modePhoto: 'העלאת תמונה', modeVideo: 'העלאת וידאו',
      mirrorChoosePhoto: 'בחירת תמונה', mirrorChooseVideo: 'בחירת וידאו',
      mirrorPosition: 'מקמו את הפנים במסגרת',
      mirrorNoCam: 'לא נמצאה מצלמה — העלו תמונה או וידאו במקום.',
      mirrorBadFile: 'סוג הקובץ אינו נתמך — בחרו קובץ אחר.',
      mirrorInitFail: 'זיהוי הפנים לא נטען — בדקו את החיבור ונסו שוב.',
      mirrorPlay: 'הפעלה', mirrorPause: 'השהיה', mirrorRetry: 'נסו שוב',
    },

    booking: {
      eyebrow: 'קביעת תור', h1: 'טיפול בעיניים, בזמן שנוח לכם',
      s1: '1 · שירות', s2: '2 · סניף', s3: '3 · תאריך', s4: '4 · שעה',
      days: ['א׳ 6', 'ב׳ 7', 'ג׳ 8', 'ד׳ 9', 'ה׳ 10'],
      summary: 'התור שלך',
      rowService: 'שירות', rowBranch: 'סניף', rowDate: 'תאריך', rowTime: 'שעה',
      fullName: 'שם מלא', phone: 'טלפון · 05X-XXX-XXXX',
      confirm: 'אישור התור', noPay: 'ללא תשלום. שינוי וביטול ללא עלות.',
      doneH1: 'התור נקבע',
      doneNote: 'אישור ותזכורות יישלחו בוואטסאפ ובאימייל. אפשר לשנות בכל עת דרך הקישור.',
      edit: 'עריכת התור', backHome: 'חזרה לדף הבית',
      calendlyEyebrow: 'קביעה אונליין', calendlyH: 'בחרו זמן שנוח לכם',
      calendlySub: 'בחרו מועד פנוי מהיומן שלנו — אישור מיידי, שינוי ללא עלות.',
      calendlyLoading: 'טוען את מערכת הקביעה…',
      calendlyOff: 'קביעת תור אונליין אינה זמינה כרגע — התקשרו אלינו',
      calendlyCta: 'קביעת תור עכשיו',
      calendlyBadgeHint: 'אפשר גם דרך הכפתור "קביעת תור" שבפינת המסך, בכל רגע.',
    },

    cart: {
      emptyH1: 'העגלה שלך ריקה', emptyP: 'מצאו מסגרת שאתם אוהבים — ומדדו אותה לפני הקנייה.', shop: 'לקולקציית המסגרות',
      title: 'העגלה שלך', lineNote: 'מסגרת + עדשה · מותאם',
      customSize: (v) => `מידה מותאמת · ${v}`,
      summary: 'סיכום', subtotal: 'סכום ביניים', shipping: 'משלוח', free: 'חינם',
      promo: 'קוד קופון', apply: 'החל', total: 'סה״כ',
      promoApplied: (c) => `קוד ${c}`, promoInvalid: 'הקוד אינו תקין או שפג תוקפו.',
      checkout: 'לתשלום', reserve: 'שריון והתאמה בסניף',
      pays: ['Visa', 'Mastercard', 'Bit', 'תשלומים'],
    },

    search: {
      placeholder: 'חיפוש מסגרות, מותגים, עדשות…',
      popular: 'חיפושים פופולריים',
      results: (n) => `${n} ${n === 1 ? 'תוצאה' : 'תוצאות'}`,
      none: (q) => `אין מסגרות התואמות ל“${q}”. נסו מותג או צורה.`,
    },

    account: {
      welcome: 'ברוכים השבים', signinSub: 'התחברו לחשבון ה-OPTIZONE שלכם',
      registerTitle: 'פתיחת חשבון', registerSub: 'מעקב הזמנות, קביעת תורים מהירה ושמירת מסגרות אהובות',
      name: 'שם מלא', email: 'כתובת אימייל', phone: 'טלפון · 05X-XXX-XXXX', password: 'סיסמה',
      pwHint: 'לפחות 6 תווים',
      signin: 'התחברות', signup: 'פתיחת חשבון', or: 'או',
      google: 'המשך עם Google',
      toRegister: 'חדשים כאן? פתחו חשבון', toLogin: 'כבר יש לכם חשבון? התחברו',
      protected: 'התחברות מאובטחת · מוגבלת קצב · נגיש לפי ת״י 5568',
      reset: {
        forgotLink: 'שכחתם סיסמה?',
        forgotTitle: 'איפוס סיסמה', forgotSub: 'הזינו את האימייל ונשלח קוד לאיפוס',
        sendCode: 'שליחת קוד איפוס',
        resetTitle: 'הזנת קוד וסיסמה חדשה', resetSub: 'בדקו את האימייל לקוד בן 6 ספרות',
        sentNote: 'אם האימייל רשום, קוד איפוס בדרך אליכם.',
        code: 'קוד בן 6 ספרות', newPassword: 'סיסמה חדשה', resetCta: 'איפוס סיסמה',
        backToLogin: '\u2192 חזרה להתחברות',
      },
      myAccount: 'החשבון שלי', hello: (n) => `שלום, ${n}`,
      stats: { orders: 'הזמנות', appts: 'תורים', wishlist: 'מועדפים', spent: 'סה״כ קניות' },
      tabs: { orders: 'ההזמנות שלי', appts: 'התורים שלי', wishlist: 'המועדפים שלי', settings: 'הגדרות' },
      track: 'מעקב',
      emptyOrders: 'עדיין אין הזמנות — הרכישות שלכם יופיעו כאן.', startShopping: 'לתחילת קנייה',
      emptyAppts: 'עדיין אין תורים.', bookNow: 'קביעת תור',
      emptyWishlist: 'רשימת המועדפים ריקה — הקישו על הלב בכל מסגרת.', browse: 'לקולקציית המסגרות',
      profile: 'פרטים אישיים', save: 'שמירת שינויים', saved: 'נשמר',
      changePw: 'שינוי סיסמה', currentPw: 'סיסמה נוכחית', newPw: 'סיסמה חדשה',
      update: 'עדכון סיסמה', pwChanged: 'הסיסמה עודכנה',
      signout: 'התנתקות',
      menu: { account: 'החשבון שלי', orders: 'ההזמנות שלי', appts: 'התורים שלי', wishlist: 'המועדפים שלי', settings: 'הגדרות', signin: 'התחברות', register: 'פתיחת חשבון', signout: 'התנתקות' },
    },

    checkout: {
      title: 'תשלום', steps: ['פרטים', 'משלוח', 'תשלום'],
      contactTitle: 'פרטי התקשרות', firstName: 'שם פרטי', lastName: 'שם משפחה', email: 'אימייל', phone: 'טלפון · 05X-XXX-XXXX',
      toShipping: 'המשך למשלוח',
      deliveryTitle: 'שיטת משלוח',
      homeDelivery: 'משלוח עד הבית', homeFree: 'חינם · 2–4 ימי עסקים', homePaid: '₪30 · 2–4 ימי עסקים',
      pickup: 'איסוף מהסניף', pickupSub: 'חינם · מוכן תוך 1–2 ימים',
      addrTitle: 'כתובת למשלוח', street: 'רחוב ומספר', apt: 'דירה / כניסה', city: 'עיר', postal: 'מיקוד',
      back: 'חזרה', toPayment: 'המשך לתשלום',
      payTitle: 'אמצעי תשלום',
      card: 'כרטיס אשראי / חיוב', cardSub: 'Visa · Mastercard · סליקה מאובטחת',
      bit: 'Bit', bitSub: 'תשלום מהטלפון',
      installments: 'תשלומים', installmentsSub: 'פריסה עד 12 תשלומים',
      cardNumber: 'מספר כרטיס', expiry: 'MM / YY', cvv: 'CVV',
      instOpt: (n, x) => `${n} תשלומים · ₪${x} לחודש`,
      secure: 'פרטי הכרטיס אינם נשמרים בשרתים שלנו · PCI-DSS דרך הסליקה',
      pay: (total) => `לתשלום ₪${total}`,
      cod: 'תשלום במזומן בעת האספקה', codSub: 'משלמים במזומן כשההזמנה מגיעה אליכם',
      comingSoon: 'בקרוב', cardSoonNote: 'תשלום בכרטיס אשראי — בקרוב.',
      placeOrder: (total) => `ביצוע הזמנה · ₪${total}`,
      addrSearch: 'רחוב ומספר — התחילו להקליד להצעות',
      addrVerifiedMsg: 'הכתובת אומתה',
      addrError: 'יש לבחור כתובת מאומתת מרשימת ההצעות.',
      addrManualError: 'נא להזין כתובת למשלוח.',
      contactError: 'נא להזין שם, אימייל תקין ומספר טלפון.',
      orderError: 'מצטערים — לא הצלחנו לבצע את ההזמנה. נסו שוב.',
      placing: 'מבצע הזמנה…',
      selectBranch: 'בחרו סניף',
      confirmedH1: 'ההזמנה אושרה',
      confirmedP: (total, id) => `הזמנה${id ? ` #${id}` : ''} · ₪${total}`,
      confirmedNote: 'חשבונית מס וקישור למעקב בדרך אליכם באימייל ובוואטסאפ.',
      thankYou: 'תודה', trackOrder: 'מעקב הזמנה', continueShopping: 'המשך קנייה',
      summary: 'סיכום הזמנה', qty: (n) => `כמות ${n}`, subtotal: 'סכום ביניים', shipping: 'משלוח', free: 'חינם', total: 'סה״כ',
    },

    brands: {
      eyebrow: 'המותגים שלנו', title: 'קנייה לפי מותג',
      sub: 'המותגים שאנחנו מציעים — מקוריים לחלוטין, באחריות יצרן מלאה.',
      count: (n) => `${n} ${n === 1 ? 'מוצר' : 'מוצרים'}`,
    },

    stores: {
      eyebrow: 'מצאו אותנו', h1: 'הסניפים שלנו',
      branch: 'סניף', bookHere: 'קביעת תור בסניף זה', directions: 'הוראות הגעה',
    },

    toast: { added: 'נוסף לעגלה' },
  },
}

// ---------------------------------------------------------------------------
// Arabic UI strings. Authored for the visible chrome; anything not overridden
// falls back to English via deepMerge below, so the table can never have a
// missing key (which would crash a component). Admin-entered CONTENT is
// auto-translated to Arabic separately (server-side), so product/homepage copy
// shows in Arabic regardless of this table.
// ---------------------------------------------------------------------------
const AR_UI = {
  langLabel: 'العربية',
  announce: 'شحن مجاني للطلبات فوق ₪400 · أكمل ضبط نظارتك في أي فرع',
  aria: { search: 'بحث', wishlist: 'المفضلة', account: 'الحساب', cart: 'السلة', menu: 'القائمة' },
  home: {
    hero_eyebrow: 'جديد · مجموعة 2026',
    hero_h1a: 'شاهد العالم', hero_h1b: 'بـ', hero_h1c: 'أناقة',
    hero_p: 'إطارات مصنوعة يدويًا وبضبط احترافي. جرّب أي نظارة عبر «المرآة الافتراضية» قبل الشراء — دون الحاجة إلى بطاقة للحجز.',
    cta_shop: 'تسوّق الإطارات', cta_book: 'احجز فحصًا', trusted: 'موثوق منذ 2009',
    hero_slot: 'أفلت صورة الغلاف هنا', tryReady: 'المرآة الافتراضية جاهزة',
    services_eyebrow: 'ماذا نقدّم', services_h2: 'رعاية كاملة للعين بأناقة',
    cat_eyebrow: 'الفئات', cat_h2: 'تسوّق حسب الفئة',
    cats: [
      { key: 'eyeglasses', label: 'نظارات طبية', slot: 'أفلت صورة النظارات الطبية' },
      { key: 'sunglasses', label: 'نظارات شمسية', slot: 'أفلت صورة النظارات الشمسية' },
      { key: 'contacts', label: 'عدسات لاصقة', slot: 'أفلت صورة العدسات اللاصقة' },
    ],
    best_eyebrow: 'الأكثر مبيعًا', best_h2: 'إطارات الموسم', viewall: 'عرض الكل',
    try_eyebrow: 'المرآة الافتراضية', try_h2: 'جرّبها من المنزل',
    try_p: 'تجربة افتراضية حيّة على جهازك. قارن الإطارات جنبًا إلى جنب، واحفظ إطلالاتك، وشاركها عبر واتساب. لا يُخزَّن أي شيء.',
    try_cta: 'ابدأ المرآة الافتراضية',
    showcase_eyebrow: 'المجموعة المميّزة', showcase_h2: 'صُمّمت لتُرى',
    showcase_p: 'إطارات مصنوعة بدقّة وبلمسة يدوية.',
  },
  footer: {
    blurb: 'نظارات ورعاية عيون فاخرة. جرّب أي إطار قبل الشراء.',
    cols: [
      { h: 'تسوّق', items: ['نظارات طبية', 'نظارات شمسية', 'عدسات لاصقة', 'إكسسوارات', 'بطاقات هدايا'] },
      { h: 'الخدمات', items: ['احجز فحص عيون', 'المرآة الافتراضية', 'دليل العدسات', 'مواقع الفروع', 'مساعدة الوصفة'] },
      { h: 'OPTIZONE', items: ['قصتنا', 'الفروع', 'الوظائف', 'المدوّنة', 'اتصل بنا'] },
    ],
    copyright: '© 2026 OPTIZONE · رؤية وأناقة',
    legal: ['بيان إمكانية الوصول (IS 5568)', 'الخصوصية', 'الشروط'],
  },
  catalog: {
    home: 'الرئيسية', title: 'نظارات طبية',
    filters: 'التصفية', clear: 'مسح', tryOnly: 'المرآة الافتراضية فقط',
    count: (n) => `${n} إطارات`, empty: 'لا توجد إطارات تطابق هذه التصفية.',
    sort: { popular: 'الترتيب: الأكثر رواجًا', asc: 'السعر: من الأقل للأعلى', desc: 'السعر: من الأعلى للأقل' },
  },
  product: {
    backTo: (l) => `→ العودة إلى ${l}`,
    inStock: 'متوفّر · نتانيا، تل أبيب',
    color: 'اللون', lensConfig: 'إعدادات العدسة',
    addToCart: (total) => `أضف إلى السلة · ₪${total}`, tryMirror: 'المرآة الافتراضية',
    freeShip: 'شحن مجاني فوق ₪400', reserveFit: 'احجز واضبط في المتجر',
    tabs: { desc: 'الوصف', specs: 'المواصفات', reviews: 'المراجعات' },
    notNow: 'ليس الآن', allowCamera: 'السماح بالكاميرا', consentTitle: 'موافقة الكاميرا والتجربة',
    mirrorSize: 'حجم الإطار', mirrorAdd: 'أضف إلى السلة', mirrorDownload: 'تنزيل الصورة',
    modeLive: 'مباشر', modePhoto: 'رفع صورة', modeVideo: 'رفع فيديو',
    specLabels: { brand: 'العلامة', shape: 'الشكل', material: 'المادة', gender: 'الفئة', lensWidth: 'عرض العدسة', bridge: 'الجسر', temple: 'طول الذراع', weight: 'الوزن', colorOpts: 'خيارات الألوان', lensOpts: 'خيارات العدسات', tryMirror: 'المرآة الافتراضية' },
  },
  cart: {
    emptyH1: 'سلتك فارغة', emptyP: 'اعثر على إطار تحبّه — وجرّبه قبل الشراء.', shop: 'تسوّق الإطارات',
    title: 'سلتك', lineNote: 'إطار + عدسة · مُعدّة',
    customSize: (v) => `مقاس مخصّص · ${v}`,
    summary: 'الملخّص', subtotal: 'المجموع الفرعي', shipping: 'الشحن', free: 'مجاني',
    promo: 'رمز الخصم', apply: 'تطبيق', total: 'الإجمالي',
    promoApplied: (c) => `الرمز ${c}`, promoInvalid: 'هذا الرمز غير صالح أو منتهي الصلاحية.',
    checkout: 'إتمام الشراء', reserve: 'احجز واضبط في المتجر',
  },
  search: {
    placeholder: 'ابحث عن إطارات، علامات، عدسات…',
    popular: 'عمليات بحث رائجة',
    results: (n) => `${n} ${n === 1 ? 'نتيجة' : 'نتائج'}`,
    none: (q) => `لا توجد إطارات تطابق «${q}». جرّب علامة أو شكلاً.`,
  },
  account: {
    welcome: 'مرحبًا بعودتك', signinSub: 'سجّل الدخول إلى حساب OPTIZONE',
    registerTitle: 'أنشئ حسابك', registerSub: 'تابع الطلبات، واحجز أسرع، واحفظ إطاراتك المفضّلة',
    name: 'الاسم الكامل', email: 'البريد الإلكتروني', phone: 'الهاتف · 05X-XXX-XXXX', password: 'كلمة المرور',
    pwHint: '6 أحرف على الأقل',
    signin: 'تسجيل الدخول', signup: 'إنشاء حساب', or: 'أو', google: 'المتابعة عبر Google',
    toRegister: 'جديد هنا؟ أنشئ حسابًا', toLogin: 'لديك حساب؟ سجّل الدخول',
    myAccount: 'حسابي', hello: (n) => `مرحبًا، ${n}`,
    stats: { orders: 'الطلبات', appts: 'المواعيد', wishlist: 'المفضّلة', spent: 'إجمالي الإنفاق' },
    tabs: { orders: 'طلباتي', appts: 'مواعيدي', wishlist: 'مفضّلتي', settings: 'إعداداتي' },
    signout: 'تسجيل الخروج',
    menu: { account: 'حسابي', orders: 'طلباتي', appts: 'مواعيدي', wishlist: 'مفضّلتي', settings: 'إعداداتي', signin: 'تسجيل الدخول', register: 'إنشاء حساب', signout: 'تسجيل الخروج' },
  },
  checkout: {
    title: 'إتمام الشراء', steps: ['التواصل', 'الشحن', 'الدفع'],
    contactTitle: 'بيانات التواصل', firstName: 'الاسم الأول', lastName: 'اسم العائلة', email: 'البريد الإلكتروني', phone: 'الهاتف · 05X-XXX-XXXX',
    toShipping: 'المتابعة إلى الشحن', deliveryTitle: 'طريقة التوصيل',
    homeDelivery: 'توصيل للمنزل', homeFree: 'مجاني · 2–4 أيام عمل', homePaid: '₪30 · 2–4 أيام عمل',
    pickup: 'الاستلام من الفرع', pickupSub: 'مجاني · جاهز خلال 1–2 يوم',
    addrTitle: 'عنوان الشحن', street: 'الشارع والرقم', apt: 'شقة / مدخل', city: 'المدينة', postal: 'الرمز البريدي',
    back: 'رجوع', toPayment: 'المتابعة إلى الدفع', payTitle: 'طريقة الدفع',
    cod: 'الدفع عند الاستلام', codSub: 'ادفع نقدًا عند وصول طلبك',
    comingSoon: 'قريبًا', cardSoonNote: 'مدفوعات البطاقة قريبًا.',
    placeOrder: (total) => `تأكيد الطلب · ₪${total}`,
    secure: 'لا تمرّ بيانات بطاقتك عبر خوادمنا · PCI-DSS عبر البوابة',
    addrVerifiedMsg: 'تم التحقق من العنوان',
    addrError: 'يرجى اختيار عنوان مُتحقّق منه من الاقتراحات.',
    addrManualError: 'يرجى إدخال عنوان الشحن.',
    contactError: 'يرجى إدخال اسمك وبريد إلكتروني صحيح ورقم هاتف.',
    orderError: 'عذرًا — تعذّر تنفيذ طلبك. حاول مرة أخرى.',
    placing: 'جارٍ تنفيذ الطلب…', selectBranch: 'اختر فرعًا',
    confirmedH1: 'تم تأكيد الطلب',
    confirmedP: (total, id) => `الطلب${id ? ` #${id}` : ''} · ₪${total}`,
    confirmedNote: 'فاتورة ضريبية ورابط تتبّع في الطريق عبر البريد وواتساب.',
    thankYou: 'شكرًا لك', trackOrder: 'تتبّع الطلب', continueShopping: 'متابعة التسوّق',
    summary: 'ملخّص الطلب', qty: (n) => `الكمية ${n}`, subtotal: 'المجموع الفرعي', shipping: 'الشحن', free: 'مجاني', total: 'الإجمالي',
  },
  booking: {
    eyebrow: 'احجز موعدًا', h1: 'رعاية العين وفق جدولك',
    calendlyEyebrow: 'احجز عبر الإنترنت', calendlyH: 'اختر وقتًا يناسبك',
    calendlySub: 'اختر موعدًا مباشرًا من تقويمنا — تأكيد فوري وإعادة جدولة مجانية.',
    calendlyLoading: 'جارٍ تحميل المُجدوِل…',
    calendlyOff: 'الحجز عبر الإنترنت غير متاح مؤقتًا — يرجى الاتصال بنا على',
    calendlyCta: 'حدّد وقتًا معي',
    calendlyBadgeHint: 'أو اضغط زر «حدّد وقتًا معي» في الزاوية في أي وقت.',
  },
  brands: {
    eyebrow: 'شركاؤنا', title: 'تسوّق حسب العلامة',
    sub: 'العلامات التي نوفّرها — أصلية 100% وبضمان الشركة المصنّعة الكامل.',
    count: (n) => `${n} ${n === 1 ? 'منتج' : 'منتجات'}`,
  },
  stores: {
    eyebrow: 'اعثر علينا', h1: 'فروعنا',
    branch: 'فرع', bookHere: 'احجز في هذا الفرع', directions: 'الحصول على الاتجاهات',
  },
  toast: { added: 'أُضيف إلى السلة' },
}

// Arabic catalog-attribute translations (mirrors ATTR_HE keys).
const ATTR_AR = {
  'Frame Shape': 'شكل الإطار', Material: 'المادة', Gender: 'الفئة',
  Round: 'دائري', Square: 'مربّع', 'Cat-eye': 'عين القطة', Oval: 'بيضوي', Aviator: 'أفياتور',
  Acetate: 'أسيتات', Metal: 'معدن', Titanium: 'تيتانيوم',
  Women: 'نساء', Men: 'رجال', Unisex: 'للجنسين', Kids: 'أطفال',
  'Eye Exams': 'فحوصات العين', 'Try Mirror': 'المرآة الافتراضية', 'Contact Lenses': 'عدسات لاصقة',
  'Frame Fitting': 'ضبط الإطار', Multifocal: 'متعدّد البؤر', Keratoconus: 'القرنية المخروطية',
  'Myopia Control': 'التحكّم في قصر النظر',
  'In lab': 'في المختبر', Collected: 'تم الاستلام', Shipped: 'تم الشحن',
  New: 'جديد', Cancelled: 'ملغى', Confirmed: 'مؤكّد', Completed: 'مكتمل',
  Daily: 'يومية', 'Bi-weekly': 'كل أسبوعين', Monthly: 'شهرية',
  'Silicone Hydrogel': 'هيدروجيل سيليكون', 'Water Gradient': 'تدرّج مائي',
}

// Deep-merge Arabic overrides over the English table so any missing Arabic key
// (or function entry) safely falls back to English — no missing-key crashes.
function deepMerge(base, over) {
  if (over === undefined || over === null) return base
  if (typeof base !== 'object' || base === null || Array.isArray(base) ||
      typeof over !== 'object' || Array.isArray(over)) return over
  const out = { ...base }
  for (const k of Object.keys(over)) out[k] = deepMerge(base[k], over[k])
  return out
}
STRINGS.ar = deepMerge(STRINGS.en, AR_UI)

// Per-language catalog-attribute maps (English passes through when absent).
const ATTR = { he: ATTR_HE, ar: ATTR_AR }

// The languages offered in the header switcher (order = display order).
export const LANGUAGES = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'he', label: 'עברית', short: 'עב' },
  { code: 'ar', label: 'العربية', short: 'ع' },
]
const RTL_LANGS = new Set(['he', 'ar'])
const isLang = (x) => LANGUAGES.some((l) => l.code === x)

const LangContext = createContext(null)

const LANG_KEY = 'oz_lang'

export function LangProvider({ children, defaultLang = 'en' }) {
  // The default stays exactly as configured (no geolocation/auto-detection);
  // a manual choice from the header toggle is persisted and wins on return
  // visits, so the language stays consistent across listing/PDP/cart/checkout.
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem(LANG_KEY)
      if (isLang(saved)) return saved
    } catch { /* private mode */ }
    return isLang(defaultLang) ? defaultLang : 'en'
  })
  const dir = RTL_LANGS.has(lang) ? 'rtl' : 'ltr'

  useEffect(() => {
    document.documentElement.dir = dir
    document.documentElement.lang = lang
    try { localStorage.setItem(LANG_KEY, lang) } catch { /* private mode */ }
  }, [lang, dir])

  // Admin live-preview iframe: the editor's language switch drives language.
  useEffect(() => {
    if (window.parent === window) return
    const onMsg = (e) => {
      if (e.origin !== window.location.origin) return
      if (e.data?.type === 'oz-preview-lang' && isLang(e.data.lang)) setLang(e.data.lang)
    }
    window.addEventListener('message', onMsg)
    return () => window.removeEventListener('message', onMsg)
  }, [])

  const value = useMemo(() => {
    const t = STRINGS[lang] || STRINGS.en
    // L: pick the right language from a bilingual value ({en,he,ar}) or pass a
    // plain string through; falls back to English when the language is missing.
    const L = (v) => (v && typeof v === 'object' && !Array.isArray(v) && ('en' in v || 'he' in v || 'ar' in v) ? (v[lang] ?? v.en) : v)
    // A: translate a catalog attribute value (English passes through).
    const A = (v) => (ATTR[lang] && ATTR[lang][v]) || v
    return {
      lang, dir, t, L, A,
      languages: LANGUAGES,
      setLang: (code) => { if (isLang(code)) setLang(code) },
      // Legacy 2-way callers: cycle through the available languages.
      toggle: () => setLang((l) => {
        const i = LANGUAGES.findIndex((x) => x.code === l)
        return LANGUAGES[(i + 1) % LANGUAGES.length].code
      }),
    }
  }, [lang])

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used within a LangProvider')
  return ctx
}
