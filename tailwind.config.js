/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        luxe: {
          ivory: '#f8f2eb',
          sand: '#ebddd1',
          almond: '#d9c2ae',
          blush: '#f2e3dc',
          rose: '#b98b79',
          mocha: '#8d6955',
          cocoa: '#5c4335',
          espresso: '#271c16',
          charcoal: '#14110f',
          mist: '#fdfaf7',
          midnight: '#120f0d',
          ink: '#ece5dd',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        body: ['Manrope', 'sans-serif'],
      },
      boxShadow: {
        luxe: '0 22px 60px rgba(38, 23, 15, 0.12)',
        soft: '0 12px 30px rgba(52, 32, 22, 0.08)',
      },
      backgroundImage: {
        'hero-glow':
          'radial-gradient(circle at top right, rgba(255,255,255,0.58), rgba(255,255,255,0.06) 38%, transparent 60%)',
        'panel-glow':
          'linear-gradient(135deg, rgba(255,255,255,0.55), rgba(255,255,255,0.1))',
      },
      animation: {
        marquee: 'marquee 22s linear infinite',
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 1.8s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-500px 0' },
          '100%': { backgroundPosition: '500px 0' },
        },
      },
    },
  },
  plugins: [],
};
