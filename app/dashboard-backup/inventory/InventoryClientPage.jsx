'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Button from '@/components/ui/Button';

export default function InventoryClientPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStrainType, setFilterStrainType] = useState('all');
  
  // Sample inventory data
  const inventoryItems = [
    { id: 1, name: 'Purple Haze', sku: 'VEN001-PH-001', category: 'indoor', strainType: 'sativa', quantity: 25, location: 'Warehouse A' },
    { id: 2, name: 'OG Kush', sku: 'VEN002-OGK-001', category: 'indoor', strainType: 'indica', quantity: 15, location: 'Warehouse B' },
    { id: 3, name: 'Blue Dream', sku: 'VEN001-BD-001', category: 'outdoor', strainType: 'hybrid', quantity: 30, location: 'Warehouse A' },
    { id: 4, name: 'Sour Diesel', sku: 'VEN003-SD-001', category: 'light dep', strainType: 'sativa', quantity: 20, location: 'Warehouse C' },
    { id: 5, name: 'Granddaddy Purple', sku: 'VEN002-GDP-001', category: 'indoor', strainType: 'indica', quantity: 10, location: 'Warehouse B' },
  ];
  
  // Filter inventory items based on search term and filters
  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesStrainType = filterStrainType === 'all' || item.strainType === filterStrainType;
    
    return matchesSearch && matchesCategory && matchesStrainType;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        <Button onClick={() => router.push('/dashboard-backup/inventory/add')}>Add New Item</Button>
      </div>
      
      <div className="mb-6">
        <div className="flex border-b">
          <button
            className={`px-4 py-2 ${activeTab === 'all' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('all')}
          >
            All Items
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'low' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('low')}
          >
            Low Stock
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'locations' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('locations')}
          >
            By Location
          </button>
        </div>
      </div>
      
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="col-span-1 md:col-span-2">
          <input
            type="text"
            placeholder="Search by name or SKU..."
            className="w-full p-2 border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <select 
            className="w-full p-2 border rounded"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="indoor">Indoor</option>
            <option value="outdoor">Outdoor</option>
            <option value="light dep">Light Dep</option>
            <option value="concentrate">Concentrate</option>
            <option value="vape">Vape</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <select 
            className="w-full p-2 border rounded"
            value={filterStrainType}
            onChange={(e) => setFilterStrainType(e.target.value)}
          >
            <option value="all">All Strain Types</option>
            <option value="indica">Indica</option>
            <option value="sativa">Sativa</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">SKU</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Category</th>
              <th className="py-2 px-4 border-b">Strain Type</th>
              <th className="py-2 px-4 border-b">Quantity</th>
              <th className="py-2 px-4 border-b">Location</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map(item => (
              <tr key={item.id}>
                <td className="py-2 px-4 border-b">{item.sku}</td>
                <td className="py-2 px-4 border-b">{item.name}</td>
                <td className="py-2 px-4 border-b capitalize">{item.category}</td>
                <td className="py-2 px-4 border-b capitalize">{item.strainType}</td>
                <td className="py-2 px-4 border-b">{item.quantity}</td>
                <td className="py-2 px-4 border-b">{item.location}</td>
                <td className="py-2 px-4 border-b">
                  <Button size="sm" onClick={() => router.push(`/dashboard-backup/inventory/${item.id}`)}>View</Button>
                  <Button size="sm" className="ml-2" onClick={() => router.push(`/dashboard-backup/inventory/${item.id}/edit`)}>Edit</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {filteredItems.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No inventory items found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
