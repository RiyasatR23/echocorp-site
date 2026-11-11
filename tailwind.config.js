/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        echo: {
          base: '#0B0A12',
          deeper: '#08070E',
          surface: '#16151F',
          'surface-alt': '#1C1B28',
          ink: '#F4F3FA',
          muted: '#A8A4BC',
          violet: '#7C5CFF',
          cyan: '#36E0FF',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'echo-gradient': 'linear-gradient(135deg, #7C5CFF, #36E0FF)',
      },
    },
  },
  plugins: [],
};
