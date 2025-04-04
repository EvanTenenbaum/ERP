import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import Button from '../ui/Button';
import { PlusIcon, TrashIcon } from 'lucide-react';

/**
 * Sales form component for creating and editing sales/orders
 * 
 * @param {Object} props - Component props
 * @param {Object} props.sale - Sale data for editing (optional)
 * @param {Array} props.customers - Available customers
 * @param {Array} props.products - Available products
 * @param {Array} props.locations - Available locations
 * @param {Array} props.salesReps - Available sales representatives
 * @param {Function} props.onSubmit - Function to call on form submission
 * @param {Function} props.onCancel - Function to call on cancel
 */
export default function SalesForm({ 
  sale, 
  customers = [], 
  products = [], 
  locations = [], 
  salesReps = [], 
  onSubmit, 
  onCancel 
}) {
  const isEditMode = !!sale;
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState({});
  const [subtotal, setSubtotal] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [total, setTotal] = useState(0);
  
  const { register, control, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
    defaultValues: sale || {
      orderNumber: '',
      customerId: '',
      status: 'pending',
      items: [],
      subtotal: 0,
      taxRate: 0,
      taxAmount: 0,
      discountType: 'percentage',
      discountValue: 0,
      discountAmount: 0,
      total: 0,
      notes: '',
      paymentStatus: 'unpaid',
      paymentMethod: '',
      paymentReference: '',
      paymentDate: '',
      shippingAddress: {
        street: '',
        city: '',
        state: '',
        zip: '',
        country: '',
      },
      shippingMethod: '',
      trackingNumber: '',
      salesRepId: '',
      commission: 0,
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  });

  // Watch for changes to calculate totals
  const watchItems = watch('items');
  const watchTaxRate = watch('taxRate');
  const watchDiscountType = watch('discountType');
  const watchDiscountValue = watch('discountValue');
  const watchCustomerId = watch('customerId');

  // Reset form when sale changes
  useEffect(() => {
    if (sale) {
      reset(sale);
    }
  }, [sale, reset]);

  // Update selected customer when customerId changes
  useEffect(() => {
    if (watchCustomerId) {
      const customer = customers.find(c => c.id === watchCustomerId);
      setSelectedCustomer(customer || null);
      
      // Pre-fill shipping address if available
      if (customer && customer.address) {
        setValue('shippingAddress', customer.address);
      }
    } else {
      setSelectedCustomer(null);
    }
  }, [watchCustomerId, customers, setValue]);

  // Calculate totals when relevant fields change
  useEffect(() => {
    // Calculate subtotal
    let calculatedSubtotal = 0;
    if (watchItems && watchItems.length > 0) {
      calculatedSubtotal = watchItems.reduce((sum, item) => {
        const quantity = parseFloat(item.quantity) || 0;
        const unitPrice = parseFloat(item.unitPrice) || 0;
        return sum + (quantity * unitPrice);
      }, 0);
    }
    setSubtotal(calculatedSubtotal);
    setValue('subtotal', calculatedSubtotal);
    
    // Calculate tax amount
    const taxRate = parseFloat(watchTaxRate) || 0;
    const calculatedTaxAmount = calculatedSubtotal * (taxRate / 100);
    setTaxAmount(calculatedTaxAmount);
    setValue('taxAmount', calculatedTaxAmount);
    
    // Calculate discount amount
    let calculatedDiscountAmount = 0;
    const discountValue = parseFloat(watchDiscountValue) || 0;
    
    if (watchDiscountType === 'percentage') {
      calculatedDiscountAmount = calculatedSubtotal * (discountValue / 100);
    } else if (watchDiscountType === 'fixed') {
      calculatedDiscountAmount = discountValue;
    }
    
    setDiscountAmount(calculatedDiscountAmount);
    setValue('discountAmount', calculatedDiscountAmount);
    
    // Calculate total
    const calculatedTotal = calculatedSubtotal + calculatedTaxAmount - calculatedDiscountAmount;
    setTotal(calculatedTotal);
    setValue('total', calculatedTotal);
    
    // Calculate commission (example: 5% of total)
    const commissionRate = 0.05; // 5%
    const calculatedCommission = calculatedTotal * commissionRate;
    setValue('commission', calculatedCommission);
  }, [watchItems, watchTaxRate, watchDiscountType, watchDiscountValue, setValue]);

  // Handle product selection
  const handleProductSelect = (index, productId) => {
    if (!productId) return;
    
    const product = products.find(p => p.id === productId);
    if (product) {
      setValue(`items.${index}.productId`, product.id);
      setValue(`items.${index}.productSku`, product.sku);
      setValue(`items.${index}.productName`, product.name);
      setValue(`items.${index}.unitPrice`, product.price);
      
      // Store selected product for reference
      setSelectedProducts(prev => ({
        ...prev,
        [index]: product
      }));
    }
  };

  // Add a new line item
  const addLineItem = () => {
    append({
      productId: '',
      productSku: '',
      productName: '',
      quantity: 1,
      unitPrice: 0,
      locationId: '',
      subtotal: 0,
      notes: ''
    });
  };

  const submitHandler = async (data) => {
    try {
      // Ensure each line item has a subtotal
      data.items = data.items.map(item => ({
        ...item,
        subtotal: (parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0)
      }));
      
      await onSubmit(data);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          {isEditMode ? 'Edit Order' : 'Create New Order'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Order Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Order Number
              </label>
              <input
                type="text"
                {...register('orderNumber')}
                placeholder="Auto-generated if left blank"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Customer*
              </label>
              <select
                {...register('customerId', { required: 'Customer is required' })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="">Select Customer</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} ({customer.code})
                  </option>
                ))}
              </select>
              {errors.customerId && (
                <p className="text-red-500 text-sm mt-1">{errors.customerId.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                {...register('status')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Sales Representative
              </label>
              <select
                {...register('salesRepId')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="">Select Sales Rep</option>
                {salesReps.map(rep => (
                  <option key={rep.id} value={rep.id}>
                    {rep.name}
                  </option>
                ))}
              </select>
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
          
          {/* Shipping and Payment Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Shipping Address
              </label>
              <input
                type="text"
                {...register('shippingAddress.street')}
                placeholder="Street"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
              <div className="grid grid-cols-2 gap-2 mt-2">
                <input
                  type="text"
                  {...register('shippingAddress.city')}
                  placeholder="City"
                  className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
                <input
                  type="text"
                  {...register('shippingAddress.state')}
                  placeholder="State/Province"
                  className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <input
                  type="text"
                  {...register('shippingAddress.zip')}
                  placeholder="ZIP/Postal Code"
                  className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
                <input
                  type="text"
                  {...register('shippingAddress.country')}
                  placeholder="Country"
                  className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Shipping Method
              </label>
              <input
                type="text"
                {...register('shippingMethod')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tracking Number
              </label>
              <input
                type="text"
                {...register('trackingNumber')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Payment Status
              </label>
              <select
                {...register('paymentStatus')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="unpaid">Unpaid</option>
                <option value="partial">Partial</option>
                <option value="paid">Paid</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Payment Method
                </label>
                <select
                  {...register('paymentMethod')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="">Select Method</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="cash">Cash</option>
                  <option value="check">Check</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Payment Reference
                </label>
                <input
                  type="text"
                  {...register('paymentReference')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Line Items */}
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Order Items</h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {fields.map((item, index) => {
                  const itemQuantity = parseFloat(watch(`items.${index}.quantity`)) || 0;
                  const itemUnitPrice = parseFloat(watch(`items.${index}.unitPrice`)) || 0;
                  const itemSubtotal = itemQuantity * itemUnitPrice;
                  
                  return (
                    <tr key={item.id}>
                      <td className="px-3 py-2">
                        <select
                          {...register(`items.${index}.productId`, { required: 'Product is required' })}
                          onChange={(e) => handleProductSelect(index, e.target.value)}
                          className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        >
                          <option value="">Select Product</option>
                          {products.map(product => (
                            <option key={product.id} value={product.id}>
                              {product.name} ({product.sku})
                            </option>
                          ))}
                        </select>
                        {errors.items?.[index]?.productId && (
                          <p className="text-red-500 text-xs mt-1">{errors.items[index].productId.message}</p>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <select
                          {...register(`items.${index}.locationId`, { required: 'Location is required' })}
                          className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        >
                          <option value="">Select Location</option>
                          {locations.map(location => (
                            <option key={location.id} value={location.id}>
                              {location.name}
                            </option>
                          ))}
                        </select>
                        {errors.items?.[index]?.locationId && (
                          <p className="text-red-500 text-xs mt-1">{errors.items[index].locationId.message}</p>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          min="1"
                          {...register(`items.${index}.quantity`, {
                            required: 'Required',
                            valueAsNumber: true,
                            min: { value: 1, message: 'Min 1' }
                          })}
                          className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                        {errors.items?.[index]?.quantity && (
                          <p className="text-red-500 text-xs mt-1">{errors.items[index].quantity.message}</p>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          step="0.01"
                          {...register(`items.${index}.unitPrice`, {
                            required: 'Required',
                            valueAsNumber: true,
                            min: { value: 0, message: 'Min 0' }
                          })}
                          className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                        {errors.items?.[index]?.unitPrice && (
                          <p className="text-red-500 text-xs mt-1">{errors.items[index].unitPrice.message}</p>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <div className="block w-full p-2 bg-gray-50 rounded-md">
                          ${itemSubtotal.toFixed(2)}
                        </div>
                        <input
                          type="hidden"
                          {...register(`items.${index}.subtotal`)}
                          value={itemSubtotal}
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Button
                          type="button"
                          variant="danger"
                          size="sm"
                          onClick={() => remove(index)}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
                
                {fields.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-3 py-4 text-center text-gray-500">
                      No items added yet. Click "Add Item" to add products to this order.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={addLineItem}
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>
        </div>
        
        {/* Order Totals */}
        <div className="mt-8 flex justify-end">
          <div className="w-full md:w-1/3 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-gray-600 mr-2">Tax Rate:</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('taxRate', { valueAsNumber: true })}
                  className="w-16 border border-gray-300 rounded-md shadow-sm p-1 text-right"
                />
                <span className="ml-1">%</span>
              </div>
              <span className="font-medium">${taxAmount.toFixed(2)}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-gray-600 mr-2">Discount:</span>
                <select
                  {...register('discountType')}
                  className="border border-gray-300 rounded-md shadow-sm p-1"
                >
                  <option value="percentage">%</option>
                  <option value="fixed">$</option>
                </select>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('discountValue', { valueAsNumber: true })}
                  className="w-16 ml-2 border border-gray-300 rounded-md shadow-sm p-1 text-right"
                />
              </div>
              <span className="font-medium">${discountAmount.toFixed(2)}</span>
            </div>
            
            <div className="border-t pt-2 flex justify-between">
              <span className="text-gray-800 font-semibold">Total:</span>
              <span className="font-bold text-lg">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <Button type="button" onClick={onCancel} variant="secondary">
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {isEditMode ? 'Update Order' : 'Create Order'}
          </Button>
        </div>
      </div>
    </form>
  );
}
