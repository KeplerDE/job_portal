/** @type {import('next').NextConfig} */

// Объявление конфигурации Next.js
const nextConfig = {
  reactStrictMode: true, // Включение строгого режима React (strict mode)
  env: {
    API_URL: "http://localhost:8000", // Определение переменной окружения API_URL
  },
};

// Экспортирование конфигурации
module.exports = nextConfig;
