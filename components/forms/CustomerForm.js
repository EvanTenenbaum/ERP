import React, { useState } from 'react';
import Button from '../ui/Button';

/**
 * Customer form component for adding or editing customer information
 * 
 * @param {Object} props - Component props
 * @param {Object} [props.initialData={}] - Initial customer data for editing
 * @param {function} props.onSubmit - Form submission handler
 * @param {function} props.onCancel - Cancel handler
 */
export default function CustomerForm({ 
  initialData = {}, 
  onSubmit, 
  onCancel 
}) {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    company: initialData.company || '',
    address: initialData.address || '',
    creditLimit: initialData.creditLimit || '',
    notes: initialData.notes || '',
  });
  
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (formData.creditLimit && isNaN(Number(formData.creditLimit))) {
      newErrors.creditLimit = 'Credit limit must be a number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">
          {initialData.id ? 'Edit Customer' : 'Add New Customer'}
        </h2>
        <p className="text-gray-500">
          {initialData.id 
            ? 'Update customer information' 
            : 'Fill in the details to add a new customer'}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Customer Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="block font-medium">
              Customer Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>
          
          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="block font-medium">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
          
          {/* Phone */}
          <div className="space-y-2">
            <label htmlFor="phone" className="block font-medium">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone}</p>
            )}
          </div>
          
          {/* Company */}
          <div className="space-y-2">
            <label htmlFor="company" className="block font-medium">
              Company
            </label>
            <input
              id="company"
              name="company"
              type="text"
              value={formData.company}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          {/* Address */}
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="address" className="block font-medium">
              Address
            </label>
            <textarea
              id="address"
              name="address"
              rows="3"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          {/* Credit Limit */}
          <div className="space-y-2">
            <label htmlFor="creditLimit" className="block font-medium">
              Credit Limit
            </label>
            <input
              id="creditLimit"
              name="creditLimit"
              type="text"
              value={formData.creditLimit}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${errors.creditLimit ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.creditLimit && (
              <p className="text-red-500 text-sm">{errors.creditLimit}</p>
            )}
          </div>
          
          {/* Notes */}
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="notes" className="block font-medium">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows="3"
              value={formData.notes}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-4 pt-4">
          <Button 
            variant="outline" 
            onClick={onCancel}
            type="button"
          >
            Cancel
          </Button>
          <Button type="submit">
            {initialData.id ? 'Update Customer' : 'Add Customer'}
          </Button>
        </div>
      </form>
    </div>
  );
}
