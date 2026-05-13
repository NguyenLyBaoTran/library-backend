/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#F1F4E8',
          100: '#E2E9D1',
          200: '#C5D3A3',
          300: '#A8BD75',
          400: '#87A96B',
          500: '#6B8E4E',
        }
      }
    },
  },
  plugins: [],
}