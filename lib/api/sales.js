/**
 * API utilities for sales management
 * 
 * This file provides functions for managing sales data
 * through the database adapter.
 */

const db = require('../database');

/**
 * Create a new sale/order
 * @param {Object} saleData - Sale data
 * @returns {Promise<Object>} Created sale
 */
async function createSale(saleData) {
  // Generate order number if not provided
  if (!saleData.orderNumber) {
    const sales = await db.sales.findAll();
    const nextNumber = sales.length + 1;
    saleData.orderNumber = `ORD${nextNumber.toString().padStart(5, '0')}`;
  }
  
  // Calculate totals if not provided
  if (!saleData.subtotal || !saleData.total) {
    let subtotal = 0;
    
    // Calculate subtotal from line items
    if (saleData.items && saleData.items.length > 0) {
      for (const item of saleData.items) {
        const lineSubtotal = item.quantity * item.unitPrice;
        item.subtotal = lineSubtotal;
        subtotal += lineSubtotal;
      }
    }
    
    saleData.subtotal = subtotal;
    
    // Calculate tax amount
    const taxRate = saleData.taxRate || 0;
    const taxAmount = subtotal * (taxRate / 100);
    saleData.taxAmount = taxAmount;
    
    // Calculate discount amount
    let discountAmount = 0;
    if (saleData.discountType === 'percentage' && saleData.discountValue) {
      discountAmount = subtotal * (saleData.discountValue / 100);
    } else if (saleData.discountType === 'fixed' && saleData.discountValue) {
      discountAmount = saleData.discountValue;
    }
    saleData.discountAmount = discountAmount;
    
    // Calculate total
    saleData.total = subtotal + taxAmount - discountAmount;
  }
  
  // Add customer code if customer ID is provided
  if (saleData.customerId && !saleData.customerCode) {
    const customer = await db.customers.findById(saleData.customerId);
    if (customer) {
      saleData.customerCode = customer.code;
    }
  }
  
  // Create the sale
  const sale = await db.sales.create(saleData);
  
  // Update inventory for each line item
  if (sale.items && sale.items.length > 0) {
    for (const item of sale.items) {
      if (item.productId && item.locationId && item.quantity) {
        try {
          // Remove inventory from location
          await removeInventoryForSale(item.productId, item.locationId, item.quantity);
        } catch (error) {
          console.error(`Error updating inventory for product ${item.productId}:`, error);
        }
      }
    }
  }
  
  return sale;
}

/**
 * Get a sale by ID
 * @param {string} id - Sale ID
 * @returns {Promise<Object>} Sale data
 */
async function getSaleById(id) {
  return db.sales.findById(id);
}

/**
 * Get all sales with optional filtering
 * @param {Object} filters - Filter criteria
 * @returns {Promise<Array>} Array of sales
 */
async function getSales(filters = {}) {
  return db.sales.findAll(filters);
}

/**
 * Update a sale
 * @param {string} id - Sale ID
 * @param {Object} updates - Sale data updates
 * @returns {Promise<Object>} Updated sale
 */
