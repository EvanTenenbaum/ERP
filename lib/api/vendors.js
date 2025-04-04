/**
 * API utilities for vendor management
 * 
 * This file provides functions for managing vendor data
 * through the database adapter.
 */

const db = require('../database');

/**
 * Create a new vendor
 * @param {Object} vendorData - Vendor data
 * @returns {Promise<Object>} Created vendor
 */
async function createVendor(vendorData) {
  // Generate vendor code if not provided
  if (!vendorData.code) {
    const vendors = await db.vendors.findAll();
    const nextNumber = vendors.length + 1;
    vendorData.code = `V${nextNumber.toString().padStart(4, '0')}`;
  }
  
  return db.vendors.create(vendorData);
}

/**
 * Get a vendor by ID
 * @param {string} id - Vendor ID
 * @returns {Promise<Object>} Vendor data
 */
async function getVendorById(id) {
  return db.vendors.findById(id);
}

/**
 * Get all vendors with optional filtering
 * @param {Object} filters - Filter criteria
 * @returns {Promise<Array>} Array of vendors
 */
async function getVendors(filters = {}) {
  return db.vendors.findAll(filters);
}

/**
 * Update a vendor
 * @param {string} id - Vendor ID
 * @param {Object} updates - Vendor data updates
 * @returns {Promise<Object>} Updated vendor
 */
async function updateVendor(id, updates) {
  return db.vendors.update(id, updates);
}

/**
 * Delete a vendor
 * @param {string} id - Vendor ID
 * @returns {Promise<Object>} Deleted vendor
 */
async function deleteVendor(id) {
  return db.vendors.delete(id);
}

/**
 * Search vendors by name, code, or contact info
 * @param {string} query - Search query
 * @returns {Promise<Array>} Array of matching vendors
 */
async function searchVendors(query) {
  const vendors = await db.vendors.findAll();
  
  if (!query) return vendors;
  
  const lowerQuery = query.toLowerCase();
  
  return vendors.filter(vendor => {
    return (
      (vendor.name && vendor.name.toLowerCase().includes(lowerQuery)) ||
      (vendor.code && vendor.code.toLowerCase().includes(lowerQuery)) ||
      (vendor.email && vendor.email.toLowerCase().includes(lowerQuery)) ||
      (vendor.phone && vendor.phone.includes(lowerQuery)) ||
      (vendor.contactName && vendor.contactName.toLowerCase().includes(lowerQuery))
    );
  });
}

/**
 * Get vendors by category
 * @param {string} category - Vendor category
 * @returns {Promise<Array>} Array of vendors
 */
async function getVendorsByCategory(category) {
  return db.vendors.findAll({ category });
}

/**
 * Create a purchase order
 * @param {Object} poData - Purchase order data
 * @returns {Promise<Object>} Created purchase order
 */
async function createPurchaseOrder(poData) {
  // Generate PO number if not provided
  if (!poData.poNumber) {
    const pos = await db.purchaseOrders.findAll();
    const nextNumber = pos.length + 1;
    poData.poNumber = `PO${nextNumber.toString().padStart(5, '0')}`;
  }
  
  // Calculate totals if not provided
  if (!poData.subtotal || !poData.total) {
    let subtotal = 0;
    
    // Calculate subtotal from line items
    if (poData.items && poData.items.length > 0) {
      for (const item of poData.items) {
        const lineSubtotal = item.quantity * item.unitPrice;
        item.subtotal = lineSubtotal;
        subtotal += lineSubtotal;
      }
    }
    
    poData.subtotal = subtotal;
    
    // Calculate tax amount
    const taxRate = poData.taxRate || 0;
    const taxAmount = subtotal * (taxRate / 100);
    poData.taxAmount = taxAmount;
    
    // Calculate total
    poData.total = subtotal + taxAmount;
  }
  
  // Add vendor code if vendor ID is provided
  if (poData.vendorId && !poData.vendorCode) {
    const vendor = await db.vendors.findById(poData.vendorId);
    if (vendor) {
      poData.vendorCode = vendor.code;
    }
  }
  
  return db.purchaseOrders.create(poData);
}

/**
 * Get a purchase order by ID
 * @param {string} id - Purchase order ID
 * @returns {Promise<Object>} Purchase order data
 */
async function getPurchaseOrderById(id) {
  return db.purchaseOrders.findById(id);
}

/**
 * Get all purchase orders with optional filtering
 * @param {Object} filters - Filter criteria
 * @returns {Promise<Array>} Array of purchase orders
 */
async function getPurchaseOrders(filters = {}) {
  return db.purchaseOrders.findAll(filters);
}

/**
 * Update a purchase order
 * @param {string} id - Purchase order ID
 * @param {Object} updates - Purchase order data updates
 * @returns {Promise<Object>} Updated purchase order
 */
async function updatePurchaseOrder(id, updates) {
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
    const taxRate = updates.taxRate || 0;
    const taxAmount = subtotal * (taxRate / 100);
    updates.taxAmount = taxAmount;
    
    // Calculate total
    updates.total = subtotal + taxAmount;
  }
  
  return db.purchaseOrders.update(id, updates);
}

