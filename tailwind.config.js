/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1B4332',
        'primary-light': '#2D6A4F',
        'primary-lighter': '#40916C',
        background: '#F9FAFB',
        surface: '#FFFFFF',
        verdict: {
          avoid: '#DC2626',
          'avoid-bg': '#FEF2F2',
          question: '#D97706',
          'question-bg': '#FFFBEB',
          trust: '#16A34A',
          'trust-bg': '#F0FDF4',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 4px 16px -2px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 12px -2px rgba(0, 0, 0, 0.08), 0 8px 24px -4px rgba(0, 0, 0, 0.1)',
        'verdict': '0 8px 32px -4px rgba(0, 0, 0, 0.12), 0 2px 8px -2px rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
    },
  },
  plugins: [],
}
