/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: false, // 🔥 Essaye `true` si ça ne marche pas
};

module.exports = nextConfig;
