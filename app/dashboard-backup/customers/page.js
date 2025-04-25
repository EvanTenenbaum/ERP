'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCustomers } from '@/lib/hooks/useCustomers';
import Button from '../../../components/ui/Button';
import { PlusIcon, SearchIcon, FilterIcon } from 'lucide-react';

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  const { 
    customers, 
    loading, 
    error, 
    fetchCustomers, 
    updateFilters, 
    clearFilters 
  } = useCustomers();

  // Apply filters when search term or active tab changes
  useEffect(() => {
    const filters = {};
    
    if (searchTerm) {
      filters.search = searchTerm;
    }
    
    if (activeTab !== 'all') {
      filters.status = activeTab;
    }
    
    updateFilters(filters);
  }, [searchTerm, activeTab, updateFilters]);

  // Handle filter form submission
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const filters = {};
    
    for (const [key, value] of formData.entries()) {
      if (value) {
        filters[key] = value;
      }
    }
    
    updateFilters(filters);
    setShowFilters(false);
  };

  // Reset filters
  const handleResetFilters = () => {
    clearFilters();
    setSearchTerm('');
    setActiveTab('all');
    setShowFilters(false);
  };

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customer Management</h1>
        <Link href="/dashboard/customers/new">
          <Button>
            <PlusIcon className="w-4 h-4 mr-2" />
            Add New Customer
          </Button>
        </Link>
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
      
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative w-full md:w-1/2">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <SearchIcon className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name, code, or contact..."
            className="w-full pl-10 p-2 border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="secondary" 
            onClick={() => setShowFilters(!showFilters)}
          >
            <FilterIcon className="w-4 h-4 mr-2" />
            Filters
          </Button>
          
          <Button 
            variant="secondary" 
            onClick={handleResetFilters}
          >
            Clear Filters
          </Button>
        </div>
      </div>
      
      {showFilters && (
        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-3">Advanced Filters</h3>
          <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Credit Limit Above
              </label>
              <input
                type="number"
                name="creditLimitMin"
                className="w-full p-2 border rounded"
                placeholder="Min credit limit"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Credit Limit Below
              </label>
              <input
                type="number"
                name="creditLimitMax"
                className="w-full p-2 border rounded"
                placeholder="Max credit limit"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Terms
              </label>
              <select
                name="paymentTerms"
                className="w-full p-2 border rounded"
              >
                <option value="">Any</option>
                <option value="Net 15">Net 15</option>
                <option value="Net 30">Net 30</option>
                <option value="Net 45">Net 45</option>
                <option value="Net 60">Net 60</option>
                <option value="Due on Receipt">Due on Receipt</option>
              </select>
            </div>
            
            <div className="md:col-span-3 flex justify-end gap-2">
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => setShowFilters(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                Apply Filters
              </Button>
            </div>
          </form>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      ) : (
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
              {customers.map(customer => (
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
                  <td className="py-2 px-4 border-b">${customer.creditLimit?.toLocaleString() || 0}</td>
                  <td className="py-2 px-4 border-b">
                    <Link href={`/dashboard/customers/${customer.id}`}>
                      <Button size="sm">View</Button>
                    </Link>
                    <Link href={`/dashboard/customers/${customer.id}/edit`}>
                      <Button size="sm" className="ml-2">Edit</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {customers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No customers found matching your criteria.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
