/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        'brand-surface': '#1E293B',
        'brand-text': '#FFFFFF',
        'brand-primary': '#3B82F6',
        'brand-accent': '#2563EB',
        'brand-highlight': '#60A5FA'
      },
      borderRadius: {
        'dao-card': '12px'
      },
      boxShadow: {
        'dao-card': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'dao-elevated': '0 10px 15px rgba(0, 0, 0, 0.2)'
      }
    },
  },
  plugins: [],
}
