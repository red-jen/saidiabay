/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Deep Navy - Sotheby's inspired elegance
        primary: {
          50: '#f5f7fa',
          100: '#e4e9f2',
          200: '#c8d3e5',
          300: '#a3b5d1',
          400: '#7891b9',
          500: '#5774a3',
          600: '#455d88',
          700: '#3a4d6f',
          800: '#33425d',
          900: '#0c1f3f', // Main brand color - deep navy
          950: '#060e1f',
        },
        // Warm Sand/Cream - sophisticated neutral
        secondary: {
          50: '#fdfcfb',
          100: '#f8f6f3',
          200: '#f0ebe4',
          300: '#e5ddd1',
          400: '#d4c7b5',
          500: '#c2b199',
          600: '#a89578',
          700: '#8c7a5f',
          800: '#746550',
          900: '#615545',
          950: '#332c22',
        },
        // Champagne Gold - luxury accent
        accent: {
          50: '#fefbf5',
          100: '#fcf4e5',
          200: '#f9e7c6',
          300: '#f4d49d',
          400: '#eebb6a',
          500: '#c9a961', // Main gold
          600: '#b8923d',
          700: '#9a7633',
          800: '#7d5f2e',
          900: '#674e28',
          950: '#3b2a13',
        },
        // Pure white tones
        white: '#ffffff',
        cream: '#faf9f7',
        ivory: '#f8f7f4',
        // Status colors
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
      },
      fontFamily: {
        // Elegant serif for headings - Sotheby's style
        serif: ['Cormorant Garamond', 'Georgia', 'Times New Roman', 'serif'],
        // Clean sans-serif for body - Booking.com style
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        // Display font for brand
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['3rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'display-sm': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1.5rem',
          lg: '2rem',
          xl: '3rem',
          '2xl': '4rem',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'fade-in-up': 'fadeInUp 0.8s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'shimmer': 'shimmer 2.5s infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'elegant': '0 1px 3px rgba(12, 31, 63, 0.04), 0 4px 12px rgba(12, 31, 63, 0.06)',
        'elegant-md': '0 4px 6px rgba(12, 31, 63, 0.04), 0 10px 24px rgba(12, 31, 63, 0.08)',
        'elegant-lg': '0 10px 20px rgba(12, 31, 63, 0.06), 0 20px 40px rgba(12, 31, 63, 0.1)',
        'elegant-xl': '0 20px 40px rgba(12, 31, 63, 0.1), 0 40px 80px rgba(12, 31, 63, 0.15)',
        'gold': '0 4px 20px rgba(201, 169, 97, 0.25)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(12, 31, 63, 0.03)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
