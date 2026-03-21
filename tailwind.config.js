/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0a1628',
          50: '#f0f4fa',
          100: '#d9e3f2',
          200: '#b3c7e6',
          300: '#8daad9',
          400: '#668ecd',
          500: '#4072c0',
          600: '#2f5ca8',
          700: '#1e4690',
          800: '#163272',
          900: '#0a1628',
          950: '#060d17',
        },
        gold: {
          DEFAULT: '#c9a84c',
          50: '#fdf8ec',
          100: '#f9eecc',
          200: '#f3dc99',
          300: '#ecc85f',
          400: '#e5b535',
          500: '#c9a84c',
          600: '#a8851e',
          700: '#88691a',
          800: '#6b5218',
          900: '#584318',
        },
        muted: '#6b7280',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      animation: {
        ticker: 'ticker 30s linear infinite',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-in': 'slideIn 0.4s ease-out forwards',
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #0a1628 0%, #122040 50%, #0a1628 100%)',
        'gold-gradient': 'linear-gradient(90deg, #c9a84c 0%, #e5c97a 50%, #c9a84c 100%)',
        'card-gradient': 'linear-gradient(145deg, #122040 0%, #0a1628 100%)',
      },
    },
  },
  plugins: [],
};
