/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./projects/**/src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#0a4f9d', 
      },
    },
  },
  plugins: [],
}

