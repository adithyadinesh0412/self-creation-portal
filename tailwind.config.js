/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./projects/**/src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#0a4f9d', 
        'cardLightBlue':'#f3f7fa',
        'chipPurple':'#A59EFB',
        'textBlue':'#0A4F9D'
      },
    },
  },
  plugins: [],
}

