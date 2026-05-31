/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Open Sans', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Poppins', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        /* Primary Brand */
        primary: {
          DEFAULT: 'var(--color-primary)',
          dark: 'var(--color-primary-dark)',
          deeper: 'var(--color-primary-deeper)',
          deep: 'var(--color-primary-deep)',
        },
        /* Secondary Accent */
        accent: {
          DEFAULT: 'var(--color-accent)',
          light: 'var(--color-accent-light)',
          alt: 'var(--color-alt-accent)',
        },
        /* Backgrounds */
        bg: {
          primary: 'var(--color-bg-primary)',
          secondary: 'var(--color-bg-secondary)',
          'blue-tint': 'var(--color-bg-blue-tint)',
          'cyan-tint': 'var(--color-bg-cyan-tint)',
        },
        /* Text */
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
        },
        /* Surface/Borders */
        border: {
          DEFAULT: 'var(--color-border)',
          blue: 'var(--color-border-blue)',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
