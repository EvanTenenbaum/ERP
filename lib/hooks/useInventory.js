/**
 * React hook for inventory management
 * 
 * This hook provides a convenient interface for components
 * to interact with the inventory API.
 */

import { useState, useEffect, useCallback } from 'react';
import inventoryApi from '../api/inventory';

/**
 * Hook for inventory management
 * @param {Object} initialFilters - Initial filter criteria
 * @returns {Object} Inventory management functions and state
 */
export function useInventory(initialFilters = {}) {
  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [inventoryRecords, setInventoryRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [lowInventoryProducts, setLowInventoryProducts] = useState([]);

  // Fetch products based on filters
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let data;
      
      // Apply different filters based on filter properties
      if (filters.category) {
        data = await inventoryApi.getProductsByCategory(filters.category);
      } else if (filters.strainType) {
        data = await inventoryApi.getProductsByStrainType(filters.strainType);
      } else if (filters.vendorId) {
        data = await inventoryApi.getProductsByVendor(filters.vendorId);
      } else if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
        data = await inventoryApi.getProductsByPriceRange(filters.minPrice, filters.maxPrice);
      } else if (filters.search) {
        data = await inventoryApi.searchProducts(filters.search);
      } else {
        data = await inventoryApi.getProducts(filters);
      }
      
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch a single product by ID
  const fetchProduct = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const data = await inventoryApi.getProductById(id);
      setSelectedProduct(data);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new product
  const createProduct = useCallback(async (productData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await inventoryApi.createProduct(productData);
      setProducts(prev => [...prev, data]);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update an existing product
  const updateProduct = useCallback(async (id, updates) => {
    try {
      setLoading(true);
      setError(null);
      const data = await inventoryApi.updateProduct(id, updates);
      setProducts(prev => prev.map(product => 
        product.id === id ? data : product
      ));
      if (selectedProduct && selectedProduct.id === id) {
        setSelectedProduct(data);
      }
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [selectedProduct]);

  // Delete a product
  const deleteProduct = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      await inventoryApi.deleteProduct(id);
      setProducts(prev => prev.filter(product => product.id !== id));
      if (selectedProduct && selectedProduct.id === id) {
        setSelectedProduct(null);
      }
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [selectedProduct]);

  // Fetch all locations
  const fetchLocations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await inventoryApi.getLocations();
      setLocations(data);
      return data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a single location by ID
  const fetchLocation = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const data = await inventoryApi.getLocationById(id);
      setSelectedLocation(data);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new location
  const createLocation = useCallback(async (locationData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await inventoryApi.createLocation(locationData);
      setLocations(prev => [...prev, data]);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update an existing location
  const updateLocation = useCallback(async (id, updates) => {
    try {
      setLoading(true);
      setError(null);
      const data = await inventoryApi.updateLocation(id, updates);
      setLocations(prev => prev.map(location => 
        location.id === id ? data : location
      ));
      if (selectedLocation && selectedLocation.id === id) {
        setSelectedLocation(data);
      }
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [selectedLocation]);

  // Delete a location
  const deleteLocation = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      await inventoryApi.deleteLocation(id);
      setLocations(prev => prev.filter(location => location.id !== id));
      if (selectedLocation && selectedLocation.id === id) {
        setSelectedLocation(null);
      }
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [selectedLocation]);

  // Fetch all inventory records
  const fetchAllInventory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await inventoryApi.getAllInventory();
      setInventoryRecords(data);
      return data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch inventory for a specific product
  const fetchProductInventory = useCallback(async (productId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await inventoryApi.getProductInventory(productId);
      return data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch inventory for a specific location
  const fetchLocationInventory = useCallback(async (locationId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await inventoryApi.getLocationInventory(locationId);
      return data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Add inventory to a location
  const addInventory = useCallback(async (productId, locationId, quantity, batchNumber) => {
    try {
      setLoading(true);
      setError(null);
      const data = await inventoryApi.addInventory(productId, locationId, quantity, batchNumber);
      
      // Refresh inventory records
      await fetchAllInventory();
      
      // Update product quantity
      const product = await inventoryApi.getProductById(productId);
      setProducts(prev => prev.map(p => 
        p.id === productId ? product : p
      ));
      
      if (selectedProduct && selectedProduct.id === productId) {
        setSelectedProduct(product);
      }
      
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchAllInventory, selectedProduct]);

  // Remove inventory from a location
  const removeInventory = useCallback(async (productId, locationId, quantity) => {
    try {
      setLoading(true);
      setError(null);
      const data = await inventoryApi.removeInventory(productId, locationId, quantity);
      
      // Refresh inventory records
      await fetchAllInventory();
      
      // Update product quantity
      const product = await inventoryApi.getProductById(productId);
      setProducts(prev => prev.map(p => 
        p.id === productId ? product : p
      ));
      
      if (selectedProduct && selectedProduct.id === productId) {
        setSelectedProduct(product);
      }
      
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchAllInventory, selectedProduct]);

  // Transfer inventory between locations
  const transferInventory = useCallback(async (productId, fromLocationId, toLocationId, quantity) => {
    try {
      setLoading(true);
      setError(null);
      const data = await inventoryApi.transferInventory(productId, fromLocationId, toLocationId, quantity);
      
      // Refresh inventory records
      await fetchAllInventory();
      
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchAllInventory]);

  // Fetch products with low inventory
  const fetchLowInventoryProducts = useCallback(async (threshold = 10) => {
    try {
      setLoading(true);
      setError(null);
      const data = await inventoryApi.getLowInventoryProducts(threshold);
      setLowInventoryProducts(data);
      return data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  // Load products and locations on mount
  useEffect(() => {
    fetchProducts();
    fetchLocations();
    fetchAllInventory();
    fetchLowInventoryProducts();
  }, [fetchProducts, fetchLocations, fetchAllInventory, fetchLowInventoryProducts]);

  return {
    // State
    products,
    locations,
    inventoryRecords,
    loading,
    error,
    filters,
    selectedProduct,
    selectedLocation,
    lowInventoryProducts,
    
    // Product actions
    fetchProducts,
    fetchProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    
    // Location actions
    fetchLocations,
    fetchLocation,
    createLocation,
    updateLocation,
    deleteLocation,
    
    // Inventory actions
    fetchAllInventory,
    fetchProductInventory,
    fetchLocationInventory,
    addInventory,
    removeInventory,
    transferInventory,
    fetchLowInventoryProducts,
    
    // Filter actions
    updateFilters,
    clearFilters,
    
    // Selection actions
    setSelectedProduct,
    setSelectedLocation,
  };
}
