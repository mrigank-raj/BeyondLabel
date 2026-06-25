/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00261b', // Deep Forest Green
        'primary-container': '#0b3d2e',
        'on-primary': '#ffffff',
        'primary-light': '#005236',
        'primary-lighter': '#4edea3',
        secondary: '#006c49',
        'secondary-container': '#6cf8bb',
        background: '#f7f9fb', // Slate Tint off-white
        surface: '#ffffff',
        'surface-variant': '#e0e3e5',
        verdict: {
          avoid: '#ba1a1a', // Soft Coral / Error
          'avoid-bg': '#ffdad6',
          question: '#dd8d00', // Warm Amber
          'question-bg': '#ffddb8',
          trust: '#006c49', // Emerald Green Success
          'trust-bg': '#6cf8bb',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'], // Body
        display: ['Outfit', 'system-ui', 'sans-serif'], // Headings
      },
      boxShadow: {
        'card': '0 4px 20px -5px rgba(0, 0, 0, 0.05)', // Level 2
        'card-hover': '0 8px 30px -5px rgba(0, 0, 0, 0.08)',
        'floating': '0 12px 40px -8px rgba(0, 0, 0, 0.15)', // Level 3
        'verdict': '0 8px 32px -4px rgba(0, 0, 0, 0.12), 0 2px 8px -2px rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        'pill': '9999px',
      },
    },
  },
  plugins: [],
}
