/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true, // Pour GitHub Pages et Vercel statique
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  assetPrefix: process.env.NODE_ENV === "production" ? "/peinturna" : "",
  basePath: process.env.NODE_ENV === "production" ? "/peinturna" : "",
};

module.exports = nextConfig;
