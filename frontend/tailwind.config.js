/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        success: '#10b981',
        danger: '#ef4444',
        warning: '#f59e0b',
      },
      fontFamily: {
        'sinhala': ['Gemunu Libre', 'sans-serif'],
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' }
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        }
      },
      animation: {
        'marquee': 'marquee 20s linear infinite',
        'marquee-slow': 'marquee 30s linear infinite',
        'marquee-slower': 'marquee 40s linear infinite',
        'spin-slow': 'spin-slow 8s linear infinite',
      }
    },
  },
  plugins: [],
}
