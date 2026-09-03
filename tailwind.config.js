/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#020617',       // Slate-950 ultraoscuro
          card: '#090d16',     // Fondo de contenedores HUD
          cyan: '#06b6d4',     // Cyan principal
          fuchsia: '#d946ef',  // Accent secundario
          green: '#10b981',    // Indicador de estado / OK
          yellow: '#facc15',   // Advertencias tácticas
        },
      },
      boxShadow: {
        'glow-cyan': '0 0 15px rgba(6, 182, 212, 0.4)',
        'glow-cyan-lg': '0 0 35px rgba(6, 182, 212, 0.7)',
        'glow-fuchsia': '0 0 15px rgba(217, 70, 239, 0.4)',
        'glow-fuchsia-lg': '0 0 35px rgba(217, 70, 239, 0.7)',
      },
      animation: {
        'scanline': 'scanline 8s linear infinite',
        'hud-spin': 'spin 12s linear infinite',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
      },
    },
  },
  plugins: [],
};