'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import Link from 'next/link';
import Button from '../../../../components/ui/Button';

export default function DashboardClientPage() {
  const router = useRouter();
  
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
          <Button onClick={() => router.push('/dashboard-fixed/inventory')}>
            Inventory
          </Button>
          <Button onClick={() => router.push('/dashboard-fixed/customers')}>
            Customers
          </Button>
          <Button onClick={() => router.push('/dashboard-fixed/sales')}>
            Sales
          </Button>
          <Button onClick={() => router.push('/dashboard-fixed/reports')}>
            Reports
          </Button>
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
            <button className="text-blue-500 text-sm" onClick={() => router.push('/dashboard-fixed/activity')}>View All Activity</button>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={() => router.push('/dashboard-fixed/inventory/add')}>
              Add Inventory
            </Button>
            <Button onClick={() => router.push('/dashboard-fixed/customers/new')}>
              Add Customer
            </Button>
            <Button onClick={() => router.push('/dashboard-fixed/sales/new')}>
              Create Sale
            </Button>
            <Button onClick={() => router.push('/dashboard-fixed/reports')}>
              Generate Report
            </Button>
          </div>
          
          <h2 className="text-xl font-semibold mt-6 mb-4">Inventory Alerts</h2>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 bg-red-50 rounded">
              <span>Low stock: OG Kush (5 units)</span>
              <button className="text-blue-500 text-sm" onClick={() => router.push('/dashboard-fixed/inventory/restock')}>Restock</button>
            </div>
            <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
              <span>Pending verification: Blue Dream</span>
              <button className="text-blue-500 text-sm" onClick={() => router.push('/dashboard-fixed/inventory/verify')}>Verify</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
