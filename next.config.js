/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel deployment - no static export needed
  experimental: {
    serverComponentsExternalPackages: [],
  },
  // Skip API routes during build
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
}

module.exports = nextConfig