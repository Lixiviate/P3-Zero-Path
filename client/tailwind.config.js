/* eslint-disable no-undef */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        "subtle-teal": "#e6fafa",
      },
      fontFamily: {
        serif: ["Cormorant Garamond", "serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
