/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        amazon_blue: {
          light: "#232F3E",
          DEFAULT: "#131921",
        },
      },
      fontFamily: {
        sans: ['Amazon Ember', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
