/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        valorant: {
          red: "#ff4655",
          dark: "#0f1923",
          light: "#ece8e1",
          gray: "#768079",
          card: "#1f2326"
        }
      }
    },
  },
  plugins: [],
};
