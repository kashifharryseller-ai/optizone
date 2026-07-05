/* @ds-bundle: {"format":4,"namespace":"OPTIZONEDesignSystem_ded4a5","components":[{"name":"DiamondRule","sourcePath":"components/brand/DiamondRule.jsx"},{"name":"Icon","sourcePath":"components/brand/Icon.jsx"},{"name":"GlassesMark","sourcePath":"components/brand/Logo.jsx"},{"name":"Logo","sourcePath":"components/brand/Logo.jsx"},{"name":"Badge","sourcePath":"components/display/Badge.jsx"},{"name":"Card","sourcePath":"components/display/Card.jsx"},{"name":"Price","sourcePath":"components/display/Price.jsx"},{"name":"ProductCard","sourcePath":"components/display/ProductCard.jsx"},{"name":"Rating","sourcePath":"components/display/Rating.jsx"},{"name":"Tag","sourcePath":"components/display/Tag.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Button","sourcePath":"components/forms/Button.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"IconButton","sourcePath":"components/forms/IconButton.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"QuantityStepper","sourcePath":"components/forms/QuantityStepper.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/brand/DiamondRule.jsx":"4450a6e8ce75","components/brand/Icon.jsx":"7d5af067172e","components/brand/Logo.jsx":"b4a87c9c508e","components/display/Badge.jsx":"deafd21f17f7","components/display/Card.jsx":"8ce9a8532400","components/display/Price.jsx":"92562192e26c","components/display/ProductCard.jsx":"84328ca724b6","components/display/Rating.jsx":"e7650880fc03","components/display/Tag.jsx":"679a08626331","components/feedback/Dialog.jsx":"91b456946e06","components/feedback/Toast.jsx":"656654c504fb","components/forms/Button.jsx":"37e20d22a039","components/forms/Checkbox.jsx":"845d248d0b1f","components/forms/IconButton.jsx":"6bc39a7f4226","components/forms/Input.jsx":"62f6f4b432a9","components/forms/QuantityStepper.jsx":"ce77ddbbee79","components/forms/Select.jsx":"ee0a57b3d901","components/forms/Switch.jsx":"1ecfa41ad6d0","components/navigation/Tabs.jsx":"bf63be6f1cf3","ui_kits/admin/Appointments.jsx":"824f6b524b03","ui_kits/admin/Dashboard.jsx":"4e86f4f26bdb","ui_kits/admin/Orders.jsx":"b9f482075a3f","ui_kits/admin/Products.jsx":"0b365fb8e672","ui_kits/admin/Shell.jsx":"5f57717557f1","ui_kits/admin/UsersContent.jsx":"c0b80737a6f0","ui_kits/admin/anim.jsx":"e8b349c40e5e","ui_kits/admin/app.jsx":"42eda556dc20","ui_kits/admin/data.js":"c0d8f18ae468","ui_kits/storefront/Account.jsx":"a264487580f8","ui_kits/storefront/Booking.jsx":"02ab64309ef4","ui_kits/storefront/Cart.jsx":"52ae13c86393","ui_kits/storefront/Catalog.jsx":"a608721f1df5","ui_kits/storefront/Checkout.jsx":"b2af2a2007d9","ui_kits/storefront/Chrome.jsx":"c1d3b505567b","ui_kits/storefront/Home.jsx":"c0f86548f755","ui_kits/storefront/Product.jsx":"f16f4f51aefc","ui_kits/storefront/Search.jsx":"9bb9c5650ad4","ui_kits/storefront/StoreLocator.jsx":"b77c200023e2","ui_kits/storefront/anim.jsx":"e8b349c40e5e","ui_kits/storefront/app.jsx":"eb45792c4244","ui_kits/storefront/data.js":"583707fd650d"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.OPTIZONEDesignSystem_ded4a5 = window.OPTIZONEDesignSystem_ded4a5 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/brand/DiamondRule.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * DiamondRule — OPTIZONE's signature divider: a hairline (or two hairlines
 * flanking a small rotated-square diamond). The brand's typographic full-stop.
 */
function DiamondRule({
  label,
  // optional caps label rendered in place of / beside the diamond
  color = 'var(--amber-600)',
  diamond = true,
  width = '100%',
  style,
  ...rest
}) {
  const line = /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      height: 1,
      background: color,
      opacity: 0.8
    }
  });
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "separator",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      width,
      color,
      ...style
    }
  }, rest), line, label ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 13,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color,
      whiteSpace: 'nowrap'
    }
  }, label) : diamond ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      background: color,
      transform: 'rotate(45deg)',
      flex: '0 0 auto'
    }
  }) : null, line);
}
Object.assign(__ds_scope, { DiamondRule });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/DiamondRule.jsx", error: String((e && e.message) || e) }); }

// components/brand/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Icon — thin, single-weight line icon wrapper.
 * Substitutes Lucide (loaded from CDN as window.lucide) for OPTIZONE's bespoke
 * line set, matching its rounded, ~1.8px stroke. Also accepts a raw SVG child
 * (e.g. one of the brand glyphs in assets/icons) via `children`.
 */
function Icon({
  name,
  size = 20,
  strokeWidth = 1.8,
  color = 'currentColor',
  children,
  style,
  ...rest
}) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (children) return;
    const el = ref.current;
    if (!el || !window.lucide) return;
    el.innerHTML = '';
    const i = document.createElement('i');
    i.setAttribute('data-lucide', name);
    el.appendChild(i);
    try {
      window.lucide.createIcons({
        attrs: {
          width: size,
          height: size,
          'stroke-width': strokeWidth
        },
        nameAttr: 'data-lucide'
      });
    } catch (e) {/* lucide not ready */}
  }, [name, size, strokeWidth, children]);
  return /*#__PURE__*/React.createElement("span", _extends({
    ref: ref,
    className: "oz-icon",
    "aria-hidden": rest['aria-label'] ? undefined : true,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: size,
      height: size,
      color,
      flex: '0 0 auto',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Icon.jsx", error: String((e && e.message) || e) }); }

// components/brand/Logo.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * OPTIZONE glasses mark — reconstructed round-eyeglasses line symbol.
 * Uses currentColor so it can be tinted (amber on pine, pine on cream, etc.).
 */
function GlassesMark({
  size = 40,
  color = 'currentColor',
  strokeWidth = 2.4,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 120 46",
    width: size * (120 / 46),
    height: size,
    fill: "none",
    role: "img",
    "aria-label": "OPTIZONE",
    style: style
  }, rest), /*#__PURE__*/React.createElement("g", {
    stroke: color,
    strokeWidth: strokeWidth,
    fill: "none",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "40",
    cy: "24",
    r: "15"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "80",
    cy: "24",
    r: "15"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M55 17 q5 -5 10 0"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M25.5 18 q-6 -2 -10.5 1"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M94.5 18 q6 -2 10.5 1"
  })));
}

/**
 * OPTIZONE logo lockup. Renders mark + wordmark (OPTI + ZONE) and optional
 * tagline with the amber diamond rule. Theme picks colors for pine or cream
 * backgrounds. `variant` chooses the composition.
 */
function Logo({
  variant = 'lockup',
  // 'lockup' | 'horizontal' | 'wordmark' | 'mark'
  theme = 'dark',
  // 'dark' = for pine bg (light text) | 'light' = for cream bg (dark text)
  tagline = true,
  size = 44,
  // wordmark cap size in px
  style,
  ...rest
}) {
  const optiColor = theme === 'dark' ? 'var(--white)' : 'var(--pine-800)';
  const zoneColor = 'var(--amber-600)';
  const taglineColor = theme === 'dark' ? 'var(--cream-100)' : 'var(--pine-700)';
  const markSize = size * 0.62;
  const Wordmark = /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: size,
      lineHeight: 1,
      letterSpacing: '0.2em',
      display: 'flex',
      whiteSpace: 'nowrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: optiColor
    }
  }, "OPTI"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: zoneColor
    }
  }, "ZONE"));
  const Tagline = tagline && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: size * 0.18,
      color: 'var(--amber-600)',
      width: '100%',
      marginTop: size * 0.16
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      height: 1,
      background: 'currentColor',
      opacity: 0.85
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: size * 0.3,
      letterSpacing: '0.34em',
      color: taglineColor,
      textTransform: 'uppercase',
      paddingInlineStart: '0.34em'
    }
  }, "Vision\xA0&\xA0Style"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      height: 1,
      background: 'currentColor',
      opacity: 0.85
    }
  }));
  if (variant === 'mark') {
    return /*#__PURE__*/React.createElement(GlassesMark, _extends({
      size: size,
      color: zoneColor,
      style: style
    }, rest));
  }
  if (variant === 'wordmark') {
    return /*#__PURE__*/React.createElement("div", _extends({
      style: {
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        ...style
      }
    }, rest), Wordmark, Tagline);
  }
  if (variant === 'horizontal') {
    return /*#__PURE__*/React.createElement("div", _extends({
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: size * 0.34,
        ...style
      }
    }, rest), /*#__PURE__*/React.createElement(GlassesMark, {
      size: markSize,
      color: zoneColor
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'flex-start'
      }
    }, Wordmark, tagline && /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-display)',
        fontSize: size * 0.26,
        letterSpacing: '0.28em',
        color: taglineColor,
        textTransform: 'uppercase',
        marginTop: size * 0.1,
        paddingInlineStart: '0.28em'
      }
    }, "Vision\xA0&\xA0Style")));
  }

  // lockup (centered, stacked)
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(GlassesMark, {
    size: markSize,
    color: zoneColor,
    style: {
      marginBottom: size * 0.24
    }
  }), Wordmark, Tagline);
}
Object.assign(__ds_scope, { GlassesMark, Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Logo.jsx", error: String((e && e.message) || e) }); }

// components/display/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Badge — small status pill (new / bestseller / sale / try-mirror). */
function Badge({
  variant = 'neutral',
  // 'neutral' | 'new' | 'sale' | 'bestseller' | 'try' | 'success' | 'danger'
  children,
  style,
  ...rest
}) {
  const variants = {
    neutral: {
      background: 'var(--cream-300)',
      color: 'var(--ink-700)'
    },
    new: {
      background: 'var(--pine-700)',
      color: 'var(--cream-100)'
    },
    sale: {
      background: 'var(--amber-600)',
      color: 'var(--pine-950)'
    },
    bestseller: {
      background: 'var(--amber-100)',
      color: 'var(--amber-800)'
    },
    try: {
      background: 'var(--pine-50)',
      color: 'var(--pine-700)'
    },
    success: {
      background: '#E4F0E7',
      color: 'var(--success)'
    },
    danger: {
      background: '#F6E3DE',
      color: 'var(--danger)'
    }
  }[variant];
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      height: 22,
      padding: '0 10px',
      fontFamily: 'var(--font-display)',
      fontSize: 11,
      fontWeight: 500,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      borderRadius: 'var(--radius-xs)',
      whiteSpace: 'nowrap',
      ...variants,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Badge.jsx", error: String((e && e.message) || e) }); }

// components/display/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Card — white surface on cream, hairline border, soft warm shadow. */
function Card({
  variant = 'default',
  // 'default' | 'flat' | 'dark' | 'outline'
  padding = 'md',
  // 'none' | 'sm' | 'md' | 'lg'
  hover = false,
  children,
  style,
  ...rest
}) {
  const pads = {
    none: 0,
    sm: 16,
    md: 24,
    lg: 32
  }[padding];
  const variants = {
    default: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-hair)',
      boxShadow: 'var(--shadow-sm)',
      color: 'var(--text-body)'
    },
    flat: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-hair)',
      boxShadow: 'none',
      color: 'var(--text-body)'
    },
    outline: {
      background: 'transparent',
      border: '1px solid var(--border-strong)',
      boxShadow: 'none',
      color: 'var(--text-body)'
    },
    dark: {
      background: 'var(--pine-700)',
      border: '1px solid var(--border-on-dark)',
      boxShadow: 'var(--shadow-dark)',
      color: 'var(--cream-100)'
    }
  }[variant];
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", _extends({
    onMouseEnter: () => hover && setH(true),
    onMouseLeave: () => hover && setH(false),
    style: {
      borderRadius: 'var(--radius-card)',
      padding: pads,
      transition: 'transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)',
      transform: h ? 'translateY(-3px)' : 'none',
      boxShadow: h ? 'var(--shadow-md)' : variants.boxShadow,
      ...variants,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Card.jsx", error: String((e && e.message) || e) }); }

// components/display/Price.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Price — shekel price with optional strikethrough original + discount. */
function Price({
  amount,
  original,
  currency = '₪',
  size = 'md',
  // 'sm' | 'md' | 'lg'
  align = 'start',
  style,
  ...rest
}) {
  const sizes = {
    sm: 16,
    md: 20,
    lg: 28
  }[size];
  const fmt = n => `${currency}${Number(n).toLocaleString('he-IL')}`;
  const off = original ? Math.round((1 - amount / original) * 100) : 0;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'baseline',
      gap: 10,
      justifyContent: align,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: sizes,
      color: original ? 'var(--amber-700)' : 'var(--text-strong)',
      letterSpacing: '0.01em'
    }
  }, fmt(amount)), original && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: sizes * 0.66,
      color: 'var(--text-faint)',
      textDecoration: 'line-through'
    }
  }, fmt(original)), original && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 11,
      fontWeight: 500,
      letterSpacing: '0.08em',
      color: 'var(--pine-950)',
      background: 'var(--amber-600)',
      padding: '2px 6px',
      borderRadius: 'var(--radius-xs)'
    }
  }, "\u2212", off, "%"));
}
Object.assign(__ds_scope, { Price });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Price.jsx", error: String((e && e.message) || e) }); }

// components/display/Rating.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Rating — amber star rating with optional count. */
function Rating({
  value = 0,
  max = 5,
  count,
  size = 16,
  style,
  ...rest
}) {
  const stars = [];
  for (let i = 0; i < max; i++) {
    const fill = Math.max(0, Math.min(1, value - i));
    stars.push(/*#__PURE__*/React.createElement("span", {
      key: i,
      style: {
        position: 'relative',
        width: size,
        height: size,
        display: 'inline-block'
      }
    }, /*#__PURE__*/React.createElement(Star, {
      size: size,
      color: "var(--ink-200)"
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        inset: 0,
        width: `${fill * 100}%`,
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement(Star, {
      size: size,
      color: "var(--amber-600)"
    }))));
  }
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      gap: 2
    }
  }, stars), count != null && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--text-muted)'
    }
  }, "(", count, ")"));
}
function Star({
  size,
  color
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: color,
    style: {
      display: 'block'
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 2.5l2.9 5.9 6.5.95-4.7 4.58 1.11 6.47L12 17.9l-5.81 3.06 1.11-6.47-4.7-4.58 6.5-.95z"
  }));
}
Object.assign(__ds_scope, { Rating });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Rating.jsx", error: String((e && e.message) || e) }); }

// components/display/ProductCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * ProductCard — frame/product tile: image, brand eyebrow, name, price, rating,
 * status badge, Try-Mirror availability, and hover lift. Composes Badge/Price/Rating.
 */
function ProductCard({
  image,
  brand,
  name,
  amount,
  original,
  rating,
  reviewCount,
  badge,
  // {variant, label}
  tryMirror = false,
  colors = [],
  // array of hex swatches
  onQuickAdd,
  style,
  ...rest
}) {
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", _extends({
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-hair)',
      borderRadius: 'var(--radius-card)',
      overflow: 'hidden',
      boxShadow: h ? 'var(--shadow-md)' : 'var(--shadow-xs)',
      transform: h ? 'translateY(-4px)' : 'none',
      transition: 'transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      aspectRatio: '4 / 3',
      background: 'var(--cream-300)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, image ? /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }) : /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 120 46",
    width: "46%",
    fill: "none",
    style: {
      opacity: 0.35
    }
  }, /*#__PURE__*/React.createElement("g", {
    stroke: "var(--pine-500)",
    strokeWidth: "2.4",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "40",
    cy: "24",
    r: "15"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "80",
    cy: "24",
    r: "15"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M55 17 q5 -5 10 0"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M25.5 18 q-6 -2 -10.5 1"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M94.5 18 q6 -2 10.5 1"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 12,
      insetInlineStart: 12,
      display: 'flex',
      gap: 6
    }
  }, badge && /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    variant: badge.variant
  }, badge.label)), tryMirror && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 12,
      insetInlineEnd: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      height: 26,
      padding: '0 10px',
      background: 'rgba(18,36,26,0.82)',
      color: 'var(--cream-100)',
      borderRadius: 999,
      fontFamily: 'var(--font-display)',
      fontSize: 10,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      backdropFilter: 'blur(4px)'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--amber-500)",
    strokeWidth: "2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "13",
    r: "3.5"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "17",
    cy: "13",
    r: "3.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M10.5 12.5c.7-.7 2.3-.7 3 0"
  })), "Try Mirror"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 18px 18px',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      flex: 1
    }
  }, brand && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 11,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: 'var(--text-accent)'
    }
  }, brand), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 16,
      fontWeight: 600,
      color: 'var(--text-strong)',
      lineHeight: 1.3
    }
  }, name), rating != null && /*#__PURE__*/React.createElement(__ds_scope.Rating, {
    value: rating,
    count: reviewCount,
    size: 14
  }), colors.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      marginTop: 2
    }
  }, colors.map((c, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      width: 16,
      height: 16,
      borderRadius: 999,
      background: c,
      border: '1px solid var(--border-hair)'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 'auto',
      paddingTop: 8
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Price, {
    amount: amount,
    original: original,
    size: "md"
  }), onQuickAdd && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onQuickAdd,
    "aria-label": "Add to cart",
    style: {
      width: 40,
      height: 40,
      borderRadius: 'var(--radius-sm)',
      border: 'none',
      cursor: 'pointer',
      background: h ? 'var(--amber-600)' : 'var(--pine-700)',
      color: h ? 'var(--pine-950)' : 'var(--cream-100)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background var(--dur-fast) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.9",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3 6h18"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16 10a4 4 0 0 1-8 0"
  }))))));
}
Object.assign(__ds_scope, { ProductCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/ProductCard.jsx", error: String((e && e.message) || e) }); }

// components/display/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Tag — filter chip / attribute pill, optionally selectable and removable. */
function Tag({
  selected = false,
  onClick,
  onRemove,
  children,
  style,
  ...rest
}) {
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("span", _extends({
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      height: 34,
      padding: '0 14px',
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      fontWeight: 500,
      borderRadius: 'var(--radius-pill)',
      border: `1px solid ${selected ? 'var(--pine-700)' : 'var(--border-hair)'}`,
      background: selected ? 'var(--pine-700)' : h ? 'var(--pine-50)' : 'var(--white)',
      color: selected ? 'var(--cream-100)' : 'var(--text-body)',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'all var(--dur-fast) var(--ease-out)',
      ...style
    }
  }, rest), children, onRemove && /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "remove",
    onClick: e => {
      e.stopPropagation();
      onRemove();
    },
    style: {
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      padding: 0,
      display: 'inline-flex',
      color: 'inherit',
      opacity: 0.7
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.4",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M18 6 6 18M6 6l12 12"
  }))));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Tag.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Dialog — centered modal on a pine scrim. Used for consent prompts (camera
 * try-on), confirmations, and quick views.
 */
function Dialog({
  open,
  onClose,
  title,
  eyebrow,
  children,
  footer,
  width = 480,
  style,
  ...rest
}) {
  React.useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape' && onClose) onClose();
    };
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      background: 'var(--overlay-scrim)',
      backdropFilter: 'blur(3px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      animation: 'ozFade var(--dur-base) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("style", null, '@keyframes ozFade{from{opacity:0}to{opacity:1}}@keyframes ozRise{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}'), /*#__PURE__*/React.createElement("div", _extends({
    role: "dialog",
    "aria-modal": "true",
    onClick: e => e.stopPropagation(),
    style: {
      width,
      maxWidth: '100%',
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-lg)',
      animation: 'ozRise var(--dur-slow) var(--ease-out)',
      overflow: 'hidden',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '28px 28px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, eyebrow && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 12,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: 'var(--text-accent)'
    }
  }, eyebrow), title && /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontSize: 22,
      color: 'var(--text-strong)'
    }
  }, title)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      color: 'var(--text-body)',
      lineHeight: 1.55
    }
  }, children)), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 28px',
      borderTop: '1px solid var(--border-hair)',
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 12,
      background: 'var(--cream-100)'
    }
  }, footer)));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Toast — transient notice. Compose with your own state / timeout. */
