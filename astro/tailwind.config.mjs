import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,tsx,ts,js}'],
  theme: {
    borderRadius: {
      sm: '12px',
      md: '20px',
      lg: '26px',
      xl: '30px',
      '2xl': '40px',
      full: '9999px',
    },
    boxShadow: {
      sm: 'var(--shadow-sm)',
      md: 'var(--shadow-md)',
      lg: 'var(--shadow-lg)',
      xl: 'var(--shadow-xl)',
    },
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'DM Sans Fallback', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['DM Sans', 'DM Sans Fallback', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          dark: 'var(--color-primary-dark)',
          deeper: 'var(--color-primary-deeper)',
          deep: 'var(--color-primary-deep)',
        },
        accent: {
          DEFAULT: 'var(--color-accent-gold)',
          light: 'var(--color-accent-gold-light)',
          gold: 'var(--color-accent-gold)',
          goldLight: 'var(--color-accent-gold-light)',
          warm: 'var(--color-accent-warm)',
          warmLight: 'var(--color-accent-warm-light)',
        },
        bg: {
          primary: 'var(--color-bg-primary)',
          secondary: 'var(--color-bg-secondary)',
          'warm-tint': 'var(--color-bg-warm-tint)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
        },
        border: {
          DEFAULT: 'var(--color-border)',
          strong: 'var(--color-border-strong)',
        },
      },
    },
  },
  plugins: [typography],
};
