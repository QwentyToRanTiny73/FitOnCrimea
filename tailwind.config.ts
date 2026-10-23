import type { Config } from "tailwindcss";

// Палитра снята с брошюры «Целебные бальзамы Крыма»:
// пергамент и опалённые края обложки, золотые поля страниц, красные заголовки,
// зелёная лента логотипа, море и полевые цветы с картины в венке.
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#2D5B36", // тёмная зелень ленты логотипа: текст, кнопки
          leaf: "#5E9E45", // светлый блик ленты
          forest: "#3F7A3E",
          crimson: "#A3232B", // заголовки разделов брошюры
          maroon: "#5A2420", // крупный заголовок обложки
          gold: "#8A6118", // золото для текста и тонких линий
          amber: "#E2B84F", // золотые поля страниц, травы-силуэты
          beige: "#F4E9D4", // пергамент
          cream: "#FCF7EC", // светлый центр страницы
          terracotta: "#B5622E", // опалённый край, дерево баночек
          sea: "#5A68A6", // сине-лиловое море картины
          poppy: "#C8322A", // мак из венка
          lavender: "#7F6BB0", // колокольчик
          plum: "#6A3F6E",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
