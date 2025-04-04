/**
 * React hook for sales management
 * 
 * This hook provides a convenient interface for components
 * to interact with the sales API.
 */

import { useState, useEffect, useCallback } from 'react';
import salesApi from '../api/sales';

/**
 * Hook for sales management
 * @param {Object} initialFilters - Initial filter criteria
 * @returns {Object} Sales management functions and state
 */
export function useSales(initialFilters = {}) {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [selectedSale, setSelectedSale] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [commissionData, setCommissionData] = useState(null);

  // Fetch sales based on filters
  const fetchSales = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let data;
      
      // Apply different filters based on filter properties
      if (filters.customerId) {
        data = await salesApi.getSalesByCustomer(filters.customerId);
      } else if (filters.startDate && filters.endDate) {
        data = await salesApi.getSalesByDateRange(new Date(filters.startDate), new Date(filters.endDate));
      } else if (filters.status) {
        data = await salesApi.getSalesByStatus(filters.status);
      } else if (filters.paymentStatus) {
        data = await salesApi.getSalesByPaymentStatus(filters.paymentStatus);
      } else {
        data = await salesApi.getSales(filters);
      }
      
      setSales(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch a single sale by ID
  const fetchSale = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const data = await salesApi.getSaleById(id);
      setSelectedSale(data);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new sale
  const createSale = useCallback(async (saleData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await salesApi.createSale(saleData);
      setSales(prev => [...prev, data]);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update an existing sale
  const updateSale = useCallback(async (id, updates) => {
    try {
      setLoading(true);
      setError(null);
      const data = await salesApi.updateSale(id, updates);
      setSales(prev => prev.map(sale => 
        sale.id === id ? data : sale
      ));
      if (selectedSale && selectedSale.id === id) {
        setSelectedSale(data);
      }
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [selectedSale]);

  // Delete a sale
  const deleteSale = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      await salesApi.deleteSale(id);
      setSales(prev => prev.filter(sale => sale.id !== id));
      if (selectedSale && selectedSale.id === id) {
        setSelectedSale(null);
      }
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [selectedSale]);

  // Record payment for a sale
  const recordPayment = useCallback(async (saleId, paymentData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await salesApi.recordPayment(saleId, paymentData);
      setSales(prev => prev.map(sale => 
        sale.id === saleId ? data : sale
      ));
      if (selectedSale && selectedSale.id === saleId) {
        setSelectedSale(data);
      }
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [selectedSale]);

  // Calculate sales metrics
  const calculateSalesMetrics = useCallback(async (startDate = null, endDate = null) => {
    try {
      setLoading(true);
      setError(null);
      const data = await salesApi.calculateSalesMetrics(startDate, endDate);
      setMetrics(data);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Calculate commission for a sales representative
  const calculateCommission = useCallback(async (salesRepId, startDate = null, endDate = null) => {
    try {
      setLoading(true);
      setError(null);
      const data = await salesApi.calculateCommission(salesRepId, startDate, endDate);
      setCommissionData(data);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
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

  // Load sales on mount and when filters change
  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  return {
    // State
    sales,
    loading,
    error,
    filters,
    selectedSale,
    metrics,
    commissionData,
    
    // Actions
    fetchSales,
    fetchSale,
    createSale,
    updateSale,
    deleteSale,
    recordPayment,
    calculateSalesMetrics,
    calculateCommission,
    updateFilters,
    clearFilters,
    setSelectedSale,
  };
}
