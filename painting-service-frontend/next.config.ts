import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Si tu as des routes dynamiques, active `trailingSlash`
  trailingSlash: true,
};

export default nextConfig;
