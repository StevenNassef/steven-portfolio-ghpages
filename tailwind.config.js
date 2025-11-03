/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0b0c10',
        foreground: '#e5e7eb',
        muted: '#9ca3af',
        card: '#111217',
        border: '#1f2937',
        primary: '#60a5fa'
      },
      boxShadow: { card: '0 10px 20px rgba(0,0,0,0.25)' },
      borderRadius: { xl2: '1.25rem' }
    },
  },
  plugins: [],
}