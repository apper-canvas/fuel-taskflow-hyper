/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#4F46E5',
          600: '#4338ca',
          700: '#3730a3',
        },
        secondary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          500: '#7C3AED',
          600: '#7c2d92',
          700: '#6b21a8',
        },
        accent: {
          50: '#ecfeff',
          100: '#cffafe',
          500: '#06B6D4',
          600: '#0891b2',
          700: '#0e7490',
        },
      },
    },
  },
  plugins: [],
}