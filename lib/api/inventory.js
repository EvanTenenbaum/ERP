/**
 * API utilities for inventory management
 * 
 * This file provides functions for managing inventory data
 * through the database adapter.
 */

const db = require('../database');

/**
 * Create a new product
 * @param {Object} productData - Product data
 * @returns {Promise<Object>} Created product
 */
async function createProduct(productData) {
  // Generate SKU if not provided
  if (!productData.sku) {
    const products = await db.products.findAll();
    const nextNumber = products.length + 1;
    
    // Include vendor code in SKU if available
    let vendorCode = '';
    if (productData.vendorId) {
      const vendor = await db.vendors.findById(productData.vendorId);
      if (vendor) {
        vendorCode = vendor.code ? `${vendor.code}-` : '';
        productData.vendorCode = vendor.code;
      }
    }
    
    productData.sku = `${vendorCode}PROD${nextNumber.toString().padStart(3, '0')}`;
  }
  
  return db.products.create(productData);
}

/**
 * Get a product by ID
 * @param {string} id - Product ID
 * @returns {Promise<Object>} Product data
 */
async function getProductById(id) {
  return db.products.findById(id);
}

/**
 * Get all products with optional filtering
 * @param {Object} filters - Filter criteria
 * @returns {Promise<Array>} Array of products
 */
async function getProducts(filters = {}) {
  return db.products.findAll(filters);
}

/**
 * Update a product
 * @param {string} id - Product ID
 * @param {Object} updates - Product data updates
 * @returns {Promise<Object>} Updated product
 */
async function updateProduct(id, updates) {
  return db.products.update(id, updates);
}

/**
 * Delete a product
 * @param {string} id - Product ID
 * @returns {Promise<Object>} Deleted product
 */
async function deleteProduct(id) {
  return db.products.delete(id);
}

/**
 * Create a new location
 * @param {Object} locationData - Location data
 * @returns {Promise<Object>} Created location
 */
async function createLocation(locationData) {
  return db.locations.create(locationData);
}

/**
 * Get a location by ID
 * @param {string} id - Location ID
 * @returns {Promise<Object>} Location data
 */
async function getLocationById(id) {
  return db.locations.findById(id);
}

/**
 * Get all locations
 * @returns {Promise<Array>} Array of locations
 */
async function getLocations() {
  return db.locations.findAll();
}

/**
 * Update a location
 * @param {string} id - Location ID
 * @param {Object} updates - Location data updates
 * @returns {Promise<Object>} Updated location
 */
async function updateLocation(id, updates) {
  return db.locations.update(id, updates);
}

/**
 * Delete a location
 * @param {string} id - Location ID
 * @returns {Promise<Object>} Deleted location
 */
async function deleteLocation(id) {
  return db.locations.delete(id);
}

/**
 * Add inventory to a location
 * @param {string} productId - Product ID
 * @param {string} locationId - Location ID
 * @param {number} quantity - Quantity to add
 * @param {string} batchNumber - Batch or lot number (optional)
 * @returns {Promise<Object>} Updated inventory record
 */
async function addInventory(productId, locationId, quantity, batchNumber = null) {
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
    
    // Update batch number if provided
    const updates = {
      quantity: updatedQuantity,
    };
    
    if (batchNumber) {
      updates.batchNumber = batchNumber;
    }
    
    return db.inventoryRecords.update(record.id, updates);
  } else {
    // Create new record
    const newRecord = {
      productId,
      locationId,
      quantity,
      batchNumber,
    };
    
    // Update product total quantity
    await db.products.update(productId, {
      quantity: (product.quantity || 0) + quantity,
    });
    
    return db.inventoryRecords.create(newRecord);
  }
}

/**
 * Remove inventory from a location
 * @param {string} productId - Product ID
 * @param {string} locationId - Location ID
 * @param {number} quantity - Quantity to remove
 * @returns {Promise<Object>} Updated inventory record
 */
async function removeInventory(productId, locationId, quantity) {
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
  
  // Check if inventory record exists
  const existingRecords = await db.inventoryRecords.findAll({
    productId,
    locationId,
  });
  
  if (existingRecords.length === 0) {
    throw new Error(`No inventory record found for product ${productId} at location ${locationId}`);
  }
  
  const record = existingRecords[0];
  
  if (record.quantity < quantity) {
    throw new Error(`Insufficient inventory: requested ${quantity}, available ${record.quantity}`);
  }
  
  const updatedQuantity = record.quantity - quantity;
  
  // Update product total quantity
  await db.products.update(productId, {
    quantity: Math.max(0, (product.quantity || 0) - quantity),
  });
  
  if (updatedQuantity === 0) {
    // Delete record if quantity becomes zero
    return db.inventoryRecords.delete(record.id);
  } else {
    // Update record with new quantity
    return db.inventoryRecords.update(record.id, {
      quantity: updatedQuantity,
    });
  }
}

