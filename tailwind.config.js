/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./projects/**/src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#0a4f9d',
        'secondary': '#343836',
        'tertiary':'#FBFDFE',
        'chipPurple':'#A59EFB',
        'chipRejected':'#FD6969',
        'chipPublished':'#008840',
        'numberCircle': '#EC555D'
      },
    },
  },
  plugins: [],
}
