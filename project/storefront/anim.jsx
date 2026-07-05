// OPTIZONE storefront — animation helpers (scroll reveal, staggering, scroll state).

// Reveal: fades + lifts children into view once, when scrolled near the viewport.
function Reveal({ children, delay = 0, as = 'div', style, ...rest }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { el.setAttribute('data-oz-in', ''); io.unobserve(el); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const Tag = as;
  return (
    <Tag ref={ref} data-oz-reveal="" style={{ transitionDelay: `${delay}ms`, ...style }} {...rest}>
      {children}
    </Tag>
  );
}

// useScrolled: true once the window has scrolled past `threshold` px.
function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);
  return scrolled;
}

// useCountUp: animate a number from 0 → target over `ms`.
function useCountUp(target, ms = 900) {
  const [val, setVal] = React.useState(0);
  React.useEffect(() => {
    let raf, start;
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / ms, 1);
      setVal(Math.round(target * ease(p)));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    // Safety: guarantee the final value even if rAF is throttled (background tab).
    const done = setTimeout(() => setVal(target), ms + 120);
    return () => { cancelAnimationFrame(raf); clearTimeout(done); };
  }, [target, ms]);
  return val;
}

Object.assign(window, { Reveal, useScrolled, useCountUp });
