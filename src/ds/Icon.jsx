import React from 'react'
import {
  ArrowRight, BarChart3, Calendar, Camera, Check, CheckCircle, ChevronDown,
  ChevronLeft, ChevronRight, ChevronUp, CircleDot, Clock, CreditCard, Eye,
  FileText, Glasses, Heart, Info, Layers, LayoutDashboard, Lock, LogOut, MapPin,
  Maximize2, Menu, Navigation, Package, Phone, Plus, Search, Settings, Share2,
  ShieldCheck, ShoppingBag, Smartphone, Sparkles, Store, Tag, Target, Trash2,
  Truck, User, UserPlus, X,
} from 'lucide-react'

// OPTIZONE substitutes Lucide for its bespoke thin, rounded, single-weight line
// set (flagged in the design system). Named by the same kebab keys the prototype used.
const ICONS = {
  'arrow-right': ArrowRight, 'bar-chart': BarChart3, calendar: Calendar, camera: Camera, check: Check,
  'check-circle': CheckCircle, 'chevron-down': ChevronDown, 'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight, 'chevron-up': ChevronUp,
  'circle-dot': CircleDot, clock: Clock, 'credit-card': CreditCard, dashboard: LayoutDashboard, eye: Eye,
  'file-text': FileText, glasses: Glasses, heart: Heart, info: Info, layers: Layers,
  lock: Lock, 'log-out': LogOut, 'map-pin': MapPin, 'maximize-2': Maximize2, menu: Menu, navigation: Navigation,
  package: Package, phone: Phone, plus: Plus, search: Search, settings: Settings, 'share-2': Share2,
  'shield-check': ShieldCheck, 'shopping-bag': ShoppingBag, smartphone: Smartphone, sparkles: Sparkles,
  store: Store, tag: Tag, target: Target, 'trash-2': Trash2, truck: Truck, user: User,
  'user-plus': UserPlus, x: X,
}

/**
 * Icon — thin, single-weight line icon wrapper. Renders a Lucide glyph (or a raw
 * SVG child) inside an inline-flex span sized to `size` and tinted with `color`.
 */
export function Icon({
  name,
  size = 20,
  strokeWidth = 1.8,
  color = 'currentColor',
  fill,
  children,
  style,
  ...rest
}) {
  const Glyph = name ? ICONS[name] : null
  return (
    <span
      className="oz-icon"
      aria-hidden={rest['aria-label'] ? undefined : true}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        color,
        flex: '0 0 auto',
        ...style,
      }}
      {...rest}
    >
      {children
        ? children
        : Glyph
          ? <Glyph size={size} strokeWidth={strokeWidth} color={color} fill={fill} />
          : null}
    </span>
  )
}
