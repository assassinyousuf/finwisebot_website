/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export when NEXT_STATIC_EXPORT is set (for GitHub Pages deployment)
  ...(process.env.NEXT_STATIC_EXPORT === 'true' && {
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