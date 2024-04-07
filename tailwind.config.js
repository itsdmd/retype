/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

export default {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: colors.yellow,
        inactive: colors.slate,
        error: colors.red,
      },
    },
  },
  plugins: [],
};
