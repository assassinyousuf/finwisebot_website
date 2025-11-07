/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only enable static export for production builds
  ...(process.env.NODE_ENV === 'production' && process.env.NEXT_STATIC_EXPORT === 'true' && {
    output: 'export',
    trailingSlash: true,
    images: {
      unoptimized: true,
    },
  }),
  // Exclude API routes from static export
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