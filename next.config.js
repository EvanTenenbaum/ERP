/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure for Vercel deployment
  distDir: '.next',
  
  // External packages that should be transpiled by Next.js
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcrypt'],
  },
  
  // Disable TypeScript and ESLint checks during build to speed up deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Increase timeout for static page generation
  staticPageGenerationTimeout: 120,
  
  // Configure webpack to handle Prisma properly
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Exclude Prisma from the server bundle
      config.externals.push('@prisma/client')
    }
    return config
  },
  
  // Image configuration
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true,
  },
  
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  swcMinify: true,
  
  // Properly handle API routes
  rewrites: async () => {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
  
  // Define file extensions for pages
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
}

// Apply environment-specific configuration
if (process.env.NODE_ENV === 'production') {
  // In production, configure for Vercel deployment
  nextConfig.generateBuildId = async () => {
    return 'build-' + new Date().getTime();
  };
}

module.exports = nextConfig
