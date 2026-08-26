/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Ember & Oak — warm light editorial palette ──
        paper: '#F4ECDD',       // main background (warm cream paper)
        sand: '#EBE0CD',        // alternating sections
        card: '#FCF8EF',        // cards / panels (lightest)
        ink: '#23190F',         // primary text (deep espresso)
        clay: '#C05A34',        // primary accent (burnt terracotta)
        'clay-deep': '#9E4626', // accent hover
        olive: '#5E6347',       // secondary accent (deep olive)
        gold: '#C79A3A',        // tiny highlight
        // legacy tokens (kept for safety)
        cream: '#F4ECDD',
        espresso: '#23190F',
        'roasted-brown': '#6B4226',
        terracotta: '#C05A34',
        'warm-white': '#FCF8EF',
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', '"JetBrains Mono"', 'monospace'],
      },
      letterSpacing: {
        label: '0.28em',
      },
      animation: {
        marquee: 'marquee 32s linear infinite',
        'scroll-dot': 'scrollDot 1.8s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'floatSlow 8s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'glow-border': 'glowBorder 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s ease-in-out infinite',
        'steam-1': 'steam 3s ease-out infinite',
        'steam-2': 'steam 3.5s ease-out 0.8s infinite',
        'steam-3': 'steam 4s ease-out 1.6s infinite',
        'draw-line': 'drawLine 1.5s ease-out forwards',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'spin-slow': 'spinSlow 20s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        scrollDot: {
          '0%': { top: '6px', opacity: '1' },
          '70%': { top: '18px', opacity: '0.3' },
          '100%': { top: '6px', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-14px) rotate(2deg)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '33%': { transform: 'translateY(-8px) rotate(-1deg)' },
          '66%': { transform: 'translateY(4px) rotate(1deg)' },
        },
        glowBorder: {
          '0%, 100%': { 'border-color': 'rgba(192,90,52,0.3)' },
          '50%': { 'border-color': 'rgba(192,90,52,0.7)' },
        },
        shimmer: {
          '0%': { 'background-position': '-200% 0' },
          '100%': { 'background-position': '200% 0' },
        },
        steam: {
          '0%': { transform: 'translateY(0) scaleX(1)', opacity: '0' },
          '15%': { opacity: '0.6' },
          '50%': { transform: 'translateY(-30px) scaleX(1.4)', opacity: '0.3' },
          '100%': { transform: 'translateY(-60px) scaleX(2)', opacity: '0' },
        },
        drawLine: {
          '0%': { 'stroke-dashoffset': '1000' },
          '100%': { 'stroke-dashoffset': '0' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        spinSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
}
