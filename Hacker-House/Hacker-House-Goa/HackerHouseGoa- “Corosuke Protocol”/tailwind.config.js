/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {colors: {
      'bgc': '#F6740B',
    },},
    backgroundImage: {
      bgimg: "url('./src/assets/bg1.png')"
    },
  },
  plugins: [],
};
