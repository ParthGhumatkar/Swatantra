/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: '#F5A623',
        'accent-glow': '#FFD700',
        surface: '#1A1A1A',
        'surface-border': '#2A2A2A',
        'dark-bg': '#0F0F0F',
        sidebar: '#111111',
        'sidebar-border': '#1E1E1E',
        'warm-white': '#F5F5F0',
        'warm-gray': '#888884',
        mint: '#E8F5E9',
        danger: '#FF6B6B',
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      fontFamily: {
        display: ['var(--font-sora)', 'sans-serif'],
        body: ['var(--font-dm-sans)', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
}
