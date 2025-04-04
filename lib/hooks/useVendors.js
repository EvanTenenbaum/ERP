/**
 * React hook for vendor management
 * 
 * This hook provides a convenient interface for components
 * to interact with the vendor API.
 */

import { useState, useEffect, useCallback } from 'react';
import vendorApi from '../api/vendors';

/**
 * Hook for vendor management
 * @param {Object} initialFilters - Initial filter criteria
 * @returns {Object} Vendor management functions and state
 */
export function useVendors(initialFilters = {}) {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState(null);
  const [communicationLogs, setCommunicationLogs] = useState([]);
  const [performanceMetrics, setPerformanceMetrics] = useState(null);
  const [paymentSchedules, setPaymentSchedules] = useState([]);

  // Fetch vendors based on filters
  const fetchVendors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let data;
      
      // Apply different filters based on filter properties
      if (filters.search) {
        data = await vendorApi.searchVendors(filters.search);
      } else if (filters.category) {
        data = await vendorApi.getVendorsByCategory(filters.category);
      } else {
        data = await vendorApi.getVendors(filters);
      }
      
      setVendors(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch a single vendor by ID
  const fetchVendor = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const data = await vendorApi.getVendorById(id);
      setSelectedVendor(data);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new vendor
  const createVendor = useCallback(async (vendorData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await vendorApi.createVendor(vendorData);
      setVendors(prev => [...prev, data]);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update an existing vendor
  const updateVendor = useCallback(async (id, updates) => {
    try {
      setLoading(true);
      setError(null);
      const data = await vendorApi.updateVendor(id, updates);
      setVendors(prev => prev.map(vendor => 
        vendor.id === id ? data : vendor
      ));
      if (selectedVendor && selectedVendor.id === id) {
        setSelectedVendor(data);
      }
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [selectedVendor]);

  // Delete a vendor
  const deleteVendor = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      await vendorApi.deleteVendor(id);
      setVendors(prev => prev.filter(vendor => vendor.id !== id));
      if (selectedVendor && selectedVendor.id === id) {
        setSelectedVendor(null);
      }
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [selectedVendor]);

  // Fetch purchase orders for a vendor
  const fetchVendorPurchaseOrders = useCallback(async (vendorId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await vendorApi.getPurchaseOrdersByVendor(vendorId);
      setPurchaseOrders(data);
      return data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a single purchase order by ID
  const fetchPurchaseOrder = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const data = await vendorApi.getPurchaseOrderById(id);
      setSelectedPurchaseOrder(data);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new purchase order
  const createPurchaseOrder = useCallback(async (poData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await vendorApi.createPurchaseOrder(poData);
      setPurchaseOrders(prev => [...prev, data]);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update an existing purchase order
  const updatePurchaseOrder = useCallback(async (id, updates) => {
    try {
      setLoading(true);
      setError(null);
      const data = await vendorApi.updatePurchaseOrder(id, updates);
      setPurchaseOrders(prev => prev.map(po => 
        po.id === id ? data : po
      ));
      if (selectedPurchaseOrder && selectedPurchaseOrder.id === id) {
        setSelectedPurchaseOrder(data);
      }
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [selectedPurchaseOrder]);

  // Delete a purchase order
  const deletePurchaseOrder = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      await vendorApi.deletePurchaseOrder(id);
      setPurchaseOrders(prev => prev.filter(po => po.id !== id));
      if (selectedPurchaseOrder && selectedPurchaseOrder.id === id) {
        setSelectedPurchaseOrder(null);
      }
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [selectedPurchaseOrder]);

  // Record payment for a purchase order
  const recordPurchaseOrderPayment = useCallback(async (poId, paymentData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await vendorApi.recordPurchaseOrderPayment(poId, paymentData);
      setPurchaseOrders(prev => prev.map(po => 
        po.id === poId ? data : po
      ));
      if (selectedPurchaseOrder && selectedPurchaseOrder.id === poId) {
        setSelectedPurchaseOrder(data);
      }
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [selectedPurchaseOrder]);

  // Receive items from a purchase order
  const receivePurchaseOrderItems = useCallback(async (poId, receivedItems) => {
    try {
      setLoading(true);
      setError(null);
      const data = await vendorApi.receivePurchaseOrderItems(poId, receivedItems);
      setPurchaseOrders(prev => prev.map(po => 
        po.id === poId ? data : po
      ));
      if (selectedPurchaseOrder && selectedPurchaseOrder.id === poId) {
        setSelectedPurchaseOrder(data);
      }
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [selectedPurchaseOrder]);

  // Fetch communication logs for a vendor
  const fetchVendorCommunicationLogs = useCallback(async (vendorId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await vendorApi.getVendorCommunicationLogs(vendorId);
      setCommunicationLogs(data);
      return data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a communication log for a vendor
  const addVendorCommunicationLog = useCallback(async (vendorId, logData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await vendorApi.addVendorCommunicationLog(vendorId, logData);
      setCommunicationLogs(prev => [...prev, data]);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Calculate vendor performance metrics
  const calculateVendorPerformance = useCallback(async (vendorId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await vendorApi.calculateVendorPerformance(vendorId);
      setPerformanceMetrics(data);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch payment schedules for a vendor
  const fetchVendorPaymentSchedules = useCallback(async (vendorId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await vendorApi.getVendorPaymentSchedules(vendorId);
      setPaymentSchedules(data);
      return data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Schedule a payment for a vendor
  const scheduleVendorPayment = useCallback(async (paymentData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await vendorApi.scheduleVendorPayment(paymentData);
      setPaymentSchedules(prev => [...prev, data]);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update a scheduled payment
  const updateVendorPaymentSchedule = useCallback(async (id, updates) => {
    try {
      setLoading(true);
      setError(null);
      const data = await vendorApi.updateVendorPaymentSchedule(id, updates);
      setPaymentSchedules(prev => prev.map(schedule => 
        schedule.id === id ? data : schedule
      ));
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a scheduled payment
  const deleteVendorPaymentSchedule = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      await vendorApi.deleteVendorPaymentSchedule(id);
      setPaymentSchedules(prev => prev.filter(schedule => schedule.id !== id));
      return true;
    } catch (err) {
      setError(err.message);
      return false;
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

  // Load vendors on mount and when filters change
  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  return {
    // State
    vendors,
    loading,
    error,
    filters,
    selectedVendor,
    purchaseOrders,
    selectedPurchaseOrder,
    communicationLogs,
    performanceMetrics,
    paymentSchedules,
    
    // Vendor actions
    fetchVendors,
    fetchVendor,
    createVendor,
    updateVendor,
    deleteVendor,
    
    // Purchase order actions
    fetchVendorPurchaseOrders,
    fetchPurchaseOrder,
    createPurchaseOrder,
    updatePurchaseOrder,
    deletePurchaseOrder,
    recordPurchaseOrderPayment,
    receivePurchaseOrderItems,
    
    // Communication log actions
    fetchVendorCommunicationLogs,
    addVendorCommunicationLog,
    
    // Performance metrics actions
    calculateVendorPerformance,
    
    // Payment schedule actions
    fetchVendorPaymentSchedules,
    scheduleVendorPayment,
    updateVendorPaymentSchedule,
    deleteVendorPaymentSchedule,
    
    // Filter actions
    updateFilters,
    clearFilters,
    
    // Setter functions
    setSelectedVendor,
    setSelectedPurchaseOrder,
  };
}
