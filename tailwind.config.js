/** @type {import('tailwindcss').Config} */
// Pont entre le Design System Sendplex (tokens.css) et Tailwind v3.
// Toutes les valeurs pointent vers les variables CSS — aucune valeur hardcodée.
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      // ── Couleurs ─────────────────────────────────────────────────────────
      colors: {
        // Tokens sémantiques shadcn-style
        background:  'var(--background)',
        foreground:  'var(--foreground)',
        border:      'var(--border)',
        input:       'var(--input)',
        ring:        'var(--ring)',

        primary: {
          DEFAULT:    'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT:    'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT:    'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT:    'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        destructive: {
          DEFAULT:    'var(--destructive)',
        },
        card: {
          DEFAULT:    'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT:    'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },

        // Surfaces Sendplex custom
        surface: {
          DEFAULT:   'var(--color-surface)',
          bright:    'var(--color-surface-bright)',
          container: {
            DEFAULT: 'var(--color-surface-container)',
            low:     'var(--color-surface-container-low)',
            high:    'var(--color-surface-container-high)',
            highest: 'var(--color-surface-container-highest)',
          },
        },

        // On-surface
        'on-surface':         'var(--color-on-surface)',
        'on-surface-variant': 'var(--color-on-surface-variant)',
        'on-primary':         'var(--color-on-primary)',

        // Outline
        outline: {
          DEFAULT: 'var(--color-outline)',
          variant: 'var(--color-outline-variant)',
        },

        // Couleurs thématiques
        'primary-green':      'var(--color-primary-green)',
        'primary-container':  'var(--color-primary-container)',
        'secondary-green':    'var(--color-secondary-green)',
        'secondary-container':'var(--color-secondary-container)',
        tertiary:             'var(--color-tertiary)',
        error:                'var(--color-error)',
      },

      // ── Typographie ───────────────────────────────────────────────────────
      fontFamily: {
        sans:    ['var(--font-sans)', 'sans-serif'],
        body:    ['var(--font-body)', 'sans-serif'],
        heading: ['var(--font-heading)', 'sans-serif'],
      },

      // ── Border radius ─────────────────────────────────────────────────────
      borderRadius: {
        sm:   'var(--radius-sm)',
        md:   'var(--radius-md)',
        lg:   'var(--radius-lg)',
        xl:   'var(--radius-xl)',
        '2xl':'var(--radius-2xl)',
        '3xl':'var(--radius-3xl)',
        '4xl':'var(--radius-4xl)',
      },
    },
  },
  plugins: [],
};
