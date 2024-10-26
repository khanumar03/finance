/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false, warnings: false };
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
