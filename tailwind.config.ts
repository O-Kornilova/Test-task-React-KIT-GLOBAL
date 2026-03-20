import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        ink: {
          DEFAULT: "#0D0D0D",
          soft: "#1A1A1A",
          muted: "#2E2E2E",
        },
        paper: {
          DEFAULT: "#F5F0E8",
          warm: "#EDE8DC",
          soft: "#FAF8F3",
        },
        accent: {
          DEFAULT: "#C8A96E",
          dark: "#A8893E",
          light: "#E8C98E",
        },
        muted: "#6B6B6B",
        border: "#D4CFC4",
        danger: "#C0392B",
        success: "#27AE60",
      },
      typography: {
        DEFAULT: {
          css: {
            color: "#0D0D0D",
            fontFamily: "var(--font-body)",
          },
        },
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease forwards",
        "slide-up": "slideUp 0.5s ease forwards",
        "slide-in": "slideIn 0.35s ease forwards",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          from: { opacity: "0", transform: "translateX(-12px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
      },
      boxShadow: {
        card: "0 2px 16px 0 rgba(13,13,13,0.06), 0 1px 3px rgba(13,13,13,0.08)",
        "card-hover": "0 8px 32px 0 rgba(13,13,13,0.12), 0 2px 8px rgba(13,13,13,0.08)",
        modal: "0 24px 64px rgba(13,13,13,0.2)",
      },
    },
  },
  plugins: [],
};

export default config;
