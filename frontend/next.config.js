/** @type {import('next').NextConfig} */

// Объявление конфигурации Next.js
const nextConfig = {
  reactStrictMode: true, // Включение строгого режима React (strict mode)
  env: {
    API_URL: "http://127.0.0.1:8000", // Определение переменной окружения API_URL
    MAPBOX_ACCESS_TOKEN:'pk.eyJ1Ijoia2VwbGVyZGUiLCJhIjoiY2xvcHM2b2doMGUwdTJvazR0Mm1pOG8yeSJ9.sZ9RMUxH0Pw1xyjSkPiIIg'
  },
};

// Экспортирование конфигурации
module.exports = nextConfig;
