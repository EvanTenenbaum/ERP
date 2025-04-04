import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../ui/Button';

/**
 * Inventory form component for adding and editing products
 * 
 * @param {Object} props - Component props
 * @param {Object} props.product - Product data for editing (optional)
 * @param {Array} props.locations - Available locations
 * @param {Array} props.vendors - Available vendors
 * @param {Function} props.onSubmit - Function to call on form submission
 * @param {Function} props.onCancel - Function to call on cancel
 */
export default function InventoryForm({ product, locations = [], vendors = [], onSubmit, onCancel }) {
  const isEditMode = !!product;
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(product?.images?.[0] || null);
  
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    defaultValues: product || {
      name: '',
      sku: '',
      description: '',
      category: 'indoor',
      strainType: 'hybrid',
      vendorId: '',
      price: 0,
      costPrice: 0,
      quantity: 0,
      unit: 'gram',
      images: [],
      batchNumber: '',
      notes: '',
      customFields: {},
    }
  });

  const watchCategory = watch('category');
  const watchStrainType = watch('strainType');

  // Reset form when product changes
  useEffect(() => {
    if (product) {
      reset(product);
      setImagePreview(product.images?.[0] || null);
    }
  }, [product, reset]);

  // Handle image selection
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitHandler = async (data) => {
    try {
      // Handle image upload in a real implementation
      // For now, just use the preview as the image URL
      if (imagePreview && !data.images.includes(imagePreview)) {
        data.images = [imagePreview, ...data.images];
      }
      
      await onSubmit(data);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          {isEditMode ? 'Edit Product' : 'Add New Product'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Product Name*
              </label>
              <input
                type="text"
                {...register('name', { required: 'Product name is required' })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                SKU
              </label>
              <input
                type="text"
                {...register('sku')}
                placeholder="Auto-generated if left blank"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category*
              </label>
              <select
                {...register('category', { required: 'Category is required' })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="indoor">Indoor</option>
                <option value="outdoor">Outdoor</option>
                <option value="light_dep">Light Dep</option>
                <option value="concentrate">Concentrate</option>
                <option value="vape">Vape</option>
                <option value="other">Other</option>
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
              )}
            </div>
            
            {(watchCategory === 'indoor' || watchCategory === 'outdoor' || watchCategory === 'light_dep') && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Strain Type
                </label>
                <select
                  {...register('strainType')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="indica">Indica</option>
                  <option value="sativa">Sativa</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Vendor
              </label>
              <select
                {...register('vendorId')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="">Select Vendor</option>
                {vendors.map(vendor => (
                  <option key={vendor.id} value={vendor.id}>
                    {vendor.name} ({vendor.code})
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Pricing, Inventory, and Image */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price ($)*
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('price', { 
                    required: 'Price is required',
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message: 'Price cannot be negative'
                    }
                  })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Cost Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('costPrice', { 
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message: 'Cost price cannot be negative'
                    }
                  })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
                {errors.costPrice && (
                  <p className="text-red-500 text-sm mt-1">{errors.costPrice.message}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  type="number"
                  {...register('quantity', { 
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message: 'Quantity cannot be negative'
                    }
                  })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  disabled={isEditMode} // Quantity is managed through inventory operations
                />
                {errors.quantity && (
                  <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>
                )}
                {isEditMode && (
                  <p className="text-sm text-gray-500 mt-1">
                    Quantity is managed through inventory operations
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Unit
                </label>
                <select
                  {...register('unit')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="gram">Gram</option>
                  <option value="eighth">Eighth (3.5g)</option>
                  <option value="quarter">Quarter (7g)</option>
                  <option value="half">Half Ounce (14g)</option>
                  <option value="ounce">Ounce (28g)</option>
                  <option value="pound">Pound (16oz)</option>
                  <option value="unit">Unit</option>
                  <option value="cartridge">Cartridge</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Batch/Lot Number
              </label>
              <input
                type="text"
                {...register('batchNumber')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Product Image
              </label>
              <div className="mt-1 flex items-center">
                {imagePreview ? (
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="Product preview" 
                      className="h-32 w-32 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setSelectedImage(null);
                      }}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="h-32 w-32 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
                    <label className="cursor-pointer text-center p-2">
                      <span className="text-sm text-gray-500">
                        Click to upload
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                {...register('notes')}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <Button type="button" onClick={onCancel} variant="secondary">
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {isEditMode ? 'Update Product' : 'Add Product'}
          </Button>
        </div>
      </div>
    </form>
  );
}