async function updateSale(id, updates) {
  const existingSale = await db.sales.findById(id);
  if (!existingSale) {
    throw new Error(`Sale with ID ${id} not found`);
  }
  
  // Handle inventory adjustments if items have changed
  if (updates.items && existingSale.items) {
    // Track inventory changes needed
    const inventoryChanges = [];
    
    // Check for removed or quantity-reduced items (return to inventory)
    for (const oldItem of existingSale.items) {
      const newItem = updates.items.find(item => item.id === oldItem.id);
      
      if (!newItem) {
        // Item was removed, return full quantity to inventory
        inventoryChanges.push({
          productId: oldItem.productId,
          locationId: oldItem.locationId,
          quantity: oldItem.quantity,
          action: 'add'
        });
      } else if (newItem.quantity < oldItem.quantity) {
        // Quantity was reduced, return difference to inventory
        inventoryChanges.push({
          productId: oldItem.productId,
          locationId: oldItem.locationId,
          quantity: oldItem.quantity - newItem.quantity,
          action: 'add'
        });
      }
    }
    
    // Check for added or quantity-increased items (remove from inventory)
    for (const newItem of updates.items) {
      const oldItem = existingSale.items.find(item => item.id === newItem.id);
      
      if (!oldItem) {
        // Item was added, remove from inventory
        inventoryChanges.push({
          productId: newItem.productId,
          locationId: newItem.locationId,
          quantity: newItem.quantity,
          action: 'remove'
        });
      } else if (newItem.quantity > oldItem.quantity) {
        // Quantity was increased, remove difference from inventory
        inventoryChanges.push({
          productId: newItem.productId,
          locationId: newItem.locationId,
          quantity: newItem.quantity - oldItem.quantity,
          action: 'remove'
        });
      }
    }
    
    // Apply inventory changes
    for (const change of inventoryChanges) {
      try {
        if (change.action === 'add') {
          await addInventoryForReturn(change.productId, change.locationId, change.quantity);
        } else if (change.action === 'remove') {
          await removeInventoryForSale(change.productId, change.locationId, change.quantity);
        }
      } catch (error) {
        console.error(`Error updating inventory for product ${change.productId}:`, error);
      }
    }
  }
  
  // Calculate totals if items have changed
  if (updates.items) {
    let subtotal = 0;
    
    // Calculate subtotal from line items
    for (const item of updates.items) {
      const lineSubtotal = item.quantity * item.unitPrice;
      item.subtotal = lineSubtotal;
      subtotal += lineSubtotal;
    }
    
    updates.subtotal = subtotal;
    
    // Calculate tax amount
    const taxRate = updates.taxRate || existingSale.taxRate || 0;
    const taxAmount = subtotal * (taxRate / 100);
    updates.taxAmount = taxAmount;
    
    // Calculate discount amount
    let discountAmount = 0;
    const discountType = updates.discountType || existingSale.discountType;
    const discountValue = updates.discountValue || existingSale.discountValue || 0;
    
    if (discountType === 'percentage') {
      discountAmount = subtotal * (discountValue / 100);
    } else if (discountType === 'fixed') {
      discountAmount = discountValue;
    }
    updates.discountAmount = discountAmount;
    
    // Calculate total
    updates.total = subtotal + taxAmount - discountAmount;
  }
  
  return db.sales.update(id, updates);
}

/**
 * Delete a sale
 * @param {string} id - Sale ID
 * @returns {Promise<Object>} Deleted sale
 */
async function deleteSale(id) {
  const sale = await db.sales.findById(id);
  if (!sale) {
    throw new Error(`Sale with ID ${id} not found`);
  }
  
  // Return inventory for each line item
  if (sale.items && sale.items.length > 0) {
    for (const item of sale.items) {
      if (item.productId && item.locationId && item.quantity) {
        try {
          // Add inventory back to location
          await addInventoryForReturn(item.productId, item.locationId, item.quantity);
        } catch (error) {
          console.error(`Error returning inventory for product ${item.productId}:`, error);
        }
      }
    }
  }
  
  return db.sales.delete(id);
}

/**
 * Record payment for a sale
 * @param {string} saleId - Sale ID
 * @param {Object} paymentData - Payment data
 * @returns {Promise<Object>} Updated sale
 */
async function recordPayment(saleId, paymentData) {
  const sale = await db.sales.findById(saleId);
  if (!sale) {
    throw new Error(`Sale with ID ${saleId} not found`);
  }
  
  const { amount, method, reference, date } = paymentData;
  
  // Calculate new payment status
  let paymentStatus = 'unpaid';
  if (amount >= sale.total) {
    paymentStatus = 'paid';
  } else if (amount > 0) {
    paymentStatus = 'partial';
  }
  
  const updates = {
    paymentStatus,
    paymentMethod: method,
    paymentReference: reference,
    paymentDate: date || new Date(),
  };
  
  return db.sales.update(saleId, updates);
}

