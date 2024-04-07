/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

export default {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: colors.yellow,
        secondary: colors.slate,
        error: colors.red,
      },
    },
  },
  plugins: [],
};