/**
 * Delete a purchase order
 * @param {string} id - Purchase order ID
 * @returns {Promise<Object>} Deleted purchase order
 */
async function deletePurchaseOrder(id) {
  return db.purchaseOrders.delete(id);
}

/**
 * Get purchase orders by vendor
 * @param {string} vendorId - Vendor ID
 * @returns {Promise<Array>} Array of purchase orders
 */
async function getPurchaseOrdersByVendor(vendorId) {
  return db.purchaseOrders.findAll({ vendorId });
}

/**
 * Get purchase orders by status
 * @param {string} status - Purchase order status
 * @returns {Promise<Array>} Array of purchase orders
 */
async function getPurchaseOrdersByStatus(status) {
  return db.purchaseOrders.findAll({ status });
}

/**
 * Record payment for a purchase order
 * @param {string} poId - Purchase order ID
 * @param {Object} paymentData - Payment data
 * @returns {Promise<Object>} Updated purchase order
 */
async function recordPurchaseOrderPayment(poId, paymentData) {
  const po = await db.purchaseOrders.findById(poId);
  if (!po) {
    throw new Error(`Purchase order with ID ${poId} not found`);
  }
  
  const { amount, method, reference, date } = paymentData;
  
  // Calculate new payment status
  let paymentStatus = 'unpaid';
  if (amount >= po.total) {
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
  
  return db.purchaseOrders.update(poId, updates);
}

/**
 * Receive items from a purchase order
 * @param {string} poId - Purchase order ID
 * @param {Array} receivedItems - Array of received items with quantities
 * @returns {Promise<Object>} Updated purchase order
 */
async function receivePurchaseOrderItems(poId, receivedItems) {
  const po = await db.purchaseOrders.findById(poId);
  if (!po) {
    throw new Error(`Purchase order with ID ${poId} not found`);
  }
  
  // Update received quantities in PO items
  const updatedItems = po.items.map(item => {
    const receivedItem = receivedItems.find(ri => ri.itemId === item.id);
    if (receivedItem) {
      const newReceivedQty = (item.receivedQuantity || 0) + receivedItem.quantity;
      return {
        ...item,
        receivedQuantity: newReceivedQty,
        isFullyReceived: newReceivedQty >= item.quantity
      };
    }
    return item;
  });
  
  // Check if all items are fully received
  const allItemsReceived = updatedItems.every(item => item.isFullyReceived);
  
  // Update PO status
  let status = po.status;
  if (allItemsReceived) {
    status = 'received';
  } else if (updatedItems.some(item => item.receivedQuantity > 0)) {
    status = 'partial';
  }
  
  // Update inventory for received items
  for (const receivedItem of receivedItems) {
    const poItem = po.items.find(item => item.id === receivedItem.itemId);
    if (poItem && poItem.productId && receivedItem.locationId) {
      try {
        // Add inventory to location
        await addInventoryFromPurchase(
          poItem.productId,
          receivedItem.locationId,
          receivedItem.quantity,
          receivedItem.batchNumber
        );
      } catch (error) {
        console.error(`Error updating inventory for product ${poItem.productId}:`, error);
      }
    }
  }
  
  return db.purchaseOrders.update(poId, {
    items: updatedItems,
    status
  });
}

/**
 * Add communication log for a vendor
 * @param {string} vendorId - Vendor ID
 * @param {Object} logData - Communication log data
 * @returns {Promise<Object>} Created communication log
 */
async function addVendorCommunicationLog(vendorId, logData) {
  const vendor = await db.vendors.findById(vendorId);
  if (!vendor) {
    throw new Error(`Vendor with ID ${vendorId} not found`);
  }
  
  const log = {
    vendorId,
    ...logData,
    timestamp: logData.timestamp || new Date()
  };
  
  return db.vendorCommunicationLogs.create(log);
}

/**
 * Get communication logs for a vendor
 * @param {string} vendorId - Vendor ID
 * @returns {Promise<Array>} Array of communication logs
 */
async function getVendorCommunicationLogs(vendorId) {
  return db.vendorCommunicationLogs.findAll({ vendorId });
}

/**
 * Calculate vendor performance metrics
 * @param {string} vendorId - Vendor ID
 * @returns {Promise<Object>} Vendor performance metrics
 */
async function calculateVendorPerformance(vendorId) {
  const vendor = await db.vendors.findById(vendorId);
  if (!vendor) {
    throw new Error(`Vendor with ID ${vendorId} not found`);
  }
  
  const purchaseOrders = await getPurchaseOrdersByVendor(vendorId);
  
  // Calculate metrics
  const totalOrders = purchaseOrders.length;
  const totalSpent = purchaseOrders.reduce((sum, po) => sum + (po.total || 0), 0);
  
  // On-time delivery rate
  const onTimeDeliveries = purchaseOrders.filter(po => {
    if (!po.expectedDeliveryDate || !po.actualDeliveryDate) return false;
    return new Date(po.actualDeliveryDate) <= new Date(po.expectedDeliveryDate);
  }).length;
  
  const onTimeDeliveryRate = totalOrders > 0 ? (onTimeDeliveries / totalOrders) * 100 : 0;
  
  // Order fulfillment rate
  const fulfilledOrders = purchaseOrders.filter(po => 
    po.status === 'received' || po.status === 'completed'
  ).length;
  
  const orderFulfillmentRate = totalOrders > 0 ? (fulfilledOrders / totalOrders) * 100 : 0;
  
  // Quality issues
  const ordersWithQualityIssues = purchaseOrders.filter(po => po.hasQualityIssues).length;
  const qualityIssueRate = totalOrders > 0 ? (ordersWithQualityIssues / totalOrders) * 100 : 0;
  
  // Average response time (if tracked in communication logs)
  const communicationLogs = await getVendorCommunicationLogs(vendorId);
  const responseTimes = [];
  
  for (let i = 0; i < communicationLogs.length - 1; i++) {
    const currentLog = communicationLogs[i];
    const nextLog = communicationLogs[i + 1];
    
    if (currentLog.direction === 'outgoing' && nextLog.direction === 'incoming') {
      const responseTime = new Date(nextLog.timestamp) - new Date(currentLog.timestamp);
      responseTimes.push(responseTime);
    }
  }
  
  const averageResponseTime = responseTimes.length > 0 
    ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length 
    : null;
  
  // Convert to hours if available
  const averageResponseTimeHours = averageResponseTime 
    ? averageResponseTime / (1000 * 60 * 60) 
    : null;
  
  return {
    vendorId,
    totalOrders,
    totalSpent,
    onTimeDeliveryRate,
    orderFulfillmentRate,
    qualityIssueRate,
    averageResponseTimeHours,
    lastOrderDate: purchaseOrders.length > 0 
      ? Math.max(...purchaseOrders.map(po => new Date(po.createdAt).getTime()))
      : null
  };
}

/**
 * Schedule a payment for a vendor
 * @param {Object} paymentData - Payment schedule data
 * @returns {Promise<Object>} Created payment schedule
 */
async function scheduleVendorPayment(paymentData) {
  return db.vendorPaymentSchedules.create(paymentData);
}

/**
 * Get scheduled payments for a vendor
 * @param {string} vendorId - Vendor ID
 * @returns {Promise<Array>} Array of scheduled payments
 */
async function getVendorPaymentSchedules(vendorId) {
  return db.vendorPaymentSchedules.findAll({ vendorId });
}

/**
 * Update a scheduled payment
 * @param {string} id - Payment schedule ID
 * @param {Object} updates - Payment schedule updates
 * @returns {Promise<Object>} Updated payment schedule
 */
async function updateVendorPaymentSchedule(id, updates) {
  return db.vendorPaymentSchedules.update(id, updates);
}

/**
 * Delete a scheduled payment
 * @param {string} id - Payment schedule ID
 * @returns {Promise<Object>} Deleted payment schedule
 */
async function deleteVendorPaymentSchedule(id) {
  return db.vendorPaymentSchedules.delete(id);
}

/**
 * Get upcoming vendor payments
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<Array>} Array of upcoming payments
 */
async function getUpcomingVendorPayments(startDate, endDate) {
  const schedules = await db.vendorPaymentSchedules.findAll();
  
  return schedules.filter(schedule => {
    const paymentDate = new Date(schedule.paymentDate);
    return paymentDate >= startDate && paymentDate <= endDate;
  });
}

/**
 * Helper function to add inventory from a purchase
 * @param {string} productId - Product ID
 * @param {string} locationId - Location ID
 * @param {number} quantity - Quantity to add
 * @param {string} batchNumber - Batch/lot number (optional)
 * @returns {Promise<void>}
 */
async function addInventoryFromPurchase(productId, locationId, quantity, batchNumber = null) {
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
    batchNumber
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
      batchNumber
    };
    
    // Update product total quantity
    await db.products.update(productId, {
      quantity: (product.quantity || 0) + quantity,
    });
    
    await db.inventoryRecords.create(newRecord);
  }
}

module.exports = {
  createVendor,
  getVendorById,
  getVendors,
  updateVendor,
  deleteVendor,
  searchVendors,
  getVendorsByCategory,
  createPurchaseOrder,
  getPurchaseOrderById,
  getPurchaseOrders,
  updatePurchaseOrder,
  deletePurchaseOrder,
  getPurchaseOrdersByVendor,
  getPurchaseOrdersByStatus,
  recordPurchaseOrderPayment,
  receivePurchaseOrderItems,
  addVendorCommunicationLog,
  getVendorCommunicationLogs,
  calculateVendorPerformance,
  scheduleVendorPayment,
  getVendorPaymentSchedules,
  updateVendorPaymentSchedule,
  deleteVendorPaymentSchedule,
  getUpcomingVendorPayments
};
