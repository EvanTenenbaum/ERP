'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useInventory } from '../../../lib/hooks/useInventory';
import Button from '../../../components/ui/Button';
import { PlusIcon, SearchIcon, FilterIcon, ArrowDownIcon, ArrowUpIcon } from 'lucide-react';

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  
  const { 
    products, 
    locations,
    loading, 
    error, 
    fetchProducts, 
    updateFilters, 
    clearFilters,
    lowInventoryProducts
  } = useInventory();

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
    
    // Handle price range
    if (filters.minPrice || filters.maxPrice) {
      filters.minPrice = filters.minPrice ? parseFloat(filters.minPrice) : 0;
      filters.maxPrice = filters.maxPrice ? parseFloat(filters.maxPrice) : 1000000;
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

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    // Handle nested properties
    if (sortField === 'vendorName' && a.vendorId && b.vendorId) {
      aValue = a.vendorName || '';
      bValue = b.vendorName || '';
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
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        <div className="flex gap-2">
          <Link href="/dashboard/inventory/add">
            <Button>
              <PlusIcon className="w-4 h-4 mr-2" />
              Add New Product
            </Button>
          </Link>
          <Link href="/dashboard/inventory/locations">
            <Button variant="secondary">
              Manage Locations
            </Button>
          </Link>
        </div>
      </div>
      
      {lowInventoryProducts.length > 0 && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-yellow-800 mb-2">Low Inventory Alert</h2>
          <p className="text-yellow-700 mb-2">
            {lowInventoryProducts.length} products are running low on inventory.
          </p>
          <div className="flex flex-wrap gap-2">
            {lowInventoryProducts.slice(0, 3).map(product => (
              <Link key={product.id} href={`/dashboard/inventory/${product.id}`}>
                <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                  {product.name}: {product.quantity} {product.unit}s left
                </span>
              </Link>
            ))}
            {lowInventoryProducts.length > 3 && (
              <Link href="/dashboard/inventory/low-stock">
                <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                  +{lowInventoryProducts.length - 3} more
                </span>
              </Link>
            )}
          </div>
        </div>
      )}
      
      <div className="mb-6">
        <div className="flex border-b overflow-x-auto">
          <button
            className={`px-4 py-2 whitespace-nowrap ${activeTab === 'all' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('all')}
          >
            All Products
          </button>
          <button
            className={`px-4 py-2 whitespace-nowrap ${activeTab === 'indoor' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('indoor')}
          >
            Indoor
          </button>
          <button
            className={`px-4 py-2 whitespace-nowrap ${activeTab === 'outdoor' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('outdoor')}
          >
            Outdoor
          </button>
          <button
            className={`px-4 py-2 whitespace-nowrap ${activeTab === 'light_dep' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('light_dep')}
          >
            Light Dep
          </button>
          <button
            className={`px-4 py-2 whitespace-nowrap ${activeTab === 'concentrate' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('concentrate')}
          >
            Concentrates
          </button>
          <button
            className={`px-4 py-2 whitespace-nowrap ${activeTab === 'vape' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('vape')}
          >
            Vapes
          </button>
          <button
            className={`px-4 py-2 whitespace-nowrap ${activeTab === 'other' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('other')}
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
            placeholder="Search by name, SKU, or description..."
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
                Price Range (Min)
              </label>
              <input
                type="number"
                name="minPrice"
                step="0.01"
                className="w-full p-2 border rounded"
                placeholder="Min price"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Range (Max)
              </label>
              <input
                type="number"
                name="maxPrice"
                step="0.01"
                className="w-full p-2 border rounded"
                placeholder="Max price"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Strain Type
              </label>
              <select
                name="strainType"
                className="w-full p-2 border rounded"
              >
                <option value="">Any</option>
                <option value="indica">Indica</option>
                <option value="sativa">Sativa</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vendor
              </label>
              <select
                name="vendorId"
                className="w-full p-2 border rounded"
              >
                <option value="">Any</option>
                {/* Vendor options would be populated here */}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <select
                name="locationId"
                className="w-full p-2 border rounded"
              >
                <option value="">Any</option>
                {locations.map(location => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
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
                  onClick={() => handleSort('sku')}
                >
                  <div className="flex items-center">
                    SKU
                    {sortField === 'sku' && (
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
                  onClick={() => handleSort('strainType')}
                >
                  <div className="flex items-center">
                    Strain Type
                    {sortField === 'strainType' && (
                      sortDirection === 'asc' ? 
                        <ArrowUpIcon className="w-4 h-4 ml-1" /> : 
                        <ArrowDownIcon className="w-4 h-4 ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  className="py-2 px-4 border-b cursor-pointer"
                  onClick={() => handleSort('price')}
                >
                  <div className="flex items-center">
                    Price
                    {sortField === 'price' && (
                      sortDirection === 'asc' ? 
                        <ArrowUpIcon className="w-4 h-4 ml-1" /> : 
                        <ArrowDownIcon className="w-4 h-4 ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  className="py-2 px-4 border-b cursor-pointer"
                  onClick={() => handleSort('quantity')}
                >
                  <div className="flex items-center">
                    Quantity
                    {sortField === 'quantity' && (
                      sortDirection === 'asc' ? 
                        <ArrowUpIcon className="w-4 h-4 ml-1" /> : 
                        <ArrowDownIcon className="w-4 h-4 ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  className="py-2 px-4 border-b cursor-pointer"
                  onClick={() => handleSort('vendorName')}
                >
                  <div className="flex items-center">
                    Vendor
                    {sortField === 'vendorName' && (
                      sortDirection === 'asc' ? 
                        <ArrowUpIcon className="w-4 h-4 ml-1" /> : 
                        <ArrowDownIcon className="w-4 h-4 ml-1" />
                    )}
                  </div>
                </th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedProducts.map(product => (
                <tr key={product.id}>
                  <td className="py-2 px-4 border-b">{product.sku}</td>
                  <td className="py-2 px-4 border-b">{product.name}</td>
                  <td className="py-2 px-4 border-b">
                    <span className={`px-2 py-1 rounded text-xs ${
                      product.category === 'indoor' ? 'bg-green-100 text-green-800' :
                      product.category === 'outdoor' ? 'bg-blue-100 text-blue-800' :
                      product.category === 'light_dep' ? 'bg-purple-100 text-purple-800' :
                      product.category === 'concentrate' ? 'bg-yellow-100 text-yellow-800' :
                      product.category === 'vape' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {product.category.charAt(0).toUpperCase() + product.category.slice(1).replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b">
                    {product.strainType ? (
                      <span className={`px-2 py-1 rounded text-xs ${
                        product.strainType === 'indica' ? 'bg-indigo-100 text-indigo-800' :
                        product.strainType === 'sativa' ? 'bg-orange-100 text-orange-800' :
                        'bg-teal-100 text-teal-800'
                      }`}>
                        {product.strainType.charAt(0).toUpperCase() + product.strainType.slice(1)}
                      </span>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>
                  <td className="py-2 px-4 border-b">${product.price?.toFixed(2) || '0.00'}</td>
                  <td className="py-2 px-4 border-b">
                    <span className={`${product.quantity < 10 ? 'text-red-600 font-semibold' : ''}`}>
                      {product.quantity || 0} {product.unit || 'units'}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b">{product.vendorName || 'N/A'}</td>
                  <td className="py-2 px-4 border-b">
                    <Link href={`/dashboard/inventory/${product.id}`}>
                      <Button size="sm">View</Button>
                    </Link>
                    <Link href={`/dashboard/inventory/${product.id}/edit`}>
                      <Button size="sm" className="ml-2">Edit</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {sortedProducts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No products found matching your criteria.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
