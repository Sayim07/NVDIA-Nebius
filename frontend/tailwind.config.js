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
        bg: "var(--bg)",
        background: "var(--bg)",
        foreground: "var(--text)",
        card: {
          DEFAULT: "var(--surface)",
          foreground: "var(--text)",
        },
        popover: {
          DEFAULT: "var(--surface)",
          foreground: "var(--text)",
        },
        surface: {
          DEFAULT: "var(--surface)",
          2: "var(--surface-2)",
          3: "#161922",
        },
        secondary: {
          DEFAULT: "var(--surface-2)",
          foreground: "var(--text)",
        },
        border: {
          DEFAULT: "var(--border)",
        },
        text: {
          DEFAULT: "var(--text)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          fg: "var(--primary-fg)",
          foreground: "var(--primary-fg)",
        },
        highlight: {
          DEFAULT: "var(--highlight)",
        },
        info: {
          DEFAULT: "var(--info)",
        },
        danger: {
          DEFAULT: "var(--danger)",
        },
        warning: {
          DEFAULT: "var(--warning)",
        },
      },
      fontFamily: {
        sans: ["'Inter'", "'Geist'", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        heading: ["'Inter Tight'", "'Geist'", "-apple-system", "sans-serif"],
        serif: ["'Instrument Serif'", "Georgia", "serif"],
        mono: ["'Geist Mono'", "'JetBrains Mono'", "monospace"],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '14px',
        '3xl': '16px',
      },
      boxShadow: {
        'soft': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'card': 'var(--card-shadow)',
        'float': '0 16px 40px -8px rgba(0, 0, 0, 0.25)',
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.25)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.25)',
        'glow-purple': '0 0 25px -5px rgba(168, 85, 247, 0.25)',
      },
      keyframes: {
        "border-beam": {
          "100%": {
            "offset-distance": "100%",
          },
        },
        "shimmer-slide": {
          to: {
            transform: "translate(calc(100cqw - 100%), 0)",
          },
        },
        "spin-around": {
          "0%": {
            transform: "translateZ(0) rotate(0)",
          },
          "15%, 35%": {
            transform: "translateZ(0) rotate(90deg)",
          },
          "65%, 85%": {
            transform: "translateZ(0) rotate(270deg)",
          },
          "100%": {
            transform: "translateZ(0) rotate(360deg)",
          },
        },
        meteor: {
          "0%": { transform: "rotate(215deg) translateX(0)", opacity: "1" },
          "70%": { opacity: "1" },
          "100%": {
            transform: "rotate(215deg) translateX(-500px)",
            opacity: "0",
          },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" },
        },
      },
      animation: {
        "border-beam": "border-beam calc(var(--duration)*1s) infinite linear",
        "shimmer-slide": "shimmer-slide var(--speed) ease-in-out infinite alternate",
        "spin-around": "spin-around calc(var(--speed) * 2) infinite linear",
        meteor: "meteor 5s linear infinite",
        "pulse-glow": "pulseGlow 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
