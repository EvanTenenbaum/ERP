// This file creates dynamic route exclusion patterns for Next.js static export
// to prevent NextRouter mounting errors during build

// Create a list of routes that should be excluded from static generation
// These are routes that use client-side components with router dependencies
const dynamicRoutes = [
  // Dashboard routes
  '/dashboard-fixed/**',
  '/dashboard-backup/**',
  
  // Auth routes that use searchParams
  '/auth/**',
  
  // Any other routes that use client-side router
  '/reports/**',
  '/customers/**',
  '/vendors/**',
  '/inventory/**',
  '/sales/**'
];

module.exports = { dynamicRoutes };
