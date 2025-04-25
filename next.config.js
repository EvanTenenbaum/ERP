/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add Prisma workaround for Vercel deployment
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Exclude Prisma from the server bundle
      // This prevents Prisma from being initialized during build time
      config.externals.push('@prisma/client')
    }
    return config
  },
  // Existing configuration
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcrypt'],
  },
  // Disable static optimization for API routes
  // This ensures API routes are always server-side rendered
  // and not statically optimized during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig

module.exports = nextConfig
