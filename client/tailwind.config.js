/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2ea4ff',
        secondary: '#333333',
        accent: '#8fd2ff',
        background: '#121212',
        txt: '#f0f0f0'
      },
    },
  },
  plugins: [],
}