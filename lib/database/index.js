/**
 * Database adapter for the ERP system
 * 
 * This file provides a unified interface for database operations,
 * abstracting the underlying database implementation.
 * 
 * Initially implemented with localStorage for development,
 * but designed to be easily replaced with a real database like MongoDB or PostgreSQL.
 */

// Import schemas
const schemas = require('./schema');

// Simple in-memory database for development
class LocalStorageDatabase {
  constructor() {
    this.data = {
      customers: [],
      products: [],
      locations: [],
      inventoryRecords: [],
      sales: [],
      vendors: [],
      purchaseOrders: [],
      tenants: [],
      users: [],
    };
    
    // Load data from localStorage if available
    if (typeof window !== 'undefined') {
      try {
        const savedData = localStorage.getItem('erpData');
        if (savedData) {
          this.data = JSON.parse(savedData);
        }
      } catch (error) {
        console.error('Error loading data from localStorage:', error);
      }
    }
  }

  // Save data to localStorage
  _saveData() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('erpData', JSON.stringify(this.data));
      } catch (error) {
        console.error('Error saving data to localStorage:', error);
      }
    }
  }

  // Generate a unique ID
  _generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Generic CRUD operations
  async create(collection, item) {
    if (!this.data[collection]) {
      throw new Error(`Collection ${collection} does not exist`);
    }
    
    const newItem = {
      ...item,
      id: item.id || this._generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.data[collection].push(newItem);
    this._saveData();
    
    return newItem;
  }

  async findById(collection, id) {
    if (!this.data[collection]) {
      throw new Error(`Collection ${collection} does not exist`);
    }
    
    return this.data[collection].find(item => item.id === id) || null;
  }

  async findAll(collection, query = {}) {
    if (!this.data[collection]) {
      throw new Error(`Collection ${collection} does not exist`);
    }
    
    let results = [...this.data[collection]];
    
    // Apply filters from query
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined) {
        results = results.filter(item => {
          if (typeof value === 'string' && typeof item[key] === 'string') {
            return item[key].toLowerCase().includes(value.toLowerCase());
          }
          return item[key] === value;
        });
      }
    });
    
    return results;
  }

  async update(collection, id, updates) {
    if (!this.data[collection]) {
      throw new Error(`Collection ${collection} does not exist`);
    }
    
    const index = this.data[collection].findIndex(item => item.id === id);
    
    if (index === -1) {
      throw new Error(`Item with id ${id} not found in ${collection}`);
    }
    
    const updatedItem = {
      ...this.data[collection][index],
      ...updates,
      updatedAt: new Date(),
    };
    
    this.data[collection][index] = updatedItem;
    this._saveData();
    
    return updatedItem;
  }

  async delete(collection, id) {
    if (!this.data[collection]) {
      throw new Error(`Collection ${collection} does not exist`);
    }
    
    const index = this.data[collection].findIndex(item => item.id === id);
    
    if (index === -1) {
      throw new Error(`Item with id ${id} not found in ${collection}`);
    }
    
    const deletedItem = this.data[collection][index];
    this.data[collection].splice(index, 1);
    this._saveData();
    
    return deletedItem;
  }
}

// Export database instance
const db = new LocalStorageDatabase();

// Export database operations for each entity
module.exports = {
  // Customer operations
  customers: {
    create: (customer) => db.create('customers', customer),
    findById: (id) => db.findById('customers', id),
    findAll: (query) => db.findAll('customers', query),
    update: (id, updates) => db.update('customers', id, updates),
    delete: (id) => db.delete('customers', id),
  },
  
  // Product operations
  products: {
    create: (product) => db.create('products', product),
    findById: (id) => db.findById('products', id),
    findAll: (query) => db.findAll('products', query),
    update: (id, updates) => db.update('products', id, updates),
    delete: (id) => db.delete('products', id),
  },
  
  // Location operations
  locations: {
    create: (location) => db.create('locations', location),
    findById: (id) => db.findById('locations', id),
    findAll: (query) => db.findAll('locations', query),
    update: (id, updates) => db.update('locations', id, updates),
    delete: (id) => db.delete('locations', id),
  },
  
  // Inventory record operations
  inventoryRecords: {
    create: (record) => db.create('inventoryRecords', record),
    findById: (id) => db.findById('inventoryRecords', id),
    findAll: (query) => db.findAll('inventoryRecords', query),
    update: (id, updates) => db.update('inventoryRecords', id, updates),
    delete: (id) => db.delete('inventoryRecords', id),
  },
  
  // Sale operations
  sales: {
    create: (sale) => db.create('sales', sale),
    findById: (id) => db.findById('sales', id),
    findAll: (query) => db.findAll('sales', query),
    update: (id, updates) => db.update('sales', id, updates),
    delete: (id) => db.delete('sales', id),
  },
  
  // Vendor operations
  vendors: {
    create: (vendor) => db.create('vendors', vendor),
    findById: (id) => db.findById('vendors', id),
    findAll: (query) => db.findAll('vendors', query),
    update: (id, updates) => db.update('vendors', id, updates),
    delete: (id) => db.delete('vendors', id),
  },
  
  // Purchase order operations
  purchaseOrders: {
    create: (order) => db.create('purchaseOrders', order),
    findById: (id) => db.findById('purchaseOrders', id),
    findAll: (query) => db.findAll('purchaseOrders', query),
    update: (id, updates) => db.update('purchaseOrders', id, updates),
    delete: (id) => db.delete('purchaseOrders', id),
  },
  
  // Tenant operations
  tenants: {
    create: (tenant) => db.create('tenants', tenant),
    findById: (id) => db.findById('tenants', id),
    findAll: (query) => db.findAll('tenants', query),
    update: (id, updates) => db.update('tenants', id, updates),
    delete: (id) => db.delete('tenants', id),
  },
  
  // User operations
  users: {
    create: (user) => db.create('users', user),
    findById: (id) => db.findById('users', id),
    findAll: (query) => db.findAll('users', query),
    update: (id, updates) => db.update('users', id, updates),
    delete: (id) => db.delete('users', id),
  },
};
