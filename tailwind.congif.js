module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
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
