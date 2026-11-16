// Сайт собирается в статические файлы (out/). Префикс путей приходит из
// переменной окружения: "/FitOnCrimea" на github.io, "" на своём домене.
import { IMAGE_WIDTHS } from "./src/lib/image-widths.mjs";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  // Уменьшенные копии картинок делает scripts/optimize-images.mjs перед сборкой,
  // нужную по ширине экрана выбирает src/lib/image-loader.ts.
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    imageSizes: IMAGE_WIDTHS.filter((w) => w < 320),
    deviceSizes: IMAGE_WIDTHS.filter((w) => w >= 320),
  },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  poweredByHeader: false,
};

export default nextConfig;
