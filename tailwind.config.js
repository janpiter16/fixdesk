import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        neutral: {
          50: '#F8F9FA',
          100: '#F1F3F5',
          200: '#ECEEF2',
          300: '#E1E4EA',
          400: '#C6CBD5',
          500: '#AAB2C0',
          600: '#8690A6',
          700: '#636B7E',
          800: '#464E61',
          900: '#12151C',
        },
        signal: {
          pending: '#F59E0B',
          inprogress: '#3B82F6',
          completed: '#10B981',
          cancelled: '#EF4444',
          warranty: '#8B5CF6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config
