import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        google: {
          purple: '#673ab7',
          lightPurple: '#f0ebf8',
          bg: '#f0ebf8',
          border: '#dadce0',
          text: '#202124',
        }
      },
      fontFamily: {
        sans: ['Roboto', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
};

export default config;
