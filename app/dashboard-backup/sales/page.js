'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSales } from '@/lib/hooks/useSales';
import { useCustomers } from '@/lib/hooks/useCustomers';
import Button from '../../../components/ui/Button';
import { PlusIcon, SearchIcon, FilterIcon, ArrowDownIcon, ArrowUpIcon } from 'lucide-react';

export default function SalesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  
  const { 
    sales, 
    loading, 
    error, 
    fetchSales, 
    updateFilters, 
    clearFilters 
  } = useSales();
  
  const { customers } = useCustomers();

  // Apply filters when search term or active tab changes
  useEffect(() => {
    const filters = {};
    
    if (searchTerm) {
      filters.search = searchTerm;
    }
    
    if (activeTab !== 'all') {
      if (activeTab === 'unpaid' || activeTab === 'partial' || activeTab === 'paid') {
        filters.paymentStatus = activeTab;
      } else {
        filters.status = activeTab;
      }
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
    
    // Handle date range
    if (filters.startDate && filters.endDate) {
      setDateRange({
        startDate: filters.startDate,
        endDate: filters.endDate
      });
    }
    
    updateFilters(filters);
    setShowFilters(false);
  };

  // Reset filters
  const handleResetFilters = () => {
    clearFilters();
    setSearchTerm('');
    setActiveTab('all');
    setDateRange({ startDate: '', endDate: '' });
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

  // Get customer name by ID
  const getCustomerName = (customerId) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? customer.name : 'Unknown Customer';
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Sort sales
  const sortedSales = [...sales].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    // Handle nested properties or computed values
    if (sortField === 'customerName') {
      aValue = getCustomerName(a.customerId);
      bValue = getCustomerName(b.customerId);
    }
    
    // Handle date sorting
    if (sortField === 'createdAt' || sortField === 'paymentDate') {
      aValue = aValue ? new Date(aValue).getTime() : 0;
      bValue = bValue ? new Date(bValue).getTime() : 0;
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
    
    // Sort numbers and dates
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
        <h1 className="text-2xl font-bold">Sales Management</h1>
        <Link href="/dashboard/sales/new">
          <Button>
            <PlusIcon className="w-4 h-4 mr-2" />
            Create New Order
          </Button>
        </Link>
      </div>
      
      <div className="mb-6">
        <div className="flex border-b overflow-x-auto">
          <button
            className={`px-4 py-2 whitespace-nowrap ${activeTab === 'all' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('all')}
          >
            All Orders
          </button>
          <button
            className={`px-4 py-2 whitespace-nowrap ${activeTab === 'pending' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending
          </button>
          <button
            className={`px-4 py-2 whitespace-nowrap ${activeTab === 'processing' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('processing')}
          >
            Processing
          </button>
          <button
            className={`px-4 py-2 whitespace-nowrap ${activeTab === 'shipped' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('shipped')}
          >
            Shipped
          </button>
          <button
            className={`px-4 py-2 whitespace-nowrap ${activeTab === 'delivered' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('delivered')}
          >
            Delivered
          </button>
          <button
            className={`px-4 py-2 whitespace-nowrap ${activeTab === 'cancelled' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('cancelled')}
          >
            Cancelled
          </button>
          <button
            className={`px-4 py-2 whitespace-nowrap ${activeTab === 'unpaid' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('unpaid')}
          >
            Unpaid
          </button>
          <button
            className={`px-4 py-2 whitespace-nowrap ${activeTab === 'partial' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('partial')}
          >
            Partially Paid
          </button>
          <button
            className={`px-4 py-2 whitespace-nowrap ${activeTab === 'paid' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('paid')}
          >
            Paid
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
            placeholder="Search by order number, customer name..."
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
                Customer
              </label>
              <select
                name="customerId"
                className="w-full p-2 border rounded"
              >
                <option value="">Any Customer</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} ({customer.code})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Method
              </label>
              <select
                name="paymentMethod"
                className="w-full p-2 border rounded"
              >
                <option value="">Any Method</option>
                <option value="credit_card">Credit Card</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="cash">Cash</option>
                <option value="check">Check</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Total
              </label>
              <input
                type="number"
                name="minTotal"
                step="0.01"
                className="w-full p-2 border rounded"
                placeholder="Min amount"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Total
              </label>
              <input
                type="number"
                name="maxTotal"
                step="0.01"
                className="w-full p-2 border rounded"
                placeholder="Max amount"
              />
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
                  onClick={() => handleSort('orderNumber')}
                >
                  <div className="flex items-center">
                    Order #
                    {sortField === 'orderNumber' && (
                      sortDirection === 'asc' ? 
                        <ArrowUpIcon className="w-4 h-4 ml-1" /> : 
                        <ArrowDownIcon className="w-4 h-4 ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  className="py-2 px-4 border-b cursor-pointer"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center">
                    Date
                    {sortField === 'createdAt' && (
                      sortDirection === 'asc' ? 
                        <ArrowUpIcon className="w-4 h-4 ml-1" /> : 
                        <ArrowDownIcon className="w-4 h-4 ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  className="py-2 px-4 border-b cursor-pointer"
                  onClick={() => handleSort('customerName')}
                >
                  <div className="flex items-center">
                    Customer
                    {sortField === 'customerName' && (
                      sortDirection === 'asc' ? 
                        <ArrowUpIcon className="w-4 h-4 ml-1" /> : 
                        <ArrowDownIcon className="w-4 h-4 ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  className="py-2 px-4 border-b cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center">
                    Status
                    {sortField === 'status' && (
                      sortDirection === 'asc' ? 
                        <ArrowUpIcon className="w-4 h-4 ml-1" /> : 
                        <ArrowDownIcon className="w-4 h-4 ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  className="py-2 px-4 border-b cursor-pointer"
                  onClick={() => handleSort('total')}
                >
                  <div className="flex items-center">
                    Total
                    {sortField === 'total' && (
                      sortDirection === 'asc' ? 
                        <ArrowUpIcon className="w-4 h-4 ml-1" /> : 
                        <ArrowDownIcon className="w-4 h-4 ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  className="py-2 px-4 border-b cursor-pointer"
                  onClick={() => handleSort('paymentStatus')}
                >
                  <div className="flex items-center">
                    Payment
                    {sortField === 'paymentStatus' && (
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
              {sortedSales.map(sale => (
                <tr key={sale.id}>
                  <td className="py-2 px-4 border-b">{sale.orderNumber}</td>
                  <td className="py-2 px-4 border-b">{formatDate(sale.createdAt)}</td>
                  <td className="py-2 px-4 border-b">{getCustomerName(sale.customerId)}</td>
                  <td className="py-2 px-4 border-b">
                    <span className={`px-2 py-1 rounded text-xs ${
                      sale.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      sale.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      sale.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                      sale.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b">${sale.total?.toFixed(2) || '0.00'}</td>
                  <td className="py-2 px-4 border-b">
                    <span className={`px-2 py-1 rounded text-xs ${
                      sale.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                      sale.paymentStatus === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {sale.paymentStatus === 'paid' ? 'Paid' :
                       sale.paymentStatus === 'partial' ? 'Partial' :
                       'Unpaid'}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b">
                    <Link href={`/dashboard/sales/${sale.id}`}>
                      <Button size="sm">View</Button>
                    </Link>
                    <Link href={`/dashboard/sales/${sale.id}/edit`}>
                      <Button size="sm" className="ml-2">Edit</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {sortedSales.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No orders found matching your criteria.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
