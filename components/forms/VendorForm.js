import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../ui/Button';

/**
 * Vendor form component for creating and editing vendors
 * 
 * @param {Object} props - Component props
 * @param {Object} props.vendor - Vendor data for editing (optional)
 * @param {Array} props.categories - Available vendor categories
 * @param {Function} props.onSubmit - Function to call on form submission
 * @param {Function} props.onCancel - Function to call on cancel
 */
export default function VendorForm({ 
  vendor, 
  categories = [
    'Flower Producer',
    'Concentrate Producer',
    'Vape Producer',
    'Packaging Supplier',
    'Equipment Supplier',
    'Other'
  ], 
  onSubmit, 
  onCancel 
}) {
  const isEditMode = !!vendor;
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: vendor || {
      name: '',
      code: '',
      category: '',
      contactName: '',
      email: '',
      phone: '',
      website: '',
      address: {
        street: '',
        city: '',
        state: '',
        zip: '',
        country: '',
      },
      paymentTerms: '',
      taxId: '',
      notes: '',
      isActive: true
    }
  });

  // Reset form when vendor changes
  useEffect(() => {
    if (vendor) {
      reset(vendor);
    }
  }, [vendor, reset]);

  const submitHandler = async (data) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          {isEditMode ? 'Edit Vendor' : 'Create New Vendor'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Vendor Name*
              </label>
              <input
                type="text"
                {...register('name', { required: 'Vendor name is required' })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Vendor Code
              </label>
              <input
                type="text"
                {...register('code')}
                placeholder="Auto-generated if left blank"
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
                <option value="">Select Category</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contact Name
              </label>
              <input
                type="text"
                {...register('contactName')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                {...register('email', {
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="tel"
                {...register('phone')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Website
              </label>
              <input
                type="url"
                {...register('website')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
          </div>
          
          {/* Additional Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                {...register('address.street')}
                placeholder="Street"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
              <div className="grid grid-cols-2 gap-2 mt-2">
                <input
                  type="text"
                  {...register('address.city')}
                  placeholder="City"
                  className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
                <input
                  type="text"
                  {...register('address.state')}
                  placeholder="State/Province"
                  className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <input
                  type="text"
                  {...register('address.zip')}
                  placeholder="ZIP/Postal Code"
                  className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
                <input
                  type="text"
                  {...register('address.country')}
                  placeholder="Country"
                  className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Payment Terms
              </label>
              <select
                {...register('paymentTerms')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="">Select Payment Terms</option>
                <option value="net_15">Net 15</option>
                <option value="net_30">Net 30</option>
                <option value="net_45">Net 45</option>
                <option value="net_60">Net 60</option>
                <option value="due_on_receipt">Due on Receipt</option>
                <option value="cod">COD (Cash on Delivery)</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tax ID / EIN
              </label>
              <input
                type="text"
                {...register('taxId')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                {...register('notes')}
                rows={4}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                {...register('isActive')}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                Active Vendor
              </label>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <Button type="button" onClick={onCancel} variant="secondary">
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {isEditMode ? 'Update Vendor' : 'Create Vendor'}
          </Button>
        </div>
      </div>
    </form>
  );
}
