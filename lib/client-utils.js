import { useState } from 'react';

// This file configures Next.js to disable static generation for client components
// that use the router, preventing NextRouter mounting errors during build

import { useEffect } from 'react';
import { useRouter } from 'next/router';

// This component wraps client components to prevent static generation
export function NoSSR({ children, fallback = null }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return fallback;
  }
  
  return children;
}

// This is a utility to check if we're in a browser environment
export const isBrowser = typeof window !== 'undefined';

// This is a utility to check if we're in a static generation environment
export const isStaticGeneration = !isBrowser && process.env.NEXT_PHASE === 'phase-static-generation';

// Use this hook to safely access router in client components
export function useSafeRouter() {
  // Only create router in browser environment
  if (!isBrowser) {
    // Return mock router during static generation
    return {
      pathname: '/',
      query: {},
      asPath: '/',
      push: () => Promise.resolve(true),
      replace: () => Promise.resolve(true),
      reload: () => {},
      back: () => {},
      prefetch: () => Promise.resolve(),
      beforePopState: () => {},
      events: {
        on: () => {},
        off: () => {},
        emit: () => {},
      },
      isFallback: false,
    };
  }
  
  // Use actual router in browser
  return useRouter();
}

export default {
  NoSSR,
  useSafeRouter,
  isBrowser,
  isStaticGeneration,
};
