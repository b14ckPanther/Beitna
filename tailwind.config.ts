import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fdf8ef',
          100: '#f9edce',
          200: '#f2d89a',
          300: '#e9bc5e',
          400: '#e2a33a',
          500: '#c9892a',
          600: '#b07020',
          700: '#8a551c',
          800: '#6e441d',
          900: '#5a391a',
          DEFAULT: '#C9A56A',
          light: '#D4B483',
          dark: '#A07840',
        },
        obsidian: {
          DEFAULT: '#071611', // deep forest-charcoal
          50: '#0b2018',
          100: '#0f271e',
          200: '#152f25',
          300: '#1b3a2e',
        },
        cream: {
          DEFAULT: '#FFF7EB',
          50: '#FFF9F0',
          100: '#FFF3E0',
        },
      },
      fontFamily: {
        cairo: ['var(--font-cairo)', 'Cairo', 'sans-serif'],
        ubuntu: ['var(--font-ubuntu)', 'Ubuntu', 'sans-serif'],
        heebo: ['var(--font-heebo)', 'Heebo', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #C9A56A 0%, #F4C095 40%, #C9A56A 70%, #A07840 100%)',
        'gold-radial': 'radial-gradient(ellipse at center, #F4C095 0%, #C9A56A 50%, #8A6030 100%)',
        'dark-gradient': 'linear-gradient(180deg, #071611 0%, #0b2018 100%)',
      },
      animation: {
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'fade-in': 'fadeIn 1s ease-out forwards',
        'slide-in-right': 'slideInRight 0.8s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.8s ease-out forwards',
        'scale-in': 'scaleIn 0.6s ease-out forwards',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(201, 165, 106, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(201, 165, 106, 0.7), 0 0 80px rgba(201, 165, 106, 0.2)' },
        },
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
    },
  },
  plugins: [],
};

export default config;
