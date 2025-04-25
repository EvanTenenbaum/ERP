'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import Link from 'next/link';
import { ArrowUpIcon, ArrowDownIcon, AlertTriangleIcon, PackageIcon, UsersIcon, DollarSignIcon, TruckIcon } from 'lucide-react';
import Button from '../../components/ui/Button';

// Chart color palette
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function DashboardPage() {
  const { isInitialized, generateDashboardData } = useApp();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!isInitialized) return;
      
      try {
        setLoading(true);
        const data = await generateDashboardData();
        setDashboardData(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadDashboardData();
  }, [isInitialized, generateDashboardData]);

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Loading:</strong>
          <span className="block sm:inline"> Initializing dashboard data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-600 text-sm font-medium">Customers</p>
              <p className="text-3xl font-bold mt-1">{dashboardData.counts.customers}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <UsersIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <Link href="/dashboard/customers">
            <p className="text-blue-600 text-sm mt-4 hover:underline">View all customers</p>
          </Link>
        </div>
        
        <div className="bg-green-50 p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-green-600 text-sm font-medium">Products</p>
              <p className="text-3xl font-bold mt-1">{dashboardData.counts.products}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <PackageIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <Link href="/dashboard/inventory">
            <p className="text-green-600 text-sm mt-4 hover:underline">View all products</p>
          </Link>
        </div>
        
        <div className="bg-purple-50 p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-purple-600 text-sm font-medium">Sales</p>
              <p className="text-3xl font-bold mt-1">{dashboardData.counts.sales}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <DollarSignIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <Link href="/dashboard/sales">
            <p className="text-purple-600 text-sm mt-4 hover:underline">View all sales</p>
          </Link>
        </div>
        
        <div className="bg-orange-50 p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-orange-600 text-sm font-medium">Vendors</p>
              <p className="text-3xl font-bold mt-1">{dashboardData.counts.vendors}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <TruckIcon className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <Link href="/dashboard/vendors">
            <p className="text-orange-600 text-sm mt-4 hover:underline">View all vendors</p>
          </Link>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Sales Trend</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={dashboardData.salesReport?.salesByPeriod ? Object.values(dashboardData.salesReport.salesByPeriod) : []}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Line type="monotone" dataKey="total" name="Sales" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Revenue vs. Cost</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dashboardData.financialReport?.financialsByPeriod || []}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="revenue" name="Revenue" fill="#8884d8" />
                <Bar dataKey="cost" name="Cost" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Top Products</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dashboardData.salesReport?.topProducts || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="revenue"
                  nameKey="productName"
                >
                  {(dashboardData.salesReport?.topProducts || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Top Customers</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dashboardData.salesReport?.topCustomers || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="revenue"
                  nameKey="customerName"
                >
                  {(dashboardData.salesReport?.topCustomers || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Alerts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Low Stock Alerts</h2>
            <Link href="/dashboard/inventory">
              <Button size="sm">View All</Button>
            </Link>
          </div>
          
          {dashboardData.lowStockProducts && dashboardData.lowStockProducts.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.lowStockProducts.slice(0, 5).map((product, index) => (
                <div key={index} className="flex items-center p-3 bg-red-50 rounded-lg">
                  <AlertTriangleIcon className="w-5 h-5 text-red-500 mr-3" />
                  <div className="flex-1">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-600">
                      Current Stock: <span className="font-medium text-red-600">{product.quantity}</span> / 
                      Reorder Point: <span className="font-medium">{product.reorderPoint}</span>
                    </p>
                  </div>
                  <Link href={`/dashboard/inventory/${product.id}`}>
                    <Button size="sm" variant="secondary">View</Button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-6 text-gray-500">No low stock alerts at this time.</p>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Sales</h2>
            <Link href="/dashboard/sales">
              <Button size="sm">View All</Button>
            </Link>
          </div>
          
          {dashboardData.recentSales && dashboardData.recentSales.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.recentSales.map((sale, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{sale.customerName}</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(sale.createdAt)} • {sale.saleNumber} • {formatCurrency(sale.total)}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className={`px-2 py-1 rounded text-xs mr-3 ${
                      sale.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                      sale.paymentStatus === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {sale.paymentStatus === 'paid' ? 'Paid' :
                       sale.paymentStatus === 'partial' ? 'Partial' :
                       'Unpaid'}
                    </span>
                    <Link href={`/dashboard/sales/${sale.id}`}>
                      <Button size="sm" variant="secondary">View</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-6 text-gray-500">No recent sales to display.</p>
          )}
        </div>
      </div>
      
      {/* Upcoming Payments */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Upcoming Vendor Payments</h2>
          <Link href="/dashboard/vendors">
            <Button size="sm">View All Vendors</Button>
          </Link>
        </div>
        
        {dashboardData.upcomingPayments && dashboardData.upcomingPayments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Vendor</th>
                  <th className="py-2 px-4 border-b">Payment Date</th>
                  <th className="py-2 px-4 border-b">Amount</th>
                  <th className="py-2 px-4 border-b">Reference</th>
                  <th className="py-2 px-4 border-b">Status</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.upcomingPayments.map((payment, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border-b">{payment.vendorName}</td>
                    <td className="py-2 px-4 border-b">{formatDate(payment.paymentDate)}</td>
                    <td className="py-2 px-4 border-b">{formatCurrency(payment.amount)}</td>
                    <td className="py-2 px-4 border-b">{payment.reference || 'N/A'}</td>
                    <td className="py-2 px-4 border-b">
                      <span className={`px-2 py-1 rounded text-xs ${
                        payment.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                        payment.status === 'paid' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b">
                      <Link href={`/dashboard/vendors/${payment.vendorId}`}>
                        <Button size="sm">View Vendor</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center py-6 text-gray-500">No upcoming payments scheduled.</p>
        )}
      </div>
    </div>
  );
}
