import React, { useState, useRef, useEffect } from 'react'
import { Toast, Icon } from './ds/index.js'
import { useLang } from './i18n/index.jsx'
import { Header, Footer } from './pages/Chrome.jsx'
import { Home } from './pages/Home.jsx'
import { Catalog } from './pages/Catalog.jsx'
import { Brands } from './pages/Brands.jsx'
import { Product } from './pages/Product.jsx'
import { Booking } from './pages/Booking.jsx'
import { Cart } from './pages/Cart.jsx'
import { Search } from './pages/Search.jsx'
import { Account } from './pages/Account.jsx'
import { Checkout } from './pages/Checkout.jsx'
import { StoreLocator } from './pages/StoreLocator.jsx'

export default function App() {
  const { t } = useLang()
  const [route, setRoute] = useState('home')
  const [product, setProduct] = useState(null)
  // Cart persists across reloads so an accidental refresh doesn't lose it.
  const CART_KEY = 'oz_cart'
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem(CART_KEY)
      const v = raw ? JSON.parse(raw) : []
      if (!Array.isArray(v)) return []
      // Drop malformed entries so a corrupt cart can't crash the storefront.
      return v.filter((i) => i && typeof i === 'object' && i.id != null && Number.isFinite(i.amount) && Number.isInteger(i.qty) && i.qty > 0)
    } catch { return [] }
  })
  useEffect(() => {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)) } catch { /* private mode / full */ }
  }, [cart])
  const [toast, setToast] = useState(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [accountTab, setAccountTab] = useState('orders')
  // Which category the catalog page shows, and an optional brand filter
  // (set when arriving from the Brands page).
  const [catalogCat, setCatalogCat] = useState('eyeglasses')
  const [catalogBrand, setCatalogBrand] = useState(null)
  const toastTimer = useRef(null)

  const go = (r, p) => {
    if (p) setProduct(p)
    setRoute(r)
    window.scrollTo({ top: 0 })
  }
  // Open a category page (eyeglasses / sunglasses / contacts / 'all'),
  // optionally narrowed to a single brand.
  const openCatalog = (cat = 'eyeglasses', brand = null) => {
    setCatalogCat(cat)
    setCatalogBrand(brand)
    go('catalog')
  }
  const openAccount = (tab) => {
    if (tab) setAccountTab(tab)
    go('account')
  }
  // opts.customSize (e.g. "110%" from Try Mirror) creates its own cart line so
  // the chosen size follows the item through cart → checkout → order summary.
  const addToCart = (p, opts = {}) => {
    const customSize = opts.customSize || p.customSize || null
    const lineKey = (i) => `${i.id}|${i.customSize || ''}`
    const key = `${p.id}|${customSize || ''}`
    setCart((c) => {
      const found = c.find((i) => lineKey(i) === key)
      if (found) return c.map((i) => (lineKey(i) === key ? { ...i, qty: i.qty + 1 } : i))
      return [...c, { ...p, customSize, qty: 1 }]
    })
    setToast({ name: p.name, brand: p.brand })
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 2600)
  }
  const subtotal = cart.reduce((s, i) => s + i.amount * i.qty, 0)

  // Which navbar item is highlighted.
  const navActive =
    route === 'catalog' ? (catalogBrand || catalogCat === 'all' ? 'brands' : catalogCat)
    : route === 'brands' ? 'brands'
    : route === 'booking' ? 'book'
    : route === 'stores' ? 'stores'
    : ''

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header navActive={navActive} go={go} openCatalog={openCatalog} cartCount={cart.reduce((s, i) => s + i.qty, 0)} onSearch={() => setSearchOpen(true)} openAccount={openAccount} />
      <main style={{ flex: 1 }}>
        <div key={route + ':' + catalogCat + ':' + (catalogBrand || '')} className="oz-route">
          {route === 'home' && <Home go={go} openCatalog={openCatalog} addToCart={addToCart} />}
          {route === 'catalog' && <Catalog category={catalogCat} brand={catalogBrand} go={go} openCatalog={openCatalog} addToCart={addToCart} />}
          {route === 'brands' && <Brands openCatalog={openCatalog} />}
          {route === 'product' && <Product product={product} go={go} openCatalog={openCatalog} addToCart={addToCart} openAccount={openAccount} />}
          {route === 'booking' && <Booking go={go} />}
          {route === 'cart' && <Cart cart={cart} setCart={setCart} go={go} openCatalog={openCatalog} />}
          {route === 'stores' && <StoreLocator go={go} />}
          {route === 'account' && <Account go={go} openCatalog={openCatalog} tab={accountTab} setTab={setAccountTab} />}
          {route === 'checkout' && <Checkout cart={cart} subtotal={subtotal} go={go} onComplete={() => setCart([])} />}
        </div>
      </main>
      <Footer go={go} openCatalog={openCatalog} />

      <Search open={searchOpen} onClose={() => setSearchOpen(false)} go={go} />

      {toast && (
        <div className="oz-toast-enter" style={{ position: 'fixed', bottom: 24, insetInlineEnd: 24, zIndex: 2000, animation: 'oz-slide-in-end var(--dur-base) var(--ease-out) both' }}>
          <Toast variant="success" title={t.toast.added} icon={<Icon name="check-circle" size={18} />} onClose={() => setToast(null)}>
            {toast.brand} · {toast.name}
          </Toast>
        </div>
      )}
    </div>
  )
}
