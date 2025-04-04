'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useVendors } from '../../../../lib/hooks/useVendors';
import Button from '../../../../components/ui/Button';
import { ArrowLeftIcon, EditIcon, TrashIcon, PlusIcon, MessageSquareIcon, AlertTriangleIcon } from 'lucide-react';

export default function VendorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const vendorId = params.id;
  
  const [activeTab, setActiveTab] = useState('overview');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCommunicationModal, setShowCommunicationModal] = useState(false);
  const [communicationData, setCommunicationData] = useState({
    type: 'email',
    direction: 'outgoing',
    subject: '',
    content: '',
    timestamp: new Date().toISOString()
  });
  
  const { 
    selectedVendor,
    purchaseOrders,
    communicationLogs,
    performanceMetrics,
    paymentSchedules,
    loading,
    error,
    fetchVendor,
    deleteVendor,
    fetchVendorPurchaseOrders,
    fetchVendorCommunicationLogs,
    addVendorCommunicationLog,
    calculateVendorPerformance,
    fetchVendorPaymentSchedules
  } = useVendors();

  // Fetch vendor data and related information on mount
  useEffect(() => {
    if (vendorId) {
      fetchVendor(vendorId);
      fetchVendorPurchaseOrders(vendorId);
      fetchVendorCommunicationLogs(vendorId);
      calculateVendorPerformance(vendorId);
      fetchVendorPaymentSchedules(vendorId);
    }
  }, [vendorId, fetchVendor, fetchVendorPurchaseOrders, fetchVendorCommunicationLogs, calculateVendorPerformance, fetchVendorPaymentSchedules]);

  // Handle vendor deletion
  const handleDelete = async () => {
    if (await deleteVendor(vendorId)) {
      router.push('/dashboard/vendors');
    }
  };

  // Handle communication log addition
  const handleAddCommunication = async (e) => {
    e.preventDefault();
    
    try {
      await addVendorCommunicationLog(vendorId, communicationData);
      setShowCommunicationModal(false);
      setCommunicationData({
        type: 'email',
        direction: 'outgoing',
        subject: '',
        content: '',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error adding communication log:', error);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Format payment terms
  const formatPaymentTerms = (terms) => {
    if (!terms) return 'Not specified';
    
    return terms
      .replace('_', ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading && !selectedVendor) {
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

  if (!selectedVendor) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Not Found:</strong>
          <span className="block sm:inline"> Vendor not found</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <Link href="/dashboard/vendors">
            <Button variant="ghost" className="mr-4">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Vendors
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{selectedVendor.name}</h1>
          <span className={`ml-4 px-2 py-1 rounded text-xs ${
            selectedVendor.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {selectedVendor.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
        
        <div className="flex space-x-2">
          <Link href={`/dashboard/purchase-orders/new?vendorId=${vendorId}`}>
            <Button>
              <PlusIcon className="w-4 h-4 mr-2" />
              New Purchase Order
            </Button>
          </Link>
          <Button 
            variant="secondary"
            onClick={() => setShowCommunicationModal(true)}
          >
            <MessageSquareIcon className="w-4 h-4 mr-2" />
            Log Communication
          </Button>
          <Link href={`/dashboard/vendors/${vendorId}/edit`}>
            <Button variant="secondary">
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
      
      {/* Vendor Code */}
      <div className="bg-gray-100 px-4 py-2 rounded-lg mb-6">
        <p className="text-gray-600">Vendor Code: <span className="font-semibold">{selectedVendor.code}</span></p>
      </div>
      
      {/* Tabs */}
      <div className="mb-6">
        <div className="flex border-b overflow-x-auto">
          <button
            className={`px-4 py-2 whitespace-nowrap ${activeTab === 'overview' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`px-4 py-2 whitespace-nowrap ${activeTab === 'purchase_orders' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('purchase_orders')}
          >
            Purchase Orders
          </button>
          <button
            className={`px-4 py-2 whitespace-nowrap ${activeTab === 'communication' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('communication')}
          >
            Communication
          </button>
          <button
            className={`px-4 py-2 whitespace-nowrap ${activeTab === 'performance' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('performance')}
          >
            Performance
          </button>
          <button
            className={`px-4 py-2 whitespace-nowrap ${activeTab === 'payments' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('payments')}
          >
            Payments
          </button>
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="bg-white shadow-md rounded-lg p-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Vendor Details</h2>
              <div className="space-y-3">
                <p><span className="font-medium">Name:</span> {selectedVendor.name}</p>
                <p><span className="font-medium">Code:</span> {selectedVendor.code}</p>
                <p><span className="font-medium">Category:</span> {selectedVendor.category}</p>
                <p><span className="font-medium">Contact Name:</span> {selectedVendor.contactName || 'N/A'}</p>
                <p><span className="font-medium">Email:</span> {selectedVendor.email || 'N/A'}</p>
                <p><span className="font-medium">Phone:</span> {selectedVendor.phone || 'N/A'}</p>
                <p><span className="font-medium">Website:</span> {selectedVendor.website ? <a href={selectedVendor.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{selectedVendor.website}</a> : 'N/A'}</p>
                <p><span className="font-medium">Status:</span> {selectedVendor.isActive ? 'Active' : 'Inactive'}</p>
              </div>
              
              <h2 className="text-lg font-semibold mt-6 mb-4">Address</h2>
              <div className="space-y-1">
                {selectedVendor.address ? (
                  <>
                    <p>{selectedVendor.address.street || ''}</p>
                    <p>
                      {selectedVendor.address.city || ''}{selectedVendor.address.city && selectedVendor.address.state ? ', ' : ''}
                      {selectedVendor.address.state || ''}
                    </p>
                    <p>{selectedVendor.address.zip || ''}</p>
                    <p>{selectedVendor.address.country || ''}</p>
                  </>
                ) : (
                  <p className="text-gray-500">No address provided</p>
                )}
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-4">Payment Information</h2>
              <div className="space-y-3">
                <p><span className="font-medium">Payment Terms:</span> {formatPaymentTerms(selectedVendor.paymentTerms)}</p>
                <p><span className="font-medium">Tax ID / EIN:</span> {selectedVendor.taxId || 'N/A'}</p>
              </div>
              
              <h2 className="text-lg font-semibold mt-6 mb-4">Performance Summary</h2>
              {performanceMetrics ? (
                <div className="space-y-3">
                  <p><span className="font-medium">Total Orders:</span> {performanceMetrics.totalOrders}</p>
                  <p><span className="font-medium">Total Spent:</span> ${performanceMetrics.totalSpent?.toFixed(2) || '0.00'}</p>
                  <p><span className="font-medium">On-Time Delivery Rate:</span> {performanceMetrics.onTimeDeliveryRate?.toFixed(1) || '0'}%</p>
                  <p><span className="font-medium">Order Fulfillment Rate:</span> {performanceMetrics.orderFulfillmentRate?.toFixed(1) || '0'}%</p>
                  <p><span className="font-medium">Quality Issue Rate:</span> {performanceMetrics.qualityIssueRate?.toFixed(1) || '0'}%</p>
                  {performanceMetrics.lastOrderDate && (
                    <p><span className="font-medium">Last Order Date:</span> {formatDate(performanceMetrics.lastOrderDate)}</p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">No performance data available</p>
              )}
              
              <h2 className="text-lg font-semibold mt-6 mb-4">Notes</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">{selectedVendor.notes || 'No notes provided'}</p>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'purchase_orders' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Purchase Orders</h2>
              <Link href={`/dashboard/purchase-orders/new?vendorId=${vendorId}`}>
                <Button>
                  <PlusIcon className="w-4 h-4 mr-2" />
                  New Purchase Order
                </Button>
              </Link>
            </div>
            
            {purchaseOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b">PO Number</th>
                      <th className="py-2 px-4 border-b">Date</th>
                      <th className="py-2 px-4 border-b">Status</th>
                      <th className="py-2 px-4 border-b">Total</th>
                      <th className="py-2 px-4 border-b">Payment Status</th>
                      <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchaseOrders.map(po => (
                      <tr key={po.id}>
                        <td className="py-2 px-4 border-b">{po.poNumber}</td>
                        <td className="py-2 px-4 border-b">{formatDate(po.createdAt)}</td>
                        <td className="py-2 px-4 border-b">
                          <span className={`px-2 py-1 rounded text-xs ${
                            po.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            po.status === 'ordered' ? 'bg-blue-100 text-blue-800' :
                            po.status === 'partial' ? 'bg-purple-100 text-purple-800' :
                            po.status === 'received' ? 'bg-green-100 text-green-800' :
                            po.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {po.status.charAt(0).toUpperCase() + po.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-2 px-4 border-b">${po.total?.toFixed(2) || '0.00'}</td>
                        <td className="py-2 px-4 border-b">
                          <span className={`px-2 py-1 rounded text-xs ${
                            po.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                            po.paymentStatus === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {po.paymentStatus === 'paid' ? 'Paid' :
                             po.paymentStatus === 'partial' ? 'Partial' :
                             'Unpaid'}
                          </span>
                        </td>
                        <td className="py-2 px-4 border-b">
                          <Link href={`/dashboard/purchase-orders/${po.id}`}>
                            <Button size="sm">View</Button>
                          </Link>
                          <Link href={`/dashboard/purchase-orders/${po.id}/edit`}>
                            <Button size="sm" className="ml-2">Edit</Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No purchase orders found for this vendor.</p>
                <Link href={`/dashboard/purchase-orders/new?vendorId=${vendorId}`}>
                  <Button className="mt-4">
                    Create First Purchase Order
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'communication' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Communication History</h2>
              <Button onClick={() => setShowCommunicationModal(true)}>
                <MessageSquareIcon className="w-4 h-4 mr-2" />
                Log Communication
              </Button>
            </div>
            
            {communicationLogs.length > 0 ? (
              <div className="space-y-4">
                {communicationLogs.map((log, index) => (
                  <div key={index} className={`p-4 rounded-lg ${
                    log.direction === 'incoming' ? 'bg-blue-50 border-l-4 border-blue-400' : 'bg-gray-50 border-l-4 border-gray-400'
                  }`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className={`px-2 py-1 rounded text-xs mr-2 ${
                          log.direction === 'incoming' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {log.direction === 'incoming' ? 'Received' : 'Sent'}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          log.type === 'email' ? 'bg-purple-100 text-purple-800' :
                          log.type === 'phone' ? 'bg-green-100 text-green-800' :
                          log.type === 'meeting' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {log.type.charAt(0).toUpperCase() + log.type.slice(1)}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">{formatDate(log.timestamp)}</span>
                    </div>
                    
                    {log.subject && (
                      <h3 className="font-medium mt-2">{log.subject}</h3>
                    )}
                    
                    <p className="mt-2 text-gray-700">{log.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No communication logs found for this vendor.</p>
                <Button 
                  className="mt-4"
                  onClick={() => setShowCommunicationModal(true)}
                >
                  Add First Communication Log
                </Button>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'performance' && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Vendor Performance</h2>
            
            {performanceMetrics ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-md font-medium mb-3">Order Statistics</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-3">
                      <p><span className="font-medium">Total Orders:</span> {performanceMetrics.totalOrders}</p>
                      <p><span className="font-medium">Total Spent:</span> ${performanceMetrics.totalSpent?.toFixed(2) || '0.00'}</p>
                      {performanceMetrics.lastOrderDate && (
                        <p><span className="font-medium">Last Order Date:</span> {formatDate(performanceMetrics.lastOrderDate)}</p>
                      )}
                    </div>
                  </div>
                  
                  <h3 className="text-md font-medium mt-6 mb-3">Quality Metrics</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-3">
                      <div>
                        <p className="mb-1"><span className="font-medium">Quality Issue Rate:</span> {performanceMetrics.qualityIssueRate?.toFixed(1) || '0'}%</p>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${
                              performanceMetrics.qualityIssueRate <= 5 ? 'bg-green-600' :
                              performanceMetrics.qualityIssueRate <= 15 ? 'bg-yellow-600' :
                              'bg-red-600'
                            }`} 
                            style={{ width: `${Math.min(performanceMetrics.qualityIssueRate || 0, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-3">Delivery Performance</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-3">
                      <div>
                        <p className="mb-1"><span className="font-medium">On-Time Delivery Rate:</span> {performanceMetrics.onTimeDeliveryRate?.toFixed(1) || '0'}%</p>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${
                              performanceMetrics.onTimeDeliveryRate >= 90 ? 'bg-green-600' :
                              performanceMetrics.onTimeDeliveryRate >= 75 ? 'bg-yellow-600' :
                              'bg-red-600'
                            }`} 
                            style={{ width: `${performanceMetrics.onTimeDeliveryRate || 0}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <p className="mb-1"><span className="font-medium">Order Fulfillment Rate:</span> {performanceMetrics.orderFulfillmentRate?.toFixed(1) || '0'}%</p>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${
                              performanceMetrics.orderFulfillmentRate >= 90 ? 'bg-green-600' :
                              performanceMetrics.orderFulfillmentRate >= 75 ? 'bg-yellow-600' :
                              'bg-red-600'
                            }`} 
                            style={{ width: `${performanceMetrics.orderFulfillmentRate || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-md font-medium mt-6 mb-3">Response Time</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    {performanceMetrics.averageResponseTimeHours ? (
                      <p><span className="font-medium">Average Response Time:</span> {performanceMetrics.averageResponseTimeHours.toFixed(1)} hours</p>
                    ) : (
                      <p className="text-gray-500">No response time data available</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No performance data available for this vendor.</p>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'payments' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Payment Schedules</h2>
              <Link href={`/dashboard/vendors/${vendorId}/schedule-payment`}>
                <Button>
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Schedule Payment
                </Button>
              </Link>
            </div>
            
            {paymentSchedules.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b">Payment Date</th>
                      <th className="py-2 px-4 border-b">Amount</th>
                      <th className="py-2 px-4 border-b">Status</th>
                      <th className="py-2 px-4 border-b">Reference</th>
                      <th className="py-2 px-4 border-b">Notes</th>
                      <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentSchedules.map(payment => (
                      <tr key={payment.id}>
                        <td className="py-2 px-4 border-b">{formatDate(payment.paymentDate)}</td>
                        <td className="py-2 px-4 border-b">${payment.amount?.toFixed(2) || '0.00'}</td>
                        <td className="py-2 px-4 border-b">
                          <span className={`px-2 py-1 rounded text-xs ${
                            payment.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                            payment.status === 'paid' ? 'bg-green-100 text-green-800' :
                            payment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-2 px-4 border-b">{payment.reference || 'N/A'}</td>
                        <td className="py-2 px-4 border-b">{payment.notes || 'N/A'}</td>
                        <td className="py-2 px-4 border-b">
                          <Link href={`/dashboard/vendors/${vendorId}/payments/${payment.id}/edit`}>
                            <Button size="sm">Edit</Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No payment schedules found for this vendor.</p>
                <Link href={`/dashboard/vendors/${vendorId}/schedule-payment`}>
                  <Button className="mt-4">
                    Schedule First Payment
                  </Button>
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
              Are you sure you want to delete vendor <strong>{selectedVendor.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Delete Vendor
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Communication Log Modal */}
      {showCommunicationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Log Communication</h3>
            <form onSubmit={handleAddCommunication}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Communication Type*
                  </label>
                  <select
                    value={communicationData.type}
                    onChange={(e) => setCommunicationData({...communicationData, type: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="email">Email</option>
                    <option value="phone">Phone Call</option>
                    <option value="meeting">Meeting</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Direction*
                  </label>
                  <select
                    value={communicationData.direction}
                    onChange={(e) => setCommunicationData({...communicationData, direction: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="outgoing">Outgoing (Sent)</option>
                    <option value="incoming">Incoming (Received)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={communicationData.subject}
                    onChange={(e) => setCommunicationData({...communicationData, subject: e.target.value})}
                    className="w-full p-2 border rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content*
                  </label>
                  <textarea
                    value={communicationData.content}
                    onChange={(e) => setCommunicationData({...communicationData, content: e.target.value})}
                    rows={4}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={communicationData.timestamp.slice(0, 16)}
                    onChange={(e) => setCommunicationData({...communicationData, timestamp: new Date(e.target.value).toISOString()})}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <Button type="button" variant="secondary" onClick={() => setShowCommunicationModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Save Log
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
