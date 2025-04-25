/**
 * API client for the ERP system
 * 
 * This file provides a unified interface for API operations,
 * abstracting the underlying API implementation details.
 * 
 * Replaces the localStorage database with real API calls to the backend.
 */

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    // Try to get error details from the response
    try {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `API error: ${response.status}`);
    } catch (e) {
      throw new Error(`API error: ${response.status}`);
    }
  }
  
  return response.json();
};

// API client class
class ApiClient {
  constructor() {
    this.baseUrl = '/api';
  }

  // Generic API request method
  async request(endpoint, method = 'GET', data = null) {
    const url = `${this.baseUrl}/${endpoint}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for authentication
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      return await handleResponse(response);
    } catch (error) {
      console.error(`API request error (${method} ${url}):`, error);
      throw error;
    }
  }

  // Generic CRUD operations
  async create(resource, data) {
    return this.request(resource, 'POST', data);
  }

  async findById(resource, id) {
    return this.request(`${resource}/${id}`);
  }

  async findAll(resource, query = {}) {
    // Convert query object to URL search params
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value);
      }
    });

    const queryString = params.toString();
    const endpoint = queryString ? `${resource}?${queryString}` : resource;
    
    return this.request(endpoint);
  }

  async update(resource, id, data) {
    return this.request(`${resource}/${id}`, 'PUT', data);
  }

  async delete(resource, id) {
    return this.request(`${resource}/${id}`, 'DELETE');
  }
}

// Create API client instance
const apiClient = new ApiClient();

// Export API operations for each entity
module.exports = {
  // Customer operations
  customers: {
    create: (customer) => apiClient.create('customers', customer),
    findById: (id) => apiClient.findById('customers', id),
    findAll: (query) => apiClient.findAll('customers', query),
    update: (id, updates) => apiClient.update('customers', id, updates),
    delete: (id) => apiClient.delete('customers', id),
    getMetrics: (id) => apiClient.request(`customers/${id}/metrics`),
    getCreditRecommendation: (id) => apiClient.request(`customers/${id}/credit-recommendation`),
  },
  
  // Product operations
  products: {
    create: (product) => apiClient.create('products', product),
    findById: (id) => apiClient.findById('products', id),
    findAll: (query) => apiClient.findAll('products', query),
    update: (id, updates) => apiClient.update('products', id, updates),
    delete: (id) => apiClient.delete('products', id),
    getImages: (id) => apiClient.request(`products/${id}/images`),
    addImage: (id, imageData) => apiClient.create(`products/${id}/images`, imageData),
    deleteImage: (id, imageId) => apiClient.delete(`products/${id}/images/${imageId}`),
  },
  
  // Location operations
  locations: {
    create: (location) => apiClient.create('locations', location),
    findById: (id) => apiClient.findById('locations', id),
    findAll: (query) => apiClient.findAll('locations', query),
    update: (id, updates) => apiClient.update('locations', id, updates),
    delete: (id) => apiClient.delete('locations', id),
  },
  
  // Inventory record operations
  inventoryRecords: {
    create: (record) => apiClient.create('inventory', record),
    findById: (id) => apiClient.findById('inventory', id),
    findAll: (query) => apiClient.findAll('inventory', query),
    update: (id, updates) => apiClient.update('inventory', id, updates),
    delete: (id) => apiClient.delete('inventory', id),
    addInventory: (data) => apiClient.create('inventory/add', data),
    removeInventory: (data) => apiClient.create('inventory/remove', data),
    transferInventory: (data) => apiClient.create('inventory/transfer', data),
  },
  
  // Sale operations
  sales: {
    create: (sale) => apiClient.create('sales', sale),
    findById: (id) => apiClient.findById('sales', id),
    findAll: (query) => apiClient.findAll('sales', query),
    update: (id, updates) => apiClient.update('sales', id, updates),
    delete: (id) => apiClient.delete('sales', id),
  },
  
  // Vendor operations
  vendors: {
    create: (vendor) => apiClient.create('vendors', vendor),
    findById: (id) => apiClient.findById('vendors', id),
    findAll: (query) => apiClient.findAll('vendors', query),
    update: (id, updates) => apiClient.update('vendors', id, updates),
    delete: (id) => apiClient.delete('vendors', id),
  },
  
  // Report operations
  reports: {
    create: (report) => apiClient.create('reports', report),
    findById: (id) => apiClient.findById('reports', id),
    findAll: (query) => apiClient.findAll('reports', query),
    update: (id, updates) => apiClient.update('reports', id, updates),
    delete: (id) => apiClient.delete('reports', id),
    execute: (id, parameters) => apiClient.create(`reports/${id}/execute`, parameters),
  },
  
  // Dashboard operations
  dashboards: {
    create: (dashboard) => apiClient.create('dashboards', dashboard),
    findById: (id) => apiClient.findById('dashboards', id),
    findAll: (query) => apiClient.findAll('dashboards', query),
    update: (id, updates) => apiClient.update('dashboards', id, updates),
    delete: (id) => apiClient.delete('dashboards', id),
    getWidgets: (id) => apiClient.request(`dashboards/${id}/widgets`),
    addWidget: (id, widget) => apiClient.create(`dashboards/${id}/widgets`, widget),
    updateWidget: (id, widgetId, updates) => apiClient.update(`dashboards/${id}/widgets/${widgetId}`, updates),
    deleteWidget: (id, widgetId) => apiClient.delete(`dashboards/${id}/widgets/${widgetId}`),
  },
  
  // User operations
  users: {
    create: (user) => apiClient.create('users', user),
    findById: (id) => apiClient.findById('users', id),
    findAll: (query) => apiClient.findAll('users', query),
    update: (id, updates) => apiClient.update('users', id, updates),
    delete: (id) => apiClient.delete('users', id),
    getCurrentUser: () => apiClient.request('users/me'),
  },
  
  // Authentication operations
  auth: {
    login: (credentials) => apiClient.create('auth/login', credentials),
    logout: () => apiClient.request('auth/logout', 'POST'),
    register: (userData) => apiClient.create('auth/register', userData),
    forgotPassword: (email) => apiClient.create('auth/forgot-password', { email }),
    resetPassword: (data) => apiClient.create('auth/reset-password', data),
  },
};