function Toast({
  variant = 'default',
  // 'default' | 'success' | 'danger' | 'accent'
  icon,
  title,
  children,
  onClose,
  style,
  ...rest
}) {
  const accents = {
    default: 'var(--pine-700)',
    success: 'var(--success)',
    danger: 'var(--danger)',
    accent: 'var(--amber-600)'
  }[variant];
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      minWidth: 280,
      maxWidth: 400,
      padding: '14px 16px',
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-lg)',
      borderInlineStart: `3px solid ${accents}`,
      ...style
    }
  }, rest), icon && /*#__PURE__*/React.createElement("span", {
    style: {
      color: accents,
      display: 'inline-flex',
      marginTop: 1
    }
  }, icon), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      fontSize: 14.5,
      color: 'var(--text-strong)'
    }
  }, title), children && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      color: 'var(--text-muted)',
      marginTop: title ? 2 : 0
    }
  }, children)), onClose && /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "dismiss",
    onClick: onClose,
    style: {
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      color: 'var(--text-faint)',
      padding: 0,
      display: 'inline-flex'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M18 6 6 18M6 6l12 12"
  }))));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/forms/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Button — OPTIZONE call-to-action. All-caps geometric label with wide tracking.
 * Primary = amber, Solid = pine, Outline, Ghost, Link.
 */
function Button({
  variant = 'primary',
  // 'primary' | 'solid' | 'outline' | 'ghost' | 'link'
  size = 'md',
  // 'sm' | 'md' | 'lg'
  startIcon,
  endIcon,
  block = false,
  disabled = false,
  children,
  style,
  ...rest
}) {
  const sizes = {
    sm: {
      padding: '0 16px',
      height: 38,
      fontSize: 12,
      gap: 8
    },
    md: {
      padding: '0 24px',
      height: 46,
      fontSize: 13,
      gap: 10
    },
    lg: {
      padding: '0 34px',
      height: 56,
      fontSize: 15,
      gap: 12
    }
  }[size];
  const base = {
    display: block ? 'flex' : 'inline-flex',
    width: block ? '100%' : undefined,
    alignItems: 'center',
    justifyContent: 'center',
    gap: sizes.gap,
    height: sizes.height,
    padding: sizes.padding,
    fontFamily: 'var(--font-display)',
    fontWeight: 500,
    fontSize: sizes.fontSize,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    border: '1px solid transparent',
    borderRadius: 'var(--radius-sm)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)',
    whiteSpace: 'nowrap',
    userSelect: 'none'
  };
  const variants = {
    primary: {
      background: 'var(--amber-600)',
      color: 'var(--pine-950)',
      borderColor: 'var(--amber-600)'
    },
    solid: {
      background: 'var(--pine-700)',
      color: 'var(--cream-100)',
      borderColor: 'var(--pine-700)'
    },
    outline: {
      background: 'transparent',
      color: 'var(--pine-700)',
      borderColor: 'var(--pine-700)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--pine-700)',
      borderColor: 'transparent'
    },
    link: {
      background: 'transparent',
      color: 'var(--amber-700)',
      borderColor: 'transparent',
      height: 'auto',
      padding: 0,
      letterSpacing: '0.1em'
    }
  }[variant];
  const hover = {
    primary: {
      background: 'var(--amber-700)',
      borderColor: 'var(--amber-700)'
    },
    solid: {
      background: 'var(--pine-800)',
      borderColor: 'var(--pine-800)'
    },
    outline: {
      background: 'var(--pine-700)',
      color: 'var(--cream-100)'
    },
    ghost: {
      background: 'var(--pine-50)'
    },
    link: {
      color: 'var(--amber-800)'
    }
  }[variant];
  const [h, setH] = React.useState(false);
  const [p, setP] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    disabled: disabled,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => {
      setH(false);
      setP(false);
    },
    onMouseDown: () => setP(true),
    onMouseUp: () => setP(false),
    style: {
      ...base,
      ...variants,
      ...(h && !disabled ? hover : null),
      transform: p && !disabled ? 'translateY(1px)' : 'none',
      ...style
    }
  }, rest), startIcon, children, endIcon);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Button.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Checkbox — square check with amber fill when selected. */
function Checkbox({
  checked,
  defaultChecked,
  onChange,
  label,
  disabled,
  id,
  style,
  ...rest
}) {
  const isControlled = checked !== undefined;
  const [internal, setInternal] = React.useState(!!defaultChecked);
  const on = isControlled ? checked : internal;
  const cbId = id || React.useId();
  const toggle = () => {
    if (disabled) return;
    if (!isControlled) setInternal(!on);
    onChange && onChange(!on);
  };
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: cbId,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    id: cbId,
    type: "checkbox",
    checked: on,
    onChange: toggle,
    disabled: disabled,
    style: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0
    }
  }, rest)), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 20,
      height: 20,
      borderRadius: 'var(--radius-xs)',
      border: `1.5px solid ${on ? 'var(--amber-600)' : 'var(--border-strong)'}`,
      background: on ? 'var(--amber-600)' : 'var(--white)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all var(--dur-fast) var(--ease-out)',
      flex: '0 0 auto'
    }
  }, on && /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--pine-950)",
    strokeWidth: "3.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 6L9 17l-5-5"
  }))), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      color: 'var(--text-body)'
    }
  }, label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * IconButton — square/circular button for a single icon (cart, search, menu…).
 */
function IconButton({
  variant = 'ghost',
  // 'ghost' | 'solid' | 'outline' | 'accent'
  size = 'md',
  // 'sm' | 'md' | 'lg'
  round = false,
  disabled = false,
  children,
  style,
  ...rest
}) {
  const dim = {
    sm: 34,
    md: 44,
    lg: 52
  }[size];
  const variants = {
    ghost: {
      background: 'transparent',
      color: 'var(--pine-700)',
      border: '1px solid transparent'
    },
    outline: {
      background: 'transparent',
      color: 'var(--pine-700)',
      border: '1px solid var(--border-hair)'
    },
    solid: {
      background: 'var(--pine-700)',
      color: 'var(--cream-100)',
      border: '1px solid var(--pine-700)'
    },
    accent: {
      background: 'var(--amber-600)',
      color: 'var(--pine-950)',
      border: '1px solid var(--amber-600)'
    }
  }[variant];
  const [h, setH] = React.useState(false);
  const hover = {
    ghost: {
      background: 'var(--pine-50)'
    },
    outline: {
      background: 'var(--pine-50)',
      borderColor: 'var(--pine-300)'
    },
    solid: {
      background: 'var(--pine-800)'
    },
    accent: {
      background: 'var(--amber-700)',
      borderColor: 'var(--amber-700)'
    }
  }[variant];
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    disabled: disabled,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: dim,
      height: dim,
      borderRadius: round ? '999px' : 'var(--radius-sm)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      transition: 'background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)',
      ...variants,
      ...(h && !disabled ? hover : null),
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Input — text field with optional label, caps eyebrow style, helper/error text,
 * and leading/trailing adornments. RTL-aware.
 */
function Input({
  label,
  helper,
  error,
  startAdornment,
  endAdornment,
  size = 'md',
  // 'sm' | 'md' | 'lg'
  id,
  style,
  containerStyle,
  ...rest
}) {
  const heights = {
    sm: 40,
    md: 48,
    lg: 56
  }[size];
  const [focus, setFocus] = React.useState(false);
  const inputId = id || React.useId();
  const borderColor = error ? 'var(--danger)' : focus ? 'var(--amber-600)' : 'var(--border-hair)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      ...containerStyle
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 12,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      fontWeight: 500
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      height: heights,
      padding: '0 14px',
      background: 'var(--white)',
      border: `1px solid ${borderColor}`,
      borderRadius: 'var(--radius-sm)',
      boxShadow: focus ? '0 0 0 3px var(--amber-100)' : 'none',
      transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)'
    }
  }, startAdornment && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      color: 'var(--text-faint)'
    }
  }, startAdornment), /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      flex: 1,
      minWidth: 0,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      fontFamily: 'var(--font-body)',
      fontSize: 15,
      color: 'var(--text-strong)',
      ...style
    }
  }, rest)), endAdornment && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      color: 'var(--text-faint)'
    }
  }, endAdornment)), (helper || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      color: error ? 'var(--danger)' : 'var(--text-muted)'
    }
  }, error || helper));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/QuantityStepper.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** QuantityStepper — −/+ control for cart quantities. */
function QuantityStepper({
  value,
  defaultValue = 1,
  min = 1,
  max = 99,
  onChange,
  size = 'md',
  style,
  ...rest
}) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue);
  const v = isControlled ? value : internal;
  const dim = {
    sm: 34,
    md: 42
  }[size] || 42;
  const set = next => {
    const clamped = Math.max(min, Math.min(max, next));
    if (!isControlled) setInternal(clamped);
    onChange && onChange(clamped);
  };
  const btn = (label, onClick, disabled) => /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClick,
    disabled: disabled,
    "aria-label": label === '−' ? 'decrease' : 'increase',
    style: {
      width: dim,
      height: dim,
      border: 'none',
      background: 'transparent',
      fontFamily: 'var(--font-display)',
      fontSize: 20,
      lineHeight: 1,
      color: disabled ? 'var(--text-faint)' : 'var(--pine-700)',
      cursor: disabled ? 'not-allowed' : 'pointer'
    }
  }, label);
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      border: '1px solid var(--border-hair)',
      borderRadius: 'var(--radius-sm)',
      background: 'var(--white)',
      ...style
    }
  }, rest), btn('−', () => set(v - 1), v <= min), /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: dim,
      textAlign: 'center',
      fontFamily: 'var(--font-body)',
      fontSize: 15,
      fontWeight: 600,
      color: 'var(--text-strong)',
      borderInline: '1px solid var(--border-hair)',
      lineHeight: `${dim}px`
    }
  }, v), btn('+', () => set(v + 1), v >= max));
}
Object.assign(__ds_scope, { QuantityStepper });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/QuantityStepper.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Select — native <select> styled to match Input, with caps label and chevron.
 */
function Select({
  label,
  helper,
  error,
  options = [],
  // [{value, label}] or string[]
  placeholder,
  size = 'md',
  id,
  style,
  containerStyle,
  ...rest
}) {
  const heights = {
    sm: 40,
    md: 48,
    lg: 56
  }[size];
  const [focus, setFocus] = React.useState(false);
  const selId = id || React.useId();
  const borderColor = error ? 'var(--danger)' : focus ? 'var(--amber-600)' : 'var(--border-hair)';
  const norm = options.map(o => typeof o === 'string' ? {
    value: o,
    label: o
  } : o);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      ...containerStyle
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: selId,
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 12,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      fontWeight: 500
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: selId,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      appearance: 'none',
      WebkitAppearance: 'none',
      width: '100%',
      height: heights,
      padding: '0 40px 0 14px',
      background: 'var(--white)',
      border: `1px solid ${borderColor}`,
      borderRadius: 'var(--radius-sm)',
      boxShadow: focus ? '0 0 0 3px var(--amber-100)' : 'none',
      fontFamily: 'var(--font-body)',
      fontSize: 15,
      color: 'var(--text-strong)',
      cursor: 'pointer',
      outline: 'none',
      transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
      ...style
    }
  }, rest), placeholder && /*#__PURE__*/React.createElement("option", {
    value: "",
    disabled: true
  }, placeholder), norm.map(o => /*#__PURE__*/React.createElement("option", {
    key: o.value,
    value: o.value
  }, o.label))), /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--text-muted)",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      position: 'absolute',
      right: 14,
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 9l6 6 6-6"
  }))), (helper || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      color: error ? 'var(--danger)' : 'var(--text-muted)'
    }
  }, error || helper));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Switch — pill toggle, amber when on. */
function Switch({
  checked,
  defaultChecked,
  onChange,
  label,
  disabled,
  id,
  style,
  ...rest
}) {
  const isControlled = checked !== undefined;
  const [internal, setInternal] = React.useState(!!defaultChecked);
  const on = isControlled ? checked : internal;
  const swId = id || React.useId();
  const toggle = () => {
    if (disabled) return;
    if (!isControlled) setInternal(!on);
    onChange && onChange(!on);
  };
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: swId,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    id: swId,
    type: "checkbox",
    checked: on,
    onChange: toggle,
    disabled: disabled,
    style: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0
    }
  }, rest)), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 46,
      height: 26,
      borderRadius: 999,
      padding: 3,
      background: on ? 'var(--amber-600)' : 'var(--ink-300)',
      display: 'inline-flex',
      alignItems: 'center',
      transition: 'background var(--dur-base) var(--ease-out)',
      flex: '0 0 auto'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 20,
      height: 20,
      borderRadius: 999,
      background: 'var(--white)',
      boxShadow: 'var(--shadow-sm)',
      transform: on ? 'translateX(20px)' : 'translateX(0)',
      transition: 'transform var(--dur-base) var(--ease-out)'
    }
  })), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      color: 'var(--text-body)'
    }
  }, label));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Tabs — underlined tab bar with amber active indicator. */
