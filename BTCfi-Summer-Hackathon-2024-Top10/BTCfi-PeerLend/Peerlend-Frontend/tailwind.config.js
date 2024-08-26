/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'roboto-serif': ["Roboto Serif"," serif"],
        'playfair': ["Playfair Display"," serif"]
      },
      animation: {
        'spin-slow': 'spin 10s linear infinite',
      },
      backgroundPosition: {
        'right-0': '100% 0',
        'bottom-0': '100% 0',
      },
    },
  },
  plugins: [],
}