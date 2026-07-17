// OPTIZONE storefront tests — run with the app served at BASE (default :5000):
//   node app.js            (terminal 1, after `npx vite build`)
//   node tests/storefront.test.mjs   (terminal 2)
//
// Covers: COD order path · address validation (Places + fallback) ·
// language-toggle persistence · Try Mirror custom-size cart persistence.
import { chromium } from 'playwright'

const BASE = process.env.BASE_URL || 'http://127.0.0.1:5000'
const EXEC = process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium'
let passed = 0, failed = 0
const ok = (m) => { passed++; console.log('   ✅ ' + m) }
const bad = (m) => { failed++; console.log('   ❌ ' + m) }
const expect = (cond, msg) => (cond ? ok(msg) : bad(msg))

// Minimal Google Maps mock so the Places flow is testable without a real key.
const GOOGLE_MOCK = `
window.google = { maps: {
  places: { AutocompleteService: class {
    getPlacePredictions(req, cb) {
      cb(req.input && req.input.length >= 3
        ? [{ description: 'Herzl St 12, Netanya, Israel', place_id: 'oz-test-place' }]
        : [])
    }
  } },
  Geocoder: class {
    geocode(req, cb) {
      cb([{
        address_components: [
          { long_name: '12', types: ['street_number'] },
          { long_name: 'Herzl St', types: ['route'] },
          { long_name: 'Netanya', types: ['locality'] },
          { long_name: '4210000', types: ['postal_code'] },
        ],
        formatted_address: 'Herzl St 12, Netanya, Israel',
        place_id: 'oz-test-place',
        geometry: { location: { lat: () => 32.3215, lng: () => 34.8532 } },
      }], 'OK')
    }
  },
} }`

async function withPage(browser, { mockMaps = false, captureOrder = false } = {}, fn) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } })
  const page = await ctx.newPage()
  const errors = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push('PAGEERROR ' + e.message))
  const captured = { order: null }
  if (mockMaps) {
    await page.addInitScript(GOOGLE_MOCK)
    await page.route('**/api/content', async (route) => {
      const res = await route.fetch()
      const json = await res.json()
      json.settings = { ...(json.settings || {}), mapsKey: 'TEST-KEY' }
      await route.fulfill({ response: res, body: JSON.stringify(json) })
    })
  }
  if (captureOrder) {
    await page.route('**/api/orders', async (route) => {
      captured.order = JSON.parse(route.request().postData() || '{}')
      await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ id: 'OZ-TEST' }) })
    })
  }
  try { await fn(page, captured, errors) } finally { await ctx.close() }
  return errors
}

async function fillContact(page) {
  await page.getByPlaceholder('First name').fill('Test')
  await page.getByPlaceholder('Last name').fill('Shopper')
  await page.getByPlaceholder('Email').fill('shopper@test.com')
  await page.getByPlaceholder(/Phone/).fill('052-000-0000')
  await page.getByRole('button', { name: 'Continue to shipping' }).click()
}

const browser = await chromium.launch({ executablePath: EXEC })

