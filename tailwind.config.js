const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: colors.black,
        primary: {
          light: colors.black,
          dark: colors.white,
        },
        secondary: {
          light: colors.gray[600],
          dark: colors.gray[400],
        },
        background: {
          light: colors.white,
          dark: colors.gray[900],
        },
        shade: {
          light: "rgba(0, 0, 0, 0.45)",
          dark: "rgba(255, 255, 255, 0.45)",
        },
        bgshade: {
          light: "rgba(0, 0, 0, 0.05)",
          dark: "rgba(255, 255, 255, 0.05)",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
