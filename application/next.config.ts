/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true, // Ensure this is enabled for App Router
  },
};

module.exports = nextConfig;
