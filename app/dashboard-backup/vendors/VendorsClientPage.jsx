'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Button from '@/components/ui/Button';

export default function VendorsClientPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample vendor data
  const vendors = [
    { id: 1, code: 'VEN001', name: 'Green Farms Co.', contact: 'Alice Green', email: 'alice@greenfarms.com', phone: '(555) 111-2222', status: 'active' },
    { id: 2, code: 'VEN002', name: 'Mountain Growers', contact: 'Bob Mountain', email: 'bob@mountaingrowers.com', phone: '(555) 222-3333', status: 'active' },
    { id: 3, code: 'VEN003', name: 'Organic Cultivators', contact: 'Carol Organic', email: 'carol@organiccultivators.com', phone: '(555) 333-4444', status: 'inactive' },
    { id: 4, code: 'VEN004', name: 'Hemp Valley Farms', contact: 'David Valley', email: 'david@hempvalley.com', phone: '(555) 444-5555', status: 'active' },
    { id: 5, code: 'VEN005', name: 'Sunshine Growers', contact: 'Emma Sun', email: 'emma@sunshinegrowers.com', phone: '(555) 555-6666', status: 'pending' },
  ];
  
  // Filter vendors based on search term and active tab
  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         vendor.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.contact.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'active' && vendor.status === 'active') ||
                      (activeTab === 'inactive' && vendor.status === 'inactive') ||
                      (activeTab === 'pending' && vendor.status === 'pending');
    
    return matchesSearch && matchesTab;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Vendor Management</h1>
        <Button onClick={() => router.push('/dashboard-backup/vendors/new')}>Add New Vendor</Button>
      </div>
      
      <div className="mb-6">
        <div className="flex border-b">
          <button
            className={`px-4 py-2 ${activeTab === 'all' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('all')}
          >
            All Vendors
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
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVendors.map(vendor => (
              <tr key={vendor.id}>
                <td className="py-2 px-4 border-b">{vendor.code}</td>
                <td className="py-2 px-4 border-b">{vendor.name}</td>
                <td className="py-2 px-4 border-b">{vendor.contact}</td>
                <td className="py-2 px-4 border-b">{vendor.email}</td>
                <td className="py-2 px-4 border-b">{vendor.phone}</td>
                <td className="py-2 px-4 border-b">
                  <span className={`px-2 py-1 rounded text-xs ${
                    vendor.status === 'active' ? 'bg-green-100 text-green-800' :
                    vendor.status === 'inactive' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                  </span>
                </td>
                <td className="py-2 px-4 border-b">
                  <Button size="sm" onClick={() => router.push(`/dashboard-backup/vendors/${vendor.id}`)}>View</Button>
                  <Button size="sm" className="ml-2" onClick={() => router.push(`/dashboard-backup/vendors/${vendor.id}/edit`)}>Edit</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {filteredVendors.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No vendors found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
