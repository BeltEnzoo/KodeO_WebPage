/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        medical: {
          blue: '#0c1a24',
          'blue-dark': '#08131b',
          green: '#0f766e',
          'green-dark': '#0b5f59',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
        display: ['Newsreader', 'Georgia', 'serif'],
      }
    },
  },
  plugins: [],
}
