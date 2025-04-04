'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCustomers } from '../../../../lib/hooks/useCustomers';
import Button from '../../../../components/ui/Button';
import { ArrowLeftIcon, EditIcon, TrashIcon, AlertTriangleIcon } from 'lucide-react';

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const customerId = params.id;
  
  const [activeTab, setActiveTab] = useState('overview');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const { 
    selectedCustomer,
    loading,
    error,
    fetchCustomer,
    deleteCustomer,
    metrics,
    fetchCustomerMetrics,
    creditRecommendation,
    fetchCreditRecommendation
  } = useCustomers();

  // Fetch customer data on mount
  useEffect(() => {
    if (customerId) {
      fetchCustomer(customerId);
      fetchCustomerMetrics(customerId);
      fetchCreditRecommendation(customerId);
    }
  }, [customerId, fetchCustomer, fetchCustomerMetrics, fetchCreditRecommendation]);

  // Handle customer deletion
  const handleDelete = async () => {
    if (await deleteCustomer(customerId)) {
      router.push('/dashboard/customers');
    }
  };

  if (loading && !selectedCustomer) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
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

  if (!selectedCustomer) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Not Found:</strong>
          <span className="block sm:inline"> Customer not found</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <Link href="/dashboard/customers">
            <Button variant="ghost" className="mr-4">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Customers
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{selectedCustomer.name}</h1>
          <span className={`ml-4 px-2 py-1 rounded text-xs ${
            selectedCustomer.status === 'active' ? 'bg-green-100 text-green-800' :
            selectedCustomer.status === 'inactive' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {selectedCustomer.status.charAt(0).toUpperCase() + selectedCustomer.status.slice(1)}
          </span>
        </div>
        
        <div className="flex space-x-2">
          <Link href={`/dashboard/customers/${customerId}/edit`}>
            <Button>
              <EditIcon className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Button variant="danger" onClick={() => setShowDeleteConfirm(true)}>
            <TrashIcon className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
      
      {/* Customer Code */}
      <div className="bg-gray-100 px-4 py-2 rounded-lg mb-6">
        <p className="text-gray-600">Customer Code: <span className="font-semibold">{selectedCustomer.code}</span></p>
      </div>
      
      {/* Tabs */}
      <div className="mb-6">
        <div className="flex border-b">
          <button
            className={`px-4 py-2 ${activeTab === 'overview' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'metrics' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('metrics')}
          >
            Metrics & Analytics
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'orders' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </button>
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="bg-white shadow-md rounded-lg p-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
              <div className="space-y-3">
                <p><span className="font-medium">Contact Person:</span> {selectedCustomer.contact}</p>
                <p><span className="font-medium">Email:</span> {selectedCustomer.email}</p>
                <p><span className="font-medium">Phone:</span> {selectedCustomer.phone || 'N/A'}</p>
              </div>
              
              <h2 className="text-lg font-semibold mt-6 mb-4">Address</h2>
              <div className="space-y-1">
                {selectedCustomer.address?.street && <p>{selectedCustomer.address.street}</p>}
                {selectedCustomer.address?.city && selectedCustomer.address?.state && (
                  <p>{selectedCustomer.address.city}, {selectedCustomer.address.state} {selectedCustomer.address.zip}</p>
                )}
                {selectedCustomer.address?.country && <p>{selectedCustomer.address.country}</p>}
                {!selectedCustomer.address?.street && !selectedCustomer.address?.city && (
                  <p className="text-gray-500">No address provided</p>
                )}
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-4">Financial Information</h2>
              <div className="space-y-3">
                <p><span className="font-medium">Credit Limit:</span> ${selectedCustomer.creditLimit?.toLocaleString() || 0}</p>
                <p><span className="font-medium">Payment Terms:</span> {selectedCustomer.paymentTerms || 'N/A'}</p>
                
                {creditRecommendation && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <h3 className="font-medium text-blue-800">Credit Recommendation</h3>
                    <p className="text-blue-700 mt-1">
                      Recommended credit limit: ${creditRecommendation.recommendedCreditLimit.toLocaleString()}
                    </p>
                    {creditRecommendation.recommendedCreditLimit > selectedCustomer.creditLimit && (
                      <p className="text-green-700 text-sm mt-1">
                        Consider increasing credit limit by ${(creditRecommendation.recommendedCreditLimit - selectedCustomer.creditLimit).toLocaleString()}
                      </p>
                    )}
                    {creditRecommendation.recommendedCreditLimit < selectedCustomer.creditLimit && (
                      <p className="text-red-700 text-sm mt-1">
                        Consider decreasing credit limit by ${(selectedCustomer.creditLimit - creditRecommendation.recommendedCreditLimit).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
              
              <h2 className="text-lg font-semibold mt-6 mb-4">Additional Information</h2>
              <div className="space-y-3">
                <p><span className="font-medium">Notes:</span></p>
                <p className="text-gray-700">{selectedCustomer.notes || 'No notes provided'}</p>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'metrics' && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Customer Metrics</h2>
            
            {metrics ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">Total Sales</h3>
                  <p className="text-2xl font-bold">${metrics.metrics.totalSales.toLocaleString()}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">Order Count</h3>
                  <p className="text-2xl font-bold">{metrics.metrics.orderCount}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">Average Order Value</h3>
                  <p className="text-2xl font-bold">${metrics.metrics.averageOrderValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">Days Since Last Order</h3>
                  <p className="text-2xl font-bold">{metrics.metrics.daysSinceLastOrder !== null ? metrics.metrics.daysSinceLastOrder : 'N/A'}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">Payment Reliability</h3>
                  <p className="text-2xl font-bold">{(metrics.metrics.paymentReliability * 100).toFixed(0)}%</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No metrics available for this customer.</p>
              </div>
            )}
            
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">Payment Pattern</h2>
              
              {metrics && metrics.metrics.orderCount > 0 ? (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          metrics.metrics.paymentReliability > 0.8 ? 'bg-green-500' :
                          metrics.metrics.paymentReliability > 0.5 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${metrics.metrics.paymentReliability * 100}%` }}
                      ></div>
                    </div>
                    <span className="ml-4 text-sm font-medium">
                      {(metrics.metrics.paymentReliability * 100).toFixed(0)}%
                    </span>
                  </div>
                  
                  <p className="mt-2 text-sm text-gray-600">
                    {metrics.metrics.paymentReliability > 0.8 ? 
                      'Excellent payment reliability. Customer pays on time consistently.' :
                      metrics.metrics.paymentReliability > 0.5 ?
                      'Average payment reliability. Customer occasionally pays late.' :
                      'Poor payment reliability. Customer frequently pays late.'
                    }
                  </p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500">No payment history available for this customer.</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'orders' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Order History</h2>
              <Link href={`/dashboard/sales/new?customerId=${customerId}`}>
                <Button>New Order</Button>
              </Link>
            </div>
            
            {metrics && metrics.metrics.orderCount > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b">Order #</th>
                      <th className="py-2 px-4 border-b">Date</th>
                      <th className="py-2 px-4 border-b">Total</th>
                      <th className="py-2 px-4 border-b">Status</th>
                      <th className="py-2 px-4 border-b">Payment Status</th>
                      <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2 px-4 border-b text-center" colSpan="6">
                        <p className="text-gray-500">Order data will be populated when sales management is implemented.</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No orders found for this customer.</p>
                <Link href={`/dashboard/sales/new?customerId=${customerId}`}>
                  <Button className="mt-4">Create First Order</Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center text-red-600 mb-4">
              <AlertTriangleIcon className="w-6 h-6 mr-2" />
              <h3 className="text-lg font-semibold">Confirm Deletion</h3>
            </div>
            <p className="mb-6">
              Are you sure you want to delete customer <strong>{selectedCustomer.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Delete Customer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
