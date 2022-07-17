/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './shared/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: {
          200: 'hsl(35, 75%, 90%)',
          100: 'hsl(35, 75%, 97%)',
          50: 'hsl(35, 75%, 98%)',
          10: 'hsl(35, 75%, 98.5%)',
        },
        primary: {
          5: 'hsl(3, 95%, 90%)',
          10: 'hsl(3, 95%, 80%)',
          50: 'hsl(3, 95%, 70%)',
          100: 'hsl(3, 95%, 60%)',
          200: 'hsl(3, 95%, 48%)',
        },
      },
    },
  },
  plugins: [],
}
