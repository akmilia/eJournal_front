/** @type {import('tailwindcss').Config} */ 

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#EBEBDC',
        primary: '#28694B',
        secondary: '#6E6E73',
        accent: '#FF5F2D',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}