import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

// Palette + radii/shadows are the EXACT OPTIZONE tokens (assets/css/tokens.css +
// spacing.css), referenced as CSS variables so the colour combination is
// identical to the React app — pine green + amber + cream, unchanged.
export default <Partial<Config>>{
  darkMode: 'class',
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './app.vue',
    './error.vue',
  ],
  theme: {
    extend: {
      colors: {
        pine: { 50: 'var(--pine-50)', 100: 'var(--pine-100)', 200: 'var(--pine-200)', 300: 'var(--pine-300)', 400: 'var(--pine-400)', 500: 'var(--pine-500)', 600: 'var(--pine-600)', 700: 'var(--pine-700)', 800: 'var(--pine-800)', 900: 'var(--pine-900)', 950: 'var(--pine-950)' },
        amber: { 50: 'var(--amber-50)', 100: 'var(--amber-100)', 200: 'var(--amber-200)', 300: 'var(--amber-300)', 400: 'var(--amber-400)', 500: 'var(--amber-500)', 600: 'var(--amber-600)', 700: 'var(--amber-700)', 800: 'var(--amber-800)', 900: 'var(--amber-900)' },
        cream: { 100: 'var(--cream-100)', 200: 'var(--cream-200)', 300: 'var(--cream-300)', 400: 'var(--cream-400)', 500: 'var(--cream-500)' },
        ink: { 100: 'var(--ink-100)', 200: 'var(--ink-200)', 300: 'var(--ink-300)', 400: 'var(--ink-400)', 500: 'var(--ink-500)', 600: 'var(--ink-600)', 700: 'var(--ink-700)', 800: 'var(--ink-800)', 900: 'var(--ink-900)' },
        brand: 'var(--pine-700)',
        accent: 'var(--amber-600)',
        // semantic aliases (mirror colors.css)
        surface: { card: 'var(--surface-card)', page: 'var(--bg-page)', 'page-alt': 'var(--bg-page-alt)' },
        text: { strong: 'var(--text-strong)', body: 'var(--text-body)', muted: 'var(--text-muted)', faint: 'var(--text-faint)', accent: 'var(--text-accent)' },
        hair: 'var(--border-hair)',
      },
      fontFamily: {
        display: ['Jost', 'Century Gothic', 'Futura', 'sans-serif'],
        body: ['Assistant', 'Jost', 'system-ui', 'sans-serif'],
        cairo: ['Cairo', 'Noto Sans Arabic', 'system-ui', 'sans-serif'],
      },
      borderRadius: { xs: 'var(--radius-xs)', sm: 'var(--radius-sm)', md: 'var(--radius-md)', lg: 'var(--radius-lg)', xl: 'var(--radius-xl)', card: 'var(--radius-card)', pill: 'var(--radius-pill)' },
      boxShadow: { xs: 'var(--shadow-xs)', sm: 'var(--shadow-sm)', md: 'var(--shadow-md)', lg: 'var(--shadow-lg)', dark: 'var(--shadow-dark)' },
      transitionTimingFunction: { out: 'var(--ease-out)', 'in-out': 'var(--ease-in-out)' },
      transitionDuration: { fast: '160ms', base: '240ms', slow: '420ms' },
      maxWidth: { container: '1200px' },
    },
  },
  plugins: [animate],
}
