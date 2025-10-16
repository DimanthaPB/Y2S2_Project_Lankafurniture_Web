module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        wood: {
          light: "#d7b899",
          DEFAULT: "#b08d57",
          dark: "#6f4e37",
        },
      },
      backgroundImage: {
        'wood-pattern': "url('https://www.transparenttextures.com/patterns/wood-pattern.png')",
      },
    },
  },
  plugins: [],
};
