/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fintech: {
          bg: '#0B0F17',
          card: '#131A29',
          cardBorder: '#1E293B',
          accent: '#10B981',
          accentHover: '#059669',
          blue: '#3B82F6',
          indigo: '#6366F1',
          gold: '#F59E0B',
          purple: '#8B5CF6',
          rose: '#F43F5E',
          textMuted: '#94A3B8'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.25)',
        'glow-blue': '0 0 25px -5px rgba(59, 130, 246, 0.25)',
        'glow-purple': '0 0 25px -5px rgba(139, 92, 246, 0.25)',
      }
    },
  },
  plugins: [],
}
