'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Button from '@/components/ui/Button';

export default function CustomersClientPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample customer data
  const customers = [
    { id: 1, code: 'CUST001', name: 'Greenleaf Distributors', contact: 'John Smith', email: 'john@greenleaf.com', phone: '(555) 123-4567', status: 'active', creditLimit: 10000 },
    { id: 2, code: 'CUST002', name: 'Herbal Solutions', contact: 'Jane Doe', email: 'jane@herbalsolutions.com', phone: '(555) 234-5678', status: 'active', creditLimit: 5000 },
    { id: 3, code: 'CUST003', name: 'Natural Wellness Co', contact: 'Robert Johnson', email: 'robert@naturalwellness.com', phone: '(555) 345-6789', status: 'inactive', creditLimit: 7500 },
    { id: 4, code: 'CUST004', name: 'Pure Hemp Collective', contact: 'Sarah Williams', email: 'sarah@purehempcollective.com', phone: '(555) 456-7890', status: 'active', creditLimit: 15000 },
    { id: 5, code: 'CUST005', name: 'Organic Remedies', contact: 'Michael Brown', email: 'michael@organicremedies.com', phone: '(555) 567-8901', status: 'pending', creditLimit: 2500 },
  ];
  
  // Filter customers based on search term and active tab
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         customer.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.contact.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'active' && customer.status === 'active') ||
                      (activeTab === 'inactive' && customer.status === 'inactive') ||
                      (activeTab === 'pending' && customer.status === 'pending');
    
    return matchesSearch && matchesTab;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customer Management</h1>
        <Button onClick={() => router.push('/dashboard-fixed/customers/new')}>Add New Customer</Button>
      </div>
      
      <div className="mb-6">
        <div className="flex border-b">
          <button
            className={`px-4 py-2 ${activeTab === 'all' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('all')}
          >
            All Customers
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'active' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('active')}
          >
            Active
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'inactive' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('inactive')}
          >
            Inactive
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'pending' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending
          </button>
        </div>
      </div>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name, code, or contact..."
          className="w-full md:w-1/2 p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Code</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Contact</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Phone</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Credit Limit</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map(customer => (
              <tr key={customer.id}>
                <td className="py-2 px-4 border-b">{customer.code}</td>
                <td className="py-2 px-4 border-b">{customer.name}</td>
                <td className="py-2 px-4 border-b">{customer.contact}</td>
                <td className="py-2 px-4 border-b">{customer.email}</td>
                <td className="py-2 px-4 border-b">{customer.phone}</td>
                <td className="py-2 px-4 border-b">
                  <span className={`px-2 py-1 rounded text-xs ${
                    customer.status === 'active' ? 'bg-green-100 text-green-800' :
                    customer.status === 'inactive' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                  </span>
                </td>
                <td className="py-2 px-4 border-b">${customer.creditLimit.toLocaleString()}</td>
                <td className="py-2 px-4 border-b">
                  <Button size="sm" onClick={() => router.push(`/dashboard-fixed/customers/${customer.id}`)}>View</Button>
                  <Button size="sm" className="ml-2" onClick={() => router.push(`/dashboard-fixed/customers/${customer.id}/edit`)}>Edit</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {filteredCustomers.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No customers found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
