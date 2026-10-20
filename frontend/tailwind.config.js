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
        surface: {
          DEFAULT: "var(--surface)",
          2: "var(--surface-2)",
        },
        border: {
          DEFAULT: "var(--border)",
        },
        text: {
          DEFAULT: "var(--text)",
        },
        muted: {
          DEFAULT: "var(--muted)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          fg: "var(--primary-fg)",
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
      },
    },
  },
  plugins: [],
};
