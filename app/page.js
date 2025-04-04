import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Multi-Tenant ERP System
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            A comprehensive solution for hemp flower wholesale brokerage businesses
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="card hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Inventory Management
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Track inventory across multiple locations with product images and detailed information.
            </p>
            <Link href="/dashboard/inventory" className="btn btn-primary inline-block">
              Explore Inventory
            </Link>
          </div>

          <div className="card hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Customer Management
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Manage customer information, track sales history, and monitor payment patterns.
            </p>
            <Link href="/dashboard/customers" className="btn btn-primary inline-block">
              View Customers
            </Link>
          </div>

          <div className="card hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Sales & Reporting
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Create invoices, manage sales, and generate comprehensive reports.
            </p>
            <Link href="/dashboard/reports" className="btn btn-primary inline-block">
              View Reports
            </Link>
          </div>
        </div>

        <div className="text-center">
          <Link href="/dashboard/dashboard" className="btn btn-secondary inline-block">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
