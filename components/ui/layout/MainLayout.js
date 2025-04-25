'use client';

import React from 'react';
import Header from './Header';
import Footer from './Footer';

/**
 * Main layout component that wraps all pages with consistent header and footer
 */
export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-grow py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
