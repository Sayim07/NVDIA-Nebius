/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
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
        canvas: "#020617", // slate-950
        surface: {
          1: "#0f172a", // slate-900
          2: "#1e293b", // slate-800
        },
        border: {
          subtle: "#334155", // slate-700
        },
        cyber: {
          emerald: "#10b981",
          rose: "#f43f5e",
          cyan: "#06b6d4",
          violet: "#8b5cf6",
          amber: "#f59e0b",
        },
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "var(--font-inter)", "system-ui", "sans-serif"],
        display: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"],
        serif: ["'Instrument Serif'", "Georgia", "serif"],
        mono: ["'JetBrains Mono'", "var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
