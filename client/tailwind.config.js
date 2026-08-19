/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sanskrit: {
          50: '#fffbf0',
          100: '#fef3c7',
          500: '#d97706',
          700: '#b45309',
          900: '#78350f',
        },
        meru: {
          bg: '#0f172a',
          card: '#1e293b',
          border: '#334155',
          gold: '#f59e0b',
          cyan: '#06b6d4',
          purple: '#a855f7',
          rose: '#f43f5e',
          emerald: '#10b981'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Cinzel', 'serif']
      }
    },
  },
  plugins: [],
}
