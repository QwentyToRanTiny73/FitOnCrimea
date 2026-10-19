// Сайт собирается в статические файлы (out/) для GitHub Pages.
// Префикс путей приходит из переменной окружения: workflow берёт его
// из настроек Pages ("/FitOnCrimea" на github.io, "" на своём домене).
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  poweredByHeader: false,
};

export default nextConfig;
