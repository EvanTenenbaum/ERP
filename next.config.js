/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  images: {
    domains: ['localhost', 'vercel.app'],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    // Removing serverActions as it's now available by default
  },
  // Use basePath to handle the dashboard route group
  basePath: '',
  // Use custom route configuration
  async redirects() {
    return [
      {
        source: '/inventory',
        destination: '/%7Bdashboard%7D/inventory',
        permanent: true,
      },
      {
        source: '/inventory/:path*',
        destination: '/%7Bdashboard%7D/inventory/:path*',
        permanent: true,
      },
      {
        source: '/customers',
        destination: '/%7Bdashboard%7D/customers',
        permanent: true,
      },
      {
        source: '/customers/:path*',
        destination: '/%7Bdashboard%7D/customers/:path*',
        permanent: true,
      },
      {
        source: '/reports',
        destination: '/%7Bdashboard%7D/reports',
        permanent: true,
      },
      {
        source: '/sales',
        destination: '/%7Bdashboard%7D/sales',
        permanent: true,
      },
      {
        source: '/sales/:path*',
        destination: '/%7Bdashboard%7D/sales/:path*',
        permanent: true,
      },
      {
        source: '/vendors',
        destination: '/%7Bdashboard%7D/vendors',
        permanent: true,
      },
      {
        source: '/vendors/:path*',
        destination: '/%7Bdashboard%7D/vendors/:path*',
        permanent: true,
      },
      {
        source: '/dashboard',
        destination: '/%7Bdashboard%7D',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
