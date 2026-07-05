import React, { useState, useRef } from 'react'
import { Toast, Icon } from './ds/index.js'
import { useLang } from './i18n/index.jsx'
import { Header, Footer } from './pages/Chrome.jsx'
import { Home } from './pages/Home.jsx'
import { Catalog } from './pages/Catalog.jsx'
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
  const [cart, setCart] = useState([])
  const [toast, setToast] = useState(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [accountTab, setAccountTab] = useState('orders')
  const toastTimer = useRef(null)

  const go = (r, p) => {
    if (p) setProduct(p)
    setRoute(r)
    window.scrollTo({ top: 0 })
  }
  // Open the account area on a specific tab (from the header menu / wishlist heart).
  const openAccount = (tab) => {
    if (tab) setAccountTab(tab)
    go('account')
  }
  const addToCart = (p) => {
    setCart((c) => {
      const found = c.find((i) => i.id === p.id)
      if (found) return c.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i))
      return [...c, { ...p, qty: 1 }]
    })
    setToast({ name: p.name, brand: p.brand })
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 2600)
  }
  const subtotal = cart.reduce((s, i) => s + i.amount * i.qty, 0)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header route={route} go={go} cartCount={cart.reduce((s, i) => s + i.qty, 0)} onSearch={() => setSearchOpen(true)} openAccount={openAccount} />
      <main style={{ flex: 1 }}>
        <div key={route} className="oz-route">
          {route === 'home' && <Home go={go} addToCart={addToCart} />}
          {route === 'catalog' && <Catalog go={go} addToCart={addToCart} />}
          {route === 'product' && <Product product={product} go={go} addToCart={addToCart} openAccount={openAccount} />}
          {route === 'booking' && <Booking go={go} />}
          {route === 'cart' && <Cart cart={cart} setCart={setCart} go={go} />}
          {route === 'stores' && <StoreLocator go={go} />}
          {route === 'account' && <Account go={go} tab={accountTab} setTab={setAccountTab} />}
          {route === 'checkout' && <Checkout cart={cart} subtotal={subtotal} go={go} onComplete={() => setCart([])} />}
        </div>
      </main>
      <Footer go={go} />

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
