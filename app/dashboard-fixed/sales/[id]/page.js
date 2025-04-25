'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSales } from '@/lib/hooks/useSales';
import { useCustomers } from '@/lib/hooks/useCustomers';
import Button from '../../../../components/ui/Button';
import { ArrowLeftIcon, EditIcon, TrashIcon, PrinterIcon, CreditCardIcon, AlertTriangleIcon } from 'lucide-react';

export default function SaleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const saleId = params.id;
  
  const [activeTab, setActiveTab] = useState('overview');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState({
    amount: 0,
    method: 'credit_card',
    reference: '',
    date: new Date().toISOString().split('T')[0]
  });
  
  const { 
    selectedSale,
    loading,
    error,
    fetchSale,
    deleteSale,
    recordPayment
  } = useSales();
  
  const { customers } = useCustomers();

  // Fetch sale data on mount
  useEffect(() => {
    if (saleId) {
      fetchSale(saleId);
    }
  }, [saleId, fetchSale]);

  // Handle sale deletion
  const handleDelete = async () => {
    if (await deleteSale(saleId)) {
      router.push('/dashboard/sales');
    }
  };

  // Handle payment recording
  const handleRecordPayment = async (e) => {
    e.preventDefault();
    
    if (paymentData.amount <= 0) {
      return;
    }
    
    try {
      await recordPayment(saleId, paymentData);
      setShowPaymentModal(false);
    } catch (error) {
      console.error('Error recording payment:', error);
    }
  };

  // Get customer by ID
  const getCustomer = (customerId) => {
    return customers.find(c => c.id === customerId) || null;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Generate invoice PDF
  const generateInvoice = () => {
    // This would be implemented with a PDF generation library
    alert('Invoice generation will be implemented in a future update.');
  };

  if (loading && !selectedSale) {
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

  if (!selectedSale) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Not Found:</strong>
          <span className="block sm:inline"> Order not found</span>
        </div>
      </div>
    );
  }

  const customer = getCustomer(selectedSale.customerId);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <Link href="/dashboard/sales">
            <Button variant="ghost" className="mr-4">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Sales
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Order #{selectedSale.orderNumber}</h1>
          <span className={`ml-4 px-2 py-1 rounded text-xs ${
            selectedSale.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            selectedSale.status === 'processing' ? 'bg-blue-100 text-blue-800' :
            selectedSale.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
            selectedSale.status === 'delivered' ? 'bg-green-100 text-green-800' :
            'bg-red-100 text-red-800'
          }`}>
            {selectedSale.status.charAt(0).toUpperCase() + selectedSale.status.slice(1)}
          </span>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            onClick={generateInvoice}
          >
            <PrinterIcon className="w-4 h-4 mr-2" />
            Generate Invoice
          </Button>
          
          {selectedSale.paymentStatus !== 'paid' && (
            <Button 
              variant="primary"
              onClick={() => {
                setPaymentData({
                  ...paymentData,
                  amount: selectedSale.total || 0
                });
                setShowPaymentModal(true);
              }}
            >
              <CreditCardIcon className="w-4 h-4 mr-2" />
              Record Payment
            </Button>
          )}
          
          <Link href={`/dashboard/sales/${saleId}/edit`}>
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
      
      {/* Order Date and Customer */}
      <div className="bg-gray-100 px-4 py-2 rounded-lg mb-6">
        <div className="flex flex-col md:flex-row md:justify-between">
          <p className="text-gray-600">
            <span className="font-semibold">Date:</span> {formatDate(selectedSale.createdAt)}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Customer:</span> {customer ? customer.name : 'Unknown Customer'}
            {customer && customer.code && ` (${customer.code})`}
          </p>
        </div>
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
            className={`px-4 py-2 ${activeTab === 'items' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('items')}
          >
            Items
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'shipping' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('shipping')}
          >
            Shipping
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'payment' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('payment')}
          >
            Payment
          </button>
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="bg-white shadow-md rounded-lg p-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3">
                <p><span className="font-medium">Order Number:</span> {selectedSale.orderNumber}</p>
                <p><span className="font-medium">Date:</span> {formatDate(selectedSale.createdAt)}</p>
                <p><span className="font-medium">Status:</span> {selectedSale.status.charAt(0).toUpperCase() + selectedSale.status.slice(1)}</p>
                <p><span className="font-medium">Items:</span> {selectedSale.items?.length || 0}</p>
                <p><span className="font-medium">Notes:</span> {selectedSale.notes || 'No notes provided'}</p>
              </div>
              
              <h2 className="text-lg font-semibold mt-6 mb-4">Customer Information</h2>
              <div className="space-y-3">
                <p><span className="font-medium">Name:</span> {customer ? customer.name : 'Unknown Customer'}</p>
                {customer && (
                  <>
                    <p><span className="font-medium">Code:</span> {customer.code}</p>
                    <p><span className="font-medium">Email:</span> {customer.email || 'N/A'}</p>
                    <p><span className="font-medium">Phone:</span> {customer.phone || 'N/A'}</p>
                  </>
                )}
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-4">Order Totals</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${selectedSale.subtotal?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax ({selectedSale.taxRate || 0}%):</span>
                    <span>${selectedSale.taxAmount?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount:</span>
                    <span>${selectedSale.discountAmount?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-semibold">
                    <span>Total:</span>
                    <span>${selectedSale.total?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
              </div>
              
              <h2 className="text-lg font-semibold mt-6 mb-4">Payment Status</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className={`px-2 py-1 rounded text-xs mr-2 ${
                      selectedSale.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                      selectedSale.paymentStatus === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedSale.paymentStatus === 'paid' ? 'Paid' :
                       selectedSale.paymentStatus === 'partial' ? 'Partial' :
                       'Unpaid'}
                    </span>
                    <span className="text-gray-600">
                      {selectedSale.paymentStatus === 'paid' ? 'Payment complete' :
                       selectedSale.paymentStatus === 'partial' ? 'Partial payment received' :
                       'No payment received'}
                    </span>
                  </div>
                  
                  {selectedSale.paymentMethod && (
                    <div className="flex justify-between">
                      <span>Payment Method:</span>
                      <span>{selectedSale.paymentMethod.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                    </div>
                  )}
                  
                  {selectedSale.paymentReference && (
                    <div className="flex justify-between">
                      <span>Reference:</span>
                      <span>{selectedSale.paymentReference}</span>
                    </div>
                  )}
                  
                  {selectedSale.paymentDate && (
                    <div className="flex justify-between">
                      <span>Payment Date:</span>
                      <span>{formatDate(selectedSale.paymentDate)}</span>
                    </div>
                  )}
                  
                  {selectedSale.paymentStatus !== 'paid' && (
                    <div className="mt-4">
                      <Button 
                        size="sm"
                        onClick={() => {
                          setPaymentData({
                            ...paymentData,
                            amount: selectedSale.total || 0
                          });
                          setShowPaymentModal(true);
                        }}
                      >
                        <CreditCardIcon className="w-4 h-4 mr-2" />
                        Record Payment
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'items' && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Order Items</h2>
            
            {selectedSale.items && selectedSale.items.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b">Product</th>
                      <th className="py-2 px-4 border-b">SKU</th>
                      <th className="py-2 px-4 border-b">Quantity</th>
                      <th className="py-2 px-4 border-b">Unit Price</th>
                      <th className="py-2 px-4 border-b">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSale.items.map((item, index) => (
                      <tr key={index}>
                        <td className="py-2 px-4 border-b">{item.productName || 'Unknown Product'}</td>
                        <td className="py-2 px-4 border-b">{item.productSku || 'N/A'}</td>
                        <td className="py-2 px-4 border-b">{item.quantity}</td>
                        <td className="py-2 px-4 border-b">${item.unitPrice?.toFixed(2) || '0.00'}</td>
                        <td className="py-2 px-4 border-b">${item.subtotal?.toFixed(2) || '0.00'}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="4" className="py-2 px-4 border-b text-right font-semibold">Subtotal:</td>
                      <td className="py-2 px-4 border-b">${selectedSale.subtotal?.toFixed(2) || '0.00'}</td>
                    </tr>
                    <tr>
                      <td colSpan="4" className="py-2 px-4 border-b text-right font-semibold">Tax ({selectedSale.taxRate || 0}%):</td>
                      <td className="py-2 px-4 border-b">${selectedSale.taxAmount?.toFixed(2) || '0.00'}</td>
                    </tr>
                    <tr>
                      <td colSpan="4" className="py-2 px-4 border-b text-right font-semibold">Discount:</td>
                      <td className="py-2 px-4 border-b">${selectedSale.discountAmount?.toFixed(2) || '0.00'}</td>
                    </tr>
                    <tr>
                      <td colSpan="4" className="py-2 px-4 border-b text-right font-semibold">Total:</td>
                      <td className="py-2 px-4 border-b font-bold">${selectedSale.total?.toFixed(2) || '0.00'}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No items found for this order.</p>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'shipping' && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Shipping Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-md font-medium mb-2">Shipping Address</h3>
                {selectedSale.shippingAddress ? (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p>{selectedSale.shippingAddress.street || ''}</p>
                    <p>
                      {selectedSale.shippingAddress.city || ''}{selectedSale.shippingAddress.city && selectedSale.shippingAddress.state ? ', ' : ''}
                      {selectedSale.shippingAddress.state || ''}
                    </p>
                    <p>{selectedSale.shippingAddress.zip || ''}</p>
                    <p>{selectedSale.shippingAddress.country || ''}</p>
                  </div>
                ) : (
                  <p className="text-gray-500">No shipping address provided.</p>
                )}
              </div>
              
              <div>
                <h3 className="text-md font-medium mb-2">Shipping Details</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p><span className="font-medium">Shipping Method:</span> {selectedSale.shippingMethod || 'Not specified'}</p>
                  <p><span className="font-medium">Tracking Number:</span> {selectedSale.trackingNumber || 'Not available'}</p>
                  <p><span className="font-medium">Status:</span> {selectedSale.status.charAt(0).toUpperCase() + selectedSale.status.slice(1)}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'payment' && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Payment Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-md font-medium mb-2">Payment Status</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-4">
                    <span className={`px-2 py-1 rounded text-xs mr-2 ${
                      selectedSale.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                      selectedSale.paymentStatus === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedSale.paymentStatus === 'paid' ? 'Paid' :
                       selectedSale.paymentStatus === 'partial' ? 'Partial' :
                       'Unpaid'}
                    </span>
                    <span className="text-gray-600">
                      {selectedSale.paymentStatus === 'paid' ? 'Payment complete' :
                       selectedSale.paymentStatus === 'partial' ? 'Partial payment received' :
                       'No payment received'}
                    </span>
                  </div>
                  
                  <p><span className="font-medium">Total Amount:</span> ${selectedSale.total?.toFixed(2) || '0.00'}</p>
                  
                  {selectedSale.paymentStatus !== 'paid' && (
                    <div className="mt-4">
                      <Button 
                        onClick={() => {
                          setPaymentData({
                            ...paymentData,
                            amount: selectedSale.total || 0
                          });
                          setShowPaymentModal(true);
                        }}
                      >
                        <CreditCardIcon className="w-4 h-4 mr-2" />
                        Record Payment
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-medium mb-2">Payment Details</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p><span className="font-medium">Payment Method:</span> {selectedSale.paymentMethod ? selectedSale.paymentMethod.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Not specified'}</p>
                  <p><span className="font-medium">Reference:</span> {selectedSale.paymentReference || 'Not available'}</p>
                  <p><span className="font-medium">Payment Date:</span> {selectedSale.paymentDate ? formatDate(selectedSale.paymentDate) : 'Not available'}</p>
                </div>
              </div>
            </div>
            
            {selectedSale.salesRepId && (
              <div className="mt-6">
                <h3 className="text-md font-medium mb-2">Commission Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p><span className="font-medium">Sales Representative:</span> {selectedSale.salesRepName || 'Unknown'}</p>
                  <p><span className="font-medium">Commission Amount:</span> ${selectedSale.commission?.toFixed(2) || '0.00'}</p>
                </div>
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
              Are you sure you want to delete order <strong>#{selectedSale.orderNumber}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Delete Order
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Record Payment</h3>
            <form onSubmit={handleRecordPayment}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount*
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={selectedSale.total || 0}
                    value={paymentData.amount}
                    onChange={(e) => setPaymentData({...paymentData, amount: parseFloat(e.target.value)})}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Method*
                  </label>
                  <select
                    value={paymentData.method}
                    onChange={(e) => setPaymentData({...paymentData, method: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="credit_card">Credit Card</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="cash">Cash</option>
                    <option value="check">Check</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reference
                  </label>
                  <input
                    type="text"
                    value={paymentData.reference}
                    onChange={(e) => setPaymentData({...paymentData, reference: e.target.value})}
                    className="w-full p-2 border rounded"
                    placeholder="Transaction ID, Check Number, etc."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Date
                  </label>
                  <input
                    type="date"
                    value={paymentData.date}
                    onChange={(e) => setPaymentData({...paymentData, date: e.target.value})}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <Button type="button" variant="secondary" onClick={() => setShowPaymentModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Record Payment
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
