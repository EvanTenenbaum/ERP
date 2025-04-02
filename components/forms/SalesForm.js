"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SalesForm({ sale = null }) {
  const router = useRouter();
  const isNewSale = !sale;
  
  const [formData, setFormData] = useState({
    customer: sale?.customer || '',
    date: sale?.date || new Date().toISOString().split('T')[0],
    items: sale?.items || [{ product: '', quantity: 1, price: 0, total: 0 }],
    subtotal: sale?.subtotal || 0,
    taxRate: sale?.taxRate || 7.5,
    taxAmount: sale?.taxAmount || 0,
    total: sale?.total || 0,
    paymentMethod: sale?.paymentMethod || 'credit_card',
    notes: sale?.notes || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };
    
    // Recalculate total for this item
    if (field === 'price' || field === 'quantity') {
      updatedItems[index].total = updatedItems[index].price * updatedItems[index].quantity;
    }
    
    // Update form data with new items and recalculate totals
    const subtotal = updatedItems.reduce((sum, item) => sum + (item.total || 0), 0);
    const taxAmount = subtotal * (formData.taxRate / 100);
    const total = subtotal + taxAmount;
    
    setFormData(prev => ({
      ...prev,
      items: updatedItems,
      subtotal,
      taxAmount,
      total
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { product: '', quantity: 1, price: 0, total: 0 }]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length === 1) return;
    
    const updatedItems = formData.items.filter((_, i) => i !== index);
    const subtotal = updatedItems.reduce((sum, item) => sum + (item.total || 0), 0);
    const taxAmount = subtotal * (formData.taxRate / 100);
    const total = subtotal + taxAmount;
    
    setFormData(prev => ({
      ...prev,
      items: updatedItems,
      subtotal,
      taxAmount,
      total
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Here you would typically save the data to your backend
    console.log('Saving sale data:', formData);
    
    // Redirect back to the sales list
    router.push('/dashboard/sales');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="customer" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Customer
          </label>
          <input
            type="text"
            id="customer"
            name="customer"
            value={formData.customer}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
          />
        </div>
        
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
          />
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Items</h3>
        <div className="mt-2 space-y-4">
          {formData.items.map((item, index) => (
            <div key={index} className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0 items-end">
              <div className="w-full md:w-2/5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Product
                </label>
                <input
                  type="text"
                  value={item.product}
                  onChange={(e) => handleItemChange(index, 'product', e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
              
              <div className="w-full md:w-1/5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
              
              <div className="w-full md:w-1/5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={item.price}
                  onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value))}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
              
              <div className="w-full md:w-1/5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Total ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={item.total || (item.price * item.quantity)}
                  readOnly
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Remove
              </button>
            </div>
          ))}
          
          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
          >
            Add Item
          </button>
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Payment Method
          </label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
          >
            <option value="credit_card">Credit Card</option>
            <option value="cash">Cash</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="check">Check</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Tax Rate (%)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            id="taxRate"
            name="taxRate"
            value={formData.taxRate}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
          />
        </div>
      </div>
      
      <div className="mt-6">
        <div className="flex justify-between py-2 text-sm">
          <span className="font-medium text-gray-700 dark:text-gray-300">Subtotal:</span>
          <span className="text-gray-900 dark:text-white">${formData.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between py-2 text-sm">
          <span className="font-medium text-gray-700 dark:text-gray-300">Tax ({formData.taxRate}%):</span>
          <span className="text-gray-900 dark:text-white">${formData.taxAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between py-2 text-lg font-bold">
          <span className="text-gray-900 dark:text-white">Total:</span>
          <span className="text-gray-900 dark:text-white">${formData.total.toFixed(2)}</span>
        </div>
      </div>
      
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows="3"
          value={formData.notes}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
        ></textarea>
      </div>
      
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isNewSale ? 'Create Sale' : 'Update Sale'}
        </button>
      </div>
    </form>
  );
}
