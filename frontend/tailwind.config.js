/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"]
      },
      colors: {
        pizza: {
          50: '#fff8f0',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        ember: {
          DEFAULT: '#e63946',
          dark: '#c1121f',
          light: '#ff6b6b'
        },
        cream: {
          DEFAULT: '#fdf6ec',
          dark: '#f5e6d3'
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
        'slide-in-right': 'slideInRight 0.3s ease-out forwards',
        'bounce-in': 'bounceIn 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97)',
        'pulse-ring': 'pulseRing 2s ease-out infinite',
        'timer-shrink': 'timerShrink linear forwards',
        'float': 'float 3s ease-in-out infinite',
        'sizzle': 'sizzle 0.5s ease-in-out'
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideInRight: { from: { opacity: 0, transform: 'translateX(100%)' }, to: { opacity: 1, transform: 'translateX(0)' } },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: 0 },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: 1 }
        },
        pulseRing: {
          '0%': { transform: 'scale(0.8)', opacity: 1 },
          '100%': { transform: 'scale(2)', opacity: 0 }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        sizzle: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' }
        }
      }
    }
  },
  plugins: []
};
