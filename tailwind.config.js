/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        poke: {
          normal: '#A8A77A',
          fire: '#EE8130',
          water: '#6390F0',
          electric: '#F7D02C',
          grass: '#7AC74C',
          ice: '#96D9D6',
          fighting: '#C22E28',
          poison: '#A33EA1',
          ground: '#E2BF65',
          flying: '#A98FF3',
          psychic: '#F95587',
          bug: '#A6B91A',
          rock: '#B6A136',
          ghost: '#735797',
          dragon: '#6F35FC',
          dark: '#705746',
          steel: '#B7B7CE',
          fairy: '#D685AD',
        },
        category: {
          physical: '#e74c3c',
          special: '#3498db',
          status: '#95a5a6',
        },
        darkbg: {
          900: '#0a0d14',
          800: '#111726',
          700: '#182035',
          600: '#232e4a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-fire': '0 0 20px -5px rgba(238, 129, 48, 0.4)',
        'glow-water': '0 0 20px -5px rgba(99, 144, 240, 0.4)',
        'glow-electric': '0 0 20px -5px rgba(247, 208, 44, 0.4)',
        'glow-grass': '0 0 20px -5px rgba(122, 199, 76, 0.4)',
        'card-dark': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}
