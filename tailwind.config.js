/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#F29999",
        bgwhite: "",
        secondary: {
          DEFAULT: "#FF9C01",
          100: "#FF9001",
          200: "#000000",
        },
        black: {
          DEFAULT: "#000",
          100: "#1E1E2D",
          200: "#232533",
        },
        gray: {
          100: "#CDCDE0",
        },
      },
      fontFamily: {
        pthin: ["Poppins-Thin", "sans-serif"],
        pextralight: ["Poppins-ExtraLight", "sans-serif"],
        plight: ["Poppins-Light", "sans-serif"],
        pregular: ["Poppins-Regular", "sans-serif"],
        pmedium: ["Poppins-Medium", "sans-serif"],
        psemibold: ["Poppins-SemiBold", "sans-serif"],
        pbold: ["Poppins-Bold", "sans-serif"],
        pextrabold: ["Poppins-ExtraBold", "sans-serif"],
        pblack: ["Poppins-Black", "sans-serif"],
        cbold: ["Comfortaa-Bold", "sans-serif"],
        clight: ["Comfortaa-Light", "sans-serif"],
        cmedium: ["Comfortaa-Medium", "sans-serif"],
        cregular: ["Comfortaa-Regular", "sans-serif"],
        cbold: ["Comfortaa-SemiBold", "sans-serif"],
      },
    },
  },
  plugins: [],
};