function Tabs({
  tabs = [],
  value,
  defaultValue,
  onChange,
  style,
  ...rest
}) {
  const isControlled = value !== undefined;
  const norm = tabs.map(t => typeof t === 'string' ? {
    value: t,
    label: t
  } : t);
  const [internal, setInternal] = React.useState(defaultValue ?? norm[0]?.value);
  const active = isControlled ? value : internal;
  const select = v => {
    if (!isControlled) setInternal(v);
    onChange && onChange(v);
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "tablist",
    style: {
      display: 'flex',
      gap: 4,
      borderBottom: '1px solid var(--border-hair)',
      ...style
    }
  }, rest), norm.map(t => {
    const on = t.value === active;
    return /*#__PURE__*/React.createElement("button", {
      key: t.value,
      role: "tab",
      "aria-selected": on,
      onClick: () => select(t.value),
      style: {
        position: 'relative',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        padding: '12px 18px',
        marginBottom: -1,
        fontFamily: 'var(--font-display)',
        fontSize: 13,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        fontWeight: 500,
        color: on ? 'var(--pine-800)' : 'var(--text-muted)',
        borderBottom: `2px solid ${on ? 'var(--amber-600)' : 'transparent'}`,
        transition: 'color var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)'
      }
    }, t.label);
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/Appointments.jsx
try { (() => {
// OPTIZONE Admin — Appointments per branch (FR-59).
const {
  Icon,
  IconButton,
  Button,
  Badge,
  Select
} = window.OPTIZONEDesignSystem_ded4a5;
const APPT_VARIANT = {
  Confirmed: 'success',
  Pending: 'bestseller',
  'No-show': 'danger'
};
function Appointments() {
  const A = window.OZ_ADMIN;
  const [branch, setBranch] = React.useState('All branches');
  React.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  });
  const list = A.appointments.filter(a => branch === 'All branches' || a.branch === branch);
  const days = ['Sun 5', 'Mon 6', 'Tue 7', 'Wed 8', 'Thu 9'];
  const [day, setDay] = React.useState('Sun 5');
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginBottom: 18,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 200
    }
  }, /*#__PURE__*/React.createElement(Select, {
    value: branch,
    onChange: e => setBranch(e.target.value),
    options: A.branches.map(b => ({
      value: b,
      label: b
    }))
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginInlineStart: 'auto'
    }
  }, days.map(d => /*#__PURE__*/React.createElement("button", {
    key: d,
    onClick: () => setDay(d),
    style: {
      padding: '8px 14px',
      borderRadius: 'var(--radius-sm)',
      border: `1.5px solid ${day === d ? 'var(--pine-700)' : 'var(--border-hair)'}`,
      background: day === d ? 'var(--pine-700)' : 'var(--surface-card)',
      color: day === d ? 'var(--cream-100)' : 'var(--text-body)',
      cursor: 'pointer',
      fontFamily: 'var(--font-display)',
      fontSize: 12.5,
      letterSpacing: '0.04em'
    }
  }, d)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr 1fr',
      gap: 14,
      marginBottom: 20
    }
  }, [['Today', list.length, 'calendar'], ['Confirmed', list.filter(a => a.status === 'Confirmed').length, 'check-circle'], ['Pending', list.filter(a => a.status === 'Pending').length, 'clock'], ['No-shows', list.filter(a => a.status === 'No-show').length, 'user-x']].map(([l, v, ic]) => /*#__PURE__*/React.createElement("div", {
    key: l,
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-hair)',
      borderRadius: 'var(--radius-md)',
      padding: '16px 18px',
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 36,
      height: 36,
      borderRadius: 'var(--radius-sm)',
      background: 'var(--pine-50)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: ic,
    size: 18,
    color: "var(--pine-700)"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 24,
      color: 'var(--text-strong)'
    }
  }, v), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--text-muted)'
    }
  }, l))))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-hair)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '0.6fr 1.4fr 1.4fr 1fr 1fr 1fr',
      gap: 12,
      padding: '12px 20px',
      background: 'var(--surface-sunken)',
      fontFamily: 'var(--font-display)',
      fontSize: 11,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Time"), /*#__PURE__*/React.createElement("span", null, "Customer"), /*#__PURE__*/React.createElement("span", null, "Service"), /*#__PURE__*/React.createElement("span", null, "Branch"), /*#__PURE__*/React.createElement("span", null, "Optometrist"), /*#__PURE__*/React.createElement("span", null, "Status")), list.map((a, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'grid',
      gridTemplateColumns: '0.6fr 1.4fr 1.4fr 1fr 1fr 1fr',
      gap: 12,
      padding: '13px 20px',
      alignItems: 'center',
      borderTop: '1px solid var(--border-hair)',
      animation: 'oz-fade-up var(--dur-fast) var(--ease-out) both',
      animationDelay: `${i * 40}ms`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 14,
      color: 'var(--pine-700)'
    }
  }, a.time), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13.5,
      fontWeight: 600,
      color: 'var(--text-strong)'
    }
  }, a.customer), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13.5,
      color: 'var(--text-body)'
    }
  }, a.service), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13.5,
      color: 'var(--text-body)'
    }
  }, a.branch), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13.5,
      color: 'var(--text-muted)'
    }
  }, a.optometrist), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    variant: APPT_VARIANT[a.status]
  }, a.status), /*#__PURE__*/React.createElement(IconButton, {
    variant: "ghost",
    size: "sm"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "more-vertical",
    size: 15
  })))))));
}
Object.assign(window, {
  Appointments
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/Appointments.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/Dashboard.jsx
try { (() => {
// OPTIZONE Admin — Dashboard: KPIs, sales trend, funnel, top products, activity.
const {
  Icon,
  Badge,
  Button
} = window.OPTIZONEDesignSystem_ded4a5;
function KpiCard({
  k,
  i
}) {
  const n = window.useCountUp(k.value, 1000);
  const fmt = (k.prefix || '') + n.toLocaleString('he-IL');
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-hair)',
      borderRadius: 'var(--radius-md)',
      padding: '18px 20px',
      animation: 'oz-fade-up var(--dur-base) var(--ease-out) both',
      animationDelay: `${i * 70}ms`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 34,
      height: 34,
      borderRadius: 'var(--radius-sm)',
      background: 'var(--pine-50)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: k.icon,
    size: 18,
    color: "var(--pine-700)"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 3,
      fontSize: 12.5,
      fontWeight: 700,
      color: k.up ? 'var(--success)' : 'var(--danger)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: k.up ? 'arrow-up-right' : 'arrow-down-right',
    size: 14,
    color: "currentColor"
  }), Math.abs(k.delta), "%")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 30,
      color: 'var(--text-strong)',
      marginTop: 14
    }
  }, fmt), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--text-muted)'
    }
  }, k.label));
}
function SalesChart() {
  const A = window.OZ_ADMIN;
  const data = A.sales12,
    W = 620,
    H = 200,
    pad = 8;
  const max = Math.max(...data) * 1.1;
  const pts = data.map((v, i) => [pad + i * (W - pad * 2) / (data.length - 1), H - pad - v / max * (H - pad * 2)]);
  const line = pts.map(p => p.join(',')).join(' ');
  const area = `${pad},${H - pad} ${line} ${W - pad},${H - pad}`;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-hair)',
      borderRadius: 'var(--radius-md)',
      padding: '20px 22px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 15,
      letterSpacing: '0.04em',
      color: 'var(--text-strong)'
    }
  }, "Sales trend"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--text-muted)'
    }
  }, "Last 12 weeks \xB7 \u20AA thousands")), /*#__PURE__*/React.createElement(Badge, {
    variant: "success"
  }, "+12.4%")), /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${W} ${H}`,
    width: "100%",
    height: "200",
    preserveAspectRatio: "none",
    style: {
      display: 'block'
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "ozArea",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: "var(--amber-500)",
    stopOpacity: "0.28"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "var(--amber-500)",
    stopOpacity: "0"
  }))), [0.25, 0.5, 0.75].map(g => /*#__PURE__*/React.createElement("line", {
    key: g,
    x1: "0",
    x2: W,
    y1: H * g,
    y2: H * g,
    stroke: "var(--border-hair)",
    strokeWidth: "1"
  })), /*#__PURE__*/React.createElement("polygon", {
    points: area,
    fill: "url(#ozArea)"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: line,
    fill: "none",
    stroke: "var(--pine-600)",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      strokeDasharray: 1600,
      strokeDashoffset: 1600,
      animation: 'oz-draw 1.4s var(--ease-out) forwards'
    }
  }), pts.map((p, i) => /*#__PURE__*/React.createElement("circle", {
    key: i,
    cx: p[0],
    cy: p[1],
    r: "3",
    fill: "var(--surface-card)",
    stroke: "var(--amber-600)",
    strokeWidth: "2",
    style: {
      opacity: 0,
      animation: `oz-fade 0.3s var(--ease-out) forwards`,
      animationDelay: `${0.7 + i * 0.05}s`
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: 8,
      fontSize: 10.5,
      color: 'var(--text-faint)'
    }
  }, A.months.map(m => /*#__PURE__*/React.createElement("span", {
    key: m
  }, m))));
}
function Funnel() {
  const A = window.OZ_ADMIN;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-hair)',
      borderRadius: 'var(--radius-md)',
      padding: '20px 22px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 15,
      color: 'var(--text-strong)',
      marginBottom: 4
    }
  }, "Try Mirror funnel"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--text-muted)',
      marginBottom: 18
    }
  }, "Engagement \u2192 conversion"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, A.funnel.map((f, i) => /*#__PURE__*/React.createElement("div", {
    key: f.label
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 13,
      marginBottom: 5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-body)'
    }
  }, f.label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      color: 'var(--text-strong)'
    }
  }, f.value, "%")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 9,
      borderRadius: 999,
      background: 'var(--surface-sunken)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      width: `${f.value}%`,
      background: f.color,
      borderRadius: 999,
      animation: 'oz-grow-x 0.9s var(--ease-out) both',
      animationDelay: `${i * 90}ms`,
      transformOrigin: 'left'
    }
  }))))));
}
function TopProducts() {
  const A = window.OZ_ADMIN;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-hair)',
      borderRadius: 'var(--radius-md)',
      padding: '20px 22px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 15,
      color: 'var(--text-strong)',
      marginBottom: 16
    }
  }, "Top products"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, A.topProducts.map((p, i) => /*#__PURE__*/React.createElement("div", {
    key: p.name,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '10px 0',
      borderBottom: i < A.topProducts.length - 1 ? '1px solid var(--border-hair)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 22,
      fontFamily: 'var(--font-display)',
      fontSize: 13,
      color: 'var(--text-faint)'
    }
  }, i + 1), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontSize: 14,
      color: 'var(--text-strong)',
      fontWeight: 500
    }
  }, p.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      color: 'var(--text-muted)'
    }
  }, p.units, " units"), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 84,
      textAlign: 'end',
      fontSize: 13.5,
      fontWeight: 600,
      color: 'var(--text-strong)'
    }
  }, "\u20AA", p.revenue.toLocaleString('he-IL'))))));
}
function Activity() {
  const A = window.OZ_ADMIN;
  const tone = {
    pine: 'var(--pine-50)',
    amber: 'var(--amber-50)',
    neutral: 'var(--surface-sunken)'
  };
  const ic = {
    pine: 'var(--pine-700)',
    amber: 'var(--amber-700)',
    neutral: 'var(--text-muted)'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-hair)',
      borderRadius: 'var(--radius-md)',
      padding: '20px 22px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 15,
      color: 'var(--text-strong)',
      marginBottom: 16
    }
  }, "Recent activity"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, A.activity.map((a, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 32,
      height: 32,
      borderRadius: 'var(--radius-sm)',
      background: tone[a.tone],
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: '0 0 auto'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: a.icon,
    size: 15,
    color: ic[a.tone]
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      color: 'var(--text-body)',
      lineHeight: 1.4
    }
  }, a.text), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: 'var(--text-faint)',
      marginTop: 2
    }
  }, a.time))))));
}
function Dashboard() {
  const A = window.OZ_ADMIN;
  React.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 22
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 16
    }
  }, A.kpis.map((k, i) => /*#__PURE__*/React.createElement(KpiCard, {
    key: k.key,
    k: k,
    i: i
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.6fr 1fr',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(SalesChart, null), /*#__PURE__*/React.createElement(Funnel, null)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.4fr 1fr',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(TopProducts, null), /*#__PURE__*/React.createElement(Activity, null)));
}
Object.assign(window, {
  Dashboard
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/Dashboard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/Orders.jsx
try { (() => {
// OPTIZONE Admin — Orders management: filter, table, detail drawer, status pipeline (FR-58).
const {
  Icon,
  IconButton,
  Button,
  Badge,
  Select
} = window.OPTIZONEDesignSystem_ded4a5;
const ORDER_VARIANT = {
  Received: 'bestseller',
  'In lab': 'neutral',
  Ready: 'try',
  Shipped: 'new',
  Collected: 'success',
  Cancelled: 'danger'
};
function OrderDrawer({
  order,
  onClose
}) {
  const A = window.OZ_ADMIN;
  const stages = A.orderStages;
  const cur = stages.indexOf(order.status);
  React.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 1200,
      display: 'flex',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--overlay-scrim)',
      animation: 'oz-fade var(--dur-base) var(--ease-out) both'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: 'min(500px,94vw)',
      background: 'var(--bg-page-alt)',
      height: '100%',
      overflowY: 'auto',
      boxShadow: 'var(--shadow-lg)',
      animation: 'oz-slide-in-end var(--dur-base) var(--ease-out) both'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'sticky',
      top: 0,
      background: 'var(--surface-card)',
      borderBottom: '1px solid var(--border-hair)',
      padding: '18px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 11,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--text-accent)'
    }
  }, "Order"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 20,
      color: 'var(--text-strong)'
    }
  }, order.id)), /*#__PURE__*/React.createElement(Badge, {
    variant: ORDER_VARIANT[order.status]
  }, order.status), /*#__PURE__*/React.createElement(IconButton, {
    variant: "ghost",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 20
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: 22
    }
  }, order.status !== 'Cancelled' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 12,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: 'var(--text-strong)',
      marginBottom: 16
    }
  }, "Fulfilment"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 13,
      insetInlineStart: 14,
      insetInlineEnd: 14,
      height: 2,
      background: 'var(--border-hair)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 13,
      insetInlineStart: 14,
      width: `${cur / (stages.length - 1) * 92}%`,
      height: 2,
      background: 'var(--pine-600)',
      transition: 'width var(--dur-slow) var(--ease-out)'
    }
  }), stages.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: s,
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 7,
      position: 'relative',
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 28,
      height: 28,
      borderRadius: 999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: i <= cur ? 'var(--pine-700)' : 'var(--surface-card)',
      border: `2px solid ${i <= cur ? 'var(--pine-700)' : 'var(--border-strong)'}`,
      color: 'var(--cream-100)'
    }
  }, i < cur ? /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 14,
    color: "currentColor"
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: 999,
      background: i === cur ? 'var(--amber-500)' : 'var(--border-strong)'
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10.5,
      color: i <= cur ? 'var(--text-strong)' : 'var(--text-faint)',
      textAlign: 'center'
    }
  }, s))))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-hair)',
      borderRadius: 'var(--radius-md)',
      padding: 18
    }
  }, [['Customer', order.customer], ['Date', order.date], ['Items', order.items], ['Payment', order.pay]].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '7px 0',
      fontSize: 13.5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)'
    }
  }, k), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-strong)',
      fontWeight: 600
    }
  }, v))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      paddingTop: 10,
      marginTop: 6,
      borderTop: '1px solid var(--border-hair)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 14,
      letterSpacing: '0.06em',
      color: 'var(--text-strong)'
    }
  }, "TOTAL"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 18,
      color: 'var(--text-strong)'
    }
  }, "\u20AA", order.total.toLocaleString('he-IL')))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(Select, {
    value: order.status,
    options: [...A.orderStages, 'Cancelled'].map(s => ({
      value: s,
      label: s
    }))
  })), /*#__PURE__*/React.createElement(Button, {
    variant: "primary"
  }, "Update status")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    block: true,
    startIcon: /*#__PURE__*/React.createElement(Icon, {
      name: "file-text",
      size: 16,
      color: "currentColor"
    })
  }, "Tax invoice"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    block: true,
    style: {
      color: 'var(--danger)'
    }
  }, "Refund"))))));
}
function Orders() {
  const A = window.OZ_ADMIN;
  const [filter, setFilter] = React.useState('All');
  const [open, setOpen] = React.useState(null);
  React.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  });
  const filters = ['All', 'Received', 'In lab', 'Ready', 'Shipped', 'Collected'];
  const list = A.orders.filter(o => filter === 'All' || o.status === filter);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginBottom: 18,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      background: 'var(--surface-card)',
      border: '1px solid var(--border-hair)',
      borderRadius: 'var(--radius-pill)',
      padding: 4,
      flexWrap: 'wrap'
    }
  }, filters.map(f => /*#__PURE__*/React.createElement("button", {
    key: f,
    onClick: () => setFilter(f),
    style: {
      border: 'none',
      cursor: 'pointer',
      borderRadius: 'var(--radius-pill)',
      padding: '7px 13px',
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      fontWeight: 600,
      background: filter === f ? 'var(--pine-700)' : 'transparent',
      color: filter === f ? 'var(--cream-100)' : 'var(--text-muted)'
    }
  }, f))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginInlineStart: 'auto',
      display: 'flex',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "sm",
    startIcon: /*#__PURE__*/React.createElement(Icon, {
      name: "download",
      size: 15,
      color: "currentColor"
    })
  }, "Export CSV"))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-hair)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1.4fr 1fr 0.7fr 1fr 1fr 0.5fr',
      gap: 12,
      padding: '12px 20px',
      background: 'var(--surface-sunken)',
      fontFamily: 'var(--font-display)',
      fontSize: 11,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Order"), /*#__PURE__*/React.createElement("span", null, "Customer"), /*#__PURE__*/React.createElement("span", null, "Date"), /*#__PURE__*/React.createElement("span", null, "Items"), /*#__PURE__*/React.createElement("span", null, "Total"), /*#__PURE__*/React.createElement("span", null, "Status"), /*#__PURE__*/React.createElement("span", null)), list.map((o, i) => /*#__PURE__*/React.createElement("div", {
    key: o.id,
    onClick: () => setOpen(o),
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1.4fr 1fr 0.7fr 1fr 1fr 0.5fr',
      gap: 12,
      padding: '13px 20px',
      alignItems: 'center',
      borderTop: '1px solid var(--border-hair)',
      cursor: 'pointer',
      animation: 'oz-fade-up var(--dur-fast) var(--ease-out) both',
      animationDelay: `${i * 30}ms`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 13.5,
      color: 'var(--text-strong)'
    }
  }, o.id), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13.5,
      color: 'var(--text-body)'
    }
  }, o.customer), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--text-muted)'
    }
  }, o.date), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13.5,
      color: 'var(--text-body)'
    }
  }, o.items), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13.5,
      fontWeight: 600,
      color: 'var(--text-strong)'
    }
  }, "\u20AA", o.total.toLocaleString('he-IL')), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Badge, {
    variant: ORDER_VARIANT[o.status]
  }, o.status)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-left",
    size: 16,
    color: "var(--text-faint)"
  }))))), open && /*#__PURE__*/React.createElement(OrderDrawer, {
    order: open,
    onClose: () => setOpen(null)
  }));
}
Object.assign(window, {
  Orders
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/Orders.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/Products.jsx
try { (() => {
// OPTIZONE Admin — Products: catalog table + slide-in add/edit editor (FR-57).
const {
  Icon,
  IconButton,
  Button,
  Badge,
  Input,
  Select,
  Switch,
  Tag,
  Checkbox
} = window.OPTIZONEDesignSystem_ded4a5;
const STATUS_VARIANT = {
  Published: 'success',
  Draft: 'neutral',
  Scheduled: 'bestseller'
};
function MediaTile({
  color,
  primary
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      aspectRatio: '1',
      borderRadius: 'var(--radius-sm)',
      background: 'var(--cream-300)',
      border: '1px solid var(--border-hair)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 120 46",
    width: "46",
    fill: "none"
  }, /*#__PURE__*/React.createElement("g", {
    stroke: color,
    strokeWidth: "3",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "40",
    cy: "24",
    r: "15"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "80",
    cy: "24",
    r: "15"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M55 17 q5 -5 10 0"
  }))), primary && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 5,
      insetInlineStart: 5,
      background: 'var(--amber-600)',
      color: 'var(--pine-950)',
      fontSize: 9,
      fontFamily: 'var(--font-display)',
      letterSpacing: '0.1em',
      padding: '2px 6px',
      borderRadius: 999
    }
  }, "PRIMARY"), /*#__PURE__*/React.createElement("button", {
    "aria-label": "remove",
    style: {
      position: 'absolute',
      top: 4,
      insetInlineEnd: 4,
      width: 20,
      height: 20,
      borderRadius: 999,
      border: 'none',
      background: 'rgba(0,0,0,0.45)',
      color: '#fff',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, "\xD7"));
}
function EditorSection({
  title,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid var(--border-hair)',
      paddingTop: 18,
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 12,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: 'var(--text-strong)',
      marginBottom: 14
    }
  }, title), children);
}
function Lbl({
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--text-muted)',
      marginBottom: 6
    }
  }, children);
}
function ProductEditor({
  product,
  onClose
}) {
  const isNew = !product;
  const [p, setP] = React.useState(product || {
    name: '',
    brand: '',
    category: 'Eyeglasses',
    price: '',
    stock: '',
    status: 'Draft',
    tryMirror: true,
    media: 0,
    color: '#274A3B'
  });
  const set = (k, v) => setP(s => ({
    ...s,
    [k]: v
  }));
  const [ar, setAr] = React.useState(true);
  const [blue, setBlue] = React.useState(false);
  React.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 1200,
      display: 'flex',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--overlay-scrim)',
      animation: 'oz-fade var(--dur-base) var(--ease-out) both'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: 'min(560px,94vw)',
      background: 'var(--bg-page-alt)',
      height: '100%',
      overflowY: 'auto',
      boxShadow: 'var(--shadow-lg)',
      animation: 'oz-slide-in-end var(--dur-base) var(--ease-out) both'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'sticky',
      top: 0,
      background: 'var(--surface-card)',
      borderBottom: '1px solid var(--border-hair)',
      padding: '18px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      zIndex: 2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 11,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--text-accent)'
    }
  }, isNew ? 'New product' : 'Edit product'), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 20,
      color: 'var(--text-strong)'
    }
  }, p.name || 'Untitled frame')), /*#__PURE__*/React.createElement(IconButton, {
    variant: "ghost",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 20
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px 24px 24px'
    }
  }, /*#__PURE__*/React.createElement(EditorSection, {
    title: "Basics"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Lbl, null, "Product name"), /*#__PURE__*/React.createElement(Input, {
    value: p.name,
    onChange: e => set('name', e.target.value),
    placeholder: "e.g. Round Metal RB3447"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Lbl, null, "Brand"), /*#__PURE__*/React.createElement(Input, {
    value: p.brand,
    onChange: e => set('brand', e.target.value),
    placeholder: "Ray-Ban"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Lbl, null, "Category"), /*#__PURE__*/React.createElement(Select, {
    value: p.category,
    onChange: e => set('category', e.target.value),
    options: ['Eyeglasses', 'Sunglasses', 'Contact Lenses', 'Accessories'].map(c => ({
      value: c,
      label: c
    }))
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Lbl, null, "Description"), /*#__PURE__*/React.createElement("textarea", {
    placeholder: "Short product description\u2026",
    rows: 3,
    style: {
      width: '100%',
      border: '1px solid var(--border-strong)',
      borderRadius: 'var(--radius-sm)',
      padding: '10px 12px',
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      color: 'var(--text-body)',
      resize: 'vertical'
    }
  })))), /*#__PURE__*/React.createElement(EditorSection, {
    title: "Media \xB7 images & video"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 10
    }
  }, [0, 1, 2].map(i => /*#__PURE__*/React.createElement(MediaTile, {
    key: i,
    color: p.color,
    primary: i === 0
  })), /*#__PURE__*/React.createElement("button", {
    style: {
      aspectRatio: '1',
      borderRadius: 'var(--radius-sm)',
      border: '1.5px dashed var(--border-strong)',
      background: 'transparent',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "upload",
    size: 18
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11
    }
  }, "Upload"))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: 'var(--text-faint)',
      marginTop: 8
    }
  }, "Drag to reorder \xB7 first image is primary \xB7 videos stream adaptively (HLS)")), /*#__PURE__*/React.createElement(EditorSection, {
    title: "Pricing & stock"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Lbl, null, "Price \u20AA"), /*#__PURE__*/React.createElement(Input, {
    value: p.price,
    onChange: e => set('price', e.target.value),
    placeholder: "390"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Lbl, null, "Compare-at \u20AA"), /*#__PURE__*/React.createElement(Input, {
    placeholder: "490"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Lbl, null, "Stock"), /*#__PURE__*/React.createElement(Input, {
    value: p.stock,
    onChange: e => set('stock', e.target.value),
    placeholder: "24"
  })))), /*#__PURE__*/React.createElement(EditorSection, {
    title: "Variants \xB7 colour"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap',
      alignItems: 'center'
    }
  }, ['#274A3B', '#6B4423', '#1A1A17', '#E08A2A'].map(c => /*#__PURE__*/React.createElement("button", {
    key: c,
    onClick: () => set('color', c),
    style: {
      width: 30,
      height: 30,
      borderRadius: 999,
      background: c,
      border: `2px solid ${p.color === c ? 'var(--amber-600)' : 'var(--border-hair)'}`,
      cursor: 'pointer'
    }
  })), /*#__PURE__*/React.createElement("button", {
    style: {
      width: 30,
      height: 30,
      borderRadius: 999,
      border: '1.5px dashed var(--border-strong)',
      background: 'transparent',
      cursor: 'pointer',
      color: 'var(--text-muted)'
    }
  }, "+"))), /*#__PURE__*/React.createElement(EditorSection, {
    title: "Lens options \xB7 rules-based"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 12
    }
  }, ['1.5', '1.6', '1.67', '1.74'].map(ix => /*#__PURE__*/React.createElement(Tag, {
    key: ix,
    selected: ix !== '1.74'
  }, "Index ", ix))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      fontSize: 13.5,
      color: 'var(--text-body)'
    }
  }, /*#__PURE__*/React.createElement(Checkbox, {
    checked: ar,
    onChange: setAr
  }), " Anti-reflective coating (+\u20AA90)"), /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      fontSize: 13.5,
      color: 'var(--text-body)'
    }
  }, /*#__PURE__*/React.createElement(Checkbox, {
    checked: blue,
    onChange: setBlue
  }), " Blue-light filter (+\u20AA70)"))), /*#__PURE__*/React.createElement(EditorSection, {
    title: "Availability"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: 'var(--text-body)'
    }
  }, "Try Mirror enabled"), /*#__PURE__*/React.createElement(Switch, {
    checked: p.tryMirror,
    onChange: v => set('tryMirror', v)
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Lbl, null, "Publishing status"), /*#__PURE__*/React.createElement(Select, {
    value: p.status,
    onChange: e => set('status', e.target.value),
    options: ['Draft', 'Published', 'Scheduled'].map(s => ({
      value: s,
      label: s
    }))
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'sticky',
      bottom: 0,
      background: 'var(--surface-card)',
      borderTop: '1px solid var(--border-hair)',
      padding: '14px 24px',
      display: 'flex',
      gap: 10,
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    onClick: onClose
  }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    onClick: onClose
  }, "Save draft"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: onClose,
    startIcon: /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 16,
      color: "currentColor"
    })
  }, p.status === 'Published' ? 'Publish' : 'Save'))));
}
function Products() {
  const A = window.OZ_ADMIN;
  const [editor, setEditor] = React.useState(null); // null | {product} | 'new'
  const [cat, setCat] = React.useState('All');
  const [q, setQ] = React.useState('');
  React.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  });
  const cats = ['All', 'Eyeglasses', 'Sunglasses', 'Contact Lenses'];
  const list = A.products.filter(p => (cat === 'All' || p.category === cat) && (p.name + p.brand).toLowerCase().includes(q.toLowerCase()));
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginBottom: 18,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      background: 'var(--surface-card)',
      border: '1px solid var(--border-hair)',
      borderRadius: 'var(--radius-pill)',
      padding: 4
    }
  }, cats.map(c => /*#__PURE__*/React.createElement("button", {
    key: c,
    onClick: () => setCat(c),
    style: {
      border: 'none',
      cursor: 'pointer',
      borderRadius: 'var(--radius-pill)',
      padding: '7px 14px',
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      fontWeight: 600,
      background: cat === c ? 'var(--pine-700)' : 'transparent',
      color: cat === c ? 'var(--cream-100)' : 'var(--text-muted)'
    }
  }, c))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 160,
      maxWidth: 260
    }
  }, /*#__PURE__*/React.createElement(Input, {
    value: q,
    onChange: e => setQ(e.target.value),
    placeholder: "Search products\u2026",
    size: "sm"
  })), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "sm",
    startIcon: /*#__PURE__*/React.createElement(Icon, {
      name: "upload",
      size: 15,
      color: "currentColor"
    })
  }, "Bulk media"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm",
    onClick: () => setEditor('new'),
    startIcon: /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 16,
      color: "currentColor"
    })
  }, "Add product")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-hair)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '2.4fr 1fr 0.9fr 0.7fr 1fr 0.5fr',
      gap: 12,
      padding: '12px 20px',
      background: 'var(--surface-sunken)',
      fontFamily: 'var(--font-display)',
      fontSize: 11,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Product"), /*#__PURE__*/React.createElement("span", null, "Category"), /*#__PURE__*/React.createElement("span", null, "Price"), /*#__PURE__*/React.createElement("span", null, "Stock"), /*#__PURE__*/React.createElement("span", null, "Status"), /*#__PURE__*/React.createElement("span", null)), list.map((p, i) => /*#__PURE__*/React.createElement("div", {
    key: p.id,
    style: {
      display: 'grid',
      gridTemplateColumns: '2.4fr 1fr 0.9fr 0.7fr 1fr 0.5fr',
      gap: 12,
      padding: '12px 20px',
      alignItems: 'center',
      borderTop: '1px solid var(--border-hair)',
      animation: 'oz-fade-up var(--dur-fast) var(--ease-out) both',
      animationDelay: `${i * 30}ms`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 42,
      height: 42,
      borderRadius: 'var(--radius-sm)',
      background: 'var(--cream-300)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: '0 0 auto'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 120 46",
    width: "30",
    fill: "none"
  }, /*#__PURE__*/React.createElement("g", {
    stroke: p.color,
    strokeWidth: "3.5",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "40",
    cy: "24",
    r: "15"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "80",
    cy: "24",
    r: "15"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M55 17 q5 -5 10 0"
  })))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--text-strong)'
    }
  }, p.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--text-muted)'
    }
  }, p.brand, " \xB7 ", p.media, " media", p.tryMirror ? ' · Try Mirror' : ''))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13.5,
      color: 'var(--text-body)'
    }
  }, p.category), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13.5,
      fontWeight: 600,
      color: 'var(--text-strong)'
    }
  }, "\u20AA", p.price), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13.5,
      color: p.stock === 0 ? 'var(--danger)' : p.stock < 5 ? 'var(--amber-700)' : 'var(--text-body)',
      fontWeight: p.stock < 5 ? 700 : 400
    }
  }, p.stock), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Badge, {
    variant: STATUS_VARIANT[p.status] || 'neutral'
  }, p.status)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    variant: "ghost",
    size: "sm",
    onClick: () => setEditor({
      product: p
    })
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "pencil",
    size: 16
  })), /*#__PURE__*/React.createElement(IconButton, {
    variant: "ghost",
    size: "sm"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "more-vertical",
    size: 16
  })))))), editor && /*#__PURE__*/React.createElement(ProductEditor, {
    product: editor === 'new' ? null : editor.product,
    onClose: () => setEditor(null)
  }));
}
Object.assign(window, {
  Products
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/Products.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/Shell.jsx
try { (() => {
// OPTIZONE Admin — app shell: pine sidebar + topbar.
const {
  Logo,
  Icon,
  IconButton,
  Button,
  Badge
} = window.OPTIZONEDesignSystem_ded4a5;
function Sidebar({
  route,
  go
}) {
  const A = window.OZ_ADMIN;
  React.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  });
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 244,
      flex: '0 0 244px',
      background: 'var(--pine-800)',
      display: 'flex',
      flexDirection: 'column',
      position: 'sticky',
      top: 0,
      height: '100vh'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '22px 22px 18px',
      borderBottom: '1px solid var(--border-on-dark)'
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    variant: "horizontal",
    theme: "dark",
    size: 19,
    tagline: false
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 10,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      color: 'var(--amber-500)',
      marginTop: 8,
      marginInlineStart: 2
    }
  }, "Admin Console")), /*#__PURE__*/React.createElement("nav", {
    style: {
      padding: '14px 12px',
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
      flex: 1
    }
  }, A.nav.map(n => {
    const active = route === n.key;
    return /*#__PURE__*/React.createElement("button", {
      key: n.key,
      onClick: () => go(n.key),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '11px 14px',
        borderRadius: 'var(--radius-sm)',
        border: 'none',
        cursor: 'pointer',
        textAlign: 'start',
        background: active ? 'var(--pine-600)' : 'transparent',
        color: active ? 'var(--cream-100)' : 'var(--pine-200)',
        fontFamily: 'var(--font-body)',
        fontSize: 14,
        fontWeight: active ? 600 : 500,
        transition: 'all var(--dur-fast) var(--ease-out)',
        position: 'relative'
      }
    }, active && /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        insetInlineStart: 0,
        top: 8,
        bottom: 8,
        width: 3,
        borderRadius: 3,
        background: 'var(--amber-500)'
      }
    }), /*#__PURE__*/React.createElement(Icon, {
      name: n.icon,
      size: 18,
      color: active ? 'var(--amber-500)' : 'var(--pine-300)'
    }), n.label);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px',
      borderTop: '1px solid var(--border-on-dark)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 36,
      height: 36,
      borderRadius: 999,
      background: 'var(--pine-600)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-display)',
      fontSize: 13,
      color: 'var(--amber-500)',
      flex: '0 0 auto'
    }
  }, A.user.initials), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      fontWeight: 600,
      color: 'var(--cream-100)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, A.user.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: 'var(--pine-300)'
    }
  }, A.user.role)), /*#__PURE__*/React.createElement(IconButton, {
    variant: "ghost",
    style: {
      color: 'var(--pine-200)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "log-out",
    size: 16,
    color: "var(--pine-200)"
  })))));
}
function Topbar({
  title,
  subtitle,
  actions
}) {
  React.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 20,
      padding: '20px 30px',
      borderBottom: '1px solid var(--border-hair)',
      background: 'var(--surface-card)',
      position: 'sticky',
      top: 0,
      zIndex: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 24,
      color: 'var(--text-strong)',
      margin: 0
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      color: 'var(--text-muted)',
      marginTop: 2
    }
  }, subtitle)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      height: 38,
      padding: '0 14px',
      background: 'var(--surface-sunken)',
      borderRadius: 'var(--radius-pill)',
      color: 'var(--text-muted)',
      fontSize: 13.5,
      minWidth: 200
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 16,
    color: "var(--text-muted)"
  }), " Search\u2026"), /*#__PURE__*/React.createElement(IconButton, {
    variant: "ghost"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "bell",
    size: 18
  })), actions));
}
function Shell({
  route,
  go,
  title,
  subtitle,
  actions,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      minHeight: '100vh',
      background: 'var(--bg-page-alt)'
    }
  }, /*#__PURE__*/React.createElement(Sidebar, {
    route: route,
    go: go
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement(Topbar, {
    title: title,
    subtitle: subtitle,
    actions: actions
  }), /*#__PURE__*/React.createElement("div", {
    key: route,
    className: "oz-route",
    style: {
      padding: '26px 30px 48px',
      flex: 1
    }
  }, children)));
}
Object.assign(window, {
  Shell
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/Shell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/UsersContent.jsx
try { (() => {
// OPTIZONE Admin — Users & Roles (RBAC, FR-61) + Content & Campaigns (FR-60).
const {
  Icon,
  IconButton,
  Button,
  Badge,
  Select,
  Switch,
  Tag
} = window.OPTIZONEDesignSystem_ded4a5;
function Users() {
  const A = window.OZ_ADMIN;
  React.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  });
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, A.roles.map(r => /*#__PURE__*/React.createElement(Tag, {
    key: r,
    selected: true
  }, r))), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm",
    style: {
      marginInlineStart: 'auto'
    },
    startIcon: /*#__PURE__*/React.createElement(Icon, {
      name: "user-plus",
      size: 16,
      color: "currentColor"
    })
  }, "Invite user")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-hair)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '2fr 1.6fr 1fr 0.9fr 0.6fr',
      gap: 12,
      padding: '12px 20px',
      background: 'var(--surface-sunken)',
      fontFamily: 'var(--font-display)',
      fontSize: 11,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "User"), /*#__PURE__*/React.createElement("span", null, "Role"), /*#__PURE__*/React.createElement("span", null, "Branch"), /*#__PURE__*/React.createElement("span", null, "Active"), /*#__PURE__*/React.createElement("span", null)), A.users.map((u, i) => /*#__PURE__*/React.createElement("div", {
    key: u.email,
    style: {
      display: 'grid',
      gridTemplateColumns: '2fr 1.6fr 1fr 0.9fr 0.6fr',
      gap: 12,
      padding: '13px 20px',
      alignItems: 'center',
      borderTop: '1px solid var(--border-hair)',
      animation: 'oz-fade-up var(--dur-fast) var(--ease-out) both',
      animationDelay: `${i * 40}ms`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 38,
      height: 38,
      borderRadius: 999,
      background: 'var(--pine-100)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-display)',
      fontSize: 13,
      color: 'var(--pine-700)',
      flex: '0 0 auto'
    }
  }, u.initials), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--text-strong)'
    }
  }, u.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--text-muted)'
    }
  }, u.email))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 200
    }
  }, /*#__PURE__*/React.createElement(Select, {
    value: u.role,
    size: "sm",
    options: A.roles.map(r => ({
      value: r,
      label: r
    }))
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13.5,
      color: 'var(--text-body)'
    }
  }, u.branch), /*#__PURE__*/React.createElement(Switch, {
    checked: u.active
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    variant: "ghost",
    size: "sm"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "more-vertical",
    size: 16
  })))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      fontSize: 12.5,
      color: 'var(--text-muted)',
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "shield",
    size: 15,
    color: "var(--text-muted)"
  }), " Role-based access control (RBAC) governs every admin action \xB7 see NFR-Security."));
}
const CAMPAIGN_VARIANT = {
  Live: 'success',
  Scheduled: 'bestseller',
  Draft: 'neutral',
  Ended: 'neutral'
};
function Content() {
  const A = window.OZ_ADMIN;
  React.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  });
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "sm",
    startIcon: /*#__PURE__*/React.createElement(Icon, {
      name: "image",
      size: 15,
      color: "currentColor"
    })
  }, "Homepage banners"), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "sm",
    startIcon: /*#__PURE__*/React.createElement(Icon, {
      name: "file-text",
      size: 15,
      color: "currentColor"
    })
  }, "Blog articles")), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm",
    style: {
      marginInlineStart: 'auto'
    },
    startIcon: /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 16,
      color: "currentColor"
    })
  }, "New campaign")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-hair)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '2fr 1.3fr 1.4fr 1fr 0.5fr',
      gap: 12,
      padding: '12px 20px',
      background: 'var(--surface-sunken)',
      fontFamily: 'var(--font-display)',
      fontSize: 11,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Title"), /*#__PURE__*/React.createElement("span", null, "Type"), /*#__PURE__*/React.createElement("span", null, "Window"), /*#__PURE__*/React.createElement("span", null, "Status"), /*#__PURE__*/React.createElement("span", null)), A.campaigns.map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: c.title,
    style: {
      display: 'grid',
      gridTemplateColumns: '2fr 1.3fr 1.4fr 1fr 0.5fr',
      gap: 12,
      padding: '14px 20px',
      alignItems: 'center',
      borderTop: '1px solid var(--border-hair)',
      animation: 'oz-fade-up var(--dur-fast) var(--ease-out) both',
      animationDelay: `${i * 40}ms`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 40,
      height: 40,
      borderRadius: 'var(--radius-sm)',
      background: 'var(--pine-50)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: '0 0 auto'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "megaphone",
    size: 17,
    color: "var(--pine-700)"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--text-strong)'
    }
  }, c.title)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13.5,
      color: 'var(--text-body)'
    }
  }, c.type), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--text-muted)'
    }
  }, c.window), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Badge, {
    variant: CAMPAIGN_VARIANT[c.status]
  }, c.status)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    variant: "ghost",
    size: "sm"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "pencil",
    size: 16
  })))))));
}
Object.assign(window, {
  Users,
  Content
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/UsersContent.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/anim.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// OPTIZONE storefront — animation helpers (scroll reveal, staggering, scroll state).

// Reveal: fades + lifts children into view once, when scrolled near the viewport.
function Reveal({
  children,
  delay = 0,
  as = 'div',
  style,
  ...rest
}) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          el.setAttribute('data-oz-in', '');
          io.unobserve(el);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -8% 0px'
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    ref: ref,
    "data-oz-reveal": "",
    style: {
      transitionDelay: `${delay}ms`,
      ...style
    }
  }, rest), children);
}

// useScrolled: true once the window has scrolled past `threshold` px.
function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, {
      passive: true
    });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);
  return scrolled;
}

// useCountUp: animate a number from 0 → target over `ms`.
function useCountUp(target, ms = 900) {
  const [val, setVal] = React.useState(0);
  React.useEffect(() => {
    let raf, start;
    const ease = t => 1 - Math.pow(1 - t, 3);
    const step = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / ms, 1);
      setVal(Math.round(target * ease(p)));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    // Safety: guarantee the final value even if rAF is throttled (background tab).
    const done = setTimeout(() => setVal(target), ms + 120);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(done);
    };
  }, [target, ms]);
  return val;
}
Object.assign(window, {
  Reveal,
  useScrolled,
  useCountUp
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/anim.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/app.jsx
try { (() => {
// OPTIZONE Admin — router.
const {
  Button,
  Icon
} = window.OPTIZONEDesignSystem_ded4a5;
function AdminApp() {
  const [route, setRoute] = React.useState('dashboard');
  const go = r => {
    setRoute(r);
    window.scrollTo({
      top: 0
    });
  };
  const meta = {
    dashboard: {
      title: 'Dashboard',
      subtitle: 'Store performance · last 30 days'
    },
    products: {
      title: 'Products',
      subtitle: 'Catalog, variants, media & lens rules',
      actions: null
    },
    orders: {
      title: 'Orders',
      subtitle: 'Fulfilment, invoices & refunds'
    },
    appointments: {
      title: 'Appointments',
      subtitle: 'Bookings across all branches'
    },
    content: {
      title: 'Content & Campaigns',
      subtitle: 'Homepage, banners, blog & promotions'
    },
    users: {
      title: 'Users & Roles',
      subtitle: 'Team access & permissions (RBAC)'
    }
  }[route];
  const screen = {
    dashboard: /*#__PURE__*/React.createElement(Dashboard, null),
    products: /*#__PURE__*/React.createElement(Products, null),
    orders: /*#__PURE__*/React.createElement(Orders, null),
    appointments: /*#__PURE__*/React.createElement(Appointments, null),
    content: /*#__PURE__*/React.createElement(Content, null),
    users: /*#__PURE__*/React.createElement(Users, null)
  }[route];
  return /*#__PURE__*/React.createElement(Shell, {
    route: route,
    go: go,
    title: meta.title,
    subtitle: meta.subtitle,
    actions: route === 'dashboard' ? /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      size: "sm",
      onClick: () => go('products'),
      startIcon: /*#__PURE__*/React.createElement(Icon, {
        name: "plus",
        size: 16,
        color: "currentColor"
      })
    }, "Add product") : null
  }, screen);
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(AdminApp, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/app.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/data.js
try { (() => {
// OPTIZONE Admin — sample data for the management console (no real data source).
window.OZ_ADMIN = {
  user: {
    name: 'Dana Cohen',
    role: 'Administrator',
    initials: 'DC'
  },
  nav: [{
    key: 'dashboard',
    label: 'Dashboard',
    icon: 'layout-dashboard'
  }, {
    key: 'products',
    label: 'Products',
    icon: 'glasses'
  }, {
    key: 'orders',
    label: 'Orders',
    icon: 'shopping-bag'
  }, {
    key: 'appointments',
    label: 'Appointments',
    icon: 'calendar'
  }, {
    key: 'content',
    label: 'Content & Campaigns',
    icon: 'layout-template'
  }, {
    key: 'users',
    label: 'Users & Roles',
    icon: 'users'
  }],
  kpis: [{
    key: 'sales',
    label: 'Sales · 30d',
    value: 284900,
    prefix: '₪',
    delta: 12.4,
    up: true,
    icon: 'trending-up'
  }, {
    key: 'orders',
    label: 'Orders',
    value: 486,
    delta: 8.1,
    up: true,
    icon: 'shopping-bag'
  }, {
    key: 'bookings',
    label: 'Bookings',
    value: 173,
    delta: 4.6,
    up: true,
    icon: 'calendar'
  }, {
    key: 'tryon',
    label: 'Try Mirror sessions',
    value: 2140,
    delta: -3.2,
    up: false,
    icon: 'camera'
  }],
  sales12: [42, 51, 47, 63, 58, 71, 66, 82, 77, 90, 85, 98],
  // weekly-ish trend (₪k)
  months: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12'],
  funnel: [{
    label: 'Visited',
    value: 100,
    color: 'var(--pine-700)'
  }, {
    label: 'Tried on',
    value: 46,
    color: 'var(--pine-500)'
  }, {
    label: 'Added to cart',
    value: 28,
    color: 'var(--amber-600)'
  }, {
    label: 'Purchased',
    value: 14,
    color: 'var(--amber-700)'
  }],
  topProducts: [{
    name: 'Ray-Ban Round Metal',
    units: 128,
    revenue: 49920
  }, {
    name: 'Persol PO3092 Havana',
    units: 96,
    revenue: 69120
  }, {
    name: 'Prada PR 17WS Symbole',
    units: 74,
    revenue: 95460
  }, {
    name: 'Versace VE4361 Medusa',
    units: 61,
    revenue: 52460
  }],
  activity: [{
    icon: 'shopping-bag',
    text: 'New order #OZ-24902 · ₪780',
    time: '2 min ago',
    tone: 'pine'
  }, {
    icon: 'calendar',
    text: 'Eye exam booked · Tel Aviv · Thu 10:30',
    time: '18 min ago',
    tone: 'amber'
  }, {
    icon: 'camera',
    text: 'Try Mirror capture saved · Prada Symbole',
    time: '41 min ago',
    tone: 'pine'
  }, {
    icon: 'package',
    text: 'Order #OZ-24817 moved to “In lab”',
    time: '1 hr ago',
    tone: 'neutral'
  }, {
    icon: 'user-plus',
    text: 'New customer registered · maya@…',
    time: '2 hr ago',
    tone: 'pine'
  }],
  products: [{
    id: 'RB3447',
    name: 'Round Metal RB3447',
    brand: 'Ray-Ban',
    category: 'Eyeglasses',
    price: 390,
    stock: 24,
    status: 'Published',
    tryMirror: true,
    media: 5,
    color: '#274A3B'
  }, {
    id: 'PO3092',
    name: 'PO3092 Havana',
    brand: 'Persol',
    category: 'Sunglasses',
    price: 720,
    stock: 8,
    status: 'Published',
    tryMirror: true,
    media: 6,
    color: '#6B4423'
  }, {
    id: 'PR17WS',
    name: 'PR 17WS Symbole',
    brand: 'Prada',
    category: 'Sunglasses',
    price: 1290,
    stock: 3,
    status: 'Published',
    tryMirror: true,
    media: 7,
    color: '#1A1A17'
  }, {
    id: 'TF2233',
    name: 'TF2233B',
    brand: 'Tiffany & Co.',
    category: 'Eyeglasses',
    price: 980,
    stock: 0,
    status: 'Draft',
    tryMirror: false,
    media: 2,
    color: '#274A3B'
  }, {
    id: 'VE4361',
    name: 'VE4361 Medusa',
    brand: 'Versace',
    category: 'Sunglasses',
    price: 860,
    stock: 15,
    status: 'Published',
    tryMirror: true,
    media: 4,
    color: '#E08A2A'
  }, {
    id: 'DG4416',
    name: 'DG4416 Print',
    brand: 'Dolce & Gabbana',
    category: 'Eyeglasses',
    price: 690,
    stock: 11,
    status: 'Scheduled',
    tryMirror: true,
    media: 3,
    color: '#6B4423'
  }, {
    id: 'AC-CL01',
    name: 'Daily Comfort · 30pk',
    brand: 'OPTIZONE',
    category: 'Contact Lenses',
    price: 145,
    stock: 60,
    status: 'Published',
    tryMirror: false,
    media: 1,
    color: '#7DA894'
  }],
  orders: [{
    id: 'OZ-24902',
    customer: 'Maya Levi',
    date: '5 Jul 2026',
    items: 2,
    total: 780,
    pay: 'Bit',
    status: 'Received'
  }, {
    id: 'OZ-24817',
    customer: 'Yossi Bar',
    date: '18 Jun 2026',
    items: 1,
    total: 600,
    pay: 'Card',
    status: 'In lab'
  }, {
    id: 'OZ-24790',
    customer: 'Noa Katz',
    date: '15 Jun 2026',
    items: 1,
    total: 1290,
    pay: 'תשלומים',
    status: 'Ready'
  }, {
    id: 'OZ-24761',
    customer: 'Amir Dahan',
    date: '12 Jun 2026',
    items: 3,
    total: 1740,
    pay: 'Card',
    status: 'Shipped'
  }, {
    id: 'OZ-24603',
    customer: 'Rina Alon',
    date: '2 May 2026',
    items: 1,
    total: 720,
    pay: 'Card',
    status: 'Collected'
  }, {
    id: 'OZ-24588',
    customer: 'Tom Gvir',
    date: '28 Apr 2026',
    items: 2,
    total: 1050,
    pay: 'Bit',
    status: 'Cancelled'
  }],
  orderStages: ['Received', 'In lab', 'Ready', 'Shipped', 'Collected'],
  appointments: [{
    time: '09:00',
    customer: 'Maya Levi',
    service: 'Eye Exam',
    branch: 'Netanya',
    optometrist: 'Dr. Levi',
    status: 'Confirmed'
  }, {
    time: '10:30',
    customer: 'Yossi Bar',
    service: 'Frame Fitting',
    branch: 'Tel Aviv',
    optometrist: '—',
    status: 'Confirmed'
  }, {
    time: '12:00',
    customer: 'Noa Katz',
    service: 'Contact-Lens Fitting',
    branch: 'Tel Aviv',
    optometrist: 'Dr. Amit',
    status: 'Pending'
  }, {
    time: '13:30',
    customer: 'Amir Dahan',
    service: "Kids' Eye Test",
    branch: 'Haifa',
    optometrist: 'Dr. Sela',
    status: 'Confirmed'
  }, {
    time: '15:00',
    customer: 'Rina Alon',
    service: 'Eye Exam',
    branch: 'Netanya',
    optometrist: 'Dr. Levi',
    status: 'No-show'
  }],
  branches: ['All branches', 'Netanya', 'Tel Aviv', 'Haifa'],
  users: [{
    name: 'Dana Cohen',
    email: 'dana@optizone.co.il',
    role: 'Administrator',
    branch: 'HQ',
    active: true,
    initials: 'DC'
  }, {
    name: 'Eitan Mizrahi',
    email: 'eitan@optizone.co.il',
    role: 'Catalog Manager',
    branch: 'HQ',
    active: true,
    initials: 'EM'
  }, {
    name: 'Shira Peled',
    email: 'shira@optizone.co.il',
    role: 'Content Editor',
    branch: 'HQ',
    active: true,
    initials: 'SP'
  }, {
    name: 'Dr. Levi',
    email: 'levi@optizone.co.il',
    role: 'Store Staff / Optician',
    branch: 'Netanya',
    active: true,
    initials: 'DL'
  }, {
    name: 'Dr. Amit',
    email: 'amit@optizone.co.il',
    role: 'Store Staff / Optician',
    branch: 'Tel Aviv',
    active: false,
    initials: 'DA'
  }],
  roles: ['Administrator', 'Catalog Manager', 'Content Editor', 'Store Staff / Optician'],
  campaigns: [{
    title: 'New · 2026 Collection',
    type: 'Homepage hero',
    status: 'Live',
    window: 'Now → 31 Aug'
  }, {
    title: 'Summer Sunglasses Sale',
    type: 'Banner + email',
    status: 'Scheduled',
    window: '10 Jul → 20 Jul'
  }, {
    title: 'Blue-light for screens',
    type: 'Blog article',
    status: 'Draft',
    window: '—'
  }, {
    title: 'Back-to-school kids',
    type: 'Campaign',
    status: 'Ended',
    window: '1 → 30 Jun'
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/data.js", error: String((e && e.message) || e) }); }

// ui_kits/storefront/Account.jsx
try { (() => {
// OPTIZONE storefront — Account: login + customer dashboard (FR-46/47).
const {
  Button,
  Input,
  Icon,
  Tabs,
  Badge,
  Card,
  DiamondRule,
  GlassesMark,
  Price
} = window.OPTIZONEDesignSystem_ded4a5;
function StatCard({
  label,
  value,
  icon
}) {
  const n = window.useCountUp(value);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-hair)',
      borderRadius: 'var(--radius-md)',
      padding: '18px 20px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      width: 34,
      height: 34,
      borderRadius: 'var(--radius-sm)',
      background: 'var(--pine-50)',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 18,
    color: "var(--pine-700)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 30,
      color: 'var(--text-strong)'
    }
  }, n), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--text-muted)',
      letterSpacing: '0.02em'
    }
  }, label));
}
function GoogleButton({
  onLogin
}) {
  const ref = React.useRef(null);
  const [rendered, setRendered] = React.useState(false);
  React.useEffect(() => {
    let tries = 0;
    const handle = resp => {
      // resp.credential is a Google ID token (JWT). In production, send it to your
      // backend to verify with the client SECRET — never trust it on the client alone.
      onLogin(resp);
    };
    const init = () => {
      const g = window.google;
      if (g && g.accounts && g.accounts.id && ref.current && window.OZ_GOOGLE_CLIENT_ID) {
        try {
          g.accounts.id.initialize({
            client_id: window.OZ_GOOGLE_CLIENT_ID,
            callback: handle
          });
          g.accounts.id.renderButton(ref.current, {
            theme: 'outline',
            size: 'large',
            width: 340,
            text: 'continue_with',
            shape: 'rectangular',
            logo_alignment: 'center'
          });
          setRendered(true);
          return true;
        } catch (e) {/* origin not authorized in this sandbox */}
      }
      return false;
    };
    if (init()) return;
    const t = setInterval(() => {
      tries++;
      if (init() || tries > 25) clearInterval(t);
    }, 200);
    return () => clearInterval(t);
  }, []);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      display: 'flex',
      justifyContent: 'center',
      minHeight: rendered ? 44 : 0
    }
  }), !rendered && /*#__PURE__*/React.createElement("button", {
    onClick: () => onLogin(null),
    style: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      height: 44,
      border: '1px solid var(--border-strong)',
      background: 'var(--white)',
      borderRadius: 'var(--radius-sm)',
      cursor: 'pointer',
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--text-strong)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 18,
      height: 18,
      borderRadius: 999,
      border: '2px solid var(--pine-400)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-display)',
      fontSize: 11,
      color: 'var(--pine-700)'
    }
  }, "G"), "Continue with Google"));
}
function Login({
  onLogin
}) {
  const [mode, setMode] = React.useState('password'); // password | otp
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 440,
      margin: '60px auto 110px',
      padding: '0 28px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "oz-route",
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-hair)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-md)',
      padding: '38px 34px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement(GlassesMark, {
    size: 46,
    color: "var(--pine-700)"
  }), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 26,
      color: 'var(--text-strong)',
      margin: '14px 0 4px'
    }
  }, "Welcome back"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      color: 'var(--text-muted)',
      margin: 0
    }
  }, "Sign in to your OPTIZONE account")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4,
      background: 'var(--surface-sunken)',
      borderRadius: 'var(--radius-pill)',
      padding: 4,
      marginBottom: 22
    }
  }, [['password', 'Password'], ['otp', 'SMS code']].map(([k, l]) => /*#__PURE__*/React.createElement("button", {
    key: k,
    onClick: () => setMode(k),
    style: {
      flex: 1,
      border: 'none',
      cursor: 'pointer',
      borderRadius: 'var(--radius-pill)',
      padding: '9px 0',
      fontFamily: 'var(--font-display)',
      fontSize: 12,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      background: mode === k ? 'var(--pine-700)' : 'transparent',
      color: mode === k ? 'var(--cream-100)' : 'var(--text-muted)'
    }
  }, l))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: mode === 'otp' ? 'Phone · 05X-XXX-XXXX' : 'Email address'
  }), mode === 'password' && /*#__PURE__*/React.createElement(Input, {
    type: "password",
    placeholder: "Password"
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    block: true,
    size: "lg",
    onClick: onLogin
  }, mode === 'otp' ? 'Send code' : 'Sign in')), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '22px 0'
    }
  }, /*#__PURE__*/React.createElement(DiamondRule, {
    label: "or"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(GoogleButton, {
    onLogin: () => onLogin()
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    block: true,
    onClick: onLogin,
    startIcon: /*#__PURE__*/React.createElement(Icon, {
      name: "user-plus",
      size: 17,
      color: "currentColor"
    })
  }, "Create an account")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12,
      color: 'var(--text-faint)',
      textAlign: 'center',
      marginTop: 18,
      lineHeight: 1.6
    }
  }, "Protected sign-in \xB7 rate-limited \xB7 IS 5568 accessible")));
}
function Dashboard({
  go
}) {
  const D = window.OZ_DATA;
  const [tab, setTab] = React.useState('orders');
  const statusColor = s => s === 'Collected' ? 'var(--success)' : s === 'Shipped' ? 'var(--info)' : 'var(--amber-700)';
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--pine-700)',
      color: 'var(--cream-100)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '40px 28px',
      display: 'flex',
      alignItems: 'center',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 58,
      height: 58,
      borderRadius: 999,
      background: 'var(--pine-600)',
      border: '1px solid var(--border-on-dark)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-display)',
      fontSize: 22,
      color: 'var(--amber-500)'
    }
  }, "ML"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 12,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: 'var(--amber-500)'
    }
  }, "My account"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 30,
      color: 'var(--cream-100)',
      margin: '4px 0 0'
    }
  }, "Shalom, Maya")))), /*#__PURE__*/React.createElement("div", {
    className: "oz-route",
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '30px 28px 80px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 16,
      marginBottom: 30
    }
  }, /*#__PURE__*/React.createElement(StatCard, {
    label: "Orders",
    value: 2,
    icon: "package"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Prescriptions",
    value: 1,
    icon: "file-text"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Saved looks",
    value: 3,
    icon: "camera"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Appointments",
    value: 1,
    icon: "calendar"
  })), /*#__PURE__*/React.createElement(Tabs, {
    tabs: [{
      value: 'orders',
      label: 'Orders'
    }, {
      value: 'rx',
      label: 'Prescriptions'
    }, {
      value: 'looks',
      label: 'Saved Looks'
    }, {
      value: 'wishlist',
      label: 'Wishlist'
    }],
    value: tab,
    onChange: setTab
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '26px 0'
    }
  }, tab === 'orders' && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, D.orders.map((o, i) => /*#__PURE__*/React.createElement("div", {
    key: o.id,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 18,
      padding: '18px 20px',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-hair)',
      borderRadius: 'var(--radius-md)',
      animation: 'oz-fade-up var(--dur-base) var(--ease-out) both',
      animationDelay: `${i * 70}ms`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 46,
      height: 46,
      borderRadius: 'var(--radius-sm)',
      background: 'var(--cream-300)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "package",
    size: 20,
    color: "var(--pine-700)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 14,
      letterSpacing: '0.06em',
      color: 'var(--text-strong)'
    }
  }, o.id), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: statusColor(o.status)
    }
  }, "\u25CF ", o.status)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      color: 'var(--text-muted)',
      marginTop: 3
    }
  }, o.items, " \xB7 ", o.date)), /*#__PURE__*/React.createElement(Price, {
    amount: o.total,
    size: "md"
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "sm"
  }, "Track")))), tab === 'rx' && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, D.prescriptions.map(r => /*#__PURE__*/React.createElement("div", {
    key: r.name,
    style: {
      padding: '20px 22px',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-hair)',
      borderRadius: 'var(--radius-md)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 16,
      color: 'var(--text-strong)'
    }
  }, r.name), /*#__PURE__*/React.createElement(Badge, {
    variant: "new"
  }, "Valid \u2192 ", r.expires)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 12,
      fontSize: 13.5
    }
  }, [['OD (right)', r.od], ['OS (left)', r.os], ['PD', r.pd + ' mm']].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      background: 'var(--surface-sunken)',
      borderRadius: 'var(--radius-sm)',
      padding: '10px 12px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, k), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      color: 'var(--text-strong)',
      marginTop: 3
    }
  }, v)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm",
    onClick: () => go('catalog')
  }, "Use on new order"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm"
  }, "Download PDF")))), /*#__PURE__*/React.createElement("button", {
    onClick: () => go('catalog'),
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      padding: '16px',
      border: '1.5px dashed var(--border-strong)',
      borderRadius: 'var(--radius-md)',
      background: 'transparent',
      cursor: 'pointer',
      color: 'var(--text-muted)',
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 16
  }), " Add a prescription (upload or manual)")), tab === 'looks' && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 18
    }
  }, D.savedLooks.map((l, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-hair)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      animation: 'oz-scale-in var(--dur-base) var(--ease-out) both',
      animationDelay: `${i * 80}ms`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: '4/3',
      background: 'linear-gradient(160deg,var(--pine-600),var(--pine-800))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "user",
    size: 72,
    color: "rgba(255,255,255,0.14)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: '38%'
    }
  }, /*#__PURE__*/React.createElement(GlassesMark, {
    size: 44,
    color: l.color
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--text-strong)'
    }
  }, l.frame), /*#__PURE__*/React.createElement(Icon, {
    name: "share-2",
    size: 16,
    color: "var(--text-muted)"
  }))))), tab === 'wishlist' && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 20
    }
  }, D.products.slice(2, 5).map(p => /*#__PURE__*/React.createElement(ProductCardWish, {
    key: p.id,
    p: p,
    go: go
  }))))));
}
function ProductCardWish({
  p,
  go
}) {
  const {
    ProductCard
  } = window.OPTIZONEDesignSystem_ded4a5;
  return /*#__PURE__*/React.createElement(ProductCard, {
    brand: p.brand,
    name: p.name,
    amount: p.amount,
    original: p.original,
    rating: p.rating,
    reviewCount: p.reviews,
    badge: p.badge,
    tryMirror: p.tryMirror,
    colors: p.colors,
    style: {
      cursor: 'pointer'
    },
    onClick: () => go('product', p)
  });
}
function Account({
  loggedIn,
  onLogin,
  go
}) {
  React.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  });
  return loggedIn ? /*#__PURE__*/React.createElement(Dashboard, {
    go: go
  }) : /*#__PURE__*/React.createElement(Login, {
    onLogin: onLogin
  });
}
Object.assign(window, {
  Account
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/Account.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/Booking.jsx
try { (() => {
// OPTIZONE storefront — Appointment booking.
const {
  Button,
  Icon,
  Tag,
  Select,
  Input,
  DiamondRule,
  Card
} = window.OPTIZONEDesignSystem_ded4a5;
function Field({
  label,
  children
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 12,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      marginBottom: 12
    }
  }, label), children);
}
function Booking({
  go
}) {
  const D = window.OZ_DATA;
  const [service, setService] = React.useState(D.bookingServices[0]);
  const [branch, setBranch] = React.useState(D.branches[0]);
  const [slot, setSlot] = React.useState('10:30');
  const [done, setDone] = React.useState(false);
  React.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  });
  const days = ['Sun 6', 'Mon 7', 'Tue 8', 'Wed 9', 'Thu 10'];
  const [day, setDay] = React.useState('Mon 7');
  if (done) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 620,
        margin: '60px auto 100px',
        padding: '0 28px',
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 64,
        height: 64,
        borderRadius: 999,
        background: 'var(--pine-50)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 30,
      color: "var(--pine-700)"
    })), /*#__PURE__*/React.createElement("h1", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 500,
        fontSize: 34,
        color: 'var(--text-strong)',
        margin: '20px 0 8px'
      }
    }, "You're booked"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 16,
        color: 'var(--text-body)',
        lineHeight: 1.6
      }
    }, service, " \xB7 ", branch, /*#__PURE__*/React.createElement("br", null), day, " \xB7 ", slot), /*#__PURE__*/React.createElement("div", {
      style: {
        margin: '20px auto',
        maxWidth: 260
      }
    }, /*#__PURE__*/React.createElement(DiamondRule, null)), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 14,
        color: 'var(--text-muted)'
      }
    }, "A confirmation and reminders will be sent via WhatsApp & email. Reschedule anytime from the link."), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 26,
        display: 'flex',
        gap: 12,
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      onClick: () => setDone(false)
    }, "Edit booking"), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      onClick: () => go('home')
    }, "Back to home")));
  }
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--pine-700)',
      color: 'var(--cream-100)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '46px 28px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 13,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'var(--amber-500)'
    }
  }, "Book an appointment"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 40,
      color: 'var(--cream-100)',
      margin: '10px 0 0'
    }
  }, "Eye care, on your schedule"))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 900,
      margin: '0 auto',
      padding: '36px 28px 80px',
      display: 'grid',
      gridTemplateColumns: '1.5fr 1fr',
      gap: 40,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 28
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "1 \xB7 Service"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 10
    }
  }, D.bookingServices.map(s => /*#__PURE__*/React.createElement(Tag, {
    key: s,
    selected: service === s,
    onClick: () => setService(s)
  }, s)))), /*#__PURE__*/React.createElement(Field, {
    label: "2 \xB7 Branch"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, D.branches.map(b => /*#__PURE__*/React.createElement("button", {
    key: b,
    onClick: () => setBranch(b),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '14px 16px',
      textAlign: 'start',
      borderRadius: 'var(--radius-md)',
      border: `1.5px solid ${branch === b ? 'var(--pine-700)' : 'var(--border-hair)'}`,
      background: branch === b ? 'var(--pine-50)' : 'var(--white)',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "map-pin",
    size: 18,
    color: "var(--pine-700)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      color: 'var(--text-strong)'
    }
  }, b))))), /*#__PURE__*/React.createElement(Field, {
    label: "3 \xB7 Date"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, days.map(d => /*#__PURE__*/React.createElement("button", {
    key: d,
    onClick: () => setDay(d),
    style: {
      flex: 1,
      padding: '12px 0',
      borderRadius: 'var(--radius-sm)',
      border: `1.5px solid ${day === d ? 'var(--amber-600)' : 'var(--border-hair)'}`,
      background: day === d ? 'var(--amber-50)' : 'var(--white)',
      cursor: 'pointer',
      fontFamily: 'var(--font-display)',
      fontSize: 13,
      letterSpacing: '0.04em',
      color: 'var(--text-strong)'
    }
  }, d)))), /*#__PURE__*/React.createElement(Field, {
    label: "4 \xB7 Time"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 10
    }
  }, D.slots.map(t => /*#__PURE__*/React.createElement("button", {
    key: t,
    onClick: () => setSlot(t),
    style: {
      padding: '12px 0',
      borderRadius: 'var(--radius-sm)',
      border: `1.5px solid ${slot === t ? 'var(--pine-700)' : 'var(--border-hair)'}`,
      background: slot === t ? 'var(--pine-700)' : 'var(--white)',
      color: slot === t ? 'var(--cream-100)' : 'var(--text-body)',
      cursor: 'pointer',
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      fontWeight: 600
    }
  }, t))))), /*#__PURE__*/React.createElement(Card, {
    padding: "lg",
    style: {
      position: 'sticky',
      top: 96
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 14,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: 'var(--text-strong)',
      marginBottom: 16
    }
  }, "Your appointment"), [['Service', service], ['Branch', branch], ['Date', day], ['Time', slot]].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: 12,
      padding: '10px 0',
      borderBottom: '1px solid var(--border-hair)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--text-muted)'
    }
  }, k), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: 'var(--text-strong)',
      fontWeight: 600,
      textAlign: 'end'
    }
  }, v))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18,
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Full name"
  }), /*#__PURE__*/React.createElement(Input, {
    placeholder: "Phone \xB7 05X-XXX-XXXX"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    block: true,
    size: "lg",
    onClick: () => setDone(true)
  }, "Confirm booking")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12,
      color: 'var(--text-muted)',
      marginTop: 12,
      textAlign: 'center'
    }
  }, "No payment needed. Free reschedule & cancellation."))));
}
Object.assign(window, {
  Booking
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/Booking.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/Cart.jsx
try { (() => {
// OPTIZONE storefront — Cart.
const {
  Button,
  Icon,
  QuantityStepper,
  Price,
  Card,
  DiamondRule,
  Input,
  GlassesMark
} = window.OPTIZONEDesignSystem_ded4a5;
function Cart({
  cart,
  setCart,
  go
}) {
  React.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  });
  const subtotal = cart.reduce((s, i) => s + i.amount * i.qty, 0);
  const shipping = subtotal > 400 || subtotal === 0 ? 0 : 30;
  const setQty = (idx, qty) => setCart(cart.map((c, i) => i === idx ? {
    ...c,
    qty
  } : c));
  const remove = idx => setCart(cart.filter((_, i) => i !== idx));
  if (cart.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 560,
        margin: '80px auto 120px',
        textAlign: 'center',
        padding: '0 28px'
      }
    }, /*#__PURE__*/React.createElement(GlassesMark, {
      size: 64,
      color: "var(--pine-300)"
    }), /*#__PURE__*/React.createElement("h1", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 500,
        fontSize: 30,
        color: 'var(--text-strong)',
        margin: '20px 0 8px'
      }
    }, "Your cart is empty"), /*#__PURE__*/React.createElement("p", {
      style: {
        color: 'var(--text-muted)',
        marginBottom: 22
      }
    }, "Find a frame you love \u2014 and try it on before you buy."), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      size: "lg",
      onClick: () => go('catalog')
    }, "Shop Frames"));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '36px 28px 80px'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 34,
      color: 'var(--text-strong)',
      margin: '0 0 24px'
    }
  }, "Your cart"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 340px',
      gap: 36,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, cart.map((it, idx) => /*#__PURE__*/React.createElement("div", {
    key: idx,
    style: {
      display: 'flex',
      gap: 18,
      padding: 16,
      background: 'var(--surface-card)',
      border: '1px solid var(--border-hair)',
      borderRadius: 'var(--radius-md)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 92,
      height: 92,
      borderRadius: 'var(--radius-sm)',
      background: 'var(--cream-300)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: '0 0 auto'
    }
  }, /*#__PURE__*/React.createElement(GlassesMark, {
    size: 26,
    color: it.colors && it.colors[0] || 'var(--pine-500)'
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 11,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--text-accent)'
    }
  }, it.brand), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 600,
      color: 'var(--text-strong)',
      margin: '3px 0 6px'
    }
  }, it.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-muted)'
    }
  }, "Frame + lens \xB7 configured")), /*#__PURE__*/React.createElement(QuantityStepper, {
    value: it.qty,
    onChange: q => setQty(idx, q),
    size: "sm"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 90,
      textAlign: 'end'
    }
  }, /*#__PURE__*/React.createElement(Price, {
    amount: it.amount * it.qty
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => remove(idx),
    "aria-label": "remove",
    style: {
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      color: 'var(--text-faint)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "trash-2",
    size: 18
  }))))), /*#__PURE__*/React.createElement(Card, {
    padding: "lg",
    style: {
      position: 'sticky',
      top: 96
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 14,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: 'var(--text-strong)',
      marginBottom: 16
    }
  }, "Summary"), [['Subtotal', `₪${subtotal.toLocaleString('he-IL')}`], ['Shipping', shipping ? `₪${shipping}` : 'Free']].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '9px 0',
      fontSize: 14,
      color: 'var(--text-body)'
    }
  }, /*#__PURE__*/React.createElement("span", null, k), /*#__PURE__*/React.createElement("span", null, v))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      margin: '12px 0'
    }
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Promo code",
    containerStyle: {
      flex: 1
    },
    size: "sm"
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "sm"
  }, "Apply")), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid var(--border-hair)',
      margin: '8px 0 14px'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 15,
      letterSpacing: '0.06em',
      color: 'var(--text-strong)'
    }
  }, "TOTAL"), /*#__PURE__*/React.createElement(Price, {
    amount: subtotal + shipping,
    size: "lg"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    block: true,
    size: "lg",
    onClick: () => go('checkout')
  }, "Checkout"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    block: true,
    onClick: () => go('booking')
  }, "Reserve & fit in-store")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      gap: 14,
      marginTop: 14,
      fontSize: 11,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: 'var(--text-faint)',
      fontFamily: 'var(--font-display)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Visa"), /*#__PURE__*/React.createElement("span", null, "Mastercard"), /*#__PURE__*/React.createElement("span", null, "Bit"), /*#__PURE__*/React.createElement("span", null, "\u05EA\u05E9\u05DC\u05D5\u05DE\u05D9\u05DD")))));
}
Object.assign(window, {
  Cart
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/Cart.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/Catalog.jsx
try { (() => {
// OPTIZONE storefront — Catalog / product listing.
const {
  ProductCard,
  Tag,
  Switch,
  Select,
  Button,
  Icon,
  DiamondRule
} = window.OPTIZONEDesignSystem_ded4a5;
function Catalog({
  go,
  addToCart
}) {
  const D = window.OZ_DATA;
  const [selected, setSelected] = React.useState({});
  const [tryOnly, setTryOnly] = React.useState(false);
  const [sort, setSort] = React.useState('popular');
  React.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  });
  const toggle = (group, val) => {
    setSelected(s => {
      const cur = new Set(s[group] || []);
      cur.has(val) ? cur.delete(val) : cur.add(val);
      return {
        ...s,
        [group]: [...cur]
      };
    });
  };
  const activeVals = Object.values(selected).flat();
  let list = D.products.filter(p => {
    if (tryOnly && !p.tryMirror) return false;
    for (const [g, vals] of Object.entries(selected)) {
      if (!vals.length) continue;
      const field = g === 'Frame Shape' ? p.shape : g === 'Material' ? p.material : p.gender;
      if (!vals.includes(field)) return false;
    }
    return true;
  });
  if (sort === 'price-asc') list = [...list].sort((a, b) => a.amount - b.amount);
  if (sort === 'price-desc') list = [...list].sort((a, b) => b.amount - a.amount);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--cream-300)',
      borderBottom: '1px solid var(--border-soft)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '34px 28px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 12,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, "Home / Eyeglasses"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 40,
      color: 'var(--text-strong)',
      margin: '10px 0 0'
    }
  }, "Eyeglasses"))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '28px 28px 72px',
      display: 'grid',
      gridTemplateColumns: '250px 1fr',
      gap: 34,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("aside", {
    style: {
      position: 'sticky',
      top: 96,
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 14,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: 'var(--text-strong)'
    }
  }, "Filters"), activeVals.length > 0 && /*#__PURE__*/React.createElement("a", {
    onClick: () => setSelected({}),
    style: {
      fontSize: 13,
      color: 'var(--amber-700)',
      cursor: 'pointer'
    }
  }, "Clear")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 0',
      borderTop: '1px solid var(--border-hair)',
      borderBottom: '1px solid var(--border-hair)'
    }
  }, /*#__PURE__*/React.createElement(Switch, {
    label: "Try Mirror only",
    checked: tryOnly,
    onChange: setTryOnly
  })), Object.entries(D.filters).map(([group, vals]) => /*#__PURE__*/React.createElement("div", {
    key: group
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 12,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      marginBottom: 12
    }
  }, group), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8
    }
  }, vals.map(v => /*#__PURE__*/React.createElement(Tag, {
    key: v,
    selected: (selected[group] || []).includes(v),
    onClick: () => toggle(group, v)
  }, v)))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: 'var(--text-muted)'
    }
  }, list.length, " frames"), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 220
    }
  }, /*#__PURE__*/React.createElement(Select, {
    value: sort,
    onChange: e => setSort(e.target.value),
    options: [{
      value: 'popular',
      label: 'Sort: Popularity'
    }, {
      value: 'price-asc',
      label: 'Price: Low to High'
    }, {
      value: 'price-desc',
      label: 'Price: High to Low'
    }]
  }))), list.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '60px 0',
      textAlign: 'center',
      color: 'var(--text-muted)'
    }
  }, "No frames match these filters.") : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 20
    }
  }, list.map(p => /*#__PURE__*/React.createElement(ProductCard, {
    key: p.id,
    brand: p.brand,
    name: p.name,
    amount: p.amount,
    original: p.original,
    rating: p.rating,
    reviewCount: p.reviews,
    badge: p.badge,
    tryMirror: p.tryMirror,
    colors: p.colors,
    onQuickAdd: () => addToCart(p),
    style: {
      cursor: 'pointer'
    },
    onClick: () => go('product', p)
  }))))));
}
Object.assign(window, {
  Catalog
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/Catalog.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/Checkout.jsx
try { (() => {
// OPTIZONE storefront — checkout: contact → shipping → payment → confirmation (FR-31/32/33/36-39).
const {
  Button,
  Input,
  Select,
  Icon,
  DiamondRule,
  Price,
  GlassesMark
} = window.OPTIZONEDesignSystem_ded4a5;
function Step({
  n,
  label,
  active,
  done
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      opacity: active || done ? 1 : 0.5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 30,
      height: 30,
      borderRadius: 999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-display)',
      fontSize: 13,
      background: done ? 'var(--success)' : active ? 'var(--pine-700)' : 'var(--surface-sunken)',
      color: done || active ? 'var(--cream-100)' : 'var(--text-muted)',
      transition: 'all var(--dur-base) var(--ease-out)'
    }
  }, done ? /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 15,
    color: "currentColor"
  }) : n), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 12.5,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: active ? 'var(--text-strong)' : 'var(--text-muted)'
    }
  }, label));
}
function PayOption({
  id,
  sel,
  onSel,
  icon,
  title,
  sub
}) {
  const active = sel === id;
  return /*#__PURE__*/React.createElement("button", {
    onClick: () => onSel(id),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      width: '100%',
      textAlign: 'start',
      padding: '14px 16px',
      borderRadius: 'var(--radius-md)',
      border: `1.5px solid ${active ? 'var(--pine-700)' : 'var(--border-hair)'}`,
      background: active ? 'var(--pine-50)' : 'var(--white)',
      cursor: 'pointer',
      transition: 'all var(--dur-fast) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 40,
      height: 40,
      borderRadius: 'var(--radius-sm)',
      background: 'var(--surface-sunken)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: '0 0 auto'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 20,
    color: "var(--pine-700)"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontSize: 15,
      fontWeight: 600,
      color: 'var(--text-strong)'
    }
  }, title), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontSize: 13,
      color: 'var(--text-muted)'
    }
  }, sub)), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 20,
      height: 20,
      borderRadius: 999,
      border: `2px solid ${active ? 'var(--pine-700)' : 'var(--border-strong)'}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, active && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: 999,
      background: 'var(--pine-700)'
    }
  })));
}
function Checkout({
  cart,
  subtotal,
  go,
  onComplete
}) {
  const [step, setStep] = React.useState(0); // 0 contact, 1 shipping, 2 payment, 3 done
  const [pay, setPay] = React.useState('card');
  const [ship, setShip] = React.useState('delivery');
  React.useEffect(() => {
    window.lucide && window.lucide.createIcons();
    window.scrollTo({
      top: 0
    });
  }, [step]);
  const shipping = ship === 'pickup' || subtotal > 400 ? 0 : 30;
  const total = subtotal + shipping;
  if (step === 3) {
    return /*#__PURE__*/React.createElement("div", {
      className: "oz-route",
      style: {
        maxWidth: 560,
        margin: '64px auto 110px',
        padding: '0 28px',
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'relative',
        width: 76,
        height: 76,
        borderRadius: 999,
        background: 'var(--pine-50)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        inset: 0,
        borderRadius: 999,
        border: '2px solid var(--pine-400)',
        animation: 'oz-ring 1.6s var(--ease-out) infinite'
      }
    }), /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 36,
      color: "var(--pine-700)"
    })), /*#__PURE__*/React.createElement("h1", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 500,
        fontSize: 32,
        color: 'var(--text-strong)',
        margin: '22px 0 6px'
      }
    }, "Order confirmed"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 16,
        color: 'var(--text-body)',
        lineHeight: 1.6
      }
    }, "Order ", /*#__PURE__*/React.createElement("b", null, "#OZ-24902"), " \xB7 \u20AA", total.toLocaleString('he-IL'), /*#__PURE__*/React.createElement("br", null), "A tax invoice (\u05D7\u05E9\u05D1\u05D5\u05E0\u05D9\u05EA \u05DE\u05E1) and tracking link are on the way via email & WhatsApp."), /*#__PURE__*/React.createElement("div", {
      style: {
        margin: '22px auto',
        maxWidth: 280
      }
    }, /*#__PURE__*/React.createElement(DiamondRule, {
      label: "Thank you"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 12,
        justifyContent: 'center',
        marginTop: 8
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      onClick: () => go('account')
    }, "Track order"), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      onClick: () => {
        onComplete();
        go('home');
      }
    }, "Continue shopping")));
  }
  const steps = ['Contact', 'Shipping', 'Payment'];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '32px 28px 80px'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 32,
      color: 'var(--text-strong)',
      margin: '0 0 22px'
    }
  }, "Checkout"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 28,
      marginBottom: 30,
      flexWrap: 'wrap'
    }
  }, steps.map((s, i) => /*#__PURE__*/React.createElement(Step, {
    key: s,
    n: i + 1,
    label: s,
    active: step === i,
    done: step > i
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 340px',
      gap: 36,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    key: step,
    className: "oz-route",
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, step === 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SectionTitle, null, "Contact details"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "First name",
    defaultValue: "Maya"
  }), /*#__PURE__*/React.createElement(Input, {
    placeholder: "Last name",
    defaultValue: "Levi"
  })), /*#__PURE__*/React.createElement(Input, {
    placeholder: "Email",
    defaultValue: "maya@example.co.il"
  }), /*#__PURE__*/React.createElement(Input, {
    placeholder: "Phone \xB7 05X-XXX-XXXX",
    defaultValue: "058-644-2303"
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    onClick: () => setStep(1),
    endIcon: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right",
      size: 18,
      color: "currentColor"
    })
  }, "Continue to shipping")), step === 1 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SectionTitle, null, "Delivery method"), /*#__PURE__*/React.createElement(PayOption, {
    id: "delivery",
    sel: ship,
    onSel: setShip,
    icon: "truck",
    title: "Home delivery",
    sub: subtotal > 400 ? 'Free · 2–4 business days' : '₪30 · 2–4 business days'
  }), /*#__PURE__*/React.createElement(PayOption, {
    id: "pickup",
    sel: ship,
    onSel: setShip,
    icon: "store",
    title: "Collect in branch",
    sub: "Free \xB7 ready in 1\u20132 days"
  }), ship === 'delivery' && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement(SectionTitle, null, "Shipping address"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Street & number",
    defaultValue: "\u05D4\u05E9\u05DC\u05D9\u05DD 12"
  }), /*#__PURE__*/React.createElement(Input, {
    placeholder: "Apt / entrance"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "City",
    defaultValue: "\u05E0\u05EA\u05E0\u05D9\u05D4"
  }), /*#__PURE__*/React.createElement(Input, {
    placeholder: "Postal code",
    defaultValue: "4237512"
  }))), ship === 'pickup' && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement(Select, {
    options: window.OZ_DATA.branches.map(b => ({
      value: b,
      label: b
    }))
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      marginTop: 6
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    onClick: () => setStep(0)
  }, "Back"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    block: true,
    onClick: () => setStep(2),
    endIcon: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right",
      size: 18,
      color: "currentColor"
    })
  }, "Continue to payment"))), step === 2 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SectionTitle, null, "Payment method"), /*#__PURE__*/React.createElement(PayOption, {
    id: "card",
    sel: pay,
    onSel: setPay,
    icon: "credit-card",
    title: "Credit / debit card",
    sub: "Visa \xB7 Mastercard \xB7 secured gateway"
  }), /*#__PURE__*/React.createElement(PayOption, {
    id: "bit",
    sel: pay,
    onSel: setPay,
    icon: "smartphone",
    title: "Bit",
    sub: "Pay from your phone"
  }), /*#__PURE__*/React.createElement(PayOption, {
    id: "installments",
    sel: pay,
    onSel: setPay,
    icon: "layers",
    title: "\u05EA\u05E9\u05DC\u05D5\u05DE\u05D9\u05DD \xB7 Installments",
    sub: "Split into up to 12 payments"
  }), pay === 'card' && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Card number",
    defaultValue: "4580 \u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 1234"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "MM / YY",
    defaultValue: "09 / 28"
  }), /*#__PURE__*/React.createElement(Input, {
    placeholder: "CVV",
    defaultValue: "\u2022\u2022\u2022"
  }))), pay === 'installments' && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement(Select, {
    options: [3, 6, 12].map(n => ({
      value: String(n),
      label: `${n} payments · ₪${Math.round(total / n)}/mo`
    }))
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 12.5,
      color: 'var(--text-muted)',
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "lock",
    size: 14
  }), " No card data touches our servers \xB7 PCI-DSS via gateway"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      marginTop: 6
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    onClick: () => setStep(1)
  }, "Back"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    block: true,
    onClick: () => setStep(3),
    startIcon: /*#__PURE__*/React.createElement(Icon, {
      name: "lock",
      size: 17,
      color: "currentColor"
    })
  }, "Pay \u20AA", total.toLocaleString('he-IL'))))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'sticky',
      top: 96,
      background: 'var(--surface-card)',
      border: '1px solid var(--border-hair)',
      borderRadius: 'var(--radius-lg)',
      padding: 22,
      boxShadow: 'var(--shadow-sm)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 14,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: 'var(--text-strong)',
      marginBottom: 16
    }
  }, "Order summary"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      marginBottom: 14
    }
  }, cart.map((it, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 44,
      height: 44,
      borderRadius: 'var(--radius-sm)',
      background: 'var(--cream-300)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: '0 0 auto'
    }
  }, /*#__PURE__*/React.createElement(GlassesMark, {
    size: 18,
    color: it.colors && it.colors[0] || 'var(--pine-500)'
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontSize: 13.5
    }
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--text-strong)'
    }
  }, it.name), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)'
    }
  }, "Qty ", it.qty)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13.5,
      fontWeight: 600
    }
  }, "\u20AA", (it.amount * it.qty).toLocaleString('he-IL'))))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid var(--border-hair)',
      paddingTop: 12
    }
  }, [['Subtotal', `₪${subtotal.toLocaleString('he-IL')}`], ['Shipping', shipping ? `₪${shipping}` : 'Free']].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '6px 0',
      fontSize: 14,
      color: 'var(--text-body)'
    }
  }, /*#__PURE__*/React.createElement("span", null, k), /*#__PURE__*/React.createElement("span", null, v)))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid var(--border-hair)',
      marginTop: 8,
      paddingTop: 12,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 15,
      letterSpacing: '0.06em',
      color: 'var(--text-strong)'
    }
  }, "TOTAL"), /*#__PURE__*/React.createElement(Price, {
    amount: total,
    size: "lg"
  })))));
}
function SectionTitle({
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 13,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: 'var(--text-strong)'
    }
  }, children);
}
Object.assign(window, {
  Checkout
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/Checkout.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/Chrome.jsx
try { (() => {
// OPTIZONE storefront — shared header & footer chrome.
const {
  Logo,
  Icon,
  IconButton,
  Button,
  DiamondRule
} = window.OPTIZONEDesignSystem_ded4a5;
function Header({
  route,
  go,
  cartCount,
  onSearch,
  loggedIn
}) {
  const D = window.OZ_DATA;
  const scrolled = window.useScrolled(4);
  React.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  });
  const navTo = key => key === 'eyeglasses' ? 'catalog' : key === 'book' ? 'booking' : key === 'stores' ? 'stores' : 'catalog';
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: scrolled ? 'var(--shadow-md)' : 'none',
      transition: 'box-shadow var(--dur-base) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--pine-950)',
      color: 'var(--cream-200)',
      textAlign: 'center',
      fontSize: 12.5,
      letterSpacing: '0.06em',
      padding: '7px 16px',
      fontFamily: 'var(--font-body)'
    }
  }, "Free shipping over \u20AA400 \xB7 Complete your fitting in any branch"), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--pine-700)',
      borderBottom: '1px solid var(--border-on-dark)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '0 28px',
      height: 74,
      display: 'flex',
      alignItems: 'center',
      gap: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      cursor: 'pointer'
    },
    onClick: () => go('home')
  }, /*#__PURE__*/React.createElement(Logo, {
    variant: "horizontal",
    theme: "dark",
    size: 22,
    tagline: false
  })), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      gap: 26,
      marginInlineStart: 12
    }
  }, D.nav.map(n => {
    const active = route === navTo(n.key) || n.key === 'eyeglasses' && route === 'catalog';
    return /*#__PURE__*/React.createElement("a", {
      key: n.key,
      onClick: () => go(navTo(n.key)),
      style: {
        cursor: 'pointer',
        fontFamily: 'var(--font-display)',
        fontSize: 13,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: active ? 'var(--amber-500)' : 'var(--cream-100)',
        paddingBottom: 2,
        borderBottom: `2px solid ${active ? 'var(--amber-500)' : 'transparent'}`
      }
    }, n.label);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginInlineStart: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    variant: "ghost",
    onClick: onSearch,
    style: {
      color: 'var(--cream-100)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    color: "var(--cream-100)"
  })), /*#__PURE__*/React.createElement(IconButton, {
    variant: "ghost",
    onClick: () => go('account'),
    style: {
      color: 'var(--cream-100)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "heart",
    color: "var(--cream-100)"
  })), /*#__PURE__*/React.createElement(IconButton, {
    variant: "ghost",
    onClick: () => go('account'),
    style: {
      color: loggedIn ? 'var(--amber-500)' : 'var(--cream-100)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "user",
    color: loggedIn ? 'var(--amber-500)' : 'var(--cream-100)'
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    variant: "accent",
    round: true,
    onClick: () => go('cart')
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "shopping-bag"
  })), cartCount > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: -4,
      insetInlineEnd: -4,
      minWidth: 18,
      height: 18,
      padding: '0 5px',
      background: 'var(--pine-950)',
      color: 'var(--cream-100)',
      borderRadius: 999,
      fontSize: 11,
      fontWeight: 700,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '2px solid var(--pine-700)'
    }
  }, cartCount)), /*#__PURE__*/React.createElement("span", {
    style: {
      marginInlineStart: 10,
      fontFamily: 'var(--font-display)',
      fontSize: 12,
      letterSpacing: '0.08em',
      color: 'var(--cream-200)',
      border: '1px solid var(--border-on-dark)',
      borderRadius: 'var(--radius-pill)',
      padding: '5px 12px',
      cursor: 'pointer'
    }
  }, "\u05E2\u05D1 / EN")))));
}
function Footer({
  go
}) {
  const linkTo = {
    'Eyeglasses': 'catalog',
    'Sunglasses': 'catalog',
    'Contact Lenses': 'catalog',
    'Accessories': 'catalog',
    'Book an Eye Exam': 'booking',
    'Try Mirror': 'catalog',
    'Store Locator': 'stores',
    'Branches': 'stores'
  };
  const cols = [{
    h: 'Shop',
    items: ['Eyeglasses', 'Sunglasses', 'Contact Lenses', 'Accessories', 'Gift Cards']
  }, {
    h: 'Services',
    items: ['Book an Eye Exam', 'Try Mirror', 'Lens Guide', 'Store Locator', 'Prescription Help']
  }, {
    h: 'OPTIZONE',
    items: ['Our Story', 'Branches', 'Careers', 'Blog', 'Contact']
  }];
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--pine-800)',
      color: 'var(--cream-200)',
      marginTop: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '56px 28px 28px',
      display: 'grid',
      gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
      gap: 40
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Logo, {
    variant: "wordmark",
    theme: "dark",
    size: 26
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 18,
      fontSize: 14,
      lineHeight: 1.6,
      color: 'var(--pine-200)',
      maxWidth: 240
    }
  }, "Premium eyewear & eye care. Try any frame on before you buy."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      fontSize: 13,
      color: 'var(--pine-200)',
      lineHeight: 1.8
    }
  }, "\u05D4\u05E9\u05DC\u05D9\u05DD 12, \u05E0\u05EA\u05E0\u05D9\u05D4", /*#__PURE__*/React.createElement("br", null), "058-644-2303 \xB7 www.optizone.co.il")), cols.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.h
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 12,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: 'var(--amber-500)',
      marginBottom: 16
    }
  }, c.h), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, c.items.map(i => /*#__PURE__*/React.createElement("a", {
    key: i,
    onClick: () => linkTo[i] && go && go(linkTo[i]),
    style: {
      fontSize: 14,
      color: 'var(--cream-200)',
      cursor: 'pointer'
    }
  }, i)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid var(--border-on-dark)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '18px 28px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: 12.5,
      color: 'var(--pine-200)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 OPTIZONE \xB7 Vision & Style"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("span", null, "Accessibility Statement (IS 5568)"), /*#__PURE__*/React.createElement("span", null, "Privacy"), /*#__PURE__*/React.createElement("span", null, "Terms")))));
}
Object.assign(window, {
  Header,
  Footer
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/Chrome.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/Home.jsx
try { (() => {
// OPTIZONE storefront — Home page.
const {
  Button,
  Icon,
  DiamondRule,
  ProductCard,
  Card,
  GlassesMark
} = window.OPTIZONEDesignSystem_ded4a5;
function ServiceTile({
  s
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      padding: '22px 20px',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-hair)',
      borderRadius: 'var(--radius-md)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 44,
      height: 44,
      borderRadius: 'var(--radius-sm)',
      background: 'var(--pine-50)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: s.icon,
    size: 22,
    color: "var(--pine-700)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 16,
      letterSpacing: '0.02em',
      color: 'var(--text-strong)'
    }
  }, s.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-muted)',
      lineHeight: 1.5
    }
  }, s.desc));
}
function Home({
  go,
  addToCart
}) {
  const D = window.OZ_DATA;
  const {
    Reveal
  } = window;
  React.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  });
  const rise = d => ({
    animation: 'oz-fade-up var(--dur-slow) var(--ease-out) both',
    animationDelay: `${d}ms`
  });
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--pine-700)',
      color: 'var(--cream-100)',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '84px 28px 92px',
      display: 'grid',
      gridTemplateColumns: '1.1fr 0.9fr',
      gap: 40,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      ...rise(40),
      display: 'inline-block',
      fontFamily: 'var(--font-display)',
      fontSize: 13,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'var(--amber-500)'
    }
  }, "New \xB7 2026 Collection"), /*#__PURE__*/React.createElement("h1", {
    style: {
      ...rise(120),
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 60,
      lineHeight: 1.02,
      letterSpacing: '0.01em',
      color: 'var(--cream-100)',
      margin: '18px 0 0'
    }
  }, "See the world", /*#__PURE__*/React.createElement("br", null), "in ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--amber-500)'
    }
  }, "style"), "."), /*#__PURE__*/React.createElement("p", {
    style: {
      ...rise(220),
      fontSize: 18,
      lineHeight: 1.6,
      color: 'var(--pine-100)',
      maxWidth: 440,
      marginTop: 20
    }
  }, "Handcrafted frames, expertly fitted. Try any pair on with Try Mirror before you buy \u2014 no card needed to reserve."), /*#__PURE__*/React.createElement("div", {
    style: {
      ...rise(320),
      display: 'flex',
      gap: 14,
      marginTop: 30
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    onClick: () => go('catalog')
  }, "Shop Frames"), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "lg",
    onClick: () => go('booking'),
    style: {
      color: 'var(--cream-100)',
      borderColor: 'var(--cream-100)'
    },
    startIcon: /*#__PURE__*/React.createElement(Icon, {
      name: "calendar",
      size: 18,
      color: "currentColor"
    })
  }, "Book an Exam")), /*#__PURE__*/React.createElement("div", {
    style: {
      ...rise(420),
      marginTop: 40,
      maxWidth: 320
    }
  }, /*#__PURE__*/React.createElement(DiamondRule, {
    label: "Trusted since 2009",
    color: "var(--amber-500)"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      ...rise(240),
      position: 'relative',
      aspectRatio: '4/3',
      borderRadius: 'var(--radius-lg)',
      background: 'linear-gradient(160deg,var(--pine-600),var(--pine-800))',
      border: '1px solid var(--border-on-dark)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: 'var(--shadow-dark)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      animation: 'oz-float 5s var(--ease-in-out) infinite'
    }
  }, /*#__PURE__*/React.createElement(GlassesMark, {
    size: 120,
    color: "var(--amber-500)"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      bottom: 18,
      insetInlineEnd: 18,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      background: 'rgba(18,36,26,0.7)',
      color: 'var(--cream-100)',
      padding: '8px 14px',
      borderRadius: 999,
      fontFamily: 'var(--font-display)',
      fontSize: 11,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      backdropFilter: 'blur(4px)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "camera",
    size: 14,
    color: "var(--amber-500)"
  }), " Try Mirror ready")))), /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '64px 28px 8px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: 32
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 13,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'var(--amber-700)'
    }
  }, "What we do"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 32,
      color: 'var(--text-strong)',
      margin: '10px 0 0'
    }
  }, "Complete eye care, beautifully done")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 18
    }
  }, D.services.map((s, i) => /*#__PURE__*/React.createElement(Reveal, {
    key: s.title,
    delay: i * 70
  }, /*#__PURE__*/React.createElement(ServiceTile, {
    s: s
  }))))), /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '56px 28px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 13,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'var(--amber-700)'
    }
  }, "Bestsellers"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 32,
      color: 'var(--text-strong)',
      margin: '8px 0 0'
    }
  }, "Frames of the season")), /*#__PURE__*/React.createElement(Button, {
    variant: "link",
    onClick: () => go('catalog'),
    endIcon: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right",
      size: 16,
      color: "currentColor"
    })
  }, "View all")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 20
    }
  }, D.products.slice(0, 4).map((p, i) => /*#__PURE__*/React.createElement(Reveal, {
    key: p.id,
    delay: i * 80
  }, /*#__PURE__*/React.createElement(ProductCard, {
    brand: p.brand,
    name: p.name,
    amount: p.amount,
    original: p.original,
    rating: p.rating,
    reviewCount: p.reviews,
    badge: p.badge,
    tryMirror: p.tryMirror,
    colors: p.colors,
    onQuickAdd: () => addToCart(p),
    style: {
      cursor: 'pointer'
    },
    onClick: () => go('product', p)
  }))))), /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto 72px',
      padding: '0 28px'
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--pine-800)',
      borderRadius: 'var(--radius-xl)',
      padding: '48px 52px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 32,
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 13,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'var(--amber-500)'
    }
  }, "Try Mirror"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 34,
      color: 'var(--cream-100)',
      margin: '12px 0 10px'
    }
  }, "Try them on from home"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 16,
      color: 'var(--pine-100)',
      maxWidth: 440,
      lineHeight: 1.6
    }
  }, "Live, on-device virtual try-on. Compare frames side by side, save your looks, and share to WhatsApp. Nothing is stored."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 22
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    onClick: () => go('catalog')
  }, "Start Try Mirror"))), /*#__PURE__*/React.createElement(GlassesMark, {
    size: 96,
    color: "var(--amber-500)",
    style: {
      flex: '0 0 auto',
      opacity: 0.9
    }
  })))));
}
Object.assign(window, {
  Home
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/Home.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/Product.jsx
try { (() => {
// OPTIZONE storefront — Product detail page (PDP) with Try Mirror + lens configurator.
const {
  Button,
  IconButton,
  Icon,
  Tabs,
  Rating,
  Price,
  Dialog,
  Checkbox,
  Select,
  DiamondRule,
  Badge,
  GlassesMark
} = window.OPTIZONEDesignSystem_ded4a5;
function MarkThumb({
  active,
  onClick,
  tint
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      width: 64,
      height: 64,
      borderRadius: 'var(--radius-sm)',
      border: `1.5px solid ${active ? 'var(--pine-700)' : 'var(--border-hair)'}`,
      background: 'var(--cream-300)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 0
    }
  }, /*#__PURE__*/React.createElement(GlassesMark, {
    size: 20,
    color: tint || 'var(--pine-500)'
  }));
}
function LensRow({
  label,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      padding: '14px 0',
      borderBottom: '1px solid var(--border-hair)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: 'var(--text-body)'
    }
  }, label), children);
}
function Product({
  product,
  go,
  addToCart
}) {
  const p = product || window.OZ_DATA.products[0];
  const [img, setImg] = React.useState(0);
  const [tab, setTab] = React.useState('desc');
  const [consent, setConsent] = React.useState(false);
  const [mirror, setMirror] = React.useState(false);
  const [lensOpen, setLensOpen] = React.useState(false);
  const [index, setIndex] = React.useState('1.6');
  const [ar, setAr] = React.useState(true);
  const [blue, setBlue] = React.useState(false);
  const [photo, setPhoto] = React.useState(false);
  React.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  });
  const lensPrice = (index === '1.6' ? 120 : index === '1.67' ? 260 : index === '1.74' ? 420 : 0) + (ar ? 90 : 0) + (blue ? 70 : 0) + (photo ? 180 : 0);
  const total = p.amount + lensPrice;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '28px 28px 72px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 12,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      cursor: 'pointer'
    },
    onClick: () => go('catalog')
  }, "\u2190 Back to Eyeglasses"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 48,
      marginTop: 20,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, [0, 1, 2, 3].map(i => /*#__PURE__*/React.createElement(MarkThumb, {
    key: i,
    active: img === i,
    onClick: () => setImg(i),
    tint: p.colors[i % p.colors.length]
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      position: 'relative',
      aspectRatio: '1',
      background: 'var(--cream-300)',
      borderRadius: 'var(--radius-lg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid var(--border-hair)'
    }
  }, /*#__PURE__*/React.createElement(GlassesMark, {
    size: 130,
    color: p.colors[img % p.colors.length]
  }), p.tryMirror && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 16,
      insetInlineStart: 16
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    variant: "try"
  }, "Try Mirror")), /*#__PURE__*/React.createElement(IconButton, {
    variant: "outline",
    round: true,
    style: {
      position: 'absolute',
      bottom: 16,
      insetInlineEnd: 16,
      background: 'var(--white)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "maximize-2",
    size: 16
  })))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 13,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: 'var(--text-accent)'
    }
  }, p.brand), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 34,
      color: 'var(--text-strong)',
      margin: '8px 0 12px'
    }
  }, p.name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement(Rating, {
    value: p.rating,
    count: p.reviews
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--border-strong)'
    }
  }, "\xB7"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--success)',
      fontWeight: 600
    }
  }, "In stock \xB7 Netanya, Tel Aviv")), /*#__PURE__*/React.createElement(Price, {
    amount: total,
    original: p.original ? p.original + lensPrice : undefined,
    size: "lg"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15,
      lineHeight: 1.6,
      color: 'var(--text-body)',
      margin: '18px 0 22px',
      maxWidth: 460
    }
  }, "A refined ", p.shape.toLowerCase(), " silhouette in premium ", p.material.toLowerCase(), ". Lightweight, precisely balanced, and ready for your prescription."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 22
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 12,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      marginBottom: 10
    }
  }, "Color"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, p.colors.map((c, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    onClick: () => setImg(i),
    style: {
      width: 34,
      height: 34,
      borderRadius: 999,
      background: c,
      border: `2px solid ${img === i ? 'var(--amber-600)' : 'var(--border-hair)'}`,
      cursor: 'pointer',
      outline: img === i ? '2px solid var(--amber-100)' : 'none'
    }
  })))), /*#__PURE__*/React.createElement("button", {
    onClick: () => setLensOpen(!lensOpen),
    style: {
      width: '100%',
      textAlign: 'start',
      border: '1px solid var(--border-hair)',
      background: 'var(--cream-100)',
      borderRadius: 'var(--radius-md)',
      padding: '14px 16px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 13,
      letterSpacing: '0.06em',
      color: 'var(--text-strong)',
      display: 'block'
    }
  }, "LENS CONFIGURATION"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--text-muted)'
    }
  }, "Index ", index, ar ? ' · Anti-reflective' : '', blue ? ' · Blue-light' : '', photo ? ' · Photochromic' : '', " \xB7 +\u20AA", lensPrice)), /*#__PURE__*/React.createElement(Icon, {
    name: lensOpen ? 'chevron-up' : 'chevron-down',
    size: 18
  })), lensOpen && /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--border-hair)',
      borderRadius: 'var(--radius-md)',
      padding: '4px 16px 16px',
      marginBottom: 18,
      background: 'var(--white)'
    }
  }, /*#__PURE__*/React.createElement(LensRow, {
    label: "Lens index"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 130
    }
  }, /*#__PURE__*/React.createElement(Select, {
    value: index,
    onChange: e => setIndex(e.target.value),
    size: "sm",
    options: [{
      value: '1.5',
      label: '1.5 · Standard'
    }, {
      value: '1.6',
      label: '1.6 · Thin +₪120'
    }, {
      value: '1.67',
      label: '1.67 +₪260'
    }, {
      value: '1.74',
      label: '1.74 +₪420'
    }]
  }))), /*#__PURE__*/React.createElement(LensRow, {
    label: "Anti-reflective coating (+\u20AA90)"
  }, /*#__PURE__*/React.createElement(Checkbox, {
    checked: ar,
    onChange: setAr
  })), /*#__PURE__*/React.createElement(LensRow, {
    label: "Blue-light filter (+\u20AA70)"
  }, /*#__PURE__*/React.createElement(Checkbox, {
    checked: blue,
    onChange: setBlue
  })), /*#__PURE__*/React.createElement(LensRow, {
    label: "Photochromic (+\u20AA180)"
  }, /*#__PURE__*/React.createElement(Checkbox, {
    checked: photo,
    onChange: setPhoto
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginTop: 12,
      color: 'var(--text-muted)',
      fontSize: 12.5
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "info",
    size: 15
  }), " Out-of-range prescriptions are fitted in-store, not blocked.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    block: true,
    onClick: () => addToCart({
      ...p,
      amount: total
    }),
    startIcon: /*#__PURE__*/React.createElement(Icon, {
      name: "shopping-bag",
      size: 18,
      color: "currentColor"
    })
  }, "Add to Cart \xB7 \u20AA", total), p.tryMirror && /*#__PURE__*/React.createElement(Button, {
    variant: "solid",
    size: "lg",
    onClick: () => setConsent(true),
    startIcon: /*#__PURE__*/React.createElement(Icon, {
      name: "camera",
      size: 18,
      color: "currentColor"
    })
  }, "Try Mirror")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 22,
      marginTop: 18,
      fontSize: 13,
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 7
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "truck",
    size: 16
  }), " Free shipping over \u20AA400"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 7
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "store",
    size: 16
  }), " Reserve & fit in-store")))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 56,
      maxWidth: 780
    }
  }, /*#__PURE__*/React.createElement(Tabs, {
    tabs: [{
      value: 'desc',
      label: 'Description'
    }, {
      value: 'specs',
      label: 'Specs'
    }, {
      value: 'reviews',
      label: 'Reviews'
    }],
    value: tab,
    onChange: setTab
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '24px 2px',
      fontSize: 15,
      lineHeight: 1.7,
      color: 'var(--text-body)'
    }
  }, tab === 'desc' && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0
    }
  }, "The ", p.name, " pairs a timeless ", p.shape.toLowerCase(), " shape with OPTIZONE's precision fitting. Hand-finished ", p.material.toLowerCase(), ", sprung hinges, and adjustable nose pads for all-day comfort. Compatible with single-vision, progressive, and blue-light lenses."), tab === 'specs' && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '12px 40px',
      maxWidth: 520
    }
  }, [['Brand', p.brand], ['Shape', p.shape], ['Material', p.material], ['Gender', p.gender], ['Lens width', '50 mm'], ['Bridge', '21 mm'], ['Temple', '145 mm'], ['Try Mirror', p.tryMirror ? 'Yes' : 'No']].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      borderBottom: '1px solid var(--border-hair)',
      paddingBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)'
    }
  }, k), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-strong)',
      fontWeight: 600
    }
  }, v)))), tab === 'reviews' && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      color: 'var(--text-muted)'
    }
  }, p.reviews, " verified reviews \xB7 ", p.rating, "/5 average. Reviews module (Phase 2) with moderation."))), /*#__PURE__*/React.createElement(Dialog, {
    open: consent,
    onClose: () => setConsent(false),
    eyebrow: "Try Mirror",
    title: "Camera & try-on consent",
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      onClick: () => setConsent(false)
    }, "Not now"), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      onClick: () => {
        setConsent(false);
        setMirror(true);
      }
    }, "Allow camera"))
  }, "OPTIZONE's Try Mirror uses your camera on-device to place frames on your face in real time. No image or biometric data is stored (Privacy Protection Law, IS 5568). You can also upload a photo instead."), mirror && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 1100,
      background: 'var(--pine-950)',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 24px',
      color: 'var(--cream-100)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      fontSize: 13,
      color: 'var(--amber-500)'
    }
  }, "Try Mirror \xB7 Live"), /*#__PURE__*/React.createElement(IconButton, {
    variant: "ghost",
    onClick: () => setMirror(false),
    style: {
      color: 'var(--cream-100)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    color: "var(--cream-100)"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 'min(70vh,520px)',
      aspectRatio: '3/4',
      borderRadius: 'var(--radius-lg)',
      background: 'linear-gradient(160deg,var(--pine-700),var(--pine-900))',
      border: '1px solid var(--border-on-dark)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "user",
    size: 160,
    color: "rgba(255,255,255,0.12)"
  }), /*#__PURE__*/React.createElement("div", {
    className: "oz-scan-line"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '34%',
      animation: 'oz-float 4s var(--ease-in-out) infinite'
    }
  }, /*#__PURE__*/React.createElement(GlassesMark, {
    size: 70,
    color: p.colors[img % p.colors.length]
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      bottom: 16,
      fontSize: 12,
      color: 'var(--pine-200)',
      letterSpacing: '0.06em'
    }
  }, "Camera preview (mock)"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 24px 28px',
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, p.colors.map((c, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    onClick: () => setImg(i),
    style: {
      width: 36,
      height: 36,
      borderRadius: 999,
      background: c,
      border: `2px solid ${img === i ? 'var(--amber-500)' : 'transparent'}`,
      cursor: 'pointer'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    style: {
      color: 'var(--cream-100)',
      borderColor: 'var(--cream-100)'
    },
    startIcon: /*#__PURE__*/React.createElement(Icon, {
      name: "camera",
      size: 18,
      color: "currentColor"
    })
  }, "Capture look"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: () => {
      addToCart({
        ...p,
        amount: total
      });
      setMirror(false);
    },
    startIcon: /*#__PURE__*/React.createElement(Icon, {
      name: "shopping-bag",
      size: 18,
      color: "currentColor"
    })
  }, "Add to Cart")))));
}
Object.assign(window, {
  Product
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/Product.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/Search.jsx
try { (() => {
// OPTIZONE storefront — search overlay with live suggestions (FR-5).
const {
  Icon,
  Badge,
  Price
} = window.OPTIZONEDesignSystem_ded4a5;
function Search({
  open,
  onClose,
  go
}) {
  const D = window.OZ_DATA;
  const [q, setQ] = React.useState('');
  const inputRef = React.useRef(null);
  React.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  });
  React.useEffect(() => {
    if (open) {
      setQ('');
      setTimeout(() => inputRef.current && inputRef.current.focus(), 60);
    }
    const onKey = e => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);
  if (!open) return null;
  const ql = q.trim().toLowerCase();
  const results = ql ? D.products.filter(p => (p.name + ' ' + p.brand + ' ' + p.shape + ' ' + p.material).toLowerCase().includes(ql)) : [];
  const pick = p => {
    onClose();
    go('product', p);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 1200,
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--overlay-scrim)',
      animation: 'oz-fade var(--dur-base) var(--ease-out) both',
      backdropFilter: 'blur(3px)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      background: 'var(--bg-page-alt)',
      boxShadow: 'var(--shadow-lg)',
      animation: 'oz-slide-down var(--dur-base) var(--ease-out) both'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 860,
      margin: '0 auto',
      padding: '26px 28px 30px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      borderBottom: '2px solid var(--pine-700)',
      paddingBottom: 14
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 24,
    color: "var(--pine-700)"
  }), /*#__PURE__*/React.createElement("input", {
    ref: inputRef,
    value: q,
    onChange: e => setQ(e.target.value),
    placeholder: "Search frames, brands, lenses\u2026",
    style: {
      flex: 1,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      fontFamily: 'var(--font-body)',
      fontSize: 22,
      color: 'var(--text-strong)'
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Close",
    style: {
      border: '1px solid var(--border-strong)',
      background: 'transparent',
      borderRadius: 'var(--radius-sm)',
      padding: '4px 9px',
      cursor: 'pointer',
      fontFamily: 'var(--font-display)',
      fontSize: 11,
      letterSpacing: '0.1em',
      color: 'var(--text-muted)'
    }
  }, "ESC")), !ql && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 11,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      marginBottom: 14
    }
  }, "Popular searches"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 10
    }
  }, D.popularSearches.map(s => /*#__PURE__*/React.createElement("button", {
    key: s,
    onClick: () => setQ(s),
    style: {
      border: '1px solid var(--border-hair)',
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-pill)',
      padding: '8px 16px',
      cursor: 'pointer',
      fontSize: 13.5,
      color: 'var(--text-body)'
    }
  }, s)))), ql && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20,
      maxHeight: '52vh',
      overflowY: 'auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 11,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      marginBottom: 12
    }
  }, results.length, " ", results.length === 1 ? 'result' : 'results'), results.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '24px 0',
      color: 'var(--text-muted)',
      fontSize: 15
    }
  }, "No frames match \u201C", q, "\u201D. Try a brand or shape.") : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, results.map((p, i) => /*#__PURE__*/React.createElement("button", {
    key: p.id,
    onClick: () => pick(p),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '12px 8px',
      border: 'none',
      borderBottom: '1px solid var(--border-hair)',
      background: 'transparent',
      cursor: 'pointer',
      textAlign: 'start',
      animation: `oz-fade-up var(--dur-base) var(--ease-out) both`,
      animationDelay: `${i * 40}ms`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 52,
      height: 52,
      borderRadius: 'var(--radius-sm)',
      background: 'var(--cream-300)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: '0 0 auto'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 120 46",
    width: "34",
    fill: "none"
  }, /*#__PURE__*/React.createElement("g", {
    stroke: p.colors[0],
    strokeWidth: "3",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "40",
    cy: "24",
    r: "15"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "80",
    cy: "24",
    r: "15"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M55 17 q5 -5 10 0"
  })))), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontFamily: 'var(--font-display)',
      fontSize: 10.5,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--text-accent)'
    }
  }, p.brand), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontSize: 15,
      fontWeight: 600,
      color: 'var(--text-strong)'
    }
  }, p.name)), p.tryMirror && /*#__PURE__*/React.createElement(Badge, {
    variant: "try"
  }, "Try Mirror"), /*#__PURE__*/React.createElement(Price, {
    amount: p.amount,
    original: p.original,
    size: "sm"
  }), /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-right",
    size: 16,
    color: "var(--text-muted)"
  }))))))));
}
Object.assign(window, {
  Search
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/Search.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/StoreLocator.jsx
try { (() => {
// OPTIZONE storefront — store locator with map + branch details (FR-54).
const {
  Button,
  Icon,
  Badge,
  DiamondRule
} = window.OPTIZONEDesignSystem_ded4a5;
function StoreLocator({
  go
}) {
  const D = window.OZ_DATA;
  const [active, setActive] = React.useState(0);
  React.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  });
  const s = D.stores[active];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--pine-700)',
      color: 'var(--cream-100)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '46px 28px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 13,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'var(--amber-500)'
    }
  }, "Find us"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 40,
      color: 'var(--cream-100)',
      margin: '10px 0 0'
    }
  }, "Our branches"))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '30px 28px 80px',
      display: 'grid',
      gridTemplateColumns: '360px 1fr',
      gap: 30,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, D.stores.map((st, i) => /*#__PURE__*/React.createElement("button", {
    key: st.name,
    onClick: () => setActive(i),
    style: {
      textAlign: 'start',
      padding: '18px 20px',
      borderRadius: 'var(--radius-md)',
      border: `1.5px solid ${active === i ? 'var(--pine-700)' : 'var(--border-hair)'}`,
      background: active === i ? 'var(--pine-50)' : 'var(--surface-card)',
      cursor: 'pointer',
      transition: 'all var(--dur-fast) var(--ease-out)',
      boxShadow: active === i ? 'var(--shadow-sm)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "map-pin",
    size: 18,
    color: "var(--pine-700)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 18,
      color: 'var(--text-strong)'
    }
  }, "OPTIZONE ", st.name)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      color: 'var(--text-muted)',
      lineHeight: 1.6
    }
  }, st.addr, /*#__PURE__*/React.createElement("br", null), st.hours), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6,
      marginTop: 12
    }
  }, st.services.map(sv => /*#__PURE__*/React.createElement("span", {
    key: sv,
    style: {
      fontSize: 11,
      letterSpacing: '0.04em',
      color: 'var(--pine-700)',
      background: 'var(--pine-100)',
      borderRadius: 'var(--radius-pill)',
      padding: '3px 10px'
    }
  }, sv)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      aspectRatio: '16/10',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      border: '1px solid var(--border-hair)',
      background: 'linear-gradient(160deg,var(--pine-100),var(--cream-300))'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "100%",
    height: "100%",
    style: {
      position: 'absolute',
      inset: 0,
      opacity: 0.5
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("pattern", {
    id: "ozgrid",
    width: "44",
    height: "44",
    patternUnits: "userSpaceOnUse"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M44 0H0V44",
    fill: "none",
    stroke: "var(--pine-300)",
    strokeWidth: "1"
  }))), /*#__PURE__*/React.createElement("rect", {
    width: "100%",
    height: "100%",
    fill: "url(#ozgrid)"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M20 60 Q120 40 180 120 T360 200 Q440 240 520 210",
    fill: "none",
    stroke: "var(--amber-400)",
    strokeWidth: "3",
    strokeLinecap: "round",
    opacity: "0.6"
  })), D.stores.map((st, i) => /*#__PURE__*/React.createElement("button", {
    key: st.name,
    onClick: () => setActive(i),
    style: {
      position: 'absolute',
      left: `${st.x}%`,
      top: `${st.y}%`,
      transform: 'translate(-50%,-100%)',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      padding: 0
    }
  }, active === i && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: '50%',
      top: '80%',
      transform: 'translate(-50%,-50%)',
      width: 30,
      height: 30,
      borderRadius: 999,
      background: 'var(--amber-500)',
      opacity: 0.5,
      animation: 'oz-ring 1.6s var(--ease-out) infinite'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "map-pin",
    size: active === i ? 40 : 30,
    color: active === i ? 'var(--amber-600)' : 'var(--pine-700)',
    fill: active === i ? 'var(--amber-500)' : 'none'
  }))))), /*#__PURE__*/React.createElement("div", {
    key: active,
    className: "oz-route",
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-hair)',
      borderRadius: 'var(--radius-lg)',
      padding: '26px 28px',
      boxShadow: 'var(--shadow-sm)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 16,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 12,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--text-accent)'
    }
  }, "Branch"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 26,
      color: 'var(--text-strong)',
      margin: '6px 0 12px'
    }
  }, "OPTIZONE ", s.name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      fontSize: 14,
      color: 'var(--text-body)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "map-pin",
    size: 16,
    color: "var(--pine-700)"
  }), " ", s.addr), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "clock",
    size: 16,
    color: "var(--pine-700)"
  }), " ", s.hours), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "phone",
    size: 16,
    color: "var(--pine-700)"
  }), " ", s.phone))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      minWidth: 180
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: () => go('booking'),
    startIcon: /*#__PURE__*/React.createElement(Icon, {
      name: "calendar",
      size: 17,
      color: "currentColor"
    })
  }, "Book at this branch"), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    startIcon: /*#__PURE__*/React.createElement(Icon, {
      name: "navigation",
      size: 17,
      color: "currentColor"
    })
  }, "Get directions")))))));
}
Object.assign(window, {
  StoreLocator
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/StoreLocator.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/anim.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// OPTIZONE storefront — animation helpers (scroll reveal, staggering, scroll state).

// Reveal: fades + lifts children into view once, when scrolled near the viewport.
function Reveal({
  children,
  delay = 0,
  as = 'div',
  style,
  ...rest
}) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          el.setAttribute('data-oz-in', '');
          io.unobserve(el);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -8% 0px'
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    ref: ref,
    "data-oz-reveal": "",
    style: {
      transitionDelay: `${delay}ms`,
      ...style
    }
  }, rest), children);
}

