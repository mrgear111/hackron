import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Primary colors
        'primary-purple': '#A06BFF',
        'primary-purple-deep': '#8B4DFF',
        'primary-dark-base': '#0C0E23',
        // Accent colors
        'accent-cyan': '#6BAAB3',
        'accent-orange': '#DC7C69',
        // Background colors
        'bg-deep-night': '#151A3A',
        'bg-lavender-cloud': '#8D7ADB',
        // UI/Text colors
        'ui-white': '#F0E4FF',
        'text-soft-lavender': '#DCD8FF',
        'text-muted': '#9A8ACF',
        // Extra tokens
        'border-default': '#1A112B',
        'bg-panel': '#151A3A',
      },
      fontFamily: {
        'pixel': ["'Press Start 2P'", 'cursive'],
        'retro': ["'VT323'", 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config;
