import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // PawTique 品牌色 (从原 HTML 移植)
        yellow: {
          DEFAULT: '#FFD84D',
          dark: '#F5C200',
          light: '#FFF3B0',
        },
        cream: {
          DEFAULT: '#FFF9EC',
          dark: '#FFF1D6',
        },
        brown: {
          DEFAULT: '#5C3D2E',
          light: '#8B5E3C',
        },
        ink: '#3D2B1F',
        muted: '#9C7B6B',
      },
      fontFamily: {
        sans: ['Nunito', 'system-ui', 'sans-serif'],
        doodle: ['Caveat', 'cursive'],
      },
      boxShadow: {
        soft: '0 4px 20px rgba(92, 61, 46, 0.12)',
        card: '0 8px 32px rgba(92, 61, 46, 0.08)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'wiggle': 'wiggle 0.5s ease-in-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-2deg)' },
          '75%': { transform: 'rotate(2deg)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;