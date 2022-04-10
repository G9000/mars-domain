module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      poppins: "Poppins",
      chakra: 'Chakra Petch'
    },
    extend: {
      colors: {
        brandBlack: "var(--brandBlack)",
        brandGrey: "var(--brandGrey)",
        brandOrange: "var(--brandOrange)",
        brandPurple: "var(--brandPurple)"
      }
    },
  },
  plugins: [],
}