// useScrolled: true once the window has scrolled past `threshold` px.
function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, {
      passive: true
    });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);
  return scrolled;
}

// useCountUp: animate a number from 0 → target over `ms`.
function useCountUp(target, ms = 900) {
  const [val, setVal] = React.useState(0);
  React.useEffect(() => {
    let raf, start;
    const ease = t => 1 - Math.pow(1 - t, 3);
    const step = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / ms, 1);
      setVal(Math.round(target * ease(p)));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    // Safety: guarantee the final value even if rAF is throttled (background tab).
    const done = setTimeout(() => setVal(target), ms + 120);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(done);
    };
  }, [target, ms]);
  return val;
}
Object.assign(window, {
  Reveal,
  useScrolled,
  useCountUp
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/anim.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/app.jsx
try { (() => {
// OPTIZONE storefront — app router.
const {
  Toast,
  Icon
} = window.OPTIZONEDesignSystem_ded4a5;
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
    window.scrollTo({
      top: 0
    });
  };
  const addToCart = p => {
    setCart(c => {
      const found = c.find(i => i.id === p.id);
      if (found) return c.map(i => i.id === p.id ? {
        ...i,
        qty: i.qty + 1
      } : i);
      return [...c, {
        ...p,
        qty: 1
      }];
    });
    setToast({
      name: p.name,
      brand: p.brand
    });
    clearTimeout(window.__ozT);
    window.__ozT = setTimeout(() => setToast(null), 2600);
  };
  const subtotal = cart.reduce((s, i) => s + i.amount * i.qty, 0);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement(Header, {
    route: route,
    go: go,
    cartCount: cart.reduce((s, i) => s + i.qty, 0),
    onSearch: () => setSearchOpen(true),
    loggedIn: loggedIn
  }), /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    key: route,
    className: "oz-route"
  }, route === 'home' && /*#__PURE__*/React.createElement(Home, {
    go: go,
    addToCart: addToCart
  }), route === 'catalog' && /*#__PURE__*/React.createElement(Catalog, {
    go: go,
    addToCart: addToCart
  }), route === 'product' && /*#__PURE__*/React.createElement(Product, {
    product: product,
    go: go,
    addToCart: addToCart
  }), route === 'booking' && /*#__PURE__*/React.createElement(Booking, {
    go: go
  }), route === 'cart' && /*#__PURE__*/React.createElement(Cart, {
    cart: cart,
    setCart: setCart,
    go: go
  }), route === 'stores' && /*#__PURE__*/React.createElement(StoreLocator, {
    go: go
  }), route === 'account' && /*#__PURE__*/React.createElement(Account, {
    loggedIn: loggedIn,
    onLogin: () => setLoggedIn(true),
    go: go
  }), route === 'checkout' && /*#__PURE__*/React.createElement(Checkout, {
    cart: cart,
    subtotal: subtotal,
    go: go,
    onComplete: () => setCart([])
  }))), /*#__PURE__*/React.createElement(Footer, {
    go: go
  }), /*#__PURE__*/React.createElement(Search, {
    open: searchOpen,
    onClose: () => setSearchOpen(false),
    go: go
  }), toast && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      bottom: 24,
      insetInlineEnd: 24,
      zIndex: 2000,
      animation: 'oz-slide-in-end var(--dur-base) var(--ease-out) both'
    }
  }, /*#__PURE__*/React.createElement(Toast, {
    variant: "success",
    title: "Added to cart",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "check-circle",
      size: 18
    }),
    onClose: () => setToast(null)
  }, toast.brand, " \xB7 ", toast.name)));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/app.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/data.js
