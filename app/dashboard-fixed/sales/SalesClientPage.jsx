'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Button from '@/components/ui/Button';

export default function SalesClientPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample sales data
  const sales = [
    { id: 1, orderNumber: 'ORD-001', customer: 'Greenleaf Distributors', date: '2025-04-15', total: 12500, status: 'completed' },
    { id: 2, orderNumber: 'ORD-002', customer: 'Herbal Solutions', date: '2025-04-18', total: 8750, status: 'pending' },
    { id: 3, orderNumber: 'ORD-003', customer: 'Natural Wellness Co', date: '2025-04-20', total: 15000, status: 'processing' },
    { id: 4, orderNumber: 'ORD-004', customer: 'Pure Hemp Collective', date: '2025-04-22', total: 9800, status: 'completed' },
    { id: 5, orderNumber: 'ORD-005', customer: 'Organic Remedies', date: '2025-04-25', total: 11200, status: 'pending' },
  ];
  
  // Filter sales based on search term and active tab
  const filteredSales = sales.filter(sale => {
    const matchesSearch = sale.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         sale.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'completed' && sale.status === 'completed') ||
                      (activeTab === 'pending' && sale.status === 'pending') ||
                      (activeTab === 'processing' && sale.status === 'processing');
    
    return matchesSearch && matchesTab;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sales Management</h1>
        <Button onClick={() => router.push('/dashboard-fixed/sales/new')}>Create New Sale</Button>
      </div>
      
      <div className="mb-6">
        <div className="flex border-b">
          <button
            className={`px-4 py-2 ${activeTab === 'all' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('all')}
          >
            All Sales
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'completed' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('completed')}
          >
            Completed
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'pending' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'processing' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('processing')}
          >
            Processing
          </button>
        </div>
      </div>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by order number or customer..."
          className="w-full md:w-1/2 p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Order #</th>
              <th className="py-2 px-4 border-b">Customer</th>
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">Total</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.map(sale => (
              <tr key={sale.id}>
                <td className="py-2 px-4 border-b">{sale.orderNumber}</td>
                <td className="py-2 px-4 border-b">{sale.customer}</td>
                <td className="py-2 px-4 border-b">{new Date(sale.date).toLocaleDateString()}</td>
                <td className="py-2 px-4 border-b">${sale.total.toLocaleString()}</td>
                <td className="py-2 px-4 border-b">
                  <span className={`px-2 py-1 rounded text-xs ${
                    sale.status === 'completed' ? 'bg-green-100 text-green-800' :
                    sale.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}
                  </span>
                </td>
                <td className="py-2 px-4 border-b">
                  <Button size="sm" onClick={() => router.push(`/dashboard-fixed/sales/${sale.id}`)}>View</Button>
                  <Button size="sm" className="ml-2" onClick={() => router.push(`/dashboard-fixed/sales/${sale.id}/edit`)}>Edit</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {filteredSales.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No sales found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
