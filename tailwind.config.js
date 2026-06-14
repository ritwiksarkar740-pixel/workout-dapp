/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gym: {
          black: '#060a10',
          dark: '#0d1117',
          card: '#0f172a',
        }
      }
    },
  },
  plugins: [],
}