/**
 * Get sales by customer
 * @param {string} customerId - Customer ID
 * @returns {Promise<Array>} Array of sales
 */
async function getSalesByCustomer(customerId) {
  return db.sales.findAll({ customerId });
}

/**
 * Get sales by date range
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<Array>} Array of sales
 */
async function getSalesByDateRange(startDate, endDate) {
  const sales = await db.sales.findAll();
  
  return sales.filter(sale => {
    const saleDate = new Date(sale.createdAt);
    return saleDate >= startDate && saleDate <= endDate;
  });
}

/**
 * Get sales by status
 * @param {string} status - Sale status
 * @returns {Promise<Array>} Array of sales
 */
async function getSalesByStatus(status) {
  return db.sales.findAll({ status });
}

/**
 * Get sales by payment status
 * @param {string} paymentStatus - Payment status
 * @returns {Promise<Array>} Array of sales
 */
async function getSalesByPaymentStatus(paymentStatus) {
  return db.sales.findAll({ paymentStatus });
}

/**
 * Calculate sales metrics
 * @param {Date} startDate - Start date (optional)
 * @param {Date} endDate - End date (optional)
 * @returns {Promise<Object>} Sales metrics
 */
async function calculateSalesMetrics(startDate = null, endDate = null) {
  let sales = await db.sales.findAll();
  
  // Filter by date range if provided
  if (startDate || endDate) {
    sales = sales.filter(sale => {
      const saleDate = new Date(sale.createdAt);
      if (startDate && endDate) {
        return saleDate >= startDate && saleDate <= endDate;
      } else if (startDate) {
        return saleDate >= startDate;
      } else if (endDate) {
        return saleDate <= endDate;
      }
      return true;
    });
  }
  
  // Calculate metrics
  const totalSales = sales.length;
  const totalRevenue = sales.reduce((sum, sale) => sum + (sale.total || 0), 0);
  const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;
  
  // Payment status breakdown
  const paymentStatusCounts = {
    paid: sales.filter(sale => sale.paymentStatus === 'paid').length,
    partial: sales.filter(sale => sale.paymentStatus === 'partial').length,
    unpaid: sales.filter(sale => sale.paymentStatus === 'unpaid').length,
  };
  
  // Status breakdown
  const statusCounts = {
    pending: sales.filter(sale => sale.status === 'pending').length,
    processing: sales.filter(sale => sale.status === 'processing').length,
    shipped: sales.filter(sale => sale.status === 'shipped').length,
    delivered: sales.filter(sale => sale.status === 'delivered').length,
    cancelled: sales.filter(sale => sale.status === 'cancelled').length,
  };
  
  // Top products
  const productCounts = {};
  const productRevenue = {};
  
  for (const sale of sales) {
    if (sale.items && sale.items.length > 0) {
      for (const item of sale.items) {
        const productId = item.productId;
        if (productId) {
          // Count quantity sold
          productCounts[productId] = (productCounts[productId] || 0) + item.quantity;
          
          // Sum revenue
          const revenue = item.quantity * item.unitPrice;
          productRevenue[productId] = (productRevenue[productId] || 0) + revenue;
        }
      }
    }
  }
  
  // Convert to arrays and sort
  const topProductsByQuantity = Object.entries(productCounts)
    .map(([productId, quantity]) => ({ productId, quantity }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);
  
  const topProductsByRevenue = Object.entries(productRevenue)
    .map(([productId, revenue]) => ({ productId, revenue }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
  
  // Fetch product details
  const topProductsWithDetails = await Promise.all(
    [...new Set([
      ...topProductsByQuantity.map(p => p.productId),
      ...topProductsByRevenue.map(p => p.productId)
    ])].map(async (productId) => {
      const product = await db.products.findById(productId);
      return {
        id: productId,
        name: product ? product.name : 'Unknown Product',
        sku: product ? product.sku : 'Unknown SKU',
        quantity: productCounts[productId] || 0,
        revenue: productRevenue[productId] || 0,
      };
    })
  );
  
  // Top customers
  const customerRevenue = {};
  const customerOrderCount = {};
  
  for (const sale of sales) {
    const customerId = sale.customerId;
    if (customerId) {
      // Count orders
      customerOrderCount[customerId] = (customerOrderCount[customerId] || 0) + 1;
      
      // Sum revenue
      customerRevenue[customerId] = (customerRevenue[customerId] || 0) + (sale.total || 0);
    }
  }
  
  // Convert to arrays and sort
  const topCustomersByRevenue = Object.entries(customerRevenue)
    .map(([customerId, revenue]) => ({ customerId, revenue }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
  
  const topCustomersByOrders = Object.entries(customerOrderCount)
    .map(([customerId, orderCount]) => ({ customerId, orderCount }))
    .sort((a, b) => b.orderCount - a.orderCount)
    .slice(0, 5);
  
  // Fetch customer details
  const topCustomersWithDetails = await Promise.all(
    [...new Set([
      ...topCustomersByRevenue.map(c => c.customerId),
      ...topCustomersByOrders.map(c => c.customerId)
    ])].map(async (customerId) => {
      const customer = await db.customers.findById(customerId);
      return {
        id: customerId,
        name: customer ? customer.name : 'Unknown Customer',
        code: customer ? customer.code : 'Unknown Code',
        revenue: customerRevenue[customerId] || 0,
        orderCount: customerOrderCount[customerId] || 0,
      };
    })
  );
  
  return {
    totalSales,
    totalRevenue,
    averageOrderValue,
    paymentStatusCounts,
    statusCounts,
    topProducts: {
      byQuantity: topProductsByQuantity.map(p => {
        const details = topProductsWithDetails.find(d => d.id === p.productId);
        return { ...p, ...details };
      }),
      byRevenue: topProductsByRevenue.map(p => {
        const details = topProductsWithDetails.find(d => d.id === p.productId);
        return { ...p, ...details };
      }),
    },
    topCustomers: {
      byRevenue: topCustomersByRevenue.map(c => {
        const details = topCustomersWithDetails.find(d => d.id === c.customerId);
        return { ...c, ...details };
      }),
      byOrders: topCustomersByOrders.map(c => {
        const details = topCustomersWithDetails.find(d => d.id === c.customerId);
        return { ...c, ...details };
      }),
    },
  };
}

/**
 * Calculate commission for sales representatives
 * @param {string} salesRepId - Sales representative ID
 * @param {Date} startDate - Start date (optional)
 * @param {Date} endDate - End date (optional)
 * @returns {Promise<Object>} Commission data
 */
async function calculateCommission(salesRepId, startDate = null, endDate = null) {
  let sales = await db.sales.findAll({ salesRepId });
  
  // Filter by date range if provided
  if (startDate || endDate) {
    sales = sales.filter(sale => {
      const saleDate = new Date(sale.createdAt);
      if (startDate && endDate) {
        return saleDate >= startDate && saleDate <= endDate;
      } else if (startDate) {
        return saleDate >= startDate;
      } else if (endDate) {
        return saleDate <= endDate;
      }
      return true;
    });
  }
  
  // Calculate commission
  const totalSales = sales.length;
  const totalRevenue = sales.reduce((sum, sale) => sum + (sale.total || 0), 0);
  const totalCommission = sales.reduce((sum, sale) => sum + (sale.commission || 0), 0);
  
  // Commission by status
  const commissionByStatus = {
    pending: sales.filter(sale => sale.status === 'pending')
      .reduce((sum, sale) => sum + (sale.commission || 0), 0),
    processing: sales.filter(sale => sale.status === 'processing')
      .reduce((sum, sale) => sum + (sale.commission || 0), 0),
    shipped: sales.filter(sale => sale.status === 'shipped')
      .reduce((sum, sale) => sum + (sale.commission || 0), 0),
    delivered: sales.filter(sale => sale.status === 'delivered')
      .reduce((sum, sale) => sum + (sale.commission || 0), 0),
    cancelled: sales.filter(sale => sale.status === 'cancelled')
      .reduce((sum, sale) => sum + (sale.commission || 0), 0),
  };
  
  // Commission by payment status
  const commissionByPaymentStatus = {
    paid: sales.filter(sale => sale.paymentStatus === 'paid')
      .reduce((sum, sale) => sum + (sale.commission || 0), 0),
    partial: sales.filter(sale => sale.paymentStatus === 'partial')
      .reduce((sum, sale) => sum + (sale.commission || 0), 0),
    unpaid: sales.filter(sale => sale.paymentStatus === 'unpaid')
      .reduce((sum, sale) => sum + (sale.commission || 0), 0),
  };
  
  return {
    salesRepId,
    totalSales,
    totalRevenue,
    totalCommission,
    commissionByStatus,
    commissionByPaymentStatus,
    sales,
  };
}

/**
 * Helper function to remove inventory for a sale
 * @param {string} productId - Product ID
 * @param {string} locationId - Location ID
 * @param {number} quantity - Quantity to remove
 * @returns {Promise<void>}
 */
async function removeInventoryForSale(productId, locationId, quantity) {
  // Get current inventory record
  const inventoryRecords = await db.inventoryRecords.findAll({
    productId,
    locationId,
  });
  
  if (inventoryRecords.length === 0) {
    throw new Error(`No inventory record found for product ${productId} at location ${locationId}`);
  }
  
  const record = inventoryRecords[0];
  
  if (record.quantity < quantity) {
    throw new Error(`Insufficient inventory: requested ${quantity}, available ${record.quantity}`);
  }
  
  // Update inventory record
  const updatedQuantity = record.quantity - quantity;
  
  // Get product
  const product = await db.products.findById(productId);
  
  // Update product total quantity
  await db.products.update(productId, {
    quantity: Math.max(0, (product.quantity || 0) - quantity),
  });
  
  if (updatedQuantity === 0) {
    // Delete record if quantity becomes zero
    await db.inventoryRecords.delete(record.id);
  } else {
    // Update record with new quantity
    await db.inventoryRecords.update(record.id, {
      quantity: updatedQuantity,
    });
  }
}

/**
 * Helper function to add inventory for a return
 * @param {string} productId - Product ID
 * @param {string} locationId - Location ID
 * @param {number} quantity - Quantity to add
 * @returns {Promise<void>}
 */
async function addInventoryForReturn(productId, locationId, quantity) {
  // Check if product exists
  const product = await db.products.findById(productId);
  if (!product) {
    throw new Error(`Product with ID ${productId} not found`);
  }
  
  // Check if location exists
  const location = await db.locations.findById(locationId);
  if (!location) {
    throw new Error(`Location with ID ${locationId} not found`);
  }
  
  // Check if inventory record already exists
  const existingRecords = await db.inventoryRecords.findAll({
    productId,
    locationId,
  });
  
  if (existingRecords.length > 0) {
    // Update existing record
    const record = existingRecords[0];
    const updatedQuantity = record.quantity + quantity;
    
    // Update product total quantity
    await db.products.update(productId, {
      quantity: (product.quantity || 0) + quantity,
    });
    
    await db.inventoryRecords.update(record.id, {
      quantity: updatedQuantity,
    });
  } else {
    // Create new record
    const newRecord = {
      productId,
      locationId,
      quantity,
    };
    
    // Update product total quantity
    await db.products.update(productId, {
      quantity: (product.quantity || 0) + quantity,
    });
    
    await db.inventoryRecords.create(newRecord);
  }
}

module.exports = {
  createSale,
  getSaleById,
  getSales,
  updateSale,
  deleteSale,
  recordPayment,
  getSalesByCustomer,
  getSalesByDateRange,
  getSalesByStatus,
  getSalesByPaymentStatus,
  calculateSalesMetrics,
  calculateCommission,
};
