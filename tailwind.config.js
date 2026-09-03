/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#070b12',
          panel: 'rgba(13, 20, 36, 0.75)',
          border: 'rgba(0, 243, 255, 0.3)',
          cyan: '#00f3ff',
          pink: '#ff007f',
          yellow: '#ffe600',
          green: '#39ff14',
        }
      },
      boxShadow: {
        'cyber-cyan': '0 0 15px rgba(0, 243, 255, 0.35)',
        'cyber-pink': '0 0 15px rgba(255, 0, 127, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      },
      backgroundImage: {
        'cyber-grid': 'linear-gradient(to right, rgba(0,243,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,243,255,0.05) 1px, transparent 1px)',
      }
    },
  },
  plugins: [],
}
