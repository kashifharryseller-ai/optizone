// OPTIZONE storefront — app router.
const { Toast, Icon } = window.OPTIZONEDesignSystem_ded4a5;

function App() {
  const [route, setRoute] = React.useState('home');
  const [product, setProduct] = React.useState(null);
  const [cart, setCart] = React.useState([]);
  const [toast, setToast] = React.useState(null);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [loggedIn, setLoggedIn] = React.useState(false);

  const go = (r, p) => {
    if (p) setProduct(p);
    setRoute(r);
    window.scrollTo({ top: 0 });
  };
  const addToCart = (p) => {
    setCart((c) => {
      const found = c.find((i) => i.id === p.id);
      if (found) return c.map((i) => i.id === p.id ? { ...i, qty: i.qty + 1 } : i);
      return [...c, { ...p, qty: 1 }];
    });
    setToast({ name: p.name, brand: p.brand });
    clearTimeout(window.__ozT);
    window.__ozT = setTimeout(() => setToast(null), 2600);
  };
  const subtotal = cart.reduce((s, i) => s + i.amount * i.qty, 0);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header route={route} go={go} cartCount={cart.reduce((s, i) => s + i.qty, 0)} onSearch={() => setSearchOpen(true)} loggedIn={loggedIn} />
      <main style={{ flex: 1 }}>
        <div key={route} className="oz-route">
          {route === 'home' && <Home go={go} addToCart={addToCart} />}
          {route === 'catalog' && <Catalog go={go} addToCart={addToCart} />}
          {route === 'product' && <Product product={product} go={go} addToCart={addToCart} />}
          {route === 'booking' && <Booking go={go} />}
          {route === 'cart' && <Cart cart={cart} setCart={setCart} go={go} />}
          {route === 'stores' && <StoreLocator go={go} />}
          {route === 'account' && <Account loggedIn={loggedIn} onLogin={() => setLoggedIn(true)} go={go} />}
          {route === 'checkout' && <Checkout cart={cart} subtotal={subtotal} go={go} onComplete={() => setCart([])} />}
        </div>
      </main>
      <Footer go={go} />

      <Search open={searchOpen} onClose={() => setSearchOpen(false)} go={go} />

      {toast && (
        <div style={{ position: 'fixed', bottom: 24, insetInlineEnd: 24, zIndex: 2000, animation: 'oz-slide-in-end var(--dur-base) var(--ease-out) both' }}>
          <Toast variant="success" title="Added to cart" icon={<Icon name="check-circle" size={18} />} onClose={() => setToast(null)}>
            {toast.brand} · {toast.name}
          </Toast>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
