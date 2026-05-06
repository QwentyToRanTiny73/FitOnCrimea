import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#2E5E4E",
          forest: "#3F6B4E",
          gold: "#C8A96E",
          beige: "#F4F0EA",
          cream: "#FAF6EF",
          sea: "#5E8AA8",
          poppy: "#D04A3A",
          lavender: "#A89AC8",
          terracotta: "#C8946E",
          plum: "#7A4A6E",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Cormorant Garamond", "serif"],
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fadeIn 0.7s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