/**
 * Transfer inventory between locations
 * @param {string} productId - Product ID
 * @param {string} fromLocationId - Source location ID
 * @param {string} toLocationId - Destination location ID
 * @param {number} quantity - Quantity to transfer
 * @returns {Promise<Object>} Result of the transfer
 */
async function transferInventory(productId, fromLocationId, toLocationId, quantity) {
  // Remove from source location
  await removeInventory(productId, fromLocationId, quantity);
  
  // Add to destination location
  await addInventory(productId, toLocationId, quantity);
  
  return {
    success: true,
    productId,
    fromLocationId,
    toLocationId,
    quantity,
  };
}

/**
 * Get inventory levels for a product across all locations
 * @param {string} productId - Product ID
 * @returns {Promise<Array>} Array of inventory records
 */
async function getProductInventory(productId) {
  const records = await db.inventoryRecords.findAll({ productId });
  
  // Fetch location details for each record
  const recordsWithLocations = await Promise.all(
    records.map(async (record) => {
      const location = await db.locations.findById(record.locationId);
      return {
        ...record,
        location,
      };
    })
  );
  
  return recordsWithLocations;
}

/**
 * Get inventory levels for a location
 * @param {string} locationId - Location ID
 * @returns {Promise<Array>} Array of inventory records
 */
async function getLocationInventory(locationId) {
  const records = await db.inventoryRecords.findAll({ locationId });
  
  // Fetch product details for each record
  const recordsWithProducts = await Promise.all(
    records.map(async (record) => {
      const product = await db.products.findById(record.productId);
      return {
        ...record,
        product,
      };
    })
  );
  
  return recordsWithProducts;
}

/**
 * Get all inventory records with product and location details
 * @returns {Promise<Array>} Array of inventory records
 */
async function getAllInventory() {
  const records = await db.inventoryRecords.findAll();
  
  // Fetch product and location details for each record
  const recordsWithDetails = await Promise.all(
    records.map(async (record) => {
      const product = await db.products.findById(record.productId);
      const location = await db.locations.findById(record.locationId);
      return {
        ...record,
        product,
        location,
      };
    })
  );
  
  return recordsWithDetails;
}

/**
 * Get products with low inventory
 * @param {number} threshold - Threshold quantity
 * @returns {Promise<Array>} Array of products with low inventory
 */
async function getLowInventoryProducts(threshold = 10) {
  const products = await db.products.findAll();
  
  return products.filter(product => {
    return (product.quantity || 0) < threshold;
  });
}

/**
 * Get products by category
 * @param {string} category - Product category
 * @returns {Promise<Array>} Array of products
 */
async function getProductsByCategory(category) {
  return db.products.findAll({ category });
}

/**
 * Get products by strain type
 * @param {string} strainType - Strain type
 * @returns {Promise<Array>} Array of products
 */
async function getProductsByStrainType(strainType) {
  return db.products.findAll({ strainType });
}

/**
 * Get products by vendor
 * @param {string} vendorId - Vendor ID
 * @returns {Promise<Array>} Array of products
 */
async function getProductsByVendor(vendorId) {
  return db.products.findAll({ vendorId });
}

/**
 * Get products by price range
 * @param {number} minPrice - Minimum price
 * @param {number} maxPrice - Maximum price
 * @returns {Promise<Array>} Array of products
 */
async function getProductsByPriceRange(minPrice, maxPrice) {
  const products = await db.products.findAll();
  
  return products.filter(product => {
    const price = product.price || 0;
    return price >= minPrice && price <= maxPrice;
  });
}

/**
 * Search products by name, SKU, or description
 * @param {string} query - Search query
 * @returns {Promise<Array>} Array of matching products
 */
async function searchProducts(query) {
  const products = await db.products.findAll();
  
  if (!query) {
    return products;
  }
  
  const lowerQuery = query.toLowerCase();
  
  return products.filter(product => {
    return (
      (product.name && product.name.toLowerCase().includes(lowerQuery)) ||
      (product.sku && product.sku.toLowerCase().includes(lowerQuery)) ||
      (product.description && product.description.toLowerCase().includes(lowerQuery))
    );
  });
}

module.exports = {
  // Product operations
  createProduct,
  getProductById,
  getProducts,
  updateProduct,
  deleteProduct,
  
  // Location operations
  createLocation,
  getLocationById,
  getLocations,
  updateLocation,
  deleteLocation,
  
  // Inventory operations
  addInventory,
  removeInventory,
  transferInventory,
  getProductInventory,
  getLocationInventory,
  getAllInventory,
  getLowInventoryProducts,
  
  // Filtering and search operations
  getProductsByCategory,
  getProductsByStrainType,
  getProductsByVendor,
  getProductsByPriceRange,
  searchProducts,
};
