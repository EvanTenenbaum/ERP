'use client';

import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">
                  Hemp ERP
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
              Multi-Tenant ERP System
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500 dark:text-gray-400">
              A comprehensive solution for hemp flower wholesale brokerage businesses
            </p>
          </div>
          
          <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Inventory Management</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Track inventory across multiple locations with product images and detailed information.
                </p>
                <div className="mt-4">
                  <Link href="/dashboard/inventory" className="btn btn-primary inline-block">
                    Explore Inventory
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow rounded-lg dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Customer Management</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Manage customer information, track sales history, and monitor payment patterns.
                </p>
                <div className="mt-4">
                  <Link href="/dashboard/customers" className="btn btn-primary inline-block">
                    View Customers
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow rounded-lg dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Sales & Reporting</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Create invoices, manage sales, and generate comprehensive reports.
                </p>
                <div className="mt-4">
                  <Link href="/dashboard/reports" className="btn btn-primary inline-block">
                    View Reports
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Link href="/dashboard" className="btn btn-secondary inline-flex items-center">
              Go to Dashboard
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </main>
      
      <footer className="bg-white shadow-sm dark:bg-gray-800 mt-auto">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Hemp ERP. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
