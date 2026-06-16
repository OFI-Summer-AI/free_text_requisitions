/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50:  '#fdfbf0',
          100: '#f7f0d0',
          200: '#eedfa0',
          300: '#e2c96a',
          400: '#d4af37',
          500: '#c9a227',
          600: '#a8841f',
          700: '#876618',
          800: '#614a10',
          900: '#3d2e0a',
        },
        ink: {
          50:  '#f5f5f5',
          100: '#e8e8e8',
          200: '#d0d0d0',
          300: '#a8a8a8',
          400: '#787878',
          500: '#505050',
          600: '#333333',
          700: '#1f1f1f',
          800: '#141414',
          900: '#0a0a0a',
        },
      },
      fontFamily: {
        sans: ['Segoe UI', 'system-ui', 'sans-serif'],
        mono: ['Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
};
