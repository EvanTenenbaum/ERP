'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';

export default function NewCustomerPage() {
  const router = useRouter();
  const { showNotification } = useApp();
  
  const [customer, setCustomer] = useState({
    code: '',
    name: '',
    contact: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: '',
    },
    status: 'active',
    creditLimit: 0, // Initialize with 0 to prevent null error
    paymentTerms: 'Net 30',
    notes: '',
    customFields: {
      licenseNumber: '',
      preferredDeliveryDay: '',
      salesTaxExempt: false
    }
  });

  const handleInputChange = (e, field, addressField = null, customField = null) => {
    const { value, type, checked } = e.target;
    
    if (addressField) {
      setCustomer(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else if (customField) {
      setCustomer(prev => ({
        ...prev,
        customFields: {
          ...prev.customFields,
          [customField]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setCustomer(prev => ({
        ...prev,
        [field]: field === 'creditLimit' ? parseFloat(value) || 0 : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Import database dynamically to avoid SSR issues
      const db = (await import('../../../../lib/database')).default;
      
      // Ensure creditLimit is a number
      const customerData = {
        ...customer,
        creditLimit: parseFloat(customer.creditLimit) || 0
      };
      
      await db.customers.create(customerData);
      
      showNotification('Customer added successfully', 'success');
      router.push('/dashboard/customers');
    } catch (error) {
      console.error('Error adding customer:', error);
      showNotification('Error adding customer', 'error');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Add New Customer</h1>
        <button
          onClick={() => router.back()}
          className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
        >
          Back to Customers
        </button>
      </div>

      <div className="bg-white p-6 rounded shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Basic Information */}
            <div>
              <label className="block mb-1">Customer Code</label>
              <input
                type="text"
                value={customer.code}
                onChange={(e) => handleInputChange(e, 'code')}
                className="w-full p-2 border rounded"
                required
                placeholder="e.g., CUST001"
              />
            </div>
            <div>
              <label className="block mb-1">Business Name</label>
              <input
                type="text"
                value={customer.name}
                onChange={(e) => handleInputChange(e, 'name')}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Contact Person</label>
              <input
                type="text"
                value={customer.contact}
                onChange={(e) => handleInputChange(e, 'contact')}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Email</label>
              <input
                type="email"
                value={customer.email}
                onChange={(e) => handleInputChange(e, 'email')}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Phone</label>
              <input
                type="tel"
                value={customer.phone}
                onChange={(e) => handleInputChange(e, 'phone')}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Status</label>
              <select
                value={customer.status}
                onChange={(e) => handleInputChange(e, 'status')}
                className="w-full p-2 border rounded"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">Credit Limit</label>
              <input
                type="number"
                value={customer.creditLimit}
                onChange={(e) => handleInputChange(e, 'creditLimit')}
                className="w-full p-2 border rounded"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block mb-1">Payment Terms</label>
              <select
                value={customer.paymentTerms}
                onChange={(e) => handleInputChange(e, 'paymentTerms')}
                className="w-full p-2 border rounded"
              >
                <option value="Net 15">Net 15</option>
                <option value="Net 30">Net 30</option>
                <option value="Net 45">Net 45</option>
                <option value="Net 60">Net 60</option>
                <option value="Prepaid">Prepaid</option>
              </select>
            </div>

            {/* Address Information */}
            <div className="col-span-2">
              <h2 className="text-lg font-semibold mb-2">Address</h2>
            </div>
            <div>
              <label className="block mb-1">Street</label>
              <input
                type="text"
                value={customer.address.street}
                onChange={(e) => handleInputChange(e, null, 'street')}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">City</label>
              <input
                type="text"
                value={customer.address.city}
                onChange={(e) => handleInputChange(e, null, 'city')}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">State/Province</label>
              <input
                type="text"
                value={customer.address.state}
                onChange={(e) => handleInputChange(e, null, 'state')}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">ZIP/Postal Code</label>
              <input
                type="text"
                value={customer.address.zip}
                onChange={(e) => handleInputChange(e, null, 'zip')}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Country</label>
              <input
                type="text"
                value={customer.address.country}
                onChange={(e) => handleInputChange(e, null, 'country')}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            {/* Custom Fields */}
            <div className="col-span-2">
              <h2 className="text-lg font-semibold mb-2">Additional Information</h2>
            </div>
            <div>
              <label className="block mb-1">License Number</label>
              <input
                type="text"
                value={customer.customFields.licenseNumber}
                onChange={(e) => handleInputChange(e, null, null, 'licenseNumber')}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Preferred Delivery Day</label>
              <select
                value={customer.customFields.preferredDeliveryDay}
                onChange={(e) => handleInputChange(e, null, null, 'preferredDeliveryDay')}
                className="w-full p-2 border rounded"
              >
                <option value="">No Preference</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">Sales Tax Exempt</label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={customer.customFields.salesTaxExempt}
                  onChange={(e) => handleInputChange(e, null, null, 'salesTaxExempt')}
                  className="mr-2"
                />
                <span>Exempt from sales tax</span>
              </div>
            </div>
            <div className="col-span-2">
              <label className="block mb-1">Notes</label>
              <textarea
                value={customer.notes}
                onChange={(e) => handleInputChange(e, 'notes')}
                className="w-full p-2 border rounded"
                rows="4"
              ></textarea>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Save Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
