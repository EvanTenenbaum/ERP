'use client';

import React from 'react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Link from 'next/link';

export default function DashboardPage() {
  // Sample metrics data
  const metrics = [
    { title: 'Total Inventory', value: '152 SKUs', change: '+12%', changeType: 'positive' },
    { title: 'Active Customers', value: '38', change: '+5%', changeType: 'positive' },
    { title: 'Monthly Sales', value: '$124,500', change: '+8%', changeType: 'positive' },
    { title: 'Pending Orders', value: '12', change: '-3%', changeType: 'negative' },
  ];

  // Sample recent activities
  const recentActivities = [
    { id: 1, type: 'inventory', action: 'New inventory added', item: 'Purple Haze (VEN001-PH-001)', time: '2 hours ago' },
    { id: 2, type: 'sale', action: 'New sale completed', item: 'Order #1234 - Greenleaf Distributors', time: '4 hours ago' },
    { id: 3, type: 'customer', action: 'New customer added', item: 'Organic Remedies (CUST005)', time: '1 day ago' },
    { id: 4, type: 'payment', action: 'Payment received', item: 'Invoice #5678 - Herbal Solutions', time: '2 days ago' },
  ];

  return (
    <div>
      <PageHeader 
        title="Dashboard" 
        description="Overview of your hemp flower wholesale business"
        actions={
          <>
            <Button variant="outline" size="sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </Button>
            <Button variant="primary" size="sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Sale
            </Button>
          </>
        }
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map((metric, index) => (
          <Card key={index} className="h-full">
            <h3 className="text-gray-500 text-sm font-medium">{metric.title}</h3>
            <p className="text-2xl font-bold mt-2 mb-1">{metric.value}</p>
            <p className={`text-sm flex items-center ${metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
              {metric.changeType === 'positive' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
              {metric.change} from last month
            </p>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card title="Recent Activity" className="h-full">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      {activity.type === 'inventory' && (
                        <Badge variant="primary" size="sm">Inventory</Badge>
                      )}
                      {activity.type === 'sale' && (
                        <Badge variant="success" size="sm">Sale</Badge>
                      )}
                      {activity.type === 'customer' && (
                        <Badge variant="info" size="sm">Customer</Badge>
                      )}
                      {activity.type === 'payment' && (
                        <Badge variant="warning" size="sm">Payment</Badge>
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900 dark:text-white">{activity.action}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{activity.item}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-right">
              <Button variant="link" size="sm">View All Activity</Button>
            </div>
          </Card>
        </div>
        
        <div>
          <Card title="Quick Actions" className="mb-6">
            <div className="grid grid-cols-1 gap-3">
              <Link href="/dashboard/inventory/add" className="w-full">
                <Button className="w-full justify-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Inventory
                </Button>
              </Link>
              <Link href="/dashboard/customers/new" className="w-full">
                <Button className="w-full justify-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Add Customer
                </Button>
              </Link>
              <Link href="/dashboard/sales/new" className="w-full">
                <Button className="w-full justify-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Create Sale
                </Button>
              </Link>
              <Link href="/dashboard/reports" className="w-full">
                <Button className="w-full justify-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Generate Report
                </Button>
              </Link>
            </div>
          </Card>
          
          <Card title="Inventory Alerts">
            <div className="space-y-3">
              <div className="p-3 bg-red-50 dark:bg-red-900/30 rounded-md">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-red-800 dark:text-red-300">Low stock: OG Kush</p>
                    <p className="text-sm text-red-600 dark:text-red-400">5 units remaining</p>
                  </div>
                  <Button variant="outline" size="sm">Restock</Button>
                </div>
              </div>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-md">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-yellow-800 dark:text-yellow-300">Pending verification</p>
                    <p className="text-sm text-yellow-600 dark:text-yellow-400">Blue Dream (VEN003-BD-002)</p>
                  </div>
                  <Button variant="outline" size="sm">Verify</Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
