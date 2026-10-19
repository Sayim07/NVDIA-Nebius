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
        background: "#07090D",
        foreground: "#F8FAFC",
        canvas: "#07090D",
        surface: {
          DEFAULT: "#0D1117",
          1: "#0E131B",
          2: "#151C27",
          3: "#1C2533",
        },
        border: {
          subtle: "rgba(255, 255, 255, 0.08)",
          DEFAULT: "rgba(255, 255, 255, 0.10)",
          strong: "rgba(255, 255, 255, 0.16)",
        },
        nvidia: {
          DEFAULT: "#76B900",
          hover: "#87D300",
          glow: "rgba(118, 185, 0, 0.25)",
        },
        cyan: {
          DEFAULT: "#22D3EE",
          hover: "#38BDF8",
          glow: "rgba(34, 211, 238, 0.25)",
        },
        threat: {
          DEFAULT: "#EF4444",
          surface: "rgba(239, 68, 68, 0.12)",
          border: "rgba(239, 68, 68, 0.35)",
        },
        warning: {
          DEFAULT: "#F59E0B",
          surface: "rgba(245, 158, 11, 0.12)",
          border: "rgba(245, 158, 11, 0.35)",
        },
      },
      fontFamily: {
        sans: ["'Inter'", "'Geist'", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        heading: ["'Space Grotesk'", "sans-serif"],
        serif: ["'Instrument Serif'", "Georgia", "serif"],
        mono: ["'Geist Mono'", "'JetBrains Mono'", "monospace"],
      },
      borderRadius: {
        '2xl': '16px',
      },
    },
  },
  plugins: [],
};

