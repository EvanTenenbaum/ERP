'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useVendors } from '../../../lib/hooks/useVendors';
import Button from '../../../components/ui/Button';
import { PlusIcon, SearchIcon, FilterIcon, ArrowDownIcon, ArrowUpIcon } from 'lucide-react';

export default function VendorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  
  const { 
    vendors, 
    loading, 
    error, 
    fetchVendors, 
    updateFilters, 
    clearFilters 
  } = useVendors();

  // Apply filters when search term or active tab changes
  useEffect(() => {
    const filters = {};
    
    if (searchTerm) {
      filters.search = searchTerm;
    }
    
    if (activeTab !== 'all') {
      filters.category = activeTab;
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

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Sort vendors
  const sortedVendors = [...vendors].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    // Handle nested properties
    if (sortField === 'address.city') {
      aValue = a.address?.city || '';
      bValue = b.address?.city || '';
    }
    
    // Handle null values
    if (aValue === null || aValue === undefined) aValue = '';
    if (bValue === null || bValue === undefined) bValue = '';
    
    // Sort strings
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    // Sort numbers
    return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
  });

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
        <h1 className="text-2xl font-bold">Vendor Management</h1>
        <Link href="/dashboard/vendors/new">
          <Button>
            <PlusIcon className="w-4 h-4 mr-2" />
            Add New Vendor
          </Button>
        </Link>
      </div>
      
      <div className="mb-6">
        <div className="flex border-b overflow-x-auto">
          <button
            className={`px-4 py-2 whitespace-nowrap ${activeTab === 'all' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('all')}
          >
            All Vendors
          </button>
          <button
            className={`px-4 py-2 whitespace-nowrap ${activeTab === 'Flower Producer' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('Flower Producer')}
          >
            Flower Producers
          </button>
          <button
            className={`px-4 py-2 whitespace-nowrap ${activeTab === 'Concentrate Producer' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('Concentrate Producer')}
          >
            Concentrate Producers
          </button>
          <button
            className={`px-4 py-2 whitespace-nowrap ${activeTab === 'Vape Producer' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('Vape Producer')}
          >
            Vape Producers
          </button>
          <button
            className={`px-4 py-2 whitespace-nowrap ${activeTab === 'Packaging Supplier' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('Packaging Supplier')}
          >
            Packaging Suppliers
          </button>
          <button
            className={`px-4 py-2 whitespace-nowrap ${activeTab === 'Other' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('Other')}
          >
            Other
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
            placeholder="Search by name, code, or contact info..."
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
                Payment Terms
              </label>
              <select
                name="paymentTerms"
                className="w-full p-2 border rounded"
              >
                <option value="">Any</option>
                <option value="net_15">Net 15</option>
                <option value="net_30">Net 30</option>
                <option value="net_45">Net 45</option>
                <option value="net_60">Net 60</option>
                <option value="due_on_receipt">Due on Receipt</option>
                <option value="cod">COD</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location (City)
              </label>
              <input
                type="text"
                name="city"
                className="w-full p-2 border rounded"
                placeholder="Filter by city"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="isActive"
                className="w-full p-2 border rounded"
              >
                <option value="">Any</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
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
                <th 
                  className="py-2 px-4 border-b cursor-pointer"
                  onClick={() => handleSort('code')}
                >
                  <div className="flex items-center">
                    Code
                    {sortField === 'code' && (
                      sortDirection === 'asc' ? 
                        <ArrowUpIcon className="w-4 h-4 ml-1" /> : 
                        <ArrowDownIcon className="w-4 h-4 ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  className="py-2 px-4 border-b cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Name
                    {sortField === 'name' && (
                      sortDirection === 'asc' ? 
                        <ArrowUpIcon className="w-4 h-4 ml-1" /> : 
                        <ArrowDownIcon className="w-4 h-4 ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  className="py-2 px-4 border-b cursor-pointer"
                  onClick={() => handleSort('category')}
                >
                  <div className="flex items-center">
                    Category
                    {sortField === 'category' && (
                      sortDirection === 'asc' ? 
                        <ArrowUpIcon className="w-4 h-4 ml-1" /> : 
                        <ArrowDownIcon className="w-4 h-4 ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  className="py-2 px-4 border-b cursor-pointer"
                  onClick={() => handleSort('contactName')}
                >
                  <div className="flex items-center">
                    Contact
                    {sortField === 'contactName' && (
                      sortDirection === 'asc' ? 
                        <ArrowUpIcon className="w-4 h-4 ml-1" /> : 
                        <ArrowDownIcon className="w-4 h-4 ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  className="py-2 px-4 border-b cursor-pointer"
                  onClick={() => handleSort('email')}
                >
                  <div className="flex items-center">
                    Email
                    {sortField === 'email' && (
                      sortDirection === 'asc' ? 
                        <ArrowUpIcon className="w-4 h-4 ml-1" /> : 
                        <ArrowDownIcon className="w-4 h-4 ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  className="py-2 px-4 border-b cursor-pointer"
                  onClick={() => handleSort('phone')}
                >
                  <div className="flex items-center">
                    Phone
                    {sortField === 'phone' && (
                      sortDirection === 'asc' ? 
                        <ArrowUpIcon className="w-4 h-4 ml-1" /> : 
                        <ArrowDownIcon className="w-4 h-4 ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  className="py-2 px-4 border-b cursor-pointer"
                  onClick={() => handleSort('address.city')}
                >
                  <div className="flex items-center">
                    City
                    {sortField === 'address.city' && (
                      sortDirection === 'asc' ? 
                        <ArrowUpIcon className="w-4 h-4 ml-1" /> : 
                        <ArrowDownIcon className="w-4 h-4 ml-1" />
                    )}
                  </div>
                </th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedVendors.map(vendor => (
                <tr key={vendor.id}>
                  <td className="py-2 px-4 border-b">{vendor.code}</td>
                  <td className="py-2 px-4 border-b">{vendor.name}</td>
                  <td className="py-2 px-4 border-b">{vendor.category}</td>
                  <td className="py-2 px-4 border-b">{vendor.contactName || 'N/A'}</td>
                  <td className="py-2 px-4 border-b">{vendor.email || 'N/A'}</td>
                  <td className="py-2 px-4 border-b">{vendor.phone || 'N/A'}</td>
                  <td className="py-2 px-4 border-b">{vendor.address?.city || 'N/A'}</td>
                  <td className="py-2 px-4 border-b">
                    <span className={`px-2 py-1 rounded text-xs ${
                      vendor.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {vendor.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b">
                    <Link href={`/dashboard/vendors/${vendor.id}`}>
                      <Button size="sm">View</Button>
                    </Link>
                    <Link href={`/dashboard/vendors/${vendor.id}/edit`}>
                      <Button size="sm" className="ml-2">Edit</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {sortedVendors.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No vendors found matching your criteria.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
