/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        cursive: ["'Dancing Script'", "cursive"],
      },
      colors : {
        primary : "#00acb4"
      }
    },
  },
  plugins: [],
}

