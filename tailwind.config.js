/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          light: '#fef08a',
          DEFAULT: '#fbbf24',
          dark: '#d97706',
        },
        royal: {
          dark: '#070000',
          medium: '#150202',
          light: '#2c0505',
        }
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        inter: ['Inter', 'sans-serif'],
        playfair: ['Playfair Display', 'serif'],
        greatvibes: ['Great Vibes', 'cursive'],
      },
      animation: {
        'heartbeat': 'heartbeat 1.5s infinite ease-in-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '14%, 42%': { transform: 'scale(1.12)' },
          '28%': { transform: 'scale(1)' },
        }
      }
    },
  },
  plugins: [],
}
