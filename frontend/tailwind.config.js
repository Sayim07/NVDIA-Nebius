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
        // Theme: Paper & Forest
        bg: "#F7F7F4",
        surface: {
          DEFAULT: "#FFFFFF",
          2: "#EEF1EC",
          3: "#E5E9E2",
        },
        ink: {
          DEFAULT: "#0F1A17",
          muted: "#56625E",
          subtle: "#8A9490",
        },
        border: {
          DEFAULT: "#E3E6E0",
          subtle: "#ECEEE9",
          dark: "#22352F",
        },
        primary: {
          DEFAULT: "#0B6E4F",
          hover: "#095A41",
          subtle: "#E7F3EE",
        },
        highlight: {
          DEFAULT: "#76B900",
          subtle: "#F0F8E2",
        },
        info: {
          DEFAULT: "#2563EB",
          subtle: "#EFF6FF",
        },
        danger: {
          DEFAULT: "#D92D20",
          subtle: "#FEF3F2",
        },
        warning: {
          DEFAULT: "#B54708",
          subtle: "#FFFAEB",
        },
        dark: {
          DEFAULT: "#0E1F1A",
          surface: "#142A24",
          card: "#18322B",
          border: "#23443B",
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
        '2xl': '16px',
        '3xl': '20px',
      },
      boxShadow: {
        'soft': '0 1px 2px rgba(15, 26, 23, 0.06)',
        'card': '0 1px 3px rgba(15, 26, 23, 0.05), 0 8px 24px rgba(15, 26, 23, 0.06)',
        'float': '0 12px 32px -4px rgba(15, 26, 23, 0.12), 0 4px 12px rgba(15, 26, 23, 0.06)',
        'dark-card': '0 1px 3px rgba(0, 0, 0, 0.2), 0 12px 32px rgba(0, 0, 0, 0.35)',
      },
    },
  },
  plugins: [],
};


