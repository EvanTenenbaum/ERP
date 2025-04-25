'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useInventory } from '../../../../lib/hooks/useInventory';
import Button from '../../../../components/ui/Button';
import { ArrowLeftIcon, EditIcon, TrashIcon, AlertTriangleIcon, PlusIcon } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id;
  
  const [activeTab, setActiveTab] = useState('overview');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAddInventoryModal, setShowAddInventoryModal] = useState(false);
  const [inventoryAction, setInventoryAction] = useState('add');
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [batchNumber, setBatchNumber] = useState('');
  
  const { 
    selectedProduct,
    locations,
    loading,
    error,
    fetchProduct,
    deleteProduct,
    fetchProductInventory,
    addInventory,
    removeInventory,
    transferInventory
  } = useInventory();

  const [productInventory, setProductInventory] = useState([]);

  // Fetch product data on mount
  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
      loadProductInventory();
    }
  }, [productId, fetchProduct]);

  // Load product inventory
  const loadProductInventory = async () => {
    if (productId) {
      const inventory = await fetchProductInventory(productId);
      setProductInventory(inventory || []);
    }
  };

  // Handle product deletion
  const handleDelete = async () => {
    if (await deleteProduct(productId)) {
      router.push('/dashboard/inventory');
    }
  };

  // Handle inventory action
  const handleInventoryAction = async (e) => {
    e.preventDefault();
    
    if (!selectedLocationId || quantity <= 0) {
      return;
    }
    
    try {
      if (inventoryAction === 'add') {
        await addInventory(productId, selectedLocationId, quantity, batchNumber);
      } else if (inventoryAction === 'remove') {
        await removeInventory(productId, selectedLocationId, quantity);
      }
      
      // Refresh inventory data
      await loadProductInventory();
      await fetchProduct(productId);
      
      // Reset form
      setSelectedLocationId('');
      setQuantity(1);
      setBatchNumber('');
      setShowAddInventoryModal(false);
    } catch (error) {
      console.error('Error performing inventory action:', error);
    }
  };

  if (loading && !selectedProduct) {
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

  if (!selectedProduct) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Not Found:</strong>
          <span className="block sm:inline"> Product not found</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <Link href="/dashboard/inventory">
            <Button variant="ghost" className="mr-4">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Inventory
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{selectedProduct.name}</h1>
          <span className={`ml-4 px-2 py-1 rounded text-xs ${
            selectedProduct.category === 'indoor' ? 'bg-green-100 text-green-800' :
            selectedProduct.category === 'outdoor' ? 'bg-blue-100 text-blue-800' :
            selectedProduct.category === 'light_dep' ? 'bg-purple-100 text-purple-800' :
            selectedProduct.category === 'concentrate' ? 'bg-yellow-100 text-yellow-800' :
            selectedProduct.category === 'vape' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {selectedProduct.category.charAt(0).toUpperCase() + selectedProduct.category.slice(1).replace('_', ' ')}
          </span>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            onClick={() => {
              setInventoryAction('add');
              setShowAddInventoryModal(true);
            }}
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Inventory
          </Button>
          <Link href={`/dashboard/inventory/${productId}/edit`}>
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
      
      {/* Product SKU */}
      <div className="bg-gray-100 px-4 py-2 rounded-lg mb-6">
        <p className="text-gray-600">SKU: <span className="font-semibold">{selectedProduct.sku}</span></p>
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
            className={`px-4 py-2 ${activeTab === 'inventory' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('inventory')}
          >
            Inventory
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'history' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('history')}
          >
            History
          </button>
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="bg-white shadow-md rounded-lg p-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              {selectedProduct.images && selectedProduct.images.length > 0 && (
                <div className="mb-6">
                  <img 
                    src={selectedProduct.images[0]} 
                    alt={selectedProduct.name} 
                    className="w-full max-w-md h-auto rounded-lg shadow-md"
                  />
                </div>
              )}
              
              <h2 className="text-lg font-semibold mb-4">Product Details</h2>
              <div className="space-y-3">
                <p><span className="font-medium">Description:</span> {selectedProduct.description || 'No description provided'}</p>
                
                {selectedProduct.strainType && (
                  <p>
                    <span className="font-medium">Strain Type:</span> 
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      selectedProduct.strainType === 'indica' ? 'bg-indigo-100 text-indigo-800' :
                      selectedProduct.strainType === 'sativa' ? 'bg-orange-100 text-orange-800' :
                      'bg-teal-100 text-teal-800'
                    }`}>
                      {selectedProduct.strainType.charAt(0).toUpperCase() + selectedProduct.strainType.slice(1)}
                    </span>
                  </p>
                )}
                
                <p><span className="font-medium">Batch/Lot Number:</span> {selectedProduct.batchNumber || 'N/A'}</p>
                
                <p><span className="font-medium">Unit:</span> {selectedProduct.unit || 'unit'}</p>
              </div>
              
              <h2 className="text-lg font-semibold mt-6 mb-4">Vendor Information</h2>
              <div className="space-y-3">
                <p><span className="font-medium">Vendor Code:</span> {selectedProduct.vendorCode || 'N/A'}</p>
                <p><span className="font-medium">Vendor:</span> {selectedProduct.vendorName || 'N/A'}</p>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-4">Pricing Information</h2>
              <div className="space-y-3">
                <p><span className="font-medium">Price:</span> ${selectedProduct.price?.toFixed(2) || '0.00'}</p>
                <p><span className="font-medium">Cost Price:</span> ${selectedProduct.costPrice?.toFixed(2) || '0.00'}</p>
                
                {selectedProduct.price && selectedProduct.costPrice && (
                  <>
                    <p>
                      <span className="font-medium">Margin:</span> ${(selectedProduct.price - selectedProduct.costPrice).toFixed(2)}
                      <span className="ml-2 text-sm text-gray-500">
                        ({((selectedProduct.price - selectedProduct.costPrice) / selectedProduct.price * 100).toFixed(2)}%)
                      </span>
                    </p>
                  </>
                )}
              </div>
              
              <h2 className="text-lg font-semibold mt-6 mb-4">Inventory Summary</h2>
              <div className="space-y-3">
                <p>
                  <span className="font-medium">Total Quantity:</span> 
                  <span className={`${selectedProduct.quantity < 10 ? 'text-red-600 font-semibold' : ''}`}>
                    {selectedProduct.quantity || 0} {selectedProduct.unit || 'units'}
                  </span>
                </p>
                
                <p><span className="font-medium">Locations:</span> {productInventory.length}</p>
                
                {selectedProduct.quantity < 10 && (
                  <div className="mt-2 p-3 bg-red-50 rounded-lg">
                    <p className="text-red-700 flex items-center">
                      <AlertTriangleIcon className="w-4 h-4 mr-2" />
                      Low inventory alert
                    </p>
                  </div>
                )}
              </div>
              
              <h2 className="text-lg font-semibold mt-6 mb-4">Additional Information</h2>
              <div className="space-y-3">
                <p><span className="font-medium">Notes:</span></p>
                <p className="text-gray-700">{selectedProduct.notes || 'No notes provided'}</p>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'inventory' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Inventory by Location</h2>
              <div className="flex space-x-2">
                <Button 
                  onClick={() => {
                    setInventoryAction('add');
                    setShowAddInventoryModal(true);
                  }}
                >
                  Add Inventory
                </Button>
                <Button 
                  variant="secondary"
                  onClick={() => {
                    setInventoryAction('remove');
                    setShowAddInventoryModal(true);
                  }}
                >
                  Remove Inventory
                </Button>
              </div>
            </div>
            
            {productInventory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b">Location</th>
                      <th className="py-2 px-4 border-b">Quantity</th>
                      <th className="py-2 px-4 border-b">Batch/Lot Number</th>
                      <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productInventory.map(record => (
                      <tr key={record.id}>
                        <td className="py-2 px-4 border-b">{record.location?.name || 'Unknown Location'}</td>
                        <td className="py-2 px-4 border-b">{record.quantity} {selectedProduct.unit || 'units'}</td>
                        <td className="py-2 px-4 border-b">{record.batchNumber || 'N/A'}</td>
                        <td className="py-2 px-4 border-b">
                          <Button 
                            size="sm"
                            onClick={() => {
                              setInventoryAction('add');
                              setSelectedLocationId(record.locationId);
                              setShowAddInventoryModal(true);
                            }}
                          >
                            Add
                          </Button>
                          <Button 
                            size="sm"
                            variant="secondary"
                            className="ml-2"
                            onClick={() => {
                              setInventoryAction('remove');
                              setSelectedLocationId(record.locationId);
                              setShowAddInventoryModal(true);
                            }}
                          >
                            Remove
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No inventory records found for this product.</p>
                <Button 
                  className="mt-4"
                  onClick={() => {
                    setInventoryAction('add');
                    setShowAddInventoryModal(true);
                  }}
                >
                  Add First Inventory
                </Button>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'history' && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Inventory History</h2>
            
            <div className="text-center py-8">
              <p className="text-gray-500">Inventory history will be implemented in a future update.</p>
            </div>
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
              Are you sure you want to delete product <strong>{selectedProduct.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Delete Product
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Add/Remove Inventory Modal */}
      {showAddInventoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">
              {inventoryAction === 'add' ? 'Add Inventory' : 'Remove Inventory'}
            </h3>
            <form onSubmit={handleInventoryAction}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location*
                  </label>
                  <select
                    value={selectedLocationId}
                    onChange={(e) => setSelectedLocationId(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select Location</option>
                    {locations.map(location => (
                      <option key={location.id} value={location.id}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity*
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                
                {inventoryAction === 'add' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Batch/Lot Number
                    </label>
                    <input
                      type="text"
                      value={batchNumber}
                      onChange={(e) => setBatchNumber(e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <Button type="button" variant="secondary" onClick={() => setShowAddInventoryModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {inventoryAction === 'add' ? 'Add Inventory' : 'Remove Inventory'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
