/**
 * API utilities for customer management
 * 
 * This file provides functions for managing customer data
 * through the database adapter.
 */

const db = require('../database');

/**
 * Create a new customer
 * @param {Object} customerData - Customer data
 * @returns {Promise<Object>} Created customer
 */
async function createCustomer(customerData) {
  // Generate customer code if not provided
  if (!customerData.code) {
    const customers = await db.customers.findAll();
    const nextNumber = customers.length + 1;
    customerData.code = `CUST${nextNumber.toString().padStart(3, '0')}`;
  }
  
  return db.customers.create(customerData);
}

/**
 * Get a customer by ID
 * @param {string} id - Customer ID
 * @returns {Promise<Object>} Customer data
 */
async function getCustomerById(id) {
  return db.customers.findById(id);
}

/**
 * Get all customers with optional filtering
 * @param {Object} filters - Filter criteria
 * @returns {Promise<Array>} Array of customers
 */
async function getCustomers(filters = {}) {
  return db.customers.findAll(filters);
}

/**
 * Update a customer
 * @param {string} id - Customer ID
 * @param {Object} updates - Customer data updates
 * @returns {Promise<Object>} Updated customer
 */
async function updateCustomer(id, updates) {
  return db.customers.update(id, updates);
}

/**
 * Delete a customer
 * @param {string} id - Customer ID
 * @returns {Promise<Object>} Deleted customer
 */
async function deleteCustomer(id) {
  return db.customers.delete(id);
}

/**
 * Get customer sales history
 * @param {string} customerId - Customer ID
 * @returns {Promise<Array>} Array of sales
 */
async function getCustomerSalesHistory(customerId) {
  return db.sales.findAll({ customerId });
}

/**
 * Calculate customer metrics
 * @param {string} customerId - Customer ID
 * @returns {Promise<Object>} Customer metrics
 */
async function calculateCustomerMetrics(customerId) {
  const customer = await db.customers.findById(customerId);
  const sales = await db.sales.findAll({ customerId });
  
  // Calculate total sales
  const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
  
  // Calculate average order value
  const averageOrderValue = sales.length > 0 ? totalSales / sales.length : 0;
  
  // Calculate days since last order
  const lastOrder = sales.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
  const daysSinceLastOrder = lastOrder 
    ? Math.floor((new Date() - new Date(lastOrder.createdAt)) / (1000 * 60 * 60 * 24)) 
    : null;
  
  // Calculate payment patterns
  const onTimePayments = sales.filter(sale => 
    sale.paymentStatus === 'paid' && 
    new Date(sale.paymentDate) <= new Date(sale.createdAt + (30 * 24 * 60 * 60 * 1000))
  ).length;
  
  const paymentReliability = sales.length > 0 ? onTimePayments / sales.length : 0;
  
  return {
    customer,
    metrics: {
      totalSales,
      averageOrderValue,
      orderCount: sales.length,
      daysSinceLastOrder,
      paymentReliability,
    }
  };
}

/**
 * Segment customers based on sales volume and payment reliability
 * @returns {Promise<Object>} Segmented customers
 */
async function segmentCustomers() {
  const customers = await db.customers.findAll();
  const segments = {
    premium: [],
    standard: [],
    new: [],
    inactive: [],
  };
  
  for (const customer of customers) {
    const { metrics } = await calculateCustomerMetrics(customer.id);
    
    // Determine segment
    if (metrics.orderCount === 0) {
      segments.new.push({ ...customer, metrics });
    } else if (metrics.daysSinceLastOrder > 90) {
      segments.inactive.push({ ...customer, metrics });
    } else if (metrics.totalSales > 10000 && metrics.paymentReliability > 0.8) {
      segments.premium.push({ ...customer, metrics });
    } else {
      segments.standard.push({ ...customer, metrics });
    }
  }
  
  return segments;
}

/**
 * Calculate credit recommendation for a customer
 * @param {string} customerId - Customer ID
 * @returns {Promise<Object>} Credit recommendation
 */
async function calculateCreditRecommendation(customerId) {
  const { customer, metrics } = await calculateCustomerMetrics(customerId);
  
  // Base credit on payment reliability and total sales
  let recommendedCredit = 0;
  
  if (metrics.orderCount === 0) {
    // New customer - conservative credit limit
    recommendedCredit = 1000;
  } else {
    // Existing customer - base on payment reliability and sales volume
    const reliabilityFactor = metrics.paymentReliability * 2; // 0 to 2
    const volumeFactor = Math.min(metrics.totalSales / 5000, 3); // 0 to 3
    const recencyFactor = metrics.daysSinceLastOrder < 30 ? 1 : 
                          metrics.daysSinceLastOrder < 60 ? 0.7 : 
                          metrics.daysSinceLastOrder < 90 ? 0.4 : 0.1; // 0.1 to 1
    
    recommendedCredit = 1000 + (reliabilityFactor + volumeFactor + recencyFactor) * 3000;
  }
  
  // Round to nearest 500
  recommendedCredit = Math.round(recommendedCredit / 500) * 500;
  
  return {
    customer,
    currentCreditLimit: customer.creditLimit || 0,
    recommendedCreditLimit: recommendedCredit,
    metrics,
  };
}

module.exports = {
  createCustomer,
  getCustomerById,
  getCustomers,
  updateCustomer,
  deleteCustomer,
  getCustomerSalesHistory,
  calculateCustomerMetrics,
  segmentCustomers,
  calculateCreditRecommendation,
};
