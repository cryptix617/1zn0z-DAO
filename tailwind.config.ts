import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dark mode inspired color scheme
        'brand-primary': '#1E40AF',      // Deep blue
        'brand-secondary': '#10B981',    // Emerald green
        'brand-background': '#0F172A',   // Dark navy background
        'brand-surface': '#1E293B',      // Slightly lighter surface
        'brand-text': '#E2E8F0',         // Light text for dark mode
        'brand-accent': '#6366F1',       // Indigo accent
        'brand-highlight': '#22D3EE',    // Cyan highlight
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'dao-card': '0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)',
        'dao-elevated': '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
      },
      borderRadius: {
        'dao-card': '1rem',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui'],
        'mono': ['Roboto Mono', 'ui-monospace', 'SFMono-Regular'],
      },
    },
  },
  plugins: [],
}

export default config
