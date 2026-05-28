/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'msk-primary': '#1e40af',
        'msk-secondary': '#dc2626',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
