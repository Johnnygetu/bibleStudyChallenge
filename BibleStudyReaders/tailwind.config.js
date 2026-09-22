/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#f5f5f5',
          900: '#ececec',
          850: '#ffffff',
          800: '#f0f0f0',
          700: '#e5e5e5',
          600: '#a3a3a3',
          500: '#737373',
          400: '#525252',
          300: '#404040',
          200: '#262626',
          100: '#171717',
          50:  '#0a0a0a',
        },
        primary: {
          50: '#cbe4f7',
          100: '#a3cff1',
          200: '#54a8e5',
          300: '#033b5c',
          400: '#022942',
          500: '#011e30',
          600: '#01121d',
          700: '#000b12',
          800: '#000407',
          900: '#000102',
        },
        ember: {
          500: '#e8590c',
          600: '#d04a06',
        },
        success: {
          500: '#2f9e44',
          600: '#237b32',
        },
        danger: {
          500: '#e03131',
          600: '#c92a2a',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.25s ease-out',
        'check-pop': 'checkPop 0.3s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        checkPop: {
          '0%': { transform: 'scale(0)' },
          '50%': { transform: 'scale(1.15)' },
          '100%': { transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