// ─────────────────────────────────────────────────────────────────────────────
console.log('\n== 1. COD order path (default method, card disabled, order placed) ==')
await withPage(browser, { captureOrder: true }, async (page, captured) => {
  await page.goto(BASE, { waitUntil: 'networkidle' })
  // PDP via first featured card → add to cart → cart → checkout
  await page.locator('main img, main svg').first().waitFor()
  await page.getByText('Round Metal RB3447').first().click()
  await page.getByRole('button', { name: /Add to Cart ·/ }).first().click()
  await page.getByRole('banner').getByRole('button', { name: 'Cart' }).click()
  await page.getByRole('button', { name: 'Checkout' }).click()
  await fillContact(page)
  // Shipping (no maps key → fallback): empty address must block with an error
  await page.getByRole('button', { name: 'Continue to payment' }).click()
  expect(await page.getByRole('alert').isVisible(), 'empty address blocks continue with inline error (fallback mode)')
  await page.getByPlaceholder(/Street & number/).fill('Herzl 12, Netanya')
  await page.getByRole('button', { name: 'Continue to payment' }).click()
  // Payment step assertions
  const codBtn = page.getByRole('button', { name: /Cash on Delivery/ })
  const cardBtn = page.getByRole('button', { name: /Credit \/ debit card/ })
  expect(await codBtn.isVisible(), 'COD option visible')
  expect(await cardBtn.isDisabled(), 'card option disabled')
  expect(await cardBtn.textContent().then((s) => s.includes('Coming Soon')), 'card shows "Coming Soon" badge')
  expect(await cardBtn.textContent().then((s) => s.includes('Card payments coming soon.')), 'card shows coming-soon subtext')
  expect(await page.getByPlaceholder('Card number').count() === 0, 'no card input fields rendered')
  const payOptions = await page.locator('button:has(span:text("Cash on Delivery")), button:has(span:text("Credit / debit card"))').count()
  expect(payOptions === 2, `exactly two payment methods shown (got ${payOptions})`)
  expect(await page.getByRole('button', { name: /Installments|תשלומים/ }).count() === 0, 'installments option removed')
  // Place the order (COD is default — no clicks on method needed)
  await page.getByRole('button', { name: /Place order ·/ }).click()
  await page.getByText('Order confirmed').waitFor()
  ok('order confirmation shown')
  expect(captured.order?.payment === 'cod', `order submitted with method=cod (got "${captured.order?.payment}")`)
  expect(captured.order?.addressVerified === false, 'addressVerified=false without Places verification')
})

// ─────────────────────────────────────────────────────────────────────────────
console.log('\n== 2. Realtime address validation (Google Places mock) ==')
await withPage(browser, { mockMaps: true, captureOrder: true }, async (page, captured) => {
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.getByText('Round Metal RB3447').first().click()
  await page.getByRole('button', { name: /Add to Cart ·/ }).first().click()
  await page.getByRole('banner').getByRole('button', { name: 'Cart' }).click()
  await page.getByRole('button', { name: 'Checkout' }).click()
  await fillContact(page)
  // With Places ready: typing without selecting a suggestion must NOT pass
  const addrInput = page.getByPlaceholder(/start typing for suggestions/)
  expect(await addrInput.isVisible(), 'autocomplete input active when a Maps key is configured')
  await addrInput.fill('Herzl 12')
  await page.getByRole('button', { name: 'Continue to payment' }).click()
  expect(await page.getByRole('alert').textContent().then((s) => s.includes('verified address')), 'unverified typed address blocked with inline error')
  // Pick the live suggestion → verified, city/postal auto-populated
  await addrInput.fill('Herzl')
  await page.getByRole('button', { name: /Herzl St 12, Netanya/ }).click()
  await page.getByText('Address verified').waitFor()
  ok('suggestion selected → "Address verified" indicator')
  expect(await page.getByPlaceholder('City').inputValue() === 'Netanya', 'city auto-populated from geocode')
  expect(await page.getByPlaceholder('Postal code').inputValue() === '4210000', 'postal code auto-populated from geocode')
  await page.getByRole('button', { name: 'Continue to payment' }).click()
  await page.getByText('Payment method').waitFor()
  ok('continue allowed after verification')
  await page.getByRole('button', { name: /Place order ·/ }).click()
  await page.getByText('Order confirmed').waitFor()
  const geo = captured.order?.customer?.geo
  expect(captured.order?.addressVerified === true, 'order flagged addressVerified=true')
  expect(!!geo && Math.abs(geo.lat - 32.3215) < 1e-6 && !!geo.placeId, `normalized geo stored on order (lat=${geo?.lat}, placeId=${geo?.placeId})`)
})

