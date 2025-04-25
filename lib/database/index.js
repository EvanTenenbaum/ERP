/**
 * Database adapter for the ERP system
 * 
 * This file provides a unified interface for database operations,
 * abstracting the underlying database implementation.
 * 
 * Now uses the API client to make real API calls to the backend
 * instead of using localStorage.
 */

// Import API client
const apiClient = require('../api-client');

// Export database operations for each entity
module.exports = {
  // Customer operations
  customers: apiClient.customers,
  
  // Product operations
  products: apiClient.products,
  
  // Location operations
  locations: apiClient.locations,
  
  // Inventory record operations
  inventoryRecords: apiClient.inventoryRecords,
  
  // Sale operations
  sales: apiClient.sales,
  
  // Vendor operations
  vendors: apiClient.vendors,
  
  // Report operations
  reports: apiClient.reports,
  
  // Dashboard operations
  dashboards: apiClient.dashboards,
  
  // User operations
  users: apiClient.users,
  
  // Authentication operations
  auth: apiClient.auth,
};
