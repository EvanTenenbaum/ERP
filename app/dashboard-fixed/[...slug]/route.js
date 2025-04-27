// This file configures dynamic routes to be handled at runtime instead of build time
// Place in app/dashboard-fixed/[...slug]/route.js

export async function GET(request, { params }) {
  // This is a catch-all route handler that will prevent static generation
  // of dashboard routes during build time
  return new Response('Dynamic route handler', { status: 200 });
}

export const dynamic = 'force-dynamic';