try { (() => {
// OPTIZONE storefront — sample catalog data (no real product photos available).
window.OZ_DATA = {
  brands: ['Ray-Ban', 'Prada', 'Versace', 'Dolce & Gabbana', 'Tiffany & Co.', 'Persol'],
  nav: [{
    key: 'eyeglasses',
    label: 'Eyeglasses'
  }, {
    key: 'sunglasses',
    label: 'Sunglasses'
  }, {
    key: 'contacts',
    label: 'Contact Lenses'
  }, {
    key: 'brands',
    label: 'Brands'
  }, {
    key: 'stores',
    label: 'Stores'
  }, {
    key: 'book',
    label: 'Book an Exam'
  }],
  services: [{
    icon: 'eye',
    title: 'Eye Exams',
    he: 'בדיקות ראיה',
    desc: 'Comprehensive vision tests with our optometrists.'
  }, {
    icon: 'glasses',
    title: 'Prescription & Sun',
    he: 'משקפי ראיה ושמש',
    desc: 'Frames fitted to your face and prescription.'
  }, {
    icon: 'circle-dot',
    title: 'Contact Lenses',
    he: 'עדשות מגע',
    desc: 'Soft, multifocal and specialty lenses.'
  }, {
    icon: 'target',
    title: 'Myopia Control',
    he: 'שליטה בקוצר ראיה',
    desc: 'Slowing progression for children and teens.'
  }, {
    icon: 'layers',
    title: 'Multifocal Experts',
    he: 'מומחים למולטיפוקל',
    desc: 'Progressive lenses done right.'
  }, {
    icon: 'shield-check',
    title: 'Keratoconus Care',
    he: 'טיפול בקרטוקונוס',
    desc: 'Specialty fitting for irregular corneas.'
  }],
  products: [{
    id: 1,
    brand: 'Ray-Ban',
    name: 'Round Metal RB3447',
    amount: 390,
    original: 490,
    rating: 4.5,
    reviews: 128,
    badge: {
      variant: 'sale',
      label: 'Sale'
    },
    tryMirror: true,
    colors: ['#22402F', '#3A342A', '#E08A2A'],
    shape: 'Round',
    material: 'Metal',
    gender: 'Unisex'
  }, {
    id: 2,
    brand: 'Persol',
    name: 'PO3092 Havana',
    amount: 720,
    rating: 5,
    reviews: 64,
    badge: {
      variant: 'new',
      label: 'New'
    },
    tryMirror: true,
    colors: ['#6B4423', '#1A1A17'],
    shape: 'Square',
    material: 'Acetate',
    gender: 'Men'
  }, {
    id: 3,
    brand: 'Prada',
    name: 'PR 17WS Symbole',
    amount: 1290,
    rating: 4.5,
    reviews: 41,
    badge: {
      variant: 'bestseller',
      label: 'Bestseller'
    },
    tryMirror: true,
    colors: ['#1A1A17', '#7E4310'],
    shape: 'Cat-eye',
    material: 'Acetate',
    gender: 'Women'
  }, {
    id: 4,
    brand: 'Tiffany & Co.',
    name: 'TF2233B',
    amount: 980,
    rating: 4,
    reviews: 22,
    tryMirror: false,
    colors: ['#22402F', '#B4CEC0'],
    shape: 'Oval',
    material: 'Metal',
    gender: 'Women'
  }, {
    id: 5,
    brand: 'Versace',
    name: 'VE4361 Medusa',
    amount: 860,
    original: 1050,
    rating: 4.5,
    reviews: 77,
    badge: {
      variant: 'sale',
      label: 'Sale'
    },
    tryMirror: true,
    colors: ['#1A1A17', '#E08A2A'],
    shape: 'Square',
    material: 'Acetate',
    gender: 'Men'
  }, {
    id: 6,
    brand: 'Dolce & Gabbana',
    name: 'DG4416 Print',
    amount: 690,
    rating: 4,
    reviews: 18,
    badge: {
      variant: 'new',
      label: 'New'
    },
    tryMirror: true,
    colors: ['#6B4423', '#3A342A'],
    shape: 'Round',
    material: 'Acetate',
    gender: 'Women'
  }],
  filters: {
    'Frame Shape': ['Round', 'Square', 'Cat-eye', 'Oval', 'Aviator'],
    'Material': ['Acetate', 'Metal', 'Titanium'],
    'Gender': ['Women', 'Men', 'Unisex', 'Kids']
  },
  branches: ['Netanya · השלים 12', 'Tel Aviv · Dizengoff 210', 'Haifa · HaNassi 8'],
  bookingServices: ['Eye Exam', 'Frame Fitting', 'Contact-Lens Fitting', "Kids' Eye Test"],
  slots: ['09:00', '10:30', '12:00', '13:30', '15:00', '16:30', '18:00'],
  popularSearches: ['Ray-Ban', 'Blue-light glasses', 'Sunglasses', 'Progressive lenses', 'Titanium frames', 'Kids'],
  stores: [{
    name: 'Netanya',
    addr: 'השלים 12, נתניה',
    phone: '058-644-2303',
    hours: 'Sun–Thu 09:00–19:00 · Fri 09:00–14:00',
    services: ['Eye Exams', 'Try Mirror', 'Contact Lenses'],
    x: 34,
    y: 46
  }, {
    name: 'Tel Aviv',
    addr: 'Dizengoff 210, Tel Aviv',
    phone: '03-521-8890',
    hours: 'Sun–Thu 10:00–21:00 · Fri 10:00–15:00',
    services: ['Eye Exams', 'Frame Fitting', 'Multifocal'],
    x: 30,
    y: 58
  }, {
    name: 'Haifa',
    addr: 'HaNassi 8, Haifa',
    phone: '04-810-4471',
    hours: 'Sun–Thu 09:00–19:00 · Fri 09:00–13:30',
    services: ['Eye Exams', 'Keratoconus', 'Myopia Control'],
    x: 40,
    y: 30
  }],
  orders: [{
    id: 'OZ-24817',
    date: '18 Jun 2026',
    status: 'In lab',
    items: 'Ray-Ban Round Metal + 1.6 AR',
    total: 600
  }, {
    id: 'OZ-24603',
    date: '2 May 2026',
    status: 'Collected',
    items: 'Persol PO3092 Havana',
    total: 720
  }],
  prescriptions: [{
    name: 'Distance · Dr. Levi',
    date: '12 Mar 2026',
    od: '-2.25 / -0.50 × 180',
    os: '-2.00 / -0.75 × 165',
    pd: '63',
    expires: 'Mar 2028'
  }],
  savedLooks: [{
    frame: 'Prada PR 17WS',
    color: '#1A1A17'
  }, {
    frame: 'Versace VE4361',
    color: '#E08A2A'
  }, {
    frame: 'Ray-Ban RB3447',
    color: '#22402F'
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/data.js", error: String((e && e.message) || e) }); }

__ds_ns.DiamondRule = __ds_scope.DiamondRule;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.GlassesMark = __ds_scope.GlassesMark;

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Price = __ds_scope.Price;

__ds_ns.ProductCard = __ds_scope.ProductCard;

__ds_ns.Rating = __ds_scope.Rating;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.QuantityStepper = __ds_scope.QuantityStepper;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
