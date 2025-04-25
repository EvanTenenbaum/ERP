"use client";

import React from 'react';
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex space-x-2">
          <Link href="/dashboard/inventory" className="btn btn-primary">
            Inventory
          </Link>
          <Link href="/dashboard/customers" className="btn btn-primary">
            Customers
          </Link>
          <Link href="/dashboard/sales" className="btn btn-primary">
            Sales
          </Link>
          <Link href="/dashboard/reports" className="btn btn-primary">
            Reports
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white p-4 rounded shadow">
            <h3 className="text-gray-500 text-sm">{metric.title}</h3>
            <p className="text-2xl font-bold">{metric.value}</p>
            <p className={`text-sm ${metric.changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
              {metric.change} from last month
            </p>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="border-b pb-2">
                <p className="font-medium">{activity.action}</p>
                <p className="text-sm text-gray-600">{activity.item}</p>
                <p className="text-xs text-gray-400">{activity.time}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 text-right">
            <button className="text-blue-500 text-sm">View All Activity</button>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/dashboard/inventory/add" className="btn btn-secondary w-full">
              Add Inventory
            </Link>
            <Link href="/dashboard/customers/add" className="btn btn-secondary w-full">
              Add Customer
            </Link>
            <Link href="/dashboard/sales/create" className="btn btn-secondary w-full">
              Create Sale
            </Link>
            <Link href="/dashboard/reports/generate" className="btn btn-secondary w-full">
              Generate Report
            </Link>
          </div>
          
          <h2 className="text-xl font-semibold mt-6 mb-4">Inventory Alerts</h2>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 bg-red-50 rounded">
              <span>Low stock: OG Kush (5 units)</span>
              <button className="text-blue-500 text-sm">Restock</button>
            </div>
            <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
              <span>Pending verification: Blue Dream</span>
              <button className="text-blue-500 text-sm">Verify</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