// ─────────────────────────────────────────────────────────────────────────────
console.log('\n== 3. Language toggle persistence (he ⇄ en, RTL, across pages/reloads) ==')
await withPage(browser, {}, async (page) => {
  await page.goto(BASE, { waitUntil: 'networkidle' })
  expect(await page.evaluate(() => document.documentElement.dir) === 'ltr', 'default language unchanged (en / ltr)')
  // Language switcher is a 3-way dropdown (English · עברית · العربية): open it, pick Hebrew.
  await page.getByRole('button', { name: /Language/ }).click()
  await page.getByRole('option', { name: 'עברית' }).click()
  await page.waitForTimeout(200)
  expect(await page.evaluate(() => document.documentElement.dir) === 'rtl', 'dir="rtl" applied when Hebrew active')
  expect(await page.evaluate(() => localStorage.getItem('oz_lang')) === 'he', 'choice persisted to localStorage')
  await page.reload({ waitUntil: 'networkidle' })
  expect(await page.evaluate(() => document.documentElement.dir) === 'rtl', 'Hebrew survives a full reload')
  // navigate listing → PDP → cart; language must stay Hebrew
  await page.getByText('משקפי ראייה').first().click()
  await page.waitForTimeout(300)
  expect(await page.evaluate(() => document.documentElement.lang) === 'he', 'Hebrew consistent on listing page')
  await page.getByRole('banner').getByRole('button', { name: 'עגלה' }).click()
  expect(await page.getByText('העגלה שלך').isVisible().catch(() => false) || await page.getByText('העגלה ריקה').isVisible().catch(() => true), 'Hebrew consistent on cart page')
  await page.getByRole('button', { name: /Language/ }).click()
  await page.getByRole('option', { name: 'English' }).click()
  await page.waitForTimeout(200)
  expect(await page.evaluate(() => localStorage.getItem('oz_lang')) === 'en', 'switching back persists en')
})

// ─────────────────────────────────────────────────────────────────────────────
console.log('\n== 4. Try Mirror custom size → cart → checkout → order payload ==')
await withPage(browser, { captureOrder: true }, async (page, captured) => {
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.getByText('Round Metal RB3447').first().click()
  // Try Mirror button sits on the product image; consent dialog gates the camera
  await page.locator('main').getByRole('button', { name: 'Try Mirror' }).first().click()
  await page.getByText('Camera & try-on consent').waitFor()
  ok('camera consent prompt shown')
  await page.getByRole('button', { name: 'Allow camera' }).click()
  await page.getByText('Frame size').waitFor()
  ok('try-on experience opens (3-mode modal)')
  // Size control: 100% → +5% twice = 110%
  await page.getByRole('button', { name: 'larger' }).click()
  await page.getByRole('button', { name: 'larger' }).click()
  expect(await page.getByText('110%').first().isVisible(), 'size control shows 110%')
  await page.getByRole('button', { name: /Add to Cart · 110%/ }).click()
  // custom size visible in cart
  await page.getByRole('banner').getByRole('button', { name: 'Cart' }).click()
  expect(await page.getByText('Custom size · 110%').isVisible(), 'cart line shows custom size 110%')
  // …and through checkout summary
  await page.getByRole('button', { name: 'Checkout' }).click()
  expect(await page.getByText('Custom size · 110%').isVisible(), 'checkout summary shows custom size')
  await fillContact(page)
  await page.getByRole('button', { name: 'Collect in branch' }).click()
  // Pickup now requires a deliberate branch choice (empty option is invalid).
  await page.locator('select').selectOption({ index: 1 })
  await page.getByRole('button', { name: 'Continue to payment' }).click()
  await page.getByRole('button', { name: /Place order ·/ }).click()
  await page.getByText('Order confirmed').waitFor()
  const item = (captured.order?.items || [])[0]
  expect(item?.customSize === '110%', `order line carries customSize (got "${item?.customSize}")`)
  expect(captured.order?.payment === 'cod', 'custom-size order also completes via COD')
})

await browser.close()
console.log(`\n${failed === 0 ? `🎉 ALL ${passed} CHECKS PASSED` : `❌ ${failed} FAILED · ${passed} passed`}`)
process.exit(failed === 0 ? 0 : 1)
