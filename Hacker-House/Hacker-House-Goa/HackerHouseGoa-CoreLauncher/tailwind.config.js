/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "primary-gradient": "linear-gradient(45deg, #9333ea, #ea580c)",
      },
      backgroundColor: {
        dark: "#161616",
        "heavy-dark": "#101010",
        light: "#f8f9fa",
      },
      colors: {
        "semi-dark": "#656565",
        dark: "#161616",
        light: "#f8f9fa",
      },
      fontFamily: {
        "chakra-petch": ["Chakra Petch", "sans-serif"],
        "IBM-Plex": ["IBM Plex Mono", "monospace"],
      },
    },
  },
  plugins: [require("daisyui"), require("@tailwindcss/typography")],
};
